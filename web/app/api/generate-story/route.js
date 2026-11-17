import { getCorpusItem, getGoldenSample } from "../../../lib/corpus";
import { acquire, getClientIp, hit, release, tooMany } from "../../../lib/rate-limit";

const ALLOWED_MODES = new Set(["heritage", "ghost", "wild_history"]);
const MAX_BODY_BYTES = 2048;
const DAY_MS = 24 * 60 * 60 * 1000;

function intEnv(name, fallback) {
  const value = Number.parseInt(process.env[name] || "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function limitsFor(hasKey) {
  return hasKey
    ? {
        perMinute: intEnv("RATE_LIMIT_PER_MINUTE", 5),
        perDay: intEnv("RATE_LIMIT_PER_DAY", 30),
        globalPerDay: intEnv("RATE_LIMIT_GLOBAL_DAY", 300),
      }
    : {
        perMinute: intEnv("MOCK_RATE_LIMIT_PER_MINUTE", 20),
        perDay: intEnv("MOCK_RATE_LIMIT_PER_DAY", 200),
        globalPerDay: intEnv("MOCK_RATE_LIMIT_GLOBAL_DAY", 2000),
      };
}

const SYSTEM_PROMPT = `你是“声迹”的粤语文化故事编辑。请根据用户提供的素材，生成一个 3 幕互动故事。

只输出 JSON，不要输出 Markdown 或解释。JSON 结构：
{
  "title": "故事标题",
  "language": "yue",
  "entities": ["素材中出现的人/地/物"],
  "glossary": [
    { "term": "粤语词", "meaning": "普通话意思", "note": "简短文化注释" }
  ],
  "scenes": [
    {
      "act": 1,
      "title": "第一幕标题",
      "summary": "这一幕发生什么",
      "textYue": "粤语叙述，60-100 字",
      "textZh": "普通话翻译",
      "choices": [
        { "label": "选择文案", "next": "s2" }
      ]
    }
  ],
  "endings": ["结局文案"],
  "translationZh": "整篇普通话摘要",
  "safetyFlags": []
}

要求：
1. 必须 3 幕；第三幕是结局，choices 为空数组。
2. 每幕 2-3 个选择；选择要具体、有画面。
3. 方言词注释 3-5 个，必须来自素材。
4. 不得编造素材中没有的历史人物、地名、年份、事件。
5. 不确定的内容用“传说中”“相传”表达，不要冒充史实。
6. 不要生成医疗、法律、投资建议。
7. 语言：粤语叙述用粤语书面表达，普通话翻译要自然。
8. 严格控制长度：每幕正文不超过 100 字，直接进入场景，不要铺陈背景。`;

function buildPrompt(item, mode) {
  const modePrompt = {
    heritage:
      "模式：正经/温情。语气温暖、克制，适合家庭与全年龄；重点是留住声音和记忆。",
    ghost:
      "模式：鬼故事。第一人称、夜色、悬疑；可以让人背后一凉，但不血腥、不低俗、不宣扬迷信；结尾用民俗/传说解释，让人知道这是故事。",
    wild_history:
      "模式：野史。说书人口吻、俏皮、有点八卦；明确使用“据传/野史/听讲”等说法；不冒充正史，不诽谤真实人物，不编造具体年份和数字。",
  }[mode] || "模式：正经/温情。";

  const glossaryTerms = (item.glossary || [])
    .map((entry) => entry.term)
    .filter(Boolean);

  const glossaryRule = glossaryTerms.length
    ? `必须覆盖的方言词（glossary 里的 term 必须与这些词完全一致，不能改写成组合词）：${glossaryTerms.join("、")}`
    : "如果素材中没有明确的方言词，glossary 可以为空数组，不要硬编。";

  return `${modePrompt}

素材标题：${item.title}
素材类型：${item.type}
地区：${item.region}
摘要：${item.summary}
原文/文本：
${item.text || "（无全文，请只根据摘要生成，不要编造细节）"}

${glossaryRule}

实体规则：
- entities 只能从上面的素材原文/摘要中逐字出现的名词里选。
- 不要输出同义词、解释性短语、组合词或扩展地名（例如原文是“羊城”，不要写成“五羊城”）。
- 每个 entity 必须能在素材原文/摘要中找到完全相同的字。

请生成 3 幕互动故事。`;
}

function validate(output, golden, sourceText) {
  const checks = [];
  const push = (name, pass, detail = "") => checks.push({ name, pass, detail });

  push("json_schema_valid", Boolean(output && output.scenes && output.glossary && output.translationZh));
  push("scene_count == 3", Array.isArray(output?.scenes) && output.scenes.length === 3);
  push(
    "ending_scene_present",
    Array.isArray(output?.scenes) &&
      output.scenes.length === 3 &&
      (output.scenes[2].choices || []).length === 0
  );
  push(
    "glossary_terms_present",
    (golden?.expected?.glossary || []).every((expected) =>
      (output?.glossary || []).some((actual) => actual.term === expected.term)
    )
  );
  push("translation_present", Boolean(output?.translationZh));
  push(
    "entities_are_grounded",
    (output?.entities || []).every(
      (entity) => sourceText.includes(entity) || (golden?.expected?.entities || []).includes(entity)
    )
  );
  push(
    "choices_present",
    (output?.scenes || []).slice(0, 2).every((scene) => (scene.choices || []).length >= 2)
  );

  return checks;
}

async function callModel(item, mode) {
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.LLM_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.LLM_MODEL || "gpt-4o-mini";

  // 方舟的推理模型会先花大量 token 思考，容易顶到网关超时；默认关闭思考，可用环境变量覆盖。
  const disableThinking = process.env.LLM_DISABLE_THINKING
    ? process.env.LLM_DISABLE_THINKING === "true"
    : baseUrl.includes("volces.com");

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    signal: AbortSignal.timeout(intEnv("LLM_TIMEOUT_MS", 15000)),
    body: JSON.stringify({
      model,
      temperature: 0.6,
      max_tokens: intEnv("LLM_MAX_TOKENS", 1500),
      ...(disableThinking ? { thinking: { type: "disabled" } } : {}),
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(item, mode) },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`模型调用失败（${response.status}）：${detail.slice(0, 300)}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("模型没有返回内容");
  if (data.choices?.[0]?.finish_reason === "length") {
    throw new Error("模型输出被长度限制截断，请重试一次");
  }

  try {
    return { output: JSON.parse(content), model };
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return { output: JSON.parse(content.slice(start, end + 1)), model };
    }
    throw new Error("模型返回的不是合法 JSON");
  }
}

function streamResult(work) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send = (payload) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
        } catch {
          closed = true;
        }
      };

      // 心跳保持连接，避免网关在模型生成期间判定请求超时。
      const timer = setInterval(() => send({ type: "ping" }), 4000);

      try {
        const payload = await work();
        send({ type: "result", ...payload });
      } catch (error) {
        send({
          type: "error",
          error: error.message,
          hint: "模型响应超时或返回异常，请重试一次。",
        });
      } finally {
        clearInterval(timer);
        if (!closed) {
          try {
            controller.close();
          } catch {
            closed = true;
          }
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Generation-Stream": "ndjson",
    },
  });
}

export async function POST(request) {
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
  const ip = getClientIp(request);
  const limits = limitsFor(Boolean(apiKey));
  let locked = false;

  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ error: "请求体过大" }, { status: 413 });
    }

    let body;
    try {
      body = JSON.parse(raw || "{}");
    } catch {
      return Response.json({ error: "请求格式不正确" }, { status: 400 });
    }

    const { corpusId } = body || {};
    const mode = ALLOWED_MODES.has(body?.mode) ? body.mode : "heritage";

    const minute = hit("minute", ip, limits.perMinute, 60 * 1000);
    if (!minute.allowed) {
      return tooMany(
        `请求太频繁，每分钟最多 ${limits.perMinute} 次，请稍后再试。`,
        minute.resetAt
      );
    }

    const daily = hit("day", ip, limits.perDay, DAY_MS);
    if (!daily.allowed) {
      return tooMany("今天的生成次数已用完，明天再来。", daily.resetAt);
    }

    const global = hit("global-day", "all", limits.globalPerDay, DAY_MS);
    if (!global.allowed) {
      return tooMany("今日全站生成额度已用完，请明天再试。", global.resetAt);
    }

    if (!acquire(ip)) {
      return tooMany("上一次生成还没结束，请稍等几秒。", Date.now() + 5000);
    }
    locked = true;

    const item = getCorpusItem(corpusId);
    if (!item) {
      release(ip);
      locked = false;
      return Response.json({ error: "找不到该素材" }, { status: 404 });
    }

    const golden = getGoldenSample(item.id, mode);
    const sourceText = [
      item.title,
      item.subtitle,
      item.region,
      item.summary,
      item.text || "",
      ...(item.tags || []),
    ].join(" ");

    if (apiKey) {
      return streamResult(async () => {
        try {
          const result = await callModel(item, mode);
          return {
            mock: false,
            model: result.model,
            corpusId: item.id,
            mode,
            output: result.output,
            validation: validate(result.output, golden, sourceText),
          };
        } finally {
          release(ip);
          locked = false;
        }
      });
    }

    // 没有 API Key 时，用黄金样品作为 Mock 输出，保证 UI/流程可跑通。
    const mockOutput = golden
      ? golden.expected
      : {
          title: item.title,
          language: "yue",
          entities: [item.title],
          glossary: item.glossary || [],
          scenes: [
            { act: 1, title: "开场", summary: item.summary, textYue: item.text || item.summary, textZh: item.summary, choices: [{ label: "继续", next: "s2" }, { label: "停下来", next: "s3" }] },
            { act: 2, title: "展开", summary: item.summary, textYue: item.text || item.summary, textZh: item.summary, choices: [{ label: "继续", next: "s3" }, { label: "回头", next: "s1" }] },
            { act: 3, title: "结局", summary: item.summary, textYue: item.text || item.summary, textZh: item.summary, choices: [] },
          ],
          endings: ["故事结束。"],
          translationZh: item.summary,
          safetyFlags: [],
        };

    release(ip);
    locked = false;

    return Response.json({
      mock: true,
      model: "mock-golden-sample",
      corpusId: item.id,
      mode,
      output: mockOutput,
      validation: validate(mockOutput, golden, sourceText),
      note: "未配置 LLM_API_KEY，当前返回黄金样品作为 Mock 输出。配置 .env.local 后会调用真实模型。",
    });
  } catch (error) {
    if (locked) release(ip);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

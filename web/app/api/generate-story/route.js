import { getCorpusItem, getGoldenSample } from "../../../lib/corpus";
import { acquire, getClientIp, hit, release, tooMany } from "../../../lib/rate-limit";
import { ALLOWED_MODES, PROMPT_VERSION, SYSTEM_PROMPT, buildPrompt } from "../../../lib/prompt";
import { planNarrative } from "../../../lib/narrative";
import { repairStory } from "../../../lib/repair-story";
import { validateStory } from "../../../lib/validate-story";

const MAX_BODY_BYTES = 8192;
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

function parseModelJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(content.slice(start, end + 1));
    }
    throw new Error("模型返回的不是合法 JSON");
  }
}

function timeoutReason(error) {
  if (error?.name === "TimeoutError" || error?.name === "AbortError") return "timeout";
  if (String(error?.message || "").includes("截断")) return "truncated";
  return "model_error";
}

async function callModel(item, mode, plan, onProgress) {
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.LLM_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.LLM_MODEL || "gpt-4o-mini";
  const useStream = process.env.LLM_STREAM !== "false";

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
    signal: AbortSignal.timeout(
      Math.min(intEnv("LLM_TIMEOUT_MS", 18000 + plan.actCount * 2500), 45000)
    ),
    body: JSON.stringify({
      model,
      temperature: 0.6,
      max_tokens: intEnv("LLM_MAX_TOKENS", 1200 + plan.actCount * 360),
      ...(disableThinking ? { thinking: { type: "disabled" } } : {}),
      response_format: { type: "json_object" },
      ...(useStream ? { stream: true } : {}),
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(item, mode, plan) },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`模型调用失败（${response.status}）：${detail.slice(0, 300)}`);
  }

  if (!useStream) {
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("模型没有返回内容");
    if (data.choices?.[0]?.finish_reason === "length") {
      throw new Error("模型输出被长度限制截断，请重试一次");
    }
    onProgress?.(content.length);
    return { output: parseModelJson(content), model };
  }

  if (!response.body) throw new Error("模型没有返回流式内容");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  let finishReason = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;

      let event;
      try {
        event = JSON.parse(data);
      } catch {
        continue;
      }

      const delta = event.choices?.[0]?.delta?.content;
      if (delta) {
        content += delta;
        onProgress?.(content.length);
      }
      const reason = event.choices?.[0]?.finish_reason;
      if (reason) finishReason = reason;
    }
  }

  if (!content) throw new Error("模型没有返回内容");
  if (finishReason === "length") {
    throw new Error("模型输出被长度限制截断，请重试一次");
  }

  return { output: parseModelJson(content), model };
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
        const payload = await work(send);
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
    const customText = typeof body?.text === "string" ? body.text.trim() : "";
    const mode = ALLOWED_MODES.has(body?.mode) ? body.mode : "heritage";

    if (customText && (customText.length < 10 || customText.length > 600)) {
      return Response.json({ error: "自定义素材需要 10-600 个字" }, { status: 400 });
    }

    if (!customText && !corpusId) {
      return Response.json({ error: "请选择素材或输入一段文字" }, { status: 400 });
    }

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

    const item = customText
      ? {
          id: "custom-input",
          title: "自定义素材",
          subtitle: "现场输入",
          type: "custom",
          region: "自定义",
          dialect: "粤语",
          license: "用户提供",
          summary: customText.slice(0, 120),
          text: customText,
          tags: [],
          glossary: [],
          modes: [mode],
        }
      : getCorpusItem(corpusId);
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

    const seedInput = body?.seed
      ? String(body.seed)
      : `${item.id}-${mode}-${Date.now()}-${Math.random()}`;
    const plan = planNarrative(seedInput, body?.acts);

    if (apiKey) {
      return streamResult(async (send) => {
        const startedAt = Date.now();

        try {
          send({ type: "stage", stage: "preparing" });

          let lastChars = 0;
          let lastAt = Date.now();
          const reportProgress = (chars) => {
            const now = Date.now();
            if (chars - lastChars < 120 && now - lastAt < 2500) return;
            lastChars = chars;
            lastAt = now;
            send({ type: "stage", stage: "generating", chars });
          };

          const result = await callModel(item, mode, plan, reportProgress);
          send({ type: "stage", stage: "validating" });
          const repaired = repairStory(result.output, plan);

          return {
            mock: false,
            fallback: false,
            model: result.model,
            promptVersion: PROMPT_VERSION,
            corpusId: item.id,
            mode,
            actCount: plan.actCount,
            skeleton: plan.skeleton,
            seed: String(plan.seed),
            repairs: repaired.repairs,
            elapsedMs: Date.now() - startedAt,
            output: repaired.output,
            validation: validateStory(repaired.output, golden, sourceText, plan),
          };
        } catch (error) {
          if (!golden?.expected) throw error;

          return {
            mock: true,
            fallback: true,
            fallbackReason: timeoutReason(error),
            model: "golden-sample",
            promptVersion: PROMPT_VERSION,
            corpusId: item.id,
            mode,
            actCount: null,
            plannedActs: plan.actCount,
            seed: String(plan.seed),
            elapsedMs: Date.now() - startedAt,
            output: golden.expected,
            validation: validateStory(golden.expected, golden, sourceText, null),
            note: "本次生成没有完成，已降级为黄金样品。可以重试一次。",
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
      fallback: false,
      model: "mock-golden-sample",
      promptVersion: PROMPT_VERSION,
      corpusId: item.id,
      mode,
      actCount: 3,
      seed: String(plan.seed),
      elapsedMs: 0,
      output: mockOutput,
      validation: validateStory(mockOutput, golden, sourceText, null),
      note: "未配置 LLM_API_KEY，当前返回黄金样品作为 Mock 输出。配置 .env.local 后会调用真实模型。",
    });
  } catch (error) {
    if (locked) release(ip);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

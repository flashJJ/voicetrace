import { MAX_ACTS, MIN_ACTS, planTable } from "./narrative.js";

export const PROMPT_VERSION = "v4-2026-12";

export const ALLOWED_MODES = new Set(["heritage", "ghost", "wild_history"]);

export const SYSTEM_PROMPT = `你是“声迹”的粤语文化故事编辑。请根据用户提供的素材和场景计划，生成一个 ${MIN_ACTS}-${MAX_ACTS} 幕的互动故事。

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
      "id": "场景 id，必须与计划一致",
      "act": 1,
      "title": "这一幕标题",
      "summary": "这一幕发生什么",
      "textYue": "粤语叙述，60-100 字",
      "textZh": "普通话翻译",
      "choices": [
        { "label": "选择文案", "next": "计划里的场景 id" }
      ]
    }
  ],
  "endings": ["结局文案"],
  "translationZh": "整篇普通话摘要",
  "safetyFlags": []
}

要求：
1. 必须严格按「场景计划」生成：场景 id、幕数、next 都不能改；结局场景必须带 "ending": true，choices 为空数组。
2. 每个非结局场景 1-2 个选择，选择要具体、有画面，指向计划给出的 next。
3. 方言词注释 3-5 个，必须来自素材。
4. 不得编造素材中没有的历史人物、地名、年份、事件。
5. 不确定的内容用“传说中”“相传”表达，不要冒充史实。
6. 不要生成医疗、法律、投资建议。
7. 语言：粤语叙述用粤语书面表达，普通话翻译要自然。
8. 严格控制长度：每幕正文不超过 100 字，直接进入场景，不要铺陈背景。`;

export function buildPrompt(item, mode, plan) {
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

场景计划（共 ${plan.actCount} 幕，骨架：${plan.skeletonLabel}）：
${planTable(plan)}

请严格按场景计划生成 ${plan.actCount} 幕互动故事。`;
}

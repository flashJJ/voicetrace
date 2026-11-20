"use client";

import { useEffect, useMemo, useState } from "react";
import { getCorpusItem, goldenSamples } from "../../lib/corpus";
import { formatDuration, listRecordings } from "../../lib/recordings";
import { MAX_ACTS, MIN_ACTS } from "../../lib/narrative";
import { LIVE_STUDIO_URL, isStaticExport } from "../../lib/live";
import { useLocale } from "../../components/LocaleProvider";

const options = goldenSamples
  .map((sample) => {
    const item = getCorpusItem(sample.storyId);
    return item ? { item, sample } : null;
  })
  .filter(Boolean);

const COPY = {
  zh: {
    eyebrow: "AI 工坊 · 黄金样品验收",
    title: "让模型先跑一遍，再决定要不要信。",
    lede: "选一条资料库素材，生成 3-8 幕互动故事、普通话翻译和方言词注释；幕数与叙事骨架随机，也可手动指定。输出会立刻对照黄金样品做检查：三幕、结局、注释、翻译、实体是否幻觉。没有配置 API Key 时，用黄金样品作为 Mock 输出，先把流程跑通。",
    liveTitle: "在线生成跑在 Trae 云端",
    liveDesc: "GitHub Pages 只能托管静态页面，真实模型生成和验收在独立服务上。点右侧按钮进入在线工坊，回来仍可看预生成演示。",
    liveCta: "打开在线 AI 工坊",
    sourceLabel: "选择素材",
    actsLabel: "幕数",
    actsRandom: (min, max) => `随机 ${min}-${max} 幕`,
    actsCount: (count) => `${count} 幕`,
    generate: "生成互动版",
    generating: "生成中，约 10-25 秒……",
    fromRecording: "从我的录音填入",
    recordingPlaceholder: "选一段转写…",
    customLabel: "也可以直接输入一段素材（10-600 字）",
    customPlaceholder: "例：我阿公以前在珠江边撑艇，讲过西关大屋趟栊门的故事……",
    modeField: "模式",
    modeOptions: {
      heritage: "正经 / 温情",
      ghost: "鬼故事",
      wild_history: "野史",
    },
    customSource: "自定义素材",
    customSourceMeta: (count) => `现场输入 · ${count} 字`,
    stageGenerating: (chars) => `模型正在写故事，已写 ${chars} 字`,
    stageValidating: "正在对照黄金样品验收",
    stagePreparing: "正在整理素材",
    errorPrefix: "生成失败：",
    statusFallback: "降级结果",
    statusMock: "Mock 模式",
    statusLive: "真实模型",
    fallbackTitle: (reason) => `本次生成没有完成：${reason}`,
    fallbackDesc: "当前展示的是该素材的黄金样品，不是模型输出。可以重试一次。",
    retry: "重试一次",
    validationHead: (passed, total) => `验收结果：${passed} / ${total} 通过`,
    comparedTo: (id) => `对照黄金样品 ${id}`,
    copyReport: "复制验收报告",
    copied: "已复制",
    pass: "通过",
    fail: "未通过",
    outputEyebrow: "生成结果",
    actLabel: (act) => `第 ${act} 幕`,
    choice: (index) => `选择 ${index}`,
    ending: "结局",
    glossary: "方言词注释",
    translation: "普通话翻译",
    rawJson: "查看原始 JSON",
    empty: "选一条素材，点“生成互动版”。没有 API Key 也能先看 Mock 流程。",
    errShortTranscript: "这段转写太短，至少需要 10 个字才能生成。",
    errShortCustom: "自定义素材至少需要 10 个字。",
    errStaticDemo: "GitHub Pages 是静态演示，已为你打开 Trae 云端在线工坊。",
    errGenerate: "生成失败",
    errNoResult: "生成没有返回结果，请重试一次",
    errCopy: "复制失败，请手动选择验收内容。",
    modeNames: {
      heritage: "正经模式",
      ghost: "鬼故事模式",
      wild_history: "野史模式",
    },
    skeletons: {
      straight: "单线递进",
      early_split: "早分叉晚汇合",
      late_split: "晚分叉",
      double_fork: "双分叉",
    },
    fallbackReason: {
      timeout: "模型响应超时",
      truncated: "输出被长度限制截断",
      model_error: "模型返回异常",
    },
    report: {
      title: "# 声迹 · 生成验收报告",
      material: "素材：",
      mode: "模式：",
      model: "模型：",
      structure: "结构：",
      prompt: "Prompt：",
      elapsed: "耗时：",
      checks: "验收：",
      status: "状态：",
      goldSample: "黄金样品",
      notMarked: "未标注",
      unknown: "未知",
      passed: (passed, total) => `${passed} / ${total} 通过`,
      fallbackStatus: (reason) => `降级（${reason}）`,
      mockStatus: "Mock",
      realStatus: "真实生成",
      tableHead: "| 检查项 | 结果 |",
      tableDivider: "|---|---|",
      checkPass: "通过",
      checkFail: "未通过",
      acts: (count) => `${count} 幕`,
    },
  },
  en: {
    eyebrow: "AI STUDIO · GOLD SAMPLE REVIEW",
    title: "Let the model run first, then decide whether to trust it.",
    lede: "Pick a piece of source material and generate a 3-8 act interactive story with a Mandarin translation and dialect notes. The act count and narrative skeleton are randomised unless you set them. Every output is checked against the gold sample right away: three acts, endings, notes, translation, and hallucinated entities. Without an API key, the gold sample stands in as a mock output so you can still walk the flow.",
    liveTitle: "Live generation runs on Trae Cloud",
    liveDesc: "GitHub Pages can only host static pages, so real generation and review run on a separate service. Use the button to open the live studio; the pre-generated demo stays available here.",
    liveCta: "Open live AI studio",
    sourceLabel: "Source material",
    actsLabel: "Acts",
    actsRandom: (min, max) => `Random ${min}-${max} acts`,
    actsCount: (count) => `${count} acts`,
    generate: "Generate interactive version",
    generating: "Generating, about 10-25 seconds…",
    fromRecording: "Fill from my recording",
    recordingPlaceholder: "Pick a transcript…",
    customLabel: "Or type your own material (10-600 characters)",
    customPlaceholder: "e.g. My grandpa used to punt a boat on the Pearl River and tell stories about the studded gates of Xiguan mansions…",
    modeField: "Mode",
    modeOptions: {
      heritage: "Heritage / Warm",
      ghost: "Ghost story",
      wild_history: "Hearsay",
    },
    customSource: "Custom material",
    customSourceMeta: (count) => `Typed here · ${count} characters`,
    stageGenerating: (chars) => `The model is writing, ${chars} characters so far`,
    stageValidating: "Checking against the gold sample",
    stagePreparing: "Preparing the material",
    errorPrefix: "Generation failed: ",
    statusFallback: "Fallback result",
    statusMock: "Mock mode",
    statusLive: "Live model",
    fallbackTitle: (reason) => `This run did not finish: ${reason}`,
    fallbackDesc: "What you see is the gold sample for this material, not model output. You can try again.",
    retry: "Try again",
    validationHead: (passed, total) => `Review: ${passed} / ${total} passed`,
    comparedTo: (id) => `Against gold sample ${id}`,
    copyReport: "Copy review report",
    copied: "Copied",
    pass: "Pass",
    fail: "Fail",
    outputEyebrow: "Generated story",
    actLabel: (act) => `Act ${act}`,
    choice: (index) => `Choice ${index}`,
    ending: "Ending",
    glossary: "Dialect notes",
    translation: "Mandarin translation",
    rawJson: "View raw JSON",
    empty: "Pick a source and click “Generate interactive version”. You can walk the mock flow even without an API key.",
    errShortTranscript: "This transcript is too short — at least 10 characters are needed.",
    errShortCustom: "Custom material needs at least 10 characters.",
    errStaticDemo: "GitHub Pages is a static demo, so the Trae Cloud live studio has been opened for you.",
    errGenerate: "Generation failed",
    errNoResult: "Generation returned no result. Please try again.",
    errCopy: "Copy failed. Please select the review text manually.",
    modeNames: {
      heritage: "Heritage",
      ghost: "Ghost story",
      wild_history: "Hearsay",
    },
    skeletons: {
      straight: "Straight line",
      early_split: "Early split",
      late_split: "Late split",
      double_fork: "Double fork",
    },
    fallbackReason: {
      timeout: "Model timed out",
      truncated: "Output truncated by the length limit",
      model_error: "Model returned an error",
    },
    report: {
      title: "# Voicetrace · Generation review report",
      material: "Material: ",
      mode: "Mode: ",
      model: "Model: ",
      structure: "Structure: ",
      prompt: "Prompt: ",
      elapsed: "Elapsed: ",
      checks: "Review: ",
      status: "Status: ",
      goldSample: "gold sample",
      notMarked: "not labelled",
      unknown: "unknown",
      passed: (passed, total) => `${passed} / ${total} passed`,
      fallbackStatus: (reason) => `Fallback (${reason})`,
      mockStatus: "Mock",
      realStatus: "Live generation",
      tableHead: "| Check | Result |",
      tableDivider: "|---|---|",
      checkPass: "Pass",
      checkFail: "Fail",
      acts: (count) => `${count} acts`,
    },
  },
};

export default function StudioPage() {
  const { localize, pick } = useLocale();
  const c = pick(COPY);

  const [selectedId, setSelectedId] = useState(options[0]?.item.id || "");
  const [customText, setCustomText] = useState("");
  const [customMode, setCustomMode] = useState("heritage");
  const [acts, setActs] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [stage, setStage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [voiceRecords, setVoiceRecords] = useState([]);

  useEffect(() => {
    let alive = true;
    listRecordings()
      .then((items) => {
        if (alive) setVoiceRecords(items.filter((item) => (item.transcript || "").trim()));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const fillFromRecording = (id) => {
    const record = voiceRecords.find((item) => item.id === id);
    if (!record) return;
    const text = (record.transcript || "").trim();
    if (text.length < 10) {
      setError(c.errShortTranscript);
      return;
    }
    setCustomText(text.slice(0, 600));
    setResult(null);
    setError("");
  };

  const selected = useMemo(
    () => options.find((option) => option.item.id === selectedId) || options[0],
    [selectedId]
  );

  const generate = async () => {
    if (!selected) return;
    const usingCustom = customText.trim().length > 0;
    if (usingCustom && customText.trim().length < 10) {
      setError(c.errShortCustom);
      return;
    }
    if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
      window.open(LIVE_STUDIO_URL, "_blank", "noopener");
      setError(c.errStaticDemo);
      return;
    }
    setLoading(true);
    setError("");
    setStage(null);
    setCopied(false);
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          usingCustom
            ? { text: customText.trim(), mode: customMode, acts }
            : { corpusId: selected.item.id, mode: selected.sample.mode || "heritage", acts }
        ),
      });

      if (response.headers.get("x-generation-stream") === "ndjson" && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let payload = null;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const message = JSON.parse(line);
            if (message.type === "stage") setStage(message);
            if (message.type === "result") payload = message;
            if (message.type === "error") throw new Error(message.error || c.errGenerate);
          }
        }

        if (!payload) throw new Error(c.errNoResult);
        const { type: ignored, ...data } = payload;
        setResult(data);
      } else {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || c.errGenerate);
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const output = result?.output;
  const passed = (result?.validation || []).filter((check) => check.pass).length;
  const total = (result?.validation || []).length;

  const modeName = (mode) => c.modeNames[mode || "heritage"] || mode;
  const skeletonName = (skeleton) => c.skeletons[skeleton] || skeleton;
  const fallbackReasonLabel = (reason) =>
    c.fallbackReason[reason] || c.fallbackReason.model_error;

  const statusLabel = result?.fallback
    ? c.statusFallback
    : result?.mock
      ? c.statusMock
      : c.statusLive;

  const fallbackLabel = fallbackReasonLabel(result?.fallbackReason);

  const stageText = (() => {
    if (!loading) return "";
    if (stage?.stage === "generating") return localize(c.stageGenerating(stage.chars));
    if (stage?.stage === "validating") return c.stageValidating;
    return c.stagePreparing;
  })();

  const copyReport = async () => {
    if (!result) return;
    const structure = [
      result.actCount
        ? localize(c.report.acts(result.actCount))
        : c.report.goldSample,
      result.skeleton ? skeletonName(result.skeleton) : "",
      result.seed ? `seed ${result.seed}` : "",
    ]
      .filter(Boolean)
      .join(" / ");
    const lines = [
      c.report.title,
      "",
      `- ${c.report.material}${result.corpusId}`,
      `- ${c.report.mode}${modeName(result.mode || "heritage")}`,
      `- ${c.report.model}${result.model}`,
      `- ${c.report.structure}${structure}`,
      `- ${c.report.prompt}${result.promptVersion || c.report.notMarked}`,
      `- ${c.report.elapsed}${typeof result.elapsedMs === "number" ? `${(result.elapsedMs / 1000).toFixed(1)}s` : c.report.unknown}`,
      `- ${c.report.checks}${localize(c.report.passed(passed, total))}`,
      `- ${c.report.status}${result.fallback ? localize(c.report.fallbackStatus(fallbackLabel)) : result.mock ? c.report.mockStatus : c.report.realStatus}`,
      "",
      c.report.tableHead,
      c.report.tableDivider,
      ...(result.validation || []).map(
        (check) => `| ${check.name} | ${check.pass ? c.report.checkPass : c.report.checkFail} |`
      ),
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(c.errCopy);
    }
  };

  return (
    <div className="container studio">
      <section className="page-hero" style={{ paddingBottom: 24 }}>
        <span className="eyebrow">{c.eyebrow}</span>
        <h1 className="page-title">{c.title}</h1>
        <p className="page-lede">{c.lede}</p>
      </section>

      {isStaticExport ? (
        <section className="studio-live">
          <div>
            <strong>{c.liveTitle}</strong>
            <p>{c.liveDesc}</p>
          </div>
          <a className="btn btn-primary" href={LIVE_STUDIO_URL} target="_blank" rel="noreferrer">
            {c.liveCta} <span aria-hidden="true">↗</span>
          </a>
        </section>
      ) : null}

      <section className="studio-panel">
        <div className="studio-controls">
          <div className="corpus-filter" style={{ flex: "1 1 320px" }}>
            <label htmlFor="studio-source">{c.sourceLabel}</label>
            <select
              id="studio-source"
              value={selectedId}
              onChange={(event) => {
                setSelectedId(event.target.value);
                setResult(null);
                setError("");
              }}
            >
              {options.map(({ item, sample }) => (
                <option key={item.id} value={item.id}>
                  {item.title} · {modeName(sample.mode || "heritage")}
                </option>
              ))}
            </select>
          </div>
          <div className="corpus-filter">
            <label htmlFor="studio-acts">{c.actsLabel}</label>
            <select
              id="studio-acts"
              value={acts}
              onChange={(event) => {
                setActs(event.target.value);
                setResult(null);
                setError("");
              }}
            >
              <option value="auto">{localize(c.actsRandom(MIN_ACTS, MAX_ACTS))}</option>
              {[3, 4, 5, 6, 7, 8].map((count) => (
                <option key={count} value={count}>
                  {localize(c.actsCount(count))}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? c.generating : c.generate}
          </button>
        </div>

        <div className="studio-custom">
          {voiceRecords.length > 0 ? (
            <div className="studio-voice">
              <label htmlFor="studio-voice">{c.fromRecording}</label>
              <select
                id="studio-voice"
                value=""
                onChange={(event) => fillFromRecording(event.target.value)}
              >
                <option value="">{c.recordingPlaceholder}</option>
                {voiceRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.storyTitle || record.storySlug} · {record.sceneTitle}（
                    {formatDuration(record.duration)}）
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <label htmlFor="studio-custom-text">{c.customLabel}</label>
          <textarea
            id="studio-custom-text"
            value={customText}
            onChange={(event) => {
              setCustomText(event.target.value);
              setResult(null);
              setError("");
            }}
            maxLength={600}
            rows={4}
            placeholder={c.customPlaceholder}
          />
          <div className="studio-custom-foot">
            <span>{customText.length} / 600</span>
            {customText.trim() ? (
              <div className="corpus-filter">
                <label htmlFor="studio-custom-mode">{c.modeField}</label>
                <select
                  id="studio-custom-mode"
                  value={customMode}
                  onChange={(event) => setCustomMode(event.target.value)}
                >
                  <option value="heritage">{c.modeOptions.heritage}</option>
                  <option value="ghost">{c.modeOptions.ghost}</option>
                  <option value="wild_history">{c.modeOptions.wild_history}</option>
                </select>
              </div>
            ) : null}
          </div>
        </div>

        {customText.trim() ? (
          <div className="studio-source">
            <strong>{c.customSource}</strong>
            <span>{localize(c.customSourceMeta(customText.trim().length))}</span>
            <p>{customText.trim().slice(0, 120)}</p>
          </div>
        ) : selected ? (
          <div className="studio-source">
            <strong>{selected.item.title}</strong>
            <span>
              {selected.item.region} · {selected.item.dialect} · {selected.item.license}
            </span>
            <p>{selected.item.summary}</p>
          </div>
        ) : null}

        {loading ? (
          <div className="studio-progress" aria-live="polite">
            <span className="studio-progress-dot" aria-hidden="true" />
            <span>{stageText}</span>
          </div>
        ) : null}

        {error ? (
          <div className="studio-error">
            <strong>{c.errorPrefix}</strong> {error}
          </div>
        ) : null}

        {result ? (
          <>
            <div className={`studio-mode ${result.fallback ? "is-fallback" : result.mock ? "is-mock" : "is-live"}`}>
              <strong>{statusLabel}</strong>
              <span>{result.model}</span>
              <small>
                {result.promptVersion ? `Prompt ${result.promptVersion}` : ""}
                {typeof result.elapsedMs === "number"
                  ? ` · ${(result.elapsedMs / 1000).toFixed(1)}s`
                  : ""}
              </small>
              <small>
                {result.actCount ? localize(c.actsCount(result.actCount)) : ""}
                {result.skeleton ? ` · ${skeletonName(result.skeleton)}` : ""}
                {result.seed ? ` · seed ${result.seed}` : ""}
              </small>
              {result.note ? <small>{result.note}</small> : null}
            </div>

            {result.fallback ? (
              <div className="studio-fallback">
                <div>
                  <strong>{localize(c.fallbackTitle(fallbackLabel))}</strong>
                  <p>{c.fallbackDesc}</p>
                </div>
                <button type="button" className="btn btn-ghost" onClick={generate} disabled={loading}>
                  {c.retry}
                </button>
              </div>
            ) : null}

            <div className="studio-validation">
              <div className="studio-validation-head">
                <strong>{localize(c.validationHead(passed, total))}</strong>
                <div className="studio-validation-actions">
                  <span>{localize(c.comparedTo(result.corpusId))}</span>
                  <button type="button" className="btn btn-ghost studio-report-btn" onClick={copyReport}>
                    {copied ? c.copied : c.copyReport}
                  </button>
                </div>
              </div>
              <div className="studio-checks">
                {(result.validation || []).map((check) => (
                  <div key={check.name} className={check.pass ? "is-pass" : "is-fail"}>
                    <span>{check.pass ? c.pass : c.fail}</span>
                    <code>{check.name}</code>
                    {check.detail ? <small>{check.detail}</small> : null}
                  </div>
                ))}
              </div>
            </div>

            {output ? (
              <div className="studio-output">
                <div className="studio-output-head">
                  <div>
                    <span className="eyebrow">{c.outputEyebrow}</span>
                    <h2>{output.title}</h2>
                  </div>
                  <div className="corpus-modes">
                    <span>{modeName(result.mode || "heritage")}</span>
                    <span>{output.language}</span>
                  </div>
                </div>

                <div className="studio-entities">
                  {(output.entities || []).map((entity) => (
                    <span key={entity}>{entity}</span>
                  ))}
                </div>

                <div className="studio-scenes">
                  {(output.scenes || []).map((scene) => (
                    <article className="studio-scene" key={scene.id || `${scene.act}-${scene.title}`}>
                      <div className="studio-scene-head">
                        <span>{localize(c.actLabel(scene.act))}</span>
                        <h3>{scene.title}</h3>
                      </div>
                      <p className="studio-scene-yue">{scene.textYue || scene.summary}</p>
                      <p className="studio-scene-zh">{scene.textZh || scene.summary}</p>
                      {scene.choices?.length ? (
                        <div className="studio-choices">
                          {scene.choices.map((choice, index) => {
                            const label =
                              typeof choice === "string"
                                ? choice
                                : choice.label || localize(c.choice(index + 1));
                            return <span key={`${label}-${index}`}>{label}</span>;
                          })}
                        </div>
                      ) : (
                        <div className="studio-ending">{c.ending}</div>
                      )}
                    </article>
                  ))}
                </div>

                <div className="studio-grid">
                  <div>
                    <div className="corpus-section-label">{c.glossary}</div>
                    {(output.glossary || []).map((item) => (
                      <div className="corpus-glossary-item" key={item.term}>
                        <strong>{item.term}</strong>
                        <span>{item.meaning}</span>
                        {item.note ? <small>{item.note}</small> : null}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="corpus-section-label">{c.translation}</div>
                    <p className="studio-translation">{output.translationZh}</p>
                    <div className="corpus-section-label">{c.ending}</div>
                    <p className="studio-translation">{(output.endings || []).join(" / ")}</p>
                  </div>
                </div>

                <details className="studio-raw">
                  <summary>{c.rawJson}</summary>
                  <pre>{JSON.stringify(output, null, 2)}</pre>
                </details>
              </div>
            ) : null}
          </>
        ) : (
          <div className="studio-empty">{c.empty}</div>
        )}
      </section>
    </div>
  );
}

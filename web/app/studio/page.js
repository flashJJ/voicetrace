"use client";

import { useMemo, useState } from "react";
import { getCorpusItem, goldenSamples, modeLabel } from "../../lib/corpus";
import { MAX_ACTS, MIN_ACTS, SKELETON_LABELS } from "../../lib/narrative";
import { LIVE_STUDIO_URL, isStaticExport } from "../../lib/live";

const options = goldenSamples
  .map((sample) => {
    const item = getCorpusItem(sample.storyId);
    return item ? { item, sample } : null;
  })
  .filter(Boolean);

export default function StudioPage() {
  const [selectedId, setSelectedId] = useState(options[0]?.item.id || "");
  const [customText, setCustomText] = useState("");
  const [customMode, setCustomMode] = useState("heritage");
  const [acts, setActs] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [stage, setStage] = useState(null);
  const [copied, setCopied] = useState(false);

  const selected = useMemo(
    () => options.find((option) => option.item.id === selectedId) || options[0],
    [selectedId]
  );

  const generate = async () => {
    if (!selected) return;
    const usingCustom = customText.trim().length > 0;
    if (usingCustom && customText.trim().length < 10) {
      setError("自定义素材至少需要 10 个字。");
      return;
    }
    if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
      window.open(LIVE_STUDIO_URL, "_blank", "noopener");
      setError("GitHub Pages 是静态演示，已为你打开 Trae 云端在线工坊。");
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
            if (message.type === "error") throw new Error(message.error || "生成失败");
          }
        }

        if (!payload) throw new Error("生成没有返回结果，请重试一次");
        const { type: ignored, ...data } = payload;
        setResult(data);
      } else {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "生成失败");
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

  const statusLabel = result?.fallback
    ? "降级结果"
    : result?.mock
      ? "Mock 模式"
      : "真实模型";

  const fallbackLabel = {
    timeout: "模型响应超时",
    truncated: "输出被长度限制截断",
    model_error: "模型返回异常",
  }[result?.fallbackReason] || "模型返回异常";

  const stageText = (() => {
    if (!loading) return "";
    if (stage?.stage === "generating") return `模型正在写故事，已写 ${stage.chars} 字`;
    if (stage?.stage === "validating") return "正在对照黄金样品验收";
    return "正在整理素材";
  })();

  const copyReport = async () => {
    if (!result) return;
    const lines = [
      "# 声迹 · 生成验收报告",
      "",
      `- 素材：${result.corpusId}`,
      `- 模式：${modeLabel(result.mode || "heritage")}`,
      `- 模型：${result.model}`,
      `- 结构：${result.actCount ? `${result.actCount} 幕` : "黄金样品"}${result.skeleton ? ` / ${SKELETON_LABELS[result.skeleton] || result.skeleton}` : ""}${result.seed ? ` / seed ${result.seed}` : ""}`,
      `- Prompt：${result.promptVersion || "未标注"}`,
      `- 耗时：${typeof result.elapsedMs === "number" ? `${(result.elapsedMs / 1000).toFixed(1)}s` : "未知"}`,
      `- 验收：${passed} / ${total} 通过`,
      `- 状态：${result.fallback ? `降级（${fallbackLabel}）` : result.mock ? "Mock" : "真实生成"}`,
      "",
      "| 检查项 | 结果 |",
      "|---|---|",
      ...(result.validation || []).map(
        (check) => `| ${check.name} | ${check.pass ? "通过" : "未通过"} |`
      ),
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("复制失败，请手动选择验收内容。");
    }
  };

  return (
    <div className="container studio">
      <section className="page-hero" style={{ paddingBottom: 24 }}>
        <span className="eyebrow">AI 工坊 · 黄金样品验收</span>
        <h1 className="page-title">让模型先跑一遍，再决定要不要信。</h1>
        <p className="page-lede">
          选一条资料库素材，生成 3-8 幕互动故事、普通话翻译和方言词注释；幕数与叙事骨架随机，也可手动指定。
          输出会立刻对照黄金样品做检查：三幕、结局、注释、翻译、实体是否幻觉。
          没有配置 API Key 时，用黄金样品作为 Mock 输出，先把流程跑通。
        </p>
      </section>

      {isStaticExport ? (
        <section className="studio-live">
          <div>
            <strong>在线生成跑在 Trae 云端</strong>
            <p>
              GitHub Pages 只能托管静态页面，真实模型生成和验收在独立服务上。
              点右侧按钮进入在线工坊，回来仍可看预生成演示。
            </p>
          </div>
          <a className="btn btn-primary" href={LIVE_STUDIO_URL} target="_blank" rel="noreferrer">
            打开在线 AI 工坊 <span aria-hidden="true">↗</span>
          </a>
        </section>
      ) : null}

      <section className="studio-panel">
        <div className="studio-controls">
          <div className="corpus-filter" style={{ flex: "1 1 320px" }}>
            <label htmlFor="studio-source">选择素材</label>
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
                  {item.title} · {modeLabel(sample.mode || "heritage")}
                </option>
              ))}
            </select>
          </div>
          <div className="corpus-filter">
            <label htmlFor="studio-acts">幕数</label>
            <select
              id="studio-acts"
              value={acts}
              onChange={(event) => {
                setActs(event.target.value);
                setResult(null);
                setError("");
              }}
            >
              <option value="auto">随机 {MIN_ACTS}-{MAX_ACTS} 幕</option>
              {[3, 4, 5, 6, 7, 8].map((count) => (
                <option key={count} value={count}>
                  {count} 幕
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? "生成中，约 10-25 秒……" : "生成互动版"}
          </button>
        </div>

        <div className="studio-custom">
          <label htmlFor="studio-custom-text">也可以直接输入一段素材（10-600 字）</label>
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
            placeholder="例：我阿公以前在珠江边撑艇，讲过西关大屋趟栊门的故事……"
          />
          <div className="studio-custom-foot">
            <span>{customText.length} / 600</span>
            {customText.trim() ? (
              <div className="corpus-filter">
                <label htmlFor="studio-custom-mode">模式</label>
                <select
                  id="studio-custom-mode"
                  value={customMode}
                  onChange={(event) => setCustomMode(event.target.value)}
                >
                  <option value="heritage">正经 / 温情</option>
                  <option value="ghost">鬼故事</option>
                  <option value="wild_history">野史</option>
                </select>
              </div>
            ) : null}
          </div>
        </div>

        {customText.trim() ? (
          <div className="studio-source">
            <strong>自定义素材</strong>
            <span>现场输入 · {customText.trim().length} 字</span>
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
            <strong>生成失败：</strong> {error}
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
                {result.actCount ? `${result.actCount} 幕` : ""}
                {result.skeleton ? ` · ${SKELETON_LABELS[result.skeleton] || result.skeleton}` : ""}
                {result.seed ? ` · seed ${result.seed}` : ""}
              </small>
              {result.note ? <small>{result.note}</small> : null}
            </div>

            {result.fallback ? (
              <div className="studio-fallback">
                <div>
                  <strong>本次生成没有完成：{fallbackLabel}</strong>
                  <p>当前展示的是该素材的黄金样品，不是模型输出。可以重试一次。</p>
                </div>
                <button type="button" className="btn btn-ghost" onClick={generate} disabled={loading}>
                  重试一次
                </button>
              </div>
            ) : null}

            <div className="studio-validation">
              <div className="studio-validation-head">
                <strong>
                  验收结果：{passed} / {total} 通过
                </strong>
                <div className="studio-validation-actions">
                  <span>对照黄金样品 {result.corpusId}</span>
                  <button type="button" className="btn btn-ghost studio-report-btn" onClick={copyReport}>
                    {copied ? "已复制" : "复制验收报告"}
                  </button>
                </div>
              </div>
              <div className="studio-checks">
                {(result.validation || []).map((check) => (
                  <div key={check.name} className={check.pass ? "is-pass" : "is-fail"}>
                    <span>{check.pass ? "通过" : "未通过"}</span>
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
                    <span className="eyebrow">生成结果</span>
                    <h2>{output.title}</h2>
                  </div>
                  <div className="corpus-modes">
                    <span>{modeLabel(result.mode || "heritage")}</span>
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
                        <span>第 {scene.act} 幕</span>
                        <h3>{scene.title}</h3>
                      </div>
                      <p className="studio-scene-yue">{scene.textYue || scene.summary}</p>
                      <p className="studio-scene-zh">{scene.textZh || scene.summary}</p>
                      {scene.choices?.length ? (
                        <div className="studio-choices">
                          {scene.choices.map((choice, index) => {
                            const label =
                              typeof choice === "string" ? choice : choice.label || `选择 ${index + 1}`;
                            return <span key={`${label}-${index}`}>{label}</span>;
                          })}
                        </div>
                      ) : (
                        <div className="studio-ending">结局</div>
                      )}
                    </article>
                  ))}
                </div>

                <div className="studio-grid">
                  <div>
                    <div className="corpus-section-label">方言词注释</div>
                    {(output.glossary || []).map((item) => (
                      <div className="corpus-glossary-item" key={item.term}>
                        <strong>{item.term}</strong>
                        <span>{item.meaning}</span>
                        {item.note ? <small>{item.note}</small> : null}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="corpus-section-label">普通话翻译</div>
                    <p className="studio-translation">{output.translationZh}</p>
                    <div className="corpus-section-label">结局</div>
                    <p className="studio-translation">{(output.endings || []).join(" / ")}</p>
                  </div>
                </div>

                <details className="studio-raw">
                  <summary>查看原始 JSON</summary>
                  <pre>{JSON.stringify(output, null, 2)}</pre>
                </details>
              </div>
            ) : null}
          </>
        ) : (
          <div className="studio-empty">
            选一条素材，点“生成互动版”。没有 API Key 也能先看 Mock 流程。
          </div>
        )}
      </section>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { getCorpusItem, goldenSamples, modeLabel } from "../../lib/corpus";

const options = goldenSamples
  .map((sample) => {
    const item = getCorpusItem(sample.storyId);
    return item ? { item, sample } : null;
  })
  .filter(Boolean);

export default function StudioPage() {
  const [selectedId, setSelectedId] = useState(options[0]?.item.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const selected = useMemo(
    () => options.find((option) => option.item.id === selectedId) || options[0],
    [selectedId]
  );

  const generate = async () => {
    if (!selected) return;
    if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
      setError(
        "这是 GitHub Pages 静态演示，不提供在线生成。请从顶部「创作 → 演示」查看预生成故事，或本地运行 npm run dev。"
      );
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          corpusId: selected.item.id,
          mode: selected.sample.mode || "heritage",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "生成失败");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const output = result?.output;
  const passed = (result?.validation || []).filter((check) => check.pass).length;
  const total = (result?.validation || []).length;

  return (
    <div className="container studio">
      <section className="page-hero" style={{ paddingBottom: 24 }}>
        <span className="eyebrow">AI 工坊 · 黄金样品验收</span>
        <h1 className="page-title">让模型先跑一遍，再决定要不要信。</h1>
        <p className="page-lede">
          选一条资料库素材，生成 3 幕互动故事、普通话翻译和方言词注释。
          输出会立刻对照黄金样品做检查：三幕、结局、注释、翻译、实体是否幻觉。
          没有配置 API Key 时，用黄金样品作为 Mock 输出，先把流程跑通。
        </p>
      </section>

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
          <button type="button" className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? "生成中……" : "生成互动版"}
          </button>
        </div>

        {selected ? (
          <div className="studio-source">
            <strong>{selected.item.title}</strong>
            <span>
              {selected.item.region} · {selected.item.dialect} · {selected.item.license}
            </span>
            <p>{selected.item.summary}</p>
          </div>
        ) : null}

        {error ? (
          <div className="studio-error">
            <strong>生成失败：</strong> {error}
          </div>
        ) : null}

        {result ? (
          <>
            <div className={`studio-mode ${result.mock ? "is-mock" : "is-live"}`}>
              <strong>{result.mock ? "Mock 模式" : "真实模型"}</strong>
              <span>{result.model}</span>
              {result.note ? <small>{result.note}</small> : null}
            </div>

            <div className="studio-validation">
              <div className="studio-validation-head">
                <strong>
                  验收结果：{passed} / {total} 通过
                </strong>
                <span>对照黄金样品 {result.corpusId}</span>
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
                    <article className="studio-scene" key={`${scene.act}-${scene.title}`}>
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

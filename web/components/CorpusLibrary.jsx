"use client";

import { useMemo, useState } from "react";
import {
  corpusItems,
  corpusMeta,
  corpusStats,
  goldenSamples,
  goldenCoverage,
  searchCorpus,
  typeLabel,
  modeLabel,
} from "../lib/corpus";

const stats = corpusStats();
const coverage = goldenCoverage();

function StatCard({ value, label, hint }) {
  return (
    <div className="corpus-stat">
      <strong>{value}</strong>
      <span>{label}</span>
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

export default function CorpusLibrary() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [region, setRegion] = useState("all");
  const [mode, setMode] = useState("all");
  const [onlyGolden, setOnlyGolden] = useState(false);
  const [selectedId, setSelectedId] = useState(corpusItems[0]?.id || "");

  const filtered = useMemo(
    () => searchCorpus({ query, type, region, mode, onlyGolden }),
    [query, type, region, mode, onlyGolden]
  );

  const selected =
    corpusItems.find((item) => item.id === selectedId) || filtered[0] || corpusItems[0];

  const selectedGolden = goldenSamples.find((sample) => sample.storyId === selected?.id);

  const exportFiltered = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shengji-cantonese-corpus-filtered.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">粤语故事资料库 · v{corpusMeta.version}</span>
        <h1 className="page-title">先把素材找够，再让 AI 动手。</h1>
        <p className="page-lede">
          这里收录 {stats.total} 条粤语童谣、传说、民间故事篇目、歇后语、农谚、民俗与谜语，
          每条都标注来源和授权状态。它们既是基础故事，也是后续 Agent 的黄金样品。
        </p>
        <div className="corpus-stats">
          <StatCard value={stats.total} label="条目总数" hint={`${stats.withFullText} 条含全文`} />
          <StatCard value={stats.golden} label="黄金样品" hint={`${coverage.withScenes} 条含三幕`} />
          <StatCard value={Object.keys(stats.byType).length} label="内容类型" hint="童谣/传说/民俗/谚语" />
          <StatCard value={stats.needsResearch} label="待补充" hint="篇目或文本待研究" />
        </div>
      </section>

      <section className="container library-section">
        <div className="corpus-toolbar">
          <div className="corpus-search">
            <label htmlFor="corpus-query">搜索</label>
            <input
              id="corpus-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜标题、地区、标签、方言词……"
            />
          </div>
          <div className="corpus-filter">
            <label htmlFor="corpus-type">类型</label>
            <select
              id="corpus-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="all">全部</option>
              {corpusMeta.categories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="corpus-filter">
            <label htmlFor="corpus-region">地区</label>
            <select
              id="corpus-region"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              <option value="all">全部</option>
              {stats.regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="corpus-filter">
            <label htmlFor="corpus-mode">模式</label>
            <select
              id="corpus-mode"
              value={mode}
              onChange={(event) => setMode(event.target.value)}
            >
              <option value="all">全部</option>
              {corpusMeta.modes.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <label className="corpus-checkbox">
            <input
              type="checkbox"
              checked={onlyGolden}
              onChange={(event) => setOnlyGolden(event.target.checked)}
            />
            只看黄金样品
          </label>
          <button type="button" className="btn btn-ghost corpus-export" onClick={exportFiltered}>
            导出当前结果
          </button>
        </div>

        <div className="corpus-layout">
          <div>
            <div className="corpus-result-line">
              共 {filtered.length} 条
              {query ? ` · 搜索“${query}”` : ""}
              {type !== "all" ? ` · ${typeLabel(type)}` : ""}
              {mode !== "all" ? ` · ${modeLabel(mode)}` : ""}
            </div>
            <div className="corpus-grid">
              {filtered.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`corpus-card ${selected?.id === item.id ? "is-active" : ""}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="corpus-card-top">
                    <span className="badge">{typeLabel(item.type)}</span>
                    <span className="corpus-region">{item.region}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="corpus-subtitle">{item.subtitle}</p>
                  <div className="corpus-modes">
                    {(item.modes || ["heritage"]).map((key) => (
                      <span key={key}>{modeLabel(key)}</span>
                    ))}
                  </div>
                  <p className="corpus-summary">{item.summary}</p>
                  <div className="corpus-card-bottom">
                    <span>{item.tags.slice(0, 2).join(" · ")}</span>
                    <span className="corpus-flags">
                      {item.goldenSample ? <em>黄金样品</em> : null}
                      {item.needsResearch ? <em className="is-warn">待补充</em> : null}
                    </span>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="corpus-empty">
                  没有匹配条目。试试更短的关键词，或把筛选条件改成“全部”。
                </div>
              )}
            </div>
          </div>

          <aside className="corpus-detail">
            {selected ? (
              <>
                <div className="corpus-card-top">
                  <span className="badge">{typeLabel(selected.type)}</span>
                  <span className="corpus-region">{selected.region}</span>
                </div>
                <h2>{selected.title}</h2>
                <p className="corpus-subtitle">{selected.subtitle}</p>
                <div className="corpus-modes">
                  {(selected.modes || ["heritage"]).map((key) => (
                    <span key={key}>{modeLabel(key)}</span>
                  ))}
                </div>
                <p>{selected.summary}</p>

                {selected.text ? (
                  <div className="corpus-text">
                    <div className="corpus-section-label">原文 / 文本</div>
                    <p>{selected.text}</p>
                  </div>
                ) : null}

                {selected.answer ? (
                  <div className="corpus-answer">
                    <strong>谜底：</strong> {selected.answer}
                  </div>
                ) : null}

                {selected.glossary?.length ? (
                  <div className="corpus-glossary">
                    <div className="corpus-section-label">方言词注释</div>
                    {selected.glossary.map((item) => (
                      <div key={item.term} className="corpus-glossary-item">
                        <strong>{item.term}</strong>
                        <span>{item.meaning}</span>
                        {item.note ? <small>{item.note}</small> : null}
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="corpus-source">
                  <div className="corpus-section-label">来源与授权</div>
                  {selected.source?.map((source) => (
                    <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                      {source.title} ↗
                    </a>
                  ))}
                  <small>授权状态：{selected.license}</small>
                </div>

                {selectedGolden ? (
                  <div className="corpus-golden">
                    <div className="corpus-section-label">黄金样品</div>
                    <p>
                      {selectedGolden.expected.scenes.length} 幕 ·{" "}
                      {selectedGolden.expected.glossary.length} 个方言词 ·{" "}
                      {selectedGolden.checks.length} 项检查
                    </p>
                    <div className="corpus-checks">
                      {selectedGolden.checks.map((check) => (
                        <span key={check}>{check}</span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="corpus-actions">
                  {selected.id === "yue-rhyme-moonlight" ? (
                    <a className="btn btn-primary" href="/stories/moonlight">
                      读《月光光》
                    </a>
                  ) : (
                    <span className="btn btn-ghost" aria-disabled="true">
                      互动版待生成
                    </span>
                  )}
                  <span className="corpus-meta">
                    {selected.license} · {selected.storyPotential ?? "-"} 分故事潜力
                  </span>
                </div>
              </>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">黄金样品</span>
              <h2 className="section-title">给 Agent 的“标准答案”</h2>
            </div>
            <p className="section-desc">
              每条黄金样品包含原始素材、期望实体、方言词注释、三幕结构、普通话翻译和检查项。
              后续 ASR、翻译、分幕、注释、内容安全都可以拿它做回归测试。
            </p>
          </div>
          <div className="golden-grid">
            {goldenSamples.map((sample) => {
              const item = corpusItems.find((entry) => entry.id === sample.storyId);
              return (
                <article className="golden-card" key={sample.id}>
                  <div className="corpus-card-top">
                    <span className="badge">黄金样品</span>
                    <span className="corpus-region">{sample.expected.language}</span>
                  </div>
                  <h3>{item?.title || sample.storyId}</h3>
                  <p className="corpus-subtitle">{sample.id}</p>
                  <p>{item?.summary}</p>
                  <div className="golden-facts">
                    <span>{sample.expected.scenes.length} 幕</span>
                    <span>{sample.expected.entities.length} 个实体</span>
                    <span>{sample.expected.glossary.length} 个方言词</span>
                    <span>{sample.checks.length} 项检查</span>
                  </div>
                  <div className="corpus-checks">
                    {sample.checks.map((check) => (
                      <span key={check}>{check}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

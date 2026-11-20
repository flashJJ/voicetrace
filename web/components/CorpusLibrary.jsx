"use client";

import { useMemo, useRef, useState } from "react";
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
import { localizeCorpusItem } from "../lib/i18n-content";
import { useLocale } from "./LocaleProvider";

const stats = corpusStats();
const coverage = goldenCoverage();
const PAGE_SIZE = 12;

const COPY = {
  zh: {
    eyebrow: (version) => `粤语故事资料库 · v${version}`,
    title: "先把素材找够，再让 AI 动手。",
    lede: (total) =>
      `这里收录 ${total} 条粤语童谣、传说、民间故事篇目、歇后语、农谚、民俗与谜语，每条都标注来源和授权状态。它们既是基础故事，也是后续 Agent 的黄金样品。`,
    sourceNote: "",
    statTotal: "条目总数",
    statFullText: (count) => `${count} 条含全文`,
    statGolden: "黄金样品",
    statScenes: (count) => `${count} 条含三幕`,
    statTypes: "内容类型",
    statTypesHint: "童谣/传说/民俗/谚语",
    statResearch: "待补充",
    statResearchHint: "篇目或文本待研究",
    search: "搜索",
    searchPlaceholder: "搜标题、地区、标签、方言词……",
    type: "类型",
    region: "地区",
    mode: "模式",
    all: "全部",
    onlyGolden: "只看黄金样品",
    exportResults: "导出当前结果",
    resultCount: (count) => `共 ${count} 条`,
    resultPage: (current, total) => ` · 第 ${current} / ${total} 页`,
    resultQuery: (query) => ` · 搜索“${query}”`,
    filterSuffix: (label) => ` · ${label}`,
    empty: "没有匹配条目。试试更短的关键词，或把筛选条件改成“全部”。",
    pagerAria: "资料库分页",
    prev: "上一页",
    next: "下一页",
    pageInfo: (current, total) => `第 ${current} / ${total} 页`,
    badgeGolden: "黄金样品",
    badgeResearch: "待补充",
    originalText: "原文 / 文本",
    answerLabel: "谜底：",
    glossaryTitle: "方言词注释",
    sourceTitle: "来源与授权",
    license: (value) => `授权状态：${value}`,
    goldenTitle: "黄金样品",
    goldenSummary: (scenes, words, checks) =>
      `${scenes} 幕 · ${words} 个方言词 · ${checks} 项检查`,
    readMoonlight: "读《月光光》",
    pendingInteractive: "互动版待生成",
    potential: (license, score) => `${license} · ${score} 分故事潜力`,
    goldenEyebrow: "黄金样品",
    goldenHeading: "给 Agent 的“标准答案”",
    goldenDesc:
      "每条黄金样品包含原始素材、期望实体、方言词注释、三幕结构、普通话翻译和检查项。后续 ASR、翻译、分幕、注释、内容安全都可以拿它做回归测试。",
    goldenScenes: (count) => `${count} 幕`,
    goldenEntities: (count) => `${count} 个实体`,
    goldenGlossary: (count) => `${count} 个方言词`,
    goldenChecks: (count) => `${count} 项检查`,
    types: {
      nursery_rhyme: "童谣",
      legend: "传说",
      folk_tale_catalog: "民间故事篇目",
      proverb: "歇后语 / 俗语",
      weather_proverb: "天气 / 农谚",
      custom: "民俗 / 节庆",
      riddle: "谜语",
      tongue_twister: "绕口令",
    },
    modes: {
      heritage: "正经模式",
      ghost: "鬼故事模式",
      wild_history: "野史模式",
    },
  },
  en: {
    eyebrow: (version) => `Cantonese story library · v${version}`,
    title: "Gather the material first. Then let AI go to work.",
    lede: (total) =>
      `${total} Cantonese nursery rhymes, legends, folk-tale entries, xiehouyu, farming proverbs, customs, and riddles. Every entry notes its source and licensing status. They are both the base stories and the gold samples for the agents that come next.`,
    sourceNote: "Source material is shown in its original Chinese.",
    statTotal: "Total entries",
    statFullText: (count) => `${count} with full text`,
    statGolden: "Gold samples",
    statScenes: (count) => `${count} with three acts`,
    statTypes: "Content types",
    statTypesHint: "Rhymes / legends / customs / proverbs",
    statResearch: "To expand",
    statResearchHint: "Entries or texts still to research",
    search: "Search",
    searchPlaceholder: "Search titles, places, tags, dialect words…",
    type: "Type",
    region: "Region",
    mode: "Mode",
    all: "All",
    onlyGolden: "Gold samples only",
    exportResults: "Export current results",
    resultCount: (count) => `${count} entries`,
    resultPage: (current, total) => ` · Page ${current} of ${total}`,
    resultQuery: (query) => ` · Search “${query}”`,
    filterSuffix: (label) => ` · ${label}`,
    empty:
      "No matching entries. Try a shorter keyword, or set the filters back to “All”.",
    pagerAria: "Library pagination",
    prev: "Previous",
    next: "Next",
    pageInfo: (current, total) => `Page ${current} of ${total}`,
    badgeGolden: "Gold sample",
    badgeResearch: "To expand",
    originalText: "Original text",
    answerLabel: "Answer:",
    glossaryTitle: "Dialect glossary",
    sourceTitle: "Sources and licensing",
    license: (value) => `License: ${value}`,
    goldenTitle: "Gold sample",
    goldenSummary: (scenes, words, checks) =>
      `${scenes} acts · ${words} dialect words · ${checks} checks`,
    readMoonlight: "Read “Moonlight”",
    pendingInteractive: "Interactive version pending",
    potential: (license, score) => `${license} · Story potential ${score}`,
    goldenEyebrow: "GOLD SAMPLES",
    goldenHeading: "The “answer key” for the agent",
    goldenDesc:
      "Each gold sample bundles source material, expected entities, a dialect glossary, a three-act structure, a Mandarin translation, and checks. ASR, translation, scene splitting, annotation, and content safety can all use it for regression tests.",
    goldenScenes: (count) => `${count} acts`,
    goldenEntities: (count) => `${count} entities`,
    goldenGlossary: (count) => `${count} dialect words`,
    goldenChecks: (count) => `${count} checks`,
    types: {
      nursery_rhyme: "Nursery rhyme",
      legend: "Legend",
      folk_tale_catalog: "Folk tale index",
      proverb: "Xiehouyu / saying",
      weather_proverb: "Weather / farming proverb",
      custom: "Custom / festival",
      riddle: "Riddle",
      tongue_twister: "Tongue twister",
    },
    modes: {
      heritage: "Heritage",
      ghost: "Ghost story",
      wild_history: "Hearsay",
    },
  },
};

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
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const typeLabelFor = (key) => c.types[key] || typeLabel(key);
  const modeLabelFor = (key) => c.modes[key] || modeLabel(key);

  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [region, setRegion] = useState("all");
  const [mode, setMode] = useState("all");
  const [onlyGolden, setOnlyGolden] = useState(false);
  const [selectedId, setSelectedId] = useState(corpusItems[0]?.id || "");
  const [page, setPage] = useState(1);
  const listTopRef = useRef(null);

  const filtered = useMemo(
    () => searchCorpus({ query, type, region, mode, onlyGolden }),
    [query, type, region, mode, onlyGolden]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const resetPage = () => setPage(1);

  const goToPage = (next) => {
    setPage(next);
    if (typeof listTopRef.current?.scrollIntoView === "function") {
      listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const selected =
    corpusItems.find((item) => item.id === selectedId) || filtered[0] || corpusItems[0];

  const selectedGolden = goldenSamples.find((sample) => sample.storyId === selected?.id);
  const selectedItem = localizeCorpusItem(selected, locale, localize);

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
        <span className="eyebrow">{c.eyebrow(corpusMeta.version)}</span>
        <h1 className="page-title">{c.title}</h1>
        <p className="page-lede">{c.lede(stats.total)}</p>
        {c.sourceNote ? <p className="notice">{c.sourceNote}</p> : null}
        <div className="corpus-stats">
          <StatCard
            value={stats.total}
            label={c.statTotal}
            hint={c.statFullText(stats.withFullText)}
          />
          <StatCard
            value={stats.golden}
            label={c.statGolden}
            hint={c.statScenes(coverage.withScenes)}
          />
          <StatCard
            value={Object.keys(stats.byType).length}
            label={c.statTypes}
            hint={c.statTypesHint}
          />
          <StatCard
            value={stats.needsResearch}
            label={c.statResearch}
            hint={c.statResearchHint}
          />
        </div>
      </section>

      <section className="container library-section">
        <div className="corpus-toolbar">
          <div className="corpus-search">
            <label htmlFor="corpus-query">{c.search}</label>
            <input
              id="corpus-query"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetPage();
              }}
              placeholder={c.searchPlaceholder}
            />
          </div>
          <div className="corpus-filter">
            <label htmlFor="corpus-type">{c.type}</label>
            <select
              id="corpus-type"
              value={type}
              onChange={(event) => {
                setType(event.target.value);
                resetPage();
              }}
            >
              <option value="all">{c.all}</option>
              {corpusMeta.categories.map((category) => (
                <option key={category.key} value={category.key}>
                  {typeLabelFor(category.key)}
                </option>
              ))}
            </select>
          </div>
          <div className="corpus-filter">
            <label htmlFor="corpus-region">{c.region}</label>
            <select
              id="corpus-region"
              value={region}
              onChange={(event) => {
                setRegion(event.target.value);
                resetPage();
              }}
            >
              <option value="all">{c.all}</option>
              {stats.regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="corpus-filter">
            <label htmlFor="corpus-mode">{c.mode}</label>
            <select
              id="corpus-mode"
              value={mode}
              onChange={(event) => {
                setMode(event.target.value);
                resetPage();
              }}
            >
              <option value="all">{c.all}</option>
              {corpusMeta.modes.map((item) => (
                <option key={item.key} value={item.key}>
                  {modeLabelFor(item.key)}
                </option>
              ))}
            </select>
          </div>
          <label className="corpus-checkbox">
            <input
              type="checkbox"
              checked={onlyGolden}
              onChange={(event) => {
                setOnlyGolden(event.target.checked);
                resetPage();
              }}
            />
            {c.onlyGolden}
          </label>
          <button type="button" className="btn btn-ghost corpus-export" onClick={exportFiltered}>
            {c.exportResults}
          </button>
        </div>

        <div className="corpus-layout">
          <div ref={listTopRef}>
            <div className="corpus-result-line">
              {c.resultCount(filtered.length)}
              {totalPages > 1 ? c.resultPage(currentPage, totalPages) : ""}
              {query ? c.resultQuery(query) : ""}
              {type !== "all" ? c.filterSuffix(typeLabelFor(type)) : ""}
              {mode !== "all" ? c.filterSuffix(modeLabelFor(mode)) : ""}
            </div>
            <div className="corpus-grid">
              {visibleItems.map((rawItem) => {
                const item = localizeCorpusItem(rawItem, locale, localize);
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`corpus-card ${selected?.id === item.id ? "is-active" : ""}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="corpus-card-top">
                      <span className="badge">{typeLabelFor(item.type)}</span>
                      <span className="corpus-region">{item.region}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p className="corpus-subtitle">{item.subtitle}</p>
                    <div className="corpus-modes">
                      {(item.modes || ["heritage"]).map((key) => (
                        <span key={key}>{modeLabelFor(key)}</span>
                      ))}
                    </div>
                    <p className="corpus-summary">{item.summary}</p>
                    <div className="corpus-card-bottom">
                      <span>{item.tags.slice(0, 2).join(" · ")}</span>
                      <span className="corpus-flags">
                        {item.goldenSample ? <em>{c.badgeGolden}</em> : null}
                        {item.needsResearch ? (
                          <em className="is-warn">{c.badgeResearch}</em>
                        ) : null}
                      </span>
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="corpus-empty">{c.empty}</div>
              )}
            </div>
            {totalPages > 1 && (
              <nav className="corpus-pager" aria-label={c.pagerAria}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {c.prev}
                </button>
                <span className="corpus-pager-info">
                  {c.pageInfo(currentPage, totalPages)}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {c.next}
                </button>
              </nav>
            )}
          </div>

          <aside className="corpus-detail">
            {selectedItem ? (
              <>
                <div className="corpus-card-top">
                  <span className="badge">{typeLabelFor(selectedItem.type)}</span>
                  <span className="corpus-region">{selectedItem.region}</span>
                </div>
                <h2>{selectedItem.title}</h2>
                <p className="corpus-subtitle">{selectedItem.subtitle}</p>
                <div className="corpus-modes">
                  {(selectedItem.modes || ["heritage"]).map((key) => (
                    <span key={key}>{modeLabelFor(key)}</span>
                  ))}
                </div>
                <p>{selectedItem.summary}</p>

                {selectedItem.text ? (
                  <div className="corpus-text">
                    <div className="corpus-section-label">{c.originalText}</div>
                    <p>{selectedItem.text}</p>
                  </div>
                ) : null}

                {selectedItem.answer ? (
                  <div className="corpus-answer">
                    <strong>{c.answerLabel}</strong> {selectedItem.answer}
                  </div>
                ) : null}

                {selectedItem.glossary?.length ? (
                  <div className="corpus-glossary">
                    <div className="corpus-section-label">{c.glossaryTitle}</div>
                    {selectedItem.glossary.map((item) => (
                      <div key={item.term} className="corpus-glossary-item">
                        <strong>{item.term}</strong>
                        <span>{item.meaning}</span>
                        {item.note ? <small>{item.note}</small> : null}
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="corpus-source">
                  <div className="corpus-section-label">{c.sourceTitle}</div>
                  {selectedItem.source?.map((source) => (
                    <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                      {source.title} ↗
                    </a>
                  ))}
                  <small>{c.license(selectedItem.license)}</small>
                </div>

                {selectedGolden ? (
                  <div className="corpus-golden">
                    <div className="corpus-section-label">{c.goldenTitle}</div>
                    <p>
                      {c.goldenSummary(
                        selectedGolden.expected.scenes.length,
                        selectedGolden.expected.glossary.length,
                        selectedGolden.checks.length
                      )}
                    </p>
                    <div className="corpus-checks">
                      {selectedGolden.checks.map((check) => (
                        <span key={check}>{check}</span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="corpus-actions">
                  {selectedItem.id === "yue-rhyme-moonlight" ? (
                    <a className="btn btn-primary" href="/stories/moonlight">
                      {c.readMoonlight}
                    </a>
                  ) : (
                    <span className="btn btn-ghost" aria-disabled="true">
                      {c.pendingInteractive}
                    </span>
                  )}
                  <span className="corpus-meta">
                    {c.potential(selectedItem.license, selectedItem.storyPotential ?? "-")}
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
              <span className="eyebrow">{c.goldenEyebrow}</span>
              <h2 className="section-title">{c.goldenHeading}</h2>
            </div>
            <p className="section-desc">{c.goldenDesc}</p>
          </div>
          <div className="golden-grid">
            {goldenSamples.map((sample) => {
              const item = localizeCorpusItem(
                corpusItems.find((entry) => entry.id === sample.storyId),
                locale,
                localize
              );
              return (
                <article className="golden-card" key={sample.id}>
                  <div className="corpus-card-top">
                    <span className="badge">{c.badgeGolden}</span>
                    <span className="corpus-region">{sample.expected.language}</span>
                  </div>
                  <h3>{item?.title || sample.storyId}</h3>
                  <p className="corpus-subtitle">{sample.id}</p>
                  <p>{item?.summary}</p>
                  <div className="golden-facts">
                    <span>{c.goldenScenes(sample.expected.scenes.length)}</span>
                    <span>{c.goldenEntities(sample.expected.entities.length)}</span>
                    <span>{c.goldenGlossary(sample.expected.glossary.length)}</span>
                    <span>{c.goldenChecks(sample.checks.length)}</span>
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

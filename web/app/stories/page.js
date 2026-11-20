"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ageBandLabel, stories, storyModes } from "../../lib/stories";
import { filterStories } from "../../lib/story-search";
import { readFavorites, subscribeFavorites } from "../../lib/favorites";
import { localizeStory } from "../../lib/i18n-content";
import StoryRecordBadge from "../../components/StoryRecordBadge";
import StoryFavoriteButton from "../../components/StoryFavoriteButton";
import ContinueReading from "../../components/ContinueReading";
import { useLocale } from "../../components/LocaleProvider";

const COPY = {
  zh: {
    eyebrow: "故事馆 · 3 种模式",
    title: "同一个广州，三种讲法。",
    lede: "正经模式留给家里人，鬼故事模式留给半夜不睡的人，野史模式留给爱听八卦的人。每个故事 3-8 幕、两三个选择、两个结局；可以听语音示例、看普通话翻译、点开方言词注释，也可以录下自家的粤语版本。",
    searchLabel: "搜索故事",
    searchPlaceholder: "搜索故事、地点或方言",
    ageFilter: "按年龄筛选",
    allAges: "全部年龄",
    favoritesOnly: "只看收藏",
    clear: "清除筛选",
    resultCount: (count) => `找到 ${count} 个故事`,
    emptyTitle: "没有找到故事",
    emptyText: "换个关键词，或清除筛选再看看。",
    read: "开始阅读",
    notice: (count) => `这里有 ${count} 个可玩故事。更多粤语童谣、传说、民俗、谚语和 Agent 黄金样品，在`,
    library: "粤语故事资料库",
    noticeMid: "；也可以去",
    studio: "AI 工坊",
    noticeEnd: "自己生成一版。",
  },
  en: {
    eyebrow: "STORIES · 3 MODES",
    title: "One Guangzhou, three ways to tell it.",
    lede: "Heritage mode for the family, ghost stories for those who stay up late, and hearsay for anyone who loves gossip. Every story runs 3-8 acts with a few choices and two endings. Listen to sample audio, read the translation, tap dialect notes, or record your family's own Cantonese version.",
    searchLabel: "Search stories",
    searchPlaceholder: "Search a story, place, or dialect",
    ageFilter: "Filter by age",
    allAges: "All ages",
    favoritesOnly: "Saved only",
    clear: "Clear filters",
    resultCount: (count) => `${count} ${count === 1 ? "story" : "stories"} found`,
    emptyTitle: "No stories found",
    emptyText: "Try another keyword, or clear the filters.",
    read: "Start reading",
    notice: (count) => `${count} playable stories here. More Cantonese rhymes, legends, folk customs, proverbs, and gold-sample agent stories live in the`,
    library: "Cantonese story library",
    noticeMid: ". You can also generate a version in the",
    studio: "AI studio",
    noticeEnd: ".",
  },
};

export default function StoriesPage() {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const [query, setQuery] = useState("");
  const [ageBand, setAgeBand] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(readFavorites());
    return subscribeFavorites(setFavorites);
  }, []);

  const localizedStories = stories.map((story) => ({
    ...localizeStory(story, locale, localize),
    isSample: story.type.includes("示例"),
  }));
  const filtered = filterStories(
    localizedStories,
    { query, ageBand, favoritesOnly },
    favorites
  );
  const hasFilters = Boolean(query.trim()) || ageBand !== "all" || favoritesOnly;

  const clearFilters = () => {
    setQuery("");
    setAgeBand("all");
    setFavoritesOnly(false);
  };

  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1 className="page-title">{c.title}</h1>
        <p className="page-lede">{c.lede}</p>
        <ContinueReading />
        <div className="story-tools" role="search">
          <label className="story-search">
            <span className="sr-only">{c.searchLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={c.searchPlaceholder}
            />
          </label>
          <label className="story-age">
            <span className="sr-only">{c.ageFilter}</span>
            <select value={ageBand} onChange={(event) => setAgeBand(event.target.value)}>
              <option value="all">{c.allAges}</option>
              <option value="4-6">{locale === "en" ? "Ages 4-6" : localize("4-6 岁")}</option>
              <option value="6-9">{locale === "en" ? "Ages 6-9" : localize("6-9 岁")}</option>
              <option value="10+">
                {locale === "en" ? "Ages 10+" : localize("10 岁以上")}
              </option>
            </select>
          </label>
          <button
            type="button"
            className={`story-filter ${favoritesOnly ? "is-active" : ""}`}
            aria-pressed={favoritesOnly}
            onClick={() => setFavoritesOnly((prev) => !prev)}
          >
            <span aria-hidden="true">★</span> {c.favoritesOnly}
          </button>
          {hasFilters ? (
            <button type="button" className="story-clear" onClick={clearFilters}>
              {c.clear}
            </button>
          ) : null}
        </div>
        <p className="story-result-count">{c.resultCount(filtered.length)}</p>
        <div className="mode-nav">
          {storyModes.map((mode) => (
            <a key={mode.key} href={`#${mode.key}`} className="mode-chip">
              <strong>{locale === "en" ? mode.enLabel : localize(mode.label)}</strong>
              <span>{locale === "en" ? mode.enTitle : localize(mode.title)}</span>
            </a>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="container story-empty">
          <h2>{c.emptyTitle}</h2>
          <p>{c.emptyText}</p>
          <button type="button" className="btn btn-ghost" onClick={clearFilters}>
            {c.clear}
          </button>
        </section>
      ) : null}

      {storyModes.map((mode) => {
        const modeStories = filtered.filter((story) => story.mode === mode.key);
        if (!modeStories.length) return null;
        return (
          <section className="container mode-section" id={mode.key} key={mode.key}>
            <div className="mode-heading">
              <span className="eyebrow">
                {locale === "en" ? mode.enLabel : localize(mode.label)}
              </span>
              <h2 className="section-title">
                {locale === "en" ? mode.enTitle : localize(mode.title)}
              </h2>
              <p className="section-desc">
                {locale === "en" ? mode.enDescription : localize(mode.description)}
              </p>
            </div>
            <div className="library-grid">
              {modeStories.map((story) => (
                <article className="library-card" key={story.slug}>
                  <img
                    src={story.cover}
                    alt={`${story.title} cover`}
                    width="900"
                    height="675"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="library-card-body">
                    <div className="story-meta">
                      <span>{story.dialect}</span>
                      <span className={story.isSample ? "badge badge-warn" : "badge"}>
                        {story.modeLabel}
                      </span>
                      {story.ageBand ? (
                        <span>
                          {locale === "en"
                            ? `Ages ${story.ageBand}`
                            : localize(ageBandLabel(story.ageBand))}
                        </span>
                      ) : null}
                    </div>
                    <div className="library-card-head">
                      <h2 className="story-title">{story.title}</h2>
                      <StoryFavoriteButton slug={story.slug} title={story.title} />
                    </div>
                    <p className="story-subtitle">{story.subtitle}</p>
                    <p className="story-intro">{story.intro}</p>
                    <StoryRecordBadge story={story} />
                    <div className="story-meta" style={{ marginTop: "auto" }}>
                      <span>{story.duration}</span>
                      <Link className="story-link" href={`/stories/${story.slug}`}>
                        {c.read} <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <section className="container" style={{ paddingBottom: 80 }}>
        <div className="notice" style={{ marginTop: 0 }}>
          {c.notice(stories.length)}{" "}
          <Link href="/library" style={{ color: "var(--cinnabar)", fontWeight: 600 }}>
            {c.library}
          </Link>
          {c.noticeMid}{" "}
          <Link href="/studio" style={{ color: "var(--cinnabar)", fontWeight: 600 }}>
            {c.studio}
          </Link>
          {c.noticeEnd}
        </div>
      </section>
    </>
  );
}

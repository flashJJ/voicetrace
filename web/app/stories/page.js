"use client";

import Link from "next/link";
import { ageBandLabel, stories, storyModes } from "../../lib/stories";
import { localizeStory } from "../../lib/i18n-content";
import StoryRecordBadge from "../../components/StoryRecordBadge";
import { useLocale } from "../../components/LocaleProvider";

const COPY = {
  zh: {
    eyebrow: "故事馆 · 3 种模式",
    title: "同一个广州，三种讲法。",
    lede: "正经模式留给家里人，鬼故事模式留给半夜不睡的人，野史模式留给爱听八卦的人。每个故事 3-8 幕、两三个选择、两个结局；可以听语音示例、看普通话翻译、点开方言词注释，也可以录下自家的粤语版本。",
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

  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1 className="page-title">{c.title}</h1>
        <p className="page-lede">{c.lede}</p>
        <div className="mode-nav">
          {storyModes.map((mode) => (
            <a key={mode.key} href={`#${mode.key}`} className="mode-chip">
              <strong>{locale === "en" ? mode.enLabel : localize(mode.label)}</strong>
              <span>{locale === "en" ? mode.enTitle : localize(mode.title)}</span>
            </a>
          ))}
        </div>
      </section>

      {storyModes.map((mode) => {
        const modeStories = stories
          .filter((story) => story.mode === mode.key)
          .map((story) => ({
            ...localizeStory(story, locale, localize),
            isSample: story.type.includes("示例"),
          }));
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
              {modeStories.map((story) => {
                return (
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
                      <h2 className="story-title">{story.title}</h2>
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
                );
              })}
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

"use client";

import Link from "next/link";
import KidsContinue from "../../components/KidsContinue";
import { kidGroups, kidStories } from "../../lib/kids";
import { localizeStory } from "../../lib/i18n-content";
import { useLocale } from "../../components/LocaleProvider";

const COPY = {
  zh: {
    eyebrow: "儿童模式 · 4-9 岁",
    title: "慢慢听，慢慢讲。",
    lede: "这里只有适合孩子的粤语故事。可以听示例语音、看普通话、点开方言词，也可以录下你家的版本。录音只保存在这台设备。",
    pick: "选一个故事",
    parent: "家长说明",
    note: "儿童模式不会出现鬼故事、野史和 AI 工坊。家长可以从右上角「家长说明」回到成人模式。",
    bandEyebrow: "适龄故事",
    age: (ageBand) => `${ageBand} 岁`,
    withParent: "家长陪同",
    start: "开始听",
    parentTitle: "给家长的一句话",
    parentText: (count) =>
      `儿童模式有 ${count} 个适龄故事，适合 4-9 岁。录音只存在本机浏览器，不上传服务器；自动转写由浏览器语音服务处理，可在录音棚关闭。`,
    parentMore: "适龄与隐私说明",
    parentExit: "回成人模式（家长确认）",
  },
  en: {
    eyebrow: "KIDS MODE · AGES 4-9",
    title: "Listen slowly. Speak slowly.",
    lede: "Only Cantonese stories made for children. Listen to sample audio, read the Mandarin or English text, tap dialect words, or record your family's version. Recordings stay on this device.",
    pick: "Pick a story",
    parent: "For grown-ups",
    note: "Kids mode never shows ghost stories, hearsay, or the AI studio. Grown-ups can return to adult mode from “For grown-ups” in the header.",
    bandEyebrow: "Age-appropriate stories",
    age: (ageBand) => `Ages ${ageBand}`,
    withParent: "With a grown-up",
    start: "Start listening",
    parentTitle: "A note for grown-ups",
    parentText: (count) =>
      `Kids mode has ${count} stories for ages 4-9. Recordings stay in this browser and are never uploaded; automatic transcription uses the browser's speech service and can be turned off in the studio.`,
    parentMore: "Ages and privacy",
    parentExit: "Back to adult mode (grown-up check)",
  },
};

export default function KidsPage() {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const groups = kidGroups().map((group) => ({
    ...group,
    label: locale === "en" ? group.enLabel : localize(group.label),
    description: locale === "en" ? group.enDescription : localize(group.description),
    stories: group.stories.map((story) => localizeStory(story, locale, localize)),
  }));
  const pool = kidStories().map(({ slug, title, ageBand }) => ({ slug, title, ageBand }));

  return (
    <main className="container kids-page">
      <section className="kids-hero">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1>{c.title}</h1>
        <p>{c.lede}</p>
        <div className="kids-hero-actions">
          <a className="btn btn-primary" href="#stories">
            {c.pick}
          </a>
          <Link className="btn btn-ghost" href="/kids/parent">
            {c.parent}
          </Link>
        </div>
      </section>

      <p className="kids-note">{c.note}</p>

      <KidsContinue stories={pool} />

      <div id="stories">
        {groups.map((group) => (
          <section className="kids-band" key={group.key}>
            <div className="kids-band-head">
              <div>
                <span className="eyebrow">{c.bandEyebrow}</span>
                <h2>{group.label}</h2>
              </div>
              <p>{group.description}</p>
            </div>
            <div className="kids-grid">
              {group.stories.map((story) => (
                <article className="kids-card" key={story.slug}>
                  <img
                    src={story.cover}
                    alt={`${story.title} cover`}
                    width="900"
                    height="675"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="kids-card-body">
                    <div className="kids-card-meta">
                      <span>{c.age(story.ageBand)}</span>
                      {story.audience === "family" ? <span>{c.withParent}</span> : null}
                    </div>
                    <h3>{story.title}</h3>
                    <p>{story.subtitle}</p>
                    {story.kidNote ? <p className="kids-card-note">{story.kidNote}</p> : null}
                    <Link className="kids-card-link" href={`/kids/${story.slug}`}>
                      {c.start} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="kids-parent-card">
        <div>
          <h2>{c.parentTitle}</h2>
          <p>{c.parentText(kidStories().length)}</p>
        </div>
        <div className="kids-hero-actions">
          <Link className="btn btn-ghost" href="/kids/parent">
            {c.parentMore}
          </Link>
          <Link className="btn btn-ghost" href="/kids/parent#exit">
            {c.parentExit}
          </Link>
        </div>
      </section>
    </main>
  );
}

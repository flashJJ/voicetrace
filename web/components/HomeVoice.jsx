"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listRecordings } from "../lib/recordings";
import { subscribeRecordProgress } from "../lib/record-progress";
import { getStory } from "../lib/stories";
import { localizeStory } from "../lib/i18n-content";
import { useLocale } from "./LocaleProvider";

const COPY = {
  zh: {
    eyebrow: "我家的声音",
    emptyTitle: "我家的声音，还空着。",
    emptyText: "挑一个故事片段，用你家的粤语读一遍。录音只保存在这台设备，随时可以删。",
    recordFirst: "录第一段",
    archive: "声音档案",
    countTitle: (count) => `已经留下 ${count} 段乡音。`,
    summary: (stories, minutes) => `${stories} 个故事 · ${minutes}。最近一段：`,
    latestLine: (title, scene, who, relation) => `${title}《${scene}》，${who}${relation}。`,
    self: "本人",
    continue: "继续录音",
    lessThanMinute: "不到 1 分钟",
    aboutMinutes: (minutes) => `约 ${minutes} 分钟`,
  },
  en: {
    eyebrow: "OUR FAMILY VOICE",
    emptyTitle: "Our family voice is still empty.",
    emptyText:
      "Pick a story act and read it in your family's Cantonese. Recordings stay on this device and can be deleted anytime.",
    recordFirst: "Record the first take",
    archive: "Voice archive",
    countTitle: (count) => `${count} voice takes saved.`,
    summary: (stories, minutes) => `${stories} stories · ${minutes}. Latest: `,
    latestLine: (title, scene, who, relation) =>
      `${title}, “${scene}”, ${who}${relation}.`,
    self: "self",
    continue: "Keep recording",
    lessThanMinute: "under 1 minute",
    aboutMinutes: (minutes) => `about ${minutes} min`,
  },
};

export default function HomeVoice() {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const [records, setRecords] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = () => {
      listRecordings()
        .then((items) => {
          if (alive) setRecords(items);
        })
        .catch(() => {
          if (alive) setRecords([]);
        });
    };
    load();
    const unsubscribe = subscribeRecordProgress(load);
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  if (!records) return null;

  const minutesLabel = (seconds) => {
    if (seconds < 60) return c.lessThanMinute;
    const minutes = Math.round(seconds / 60);
    return c.aboutMinutes(minutes);
  };

  if (records.length === 0) {
    return (
      <section className="container home-voice-wrap">
        <div className="home-voice">
          <div>
            <span className="eyebrow">{c.eyebrow}</span>
            <h2>{c.emptyTitle}</h2>
            <p>{c.emptyText}</p>
          </div>
          <div className="home-voice-actions">
            <Link className="btn btn-primary" href="/record">
              {c.recordFirst}
            </Link>
            <Link className="btn btn-ghost" href="/archive">
              {c.archive}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const totalDuration = records.reduce((sum, record) => sum + (record.duration || 0), 0);
  const storyCount = new Set(records.map((record) => record.storySlug)).size;
  const latest = records[0];
  const rawStory = latest.storySlug ? getStory(latest.storySlug) : null;
  const localizedStory = rawStory ? localizeStory(rawStory, locale, localize) : null;
  const latestStoryTitle = localizedStory?.title || latest.storyTitle || latest.storySlug;
  const latestSceneTitle =
    localizedStory?.scenes.find((scene) => scene.id === latest.sceneId)?.title ||
    latest.sceneTitle;
  const who = latest.speaker ? `${latest.speaker} · ` : "";

  return (
    <section className="container home-voice-wrap">
      <div className="home-voice">
        <div>
          <span className="eyebrow">{c.eyebrow}</span>
          <h2>{c.countTitle(records.length)}</h2>
          <p>
            {c.summary(storyCount, minutesLabel(totalDuration))}
            {c.latestLine(
              latestStoryTitle,
              latestSceneTitle,
              who,
              latest.relation || c.self
            )}
          </p>
        </div>
        <div className="home-voice-actions">
          <Link className="btn btn-primary" href="/record">
            {c.continue}
          </Link>
          <Link className="btn btn-ghost" href="/archive">
            {c.archive}
          </Link>
        </div>
      </div>
    </section>
  );
}

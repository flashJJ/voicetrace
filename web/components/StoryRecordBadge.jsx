"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadRecordProgress, subscribeRecordProgress } from "../lib/record-progress";
import { useLocale } from "./LocaleProvider";

const COPY = {
  zh: {
    label: "我家的版本",
    rec: (count, total) => `已录 ${count}/${total}`,
    none: "未录",
    start: "录我家的版本",
    listen: "听我家的版本",
    continue: "继续录",
  },
  en: {
    label: "Our family version",
    rec: (count, total) => `${count}/${total} recorded`,
    none: "Not recorded",
    start: "Record our version",
    listen: "Hear our version",
    continue: "Keep recording",
  },
};

export default function StoryRecordBadge({ story }) {
  const { pick } = useLocale();
  const c = pick(COPY);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = () => {
      loadRecordProgress().then((map) => {
        if (alive) setProgress(map.get(story.slug) || { count: 0, duration: 0 });
      });
    };
    load();
    const unsubscribe = subscribeRecordProgress(load);
    return () => {
      alive = false;
      unsubscribe();
    };
  }, [story.slug]);

  if (!progress) return null;
  const total = story.scenes.length;
  const complete = progress.count >= total;
  const href =
    progress.count === 0
      ? `/record?story=${story.slug}`
      : complete
        ? `/stories/${story.slug}`
        : `/record?story=${story.slug}`;
  const action = progress.count === 0 ? c.start : complete ? c.listen : c.continue;

  return (
    <div className="story-record">
      <span className="story-record-label">{c.label}</span>
      <span className={`story-record-count ${progress.count ? "is-active" : ""}`}>
        {progress.count ? c.rec(progress.count, total) : c.none}
      </span>
      <Link className="story-record-link" href={href}>
        {action} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

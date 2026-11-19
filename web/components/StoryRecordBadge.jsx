"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadRecordProgress, subscribeRecordProgress } from "../lib/record-progress";

export default function StoryRecordBadge({ story }) {
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
  const action = progress.count === 0 ? "录我家的版本" : complete ? "听我家的版本" : "继续录";

  return (
    <div className="story-record">
      <span className="story-record-label">我家的版本</span>
      <span className={`story-record-count ${progress.count ? "is-active" : ""}`}>
        {progress.count ? `已录 ${progress.count}/${total}` : "未录"}
      </span>
      <Link className="story-record-link" href={href}>
        {action} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

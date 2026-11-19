"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { kidStories } from "../lib/kids";
import { getKidLearning } from "../lib/kid-learning";
import {
  clearAllKidProgress,
  clearKidProgress,
  readKidProgressAll,
  subscribeKidProgress,
  summarizeKidProgress,
} from "../lib/kid-progress";

const pool = kidStories();

function hasAny(summary) {
  return (
    summary.visitedCount > 0 ||
    summary.recordedCount > 0 ||
    summary.wordsKnown > 0 ||
    summary.quizAnswered > 0
  );
}

export default function KidProgressPanel() {
  const [all, setAll] = useState({});

  useEffect(() => {
    const sync = () => setAll(readKidProgressAll());
    sync();
    return subscribeKidProgress(sync);
  }, []);

  const rows = pool.map((story) => ({
    story,
    summary: summarizeKidProgress(
      story,
      getKidLearning(story.slug),
      all[story.slug] || {}
    ),
  }));
  const recordedRows = rows.filter((row) => hasAny(row.summary));

  const handleClear = (slug) => {
    clearKidProgress(slug);
    setAll(readKidProgressAll());
  };

  const handleClearAll = () => {
    if (!window.confirm("清除所有故事的学习记录？录音不会删除，仍可在声音档案里找到。")) {
      return;
    }
    clearAllKidProgress();
    setAll({});
  };

  if (!recordedRows.length) {
    return (
      <p className="kid-progress-empty">
        还没有学习记录。孩子每读一幕、跟读一次或做小测，这里都会留下一条本机记录。
      </p>
    );
  }

  return (
    <>
      <ul className="kid-progress-list">
        {recordedRows.map(({ story, summary }) => (
          <li className="kid-progress-item" key={story.slug}>
            <span className="kid-progress-title">
              {story.title} · {story.ageBand} 岁
            </span>
            <span className="kid-progress-meta">
              <span>
                读 {summary.visitedCount}/{summary.scenesTotal} 幕
              </span>
              <span>跟读 {summary.recordedCount} 段</span>
              <span>
                认词 {summary.wordsKnown}/{summary.wordsTotal}
              </span>
              <span>
                {summary.quizAnswered
                  ? `小测 ${summary.quizCorrect}/${summary.quizTotal}`
                  : "小测未做"}
              </span>
            </span>
            <Link className="kid-progress-link" href={`/kids/${story.slug}/summary`}>
              看小结
            </Link>
            <button
              type="button"
              className="kid-progress-clear"
              onClick={() => handleClear(story.slug)}
            >
              清除
            </button>
          </li>
        ))}
      </ul>
      <div className="kid-progress-actions">
        <span className="kid-learn-hint">记录只存在这台设备，换手机不会同步，可随时清除。</span>
        <button type="button" className="kid-progress-clear-all" onClick={handleClearAll}>
          清除全部学习记录
        </button>
      </div>
    </>
  );
}

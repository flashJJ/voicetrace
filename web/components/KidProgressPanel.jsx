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
import { localizeStory } from "../lib/i18n-content";
import { useLocale } from "./LocaleProvider";

const pool = kidStories();

const COPY = {
  zh: {
    confirmAll: "清除所有故事的学习记录？录音不会删除，仍可在声音档案里找到。",
    empty: "还没有学习记录。孩子每读一幕、跟读一次或做小测，这里都会留下一条本机记录。",
    age: (ageBand) => `${ageBand} 岁`,
    visited: (done, total) => `读 ${done}/${total} 幕`,
    recorded: (count) => `跟读 ${count} 段`,
    words: (done, total) => `认词 ${done}/${total}`,
    quiz: (correct, total) => `小测 ${correct}/${total}`,
    quizNone: "小测未做",
    view: "看小结",
    clear: "清除",
    hint: "记录只存在这台设备，换手机不会同步，可随时清除。",
    clearAll: "清除全部学习记录",
  },
  en: {
    confirmAll:
      "Clear learning records for all stories? Recordings are kept and can still be found in the archive.",
    empty:
      "No learning records yet. Each act read, read-along, or quiz leaves a record on this device.",
    age: (ageBand) => `ages ${ageBand}`,
    visited: (done, total) => `${done}/${total} acts`,
    recorded: (count) => `${count} read-alongs`,
    words: (done, total) => `${done}/${total} words`,
    quiz: (correct, total) => `quiz ${correct}/${total}`,
    quizNone: "quiz not taken",
    view: "Summary",
    clear: "Clear",
    hint: "Records stay on this device, do not sync across phones, and can be cleared anytime.",
    clearAll: "Clear all learning records",
  },
};

function hasAny(summary) {
  return (
    summary.visitedCount > 0 ||
    summary.recordedCount > 0 ||
    summary.wordsKnown > 0 ||
    summary.quizAnswered > 0
  );
}

export default function KidProgressPanel() {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const [all, setAll] = useState({});

  useEffect(() => {
    const sync = () => setAll(readKidProgressAll());
    sync();
    return subscribeKidProgress(sync);
  }, []);

  const rows = pool.map((story) => ({
    story,
    title: localizeStory(story, locale, localize).title,
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
    if (!window.confirm(c.confirmAll)) {
      return;
    }
    clearAllKidProgress();
    setAll({});
  };

  if (!recordedRows.length) {
    return <p className="kid-progress-empty">{c.empty}</p>;
  }

  return (
    <>
      <ul className="kid-progress-list">
        {recordedRows.map(({ story, title, summary }) => (
          <li className="kid-progress-item" key={story.slug}>
            <span className="kid-progress-title">
              {title} · {c.age(story.ageBand)}
            </span>
            <span className="kid-progress-meta">
              <span>{c.visited(summary.visitedCount, summary.scenesTotal)}</span>
              <span>{c.recorded(summary.recordedCount)}</span>
              <span>{c.words(summary.wordsKnown, summary.wordsTotal)}</span>
              <span>
                {summary.quizAnswered
                  ? c.quiz(summary.quizCorrect, summary.quizTotal)
                  : c.quizNone}
              </span>
            </span>
            <Link className="kid-progress-link" href={`/kids/${story.slug}/summary`}>
              {c.view}
            </Link>
            <button
              type="button"
              className="kid-progress-clear"
              onClick={() => handleClear(story.slug)}
            >
              {c.clear}
            </button>
          </li>
        ))}
      </ul>
      <div className="kid-progress-actions">
        <span className="kid-learn-hint">{c.hint}</span>
        <button type="button" className="kid-progress-clear-all" onClick={handleClearAll}>
          {c.clearAll}
        </button>
      </div>
    </>
  );
}

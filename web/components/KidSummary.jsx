"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearKidProgress,
  readKidProgress,
  subscribeKidProgress,
  summarizeKidProgress,
} from "../lib/kid-progress";
import { localizeStory } from "../lib/i18n-content";
import { useLocale } from "./LocaleProvider";

const COPY = {
  zh: {
    aria: "学习小结",
    back: "回故事",
    kidsMeta: (ageBand) => `${ageBand} 岁 · 儿童模式`,
    eyebrow: "学习小结",
    heroText: "读了几幕、跟读了几段、认识了几个词、答对几题，这里都记着。",
    note: "小结只统计本机保存的进度；录音文件在「声音档案」里单独管理，清除小结不会删除录音。",
    confirmClear: "清除这个故事的学习记录？录音不会删除，仍可在声音档案里找到。",
    visited: "读过的幕",
    recorded: "跟读的段",
    words: "认识的词",
    quiz: "小测答对",
    notDone: "未做",
    stepListen: "听故事读完几幕",
    stepReadAlong: "跟读一段自己的声音",
    stepWords: "认识本幕的词语",
    stepQuiz: "做一次故事小测",
    hintHasProgress: "这份记录只保存在这台设备，不会上传。",
    hintEmpty: "还没有学习记录。先回故事读一幕，再回来看看。",
    continueReading: "继续读这个故事",
    goRead: "去读故事",
    retakeQuiz: "再做小测",
    takeQuiz: "做故事小测",
    clear: "清除这份记录",
  },
  en: {
    aria: "Learning summary",
    back: "Back to story",
    kidsMeta: (ageBand) => `${ageBand} · Kids mode`,
    eyebrow: "Learning summary",
    heroText: "Acts read, lines echoed, words learned, and quiz answers — all recorded here.",
    note: "This summary only counts progress saved on this device. Recordings are managed separately in the archive; clearing the summary does not delete them.",
    confirmClear:
      "Clear the learning record for this story? Recordings are kept and can still be found in the archive.",
    visited: "Acts read",
    recorded: "Read-along takes",
    words: "Words known",
    quiz: "Quiz correct",
    notDone: "Not yet",
    stepListen: "Read a few acts",
    stepReadAlong: "Read along in your own voice",
    stepWords: "Learn the words in this act",
    stepQuiz: "Take the story quiz",
    hintHasProgress: "This record stays on this device and is never uploaded.",
    hintEmpty: "No learning record yet. Read an act, then come back.",
    continueReading: "Keep reading",
    goRead: "Read the story",
    retakeQuiz: "Retake quiz",
    takeQuiz: "Take the story quiz",
    clear: "Clear this record",
  },
};

export default function KidSummary({ story, learning }) {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const localizedStory = localizeStory(story, locale, localize);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const sync = () => setProgress(readKidProgress(story.slug));
    sync();
    return subscribeKidProgress(sync);
  }, [story.slug]);

  const summary = summarizeKidProgress(story, learning, progress || {});
  const hasProgress =
    summary.visitedCount > 0 ||
    summary.recordedCount > 0 ||
    summary.wordsKnown > 0 ||
    summary.quizAnswered > 0;

  const handleClear = () => {
    if (!window.confirm(c.confirmClear)) {
      return;
    }
    clearKidProgress(story.slug);
    setProgress(readKidProgress(story.slug));
  };

  return (
    <main className="container kids-page kid-summary-page">
      <div className="reader-top">
        <Link href={`/kids/${story.slug}`} className="reader-back">
          <span aria-hidden="true">←</span> {c.back}
        </Link>
        <span>{c.kidsMeta(localizedStory.ageBand)}</span>
      </div>

      <section className="kids-hero kid-summary-hero">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1>{localizedStory.title}</h1>
        <p>{c.heroText}</p>
      </section>

      <section className="kid-summary" aria-label={c.aria}>
        <div className="kid-stat-grid">
          <div className="kid-stat">
            <strong>
              {summary.visitedCount}/{summary.scenesTotal}
            </strong>
            <span>{c.visited}</span>
          </div>
          <div className="kid-stat">
            <strong>{summary.recordedCount}</strong>
            <span>{c.recorded}</span>
          </div>
          <div className="kid-stat">
            <strong>
              {summary.wordsKnown}/{summary.wordsTotal}
            </strong>
            <span>{c.words}</span>
          </div>
          <div className="kid-stat">
            <strong>
              {summary.quizAnswered ? `${summary.quizCorrect}/${summary.quizTotal}` : c.notDone}
            </strong>
            <span>{c.quiz}</span>
          </div>
        </div>

        <ul className="kid-summary-steps">
          <li className={summary.steps.listen ? "is-done" : ""}>
            <span className="kid-step-dot" aria-hidden="true" />
            {c.stepListen}
          </li>
          <li className={summary.steps.readAlong ? "is-done" : ""}>
            <span className="kid-step-dot" aria-hidden="true" />
            {c.stepReadAlong}
          </li>
          <li className={summary.steps.words ? "is-done" : ""}>
            <span className="kid-step-dot" aria-hidden="true" />
            {c.stepWords}
          </li>
          <li className={summary.steps.quiz ? "is-done" : ""}>
            <span className="kid-step-dot" aria-hidden="true" />
            {c.stepQuiz}
          </li>
        </ul>

        <p className="kid-learn-hint">
          {hasProgress ? c.hintHasProgress : c.hintEmpty}
        </p>

        <div className="kid-summary-actions">
          <Link className="btn btn-primary" href={`/kids/${story.slug}`}>
            {hasProgress ? c.continueReading : c.goRead}
          </Link>
          {summary.quizTotal > 0 ? (
            <Link className="btn btn-ghost" href={`/kids/${story.slug}/quiz`}>
              {summary.quizAnswered ? c.retakeQuiz : c.takeQuiz}
            </Link>
          ) : null}
          {hasProgress ? (
            <button type="button" className="btn btn-ghost" onClick={handleClear}>
              {c.clear}
            </button>
          ) : null}
        </div>
      </section>

      <p className="kids-note">{c.note}</p>
    </main>
  );
}

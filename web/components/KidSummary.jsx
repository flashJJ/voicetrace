"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearKidProgress,
  readKidProgress,
  subscribeKidProgress,
  summarizeKidProgress,
} from "../lib/kid-progress";

export default function KidSummary({ story, learning }) {
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
    if (!window.confirm("清除这个故事的学习记录？录音不会删除，仍可在声音档案里找到。")) {
      return;
    }
    clearKidProgress(story.slug);
    setProgress(readKidProgress(story.slug));
  };

  return (
    <section className="kid-summary" aria-label="学习小结">
      <div className="kid-stat-grid">
        <div className="kid-stat">
          <strong>
            {summary.visitedCount}/{summary.scenesTotal}
          </strong>
          <span>读过的幕</span>
        </div>
        <div className="kid-stat">
          <strong>{summary.recordedCount}</strong>
          <span>跟读的段</span>
        </div>
        <div className="kid-stat">
          <strong>
            {summary.wordsKnown}/{summary.wordsTotal}
          </strong>
          <span>认识的词</span>
        </div>
        <div className="kid-stat">
          <strong>
            {summary.quizAnswered ? `${summary.quizCorrect}/${summary.quizTotal}` : "未做"}
          </strong>
          <span>小测答对</span>
        </div>
      </div>

      <ul className="kid-summary-steps">
        <li className={summary.steps.listen ? "is-done" : ""}>
          <span className="kid-step-dot" aria-hidden="true" />
          听故事读完几幕
        </li>
        <li className={summary.steps.readAlong ? "is-done" : ""}>
          <span className="kid-step-dot" aria-hidden="true" />
          跟读一段自己的声音
        </li>
        <li className={summary.steps.words ? "is-done" : ""}>
          <span className="kid-step-dot" aria-hidden="true" />
          认识本幕的词语
        </li>
        <li className={summary.steps.quiz ? "is-done" : ""}>
          <span className="kid-step-dot" aria-hidden="true" />
          做一次故事小测
        </li>
      </ul>

      <p className="kid-learn-hint">
        {hasProgress
          ? "这份记录只保存在这台设备，不会上传。"
          : "还没有学习记录。先回故事读一幕，再回来看看。"}
      </p>

      <div className="kid-summary-actions">
        <Link className="btn btn-primary" href={`/kids/${story.slug}`}>
          {hasProgress ? "继续读这个故事" : "去读故事"}
        </Link>
        {summary.quizTotal > 0 ? (
          <Link className="btn btn-ghost" href={`/kids/${story.slug}/quiz`}>
            {summary.quizAnswered ? "再做小测" : "做故事小测"}
          </Link>
        ) : null}
        {hasProgress ? (
          <button type="button" className="btn btn-ghost" onClick={handleClear}>
            清除这份记录
          </button>
        ) : null}
      </div>
    </section>
  );
}

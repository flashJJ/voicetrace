"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecorder } from "../hooks/useRecorder";
import { useSpeechPlayback } from "../hooks/useSpeechPlayback";
import { formatDuration } from "../lib/recordings";
import { markSceneRecorded, readKidProgress } from "../lib/kid-progress";
import { useLocale } from "./LocaleProvider";
import SpeechRateControl from "./SpeechRateControl";

const COPY = {
  zh: {
    aria: "跟读练习",
    title: "跟读一次",
    hint: "先听一次，再录下来自己回放。练习录音不会上传，也不会进声音档案；换一幕会清空。",
    done: "已跟读过",
    recording: (time) => `正在录音 · ${time}`,
    requesting: "正在请求麦克风…",
    processing: "正在生成…",
    gotIt: "知道了",
    stopPlayback: "停止播放",
    listen: "听示例",
    stop: "停止",
    again: "再读一次",
    againMarked: "再跟读一次",
    start: "开始跟读",
    clear: "清空",
    saveLink: "想保存就录进我家的版本 →",
  },
  en: {
    aria: "Read-along practice",
    title: "Read along once",
    hint: "Listen once, then record yourself and play it back. Practice recordings are not uploaded and do not go to the archive; they reset when you change acts.",
    done: "Read along done",
    recording: (time) => `Recording · ${time}`,
    requesting: "Requesting microphone…",
    processing: "Preparing…",
    gotIt: "Got it",
    stopPlayback: "Stop",
    listen: "Listen",
    stop: "Stop",
    again: "Read again",
    againMarked: "Read along again",
    start: "Start read-along",
    clear: "Clear",
    saveLink: "To keep it, record into our family version →",
  },
};

export default function KidReadAlong({ story, scene }) {
  const { pick } = useLocale();
  const c = pick(COPY);
  const { status, error, elapsed, clip, start, stop, reset, setError } = useRecorder();
  const {
    speaking,
    message: listenMessage,
    speak,
    stop: stopSpeaking,
  } = useSpeechPlayback();
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    reset();
    stopSpeaking();
    setMarked(false);
    try {
      setMarked(readKidProgress(story.slug).recorded.includes(scene.id));
    } catch (readError) {
      setMarked(false);
    }
  }, [reset, stopSpeaking, story.slug, scene.id]);

  useEffect(() => {
    if (status !== "ready" || !clip) return;
    markSceneRecorded(story.slug, scene.id);
    setMarked(true);
  }, [status, clip, story.slug, scene.id]);

  const isRecording = status === "recording";

  return (
    <section className="kid-readalong" id="kid-readalong" aria-label={c.aria}>
      <div className="kid-readalong-head">
        <div>
          <h3>{c.title}</h3>
          <p className="kid-learn-hint">{c.hint}</p>
        </div>
        {marked ? <span className="kid-readalong-done">{c.done}</span> : null}
      </div>

      <div className="kid-readalong-body">
        {isRecording ? (
          <p className="kid-readalong-status is-recording">
            {c.recording(formatDuration(elapsed))}
          </p>
        ) : null}
        {status === "requesting" ? (
          <p className="kid-readalong-status">{c.requesting}</p>
        ) : null}
        {status === "processing" ? (
          <p className="kid-readalong-status">{c.processing}</p>
        ) : null}

        {clip ? (
          <div className="kid-readalong-preview">
            <audio controls src={clip.url} preload="metadata" />
            <span>{formatDuration(clip.duration)}</span>
          </div>
        ) : null}

        {error ? (
          <p className="kid-readalong-error">
            {error}
            <button type="button" onClick={() => setError("")}>
              {c.gotIt}
            </button>
          </p>
        ) : null}

        {listenMessage ? (
          <p className="kid-readalong-listen-hint">{listenMessage}</p>
        ) : null}

        <SpeechRateControl />

        <div className="kid-readalong-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              speaking ? stopSpeaking() : speak(scene.audioText || scene.textYue)
            }
            disabled={isRecording || status === "requesting" || status === "processing"}
          >
            {speaking ? c.stopPlayback : c.listen}
          </button>
          {isRecording ? (
            <button type="button" className="btn btn-primary" onClick={stop}>
              {c.stop}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={start}
              disabled={status === "requesting" || status === "processing"}
            >
              {clip ? c.again : marked ? c.againMarked : c.start}
            </button>
          )}
          {clip && !isRecording ? (
            <button type="button" className="btn btn-ghost" onClick={reset}>
              {c.clear}
            </button>
          ) : null}
          <Link
            className="kid-readalong-link"
            href={`/kids/record?story=${story.slug}&scene=${scene.id}`}
          >
            {c.saveLink}
          </Link>
        </div>
      </div>
    </section>
  );
}

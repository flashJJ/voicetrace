"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecorder } from "../hooks/useRecorder";
import { useSpeechPlayback } from "../hooks/useSpeechPlayback";
import { formatDuration } from "../lib/recordings";
import { markSceneRecorded, readKidProgress } from "../lib/kid-progress";

export default function KidReadAlong({ story, scene }) {
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
    <section className="kid-readalong" id="kid-readalong" aria-label="跟读练习">
      <div className="kid-readalong-head">
        <div>
          <h3>跟读一次</h3>
          <p className="kid-learn-hint">
            先听一次，再录下来自己回放。练习录音不会上传，也不会进声音档案；换一幕会清空。
          </p>
        </div>
        {marked ? <span className="kid-readalong-done">已跟读过</span> : null}
      </div>

      <div className="kid-readalong-body">
        {isRecording ? (
          <p className="kid-readalong-status is-recording">
            正在录音 · {formatDuration(elapsed)}
          </p>
        ) : null}
        {status === "requesting" ? (
          <p className="kid-readalong-status">正在请求麦克风…</p>
        ) : null}
        {status === "processing" ? (
          <p className="kid-readalong-status">正在生成…</p>
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
              知道了
            </button>
          </p>
        ) : null}

        {listenMessage ? (
          <p className="kid-readalong-listen-hint">{listenMessage}</p>
        ) : null}

        <div className="kid-readalong-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              speaking ? stopSpeaking() : speak(scene.audioText || scene.textYue)
            }
            disabled={isRecording || status === "requesting" || status === "processing"}
          >
            {speaking ? "停止播放" : "听示例"}
          </button>
          {isRecording ? (
            <button type="button" className="btn btn-primary" onClick={stop}>
              停止
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={start}
              disabled={status === "requesting" || status === "processing"}
            >
              {clip ? "再读一次" : marked ? "再跟读一次" : "开始跟读"}
            </button>
          )}
          {clip && !isRecording ? (
            <button type="button" className="btn btn-ghost" onClick={reset}>
              清空
            </button>
          ) : null}
          <Link
            className="kid-readalong-link"
            href={`/kids/record?story=${story.slug}&scene=${scene.id}`}
          >
            想保存就录进我家的版本 →
          </Link>
        </div>
      </div>
    </section>
  );
}

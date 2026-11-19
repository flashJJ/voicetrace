"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { kidStories } from "../../../lib/kids";
import {
  formatDuration,
  getRecording,
  recordingId,
  saveRecording,
} from "../../../lib/recordings";
import { MAX_RECORD_MS } from "../../../lib/recorder";
import { useRecorder } from "../../../hooks/useRecorder";
import { useSpeechRecognition } from "../../../hooks/useSpeech";

const pool = kidStories();

export default function KidRecordPage() {
  const [storySlug, setStorySlug] = useState(pool[0].slug);
  const [sceneId, setSceneId] = useState(pool[0].scenes[0].id);
  const [speaker, setSpeaker] = useState("");
  const [consent, setConsent] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [manualEdit, setManualEdit] = useState(false);
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  const [existing, setExisting] = useState(null);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const initializedRef = useRef(false);
  const { status, error, elapsed, clip, start, stop, reset, setError } = useRecorder();
  const speech = useSpeechRecognition();

  const story = useMemo(
    () => pool.find((item) => item.slug === storySlug) || pool[0],
    [storySlug]
  );
  const scene = useMemo(
    () => story.scenes.find((item) => item.id === sceneId) || story.scenes[0],
    [story, sceneId]
  );

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const wantedStory = pool.find((item) => item.slug === params.get("story"));
    if (!wantedStory) return;
    setStorySlug(wantedStory.slug);
    const wantedScene = wantedStory.scenes.find(
      (item) => item.id === params.get("scene")
    );
    setSceneId(wantedScene?.id || wantedStory.scenes[0].id);
  }, []);

  useEffect(() => {
    let alive = true;
    reset();
    setMessage("");
    setSaveError("");
    setExisting(null);
    getRecording(recordingId(story.slug, scene.id))
      .then((record) => {
        if (!alive) return;
        setExisting(record);
        setTranscript(record?.transcript || "");
        if (record?.speaker) setSpeaker(record.speaker);
        setManualEdit(false);
      })
      .catch(() => {
        if (alive) setTranscript("");
      });
    return () => {
      alive = false;
    };
  }, [reset, story.slug, scene.id]);

  useEffect(() => {
    const shouldListen = (status === "recording" || status === "processing") && autoTranscribe;
    if (shouldListen) speech.start();
    else speech.stop();
  }, [status, autoTranscribe, speech.start, speech.stop]);

  useEffect(() => {
    if (!autoTranscribe || manualEdit) return;
    const combined = `${speech.transcript}${speech.interim}`;
    if (combined) setTranscript(combined);
  }, [speech.transcript, speech.interim, autoTranscribe, manualEdit]);

  const handleStoryChange = (event) => {
    const next = pool.find((item) => item.slug === event.target.value);
    if (!next) return;
    setStorySlug(next.slug);
    setSceneId(next.scenes[0].id);
  };

  const handleStart = () => {
    setManualEdit(false);
    setMessage("");
    setSaveError("");
    if (autoTranscribe) setTranscript("");
    start();
  };

  const handleSave = async () => {
    if (!clip) return;
    if (!consent) {
      setSaveError("请先勾选「同意保存在本机」。");
      return;
    }
    setSaving(true);
    setSaveError("");
    setMessage("");
    try {
      await saveRecording({
        id: recordingId(story.slug, scene.id),
        storySlug: story.slug,
        sceneId: scene.id,
        storyTitle: story.title,
        sceneTitle: scene.title,
        blob: clip.blob,
        mime: clip.mime,
        duration: clip.duration,
        transcript: transcript.trim() || scene.textYue,
        speaker: speaker.trim(),
        relation: "本人",
        consent: true,
      });
      setExisting(await getRecording(recordingId(story.slug, scene.id)));
      setMessage("录好了，已经存在这台设备。可以回故事里听我家的版本。");
    } catch (saveFailure) {
      setSaveError(saveFailure.message || "保存失败，请重试。");
    } finally {
      setSaving(false);
    }
  };

  const isRecording = status === "recording";

  return (
    <main className="container kids-page kids-record-page">
      <section className="kids-hero">
        <span className="eyebrow">儿童模式 · 录音</span>
        <h1>录一段我家的粤语。</h1>
        <p>大人可以陪着一起读。读错没关系，重录整段就好。录音只保存在这台设备。</p>
      </section>

      <div className="kids-record-card">
        <div className="kids-record-selects">
          <label>
            <span>故事</span>
            <select value={story.slug} onChange={handleStoryChange}>
              {pool.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title} · {item.ageBand} 岁
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>片段</span>
            <select value={scene.id} onChange={(event) => setSceneId(event.target.value)}>
              {story.scenes.map((item) => (
                <option key={item.id} value={item.id}>
                  第 {item.act} 幕 · {item.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <article className="kids-record-prompt">
          <div className="kids-record-prompt-head">
            <span>
              第 {scene.act} 幕 / {story.title}
            </span>
            {existing ? <span>已有录音，可重录</span> : null}
          </div>
          <p>{scene.textYue}</p>
          <details>
            <summary>看普通话</summary>
            <p>{scene.textZh}</p>
          </details>
        </article>

        <div className={`kids-recorder ${isRecording ? "is-recording" : ""}`}>
          <div className="kids-recorder-top">
            <div>
              <p className="kids-recorder-label">
                {status === "requesting" && "正在请求麦克风…"}
                {status === "recording" && "正在录音"}
                {status === "processing" && "正在生成…"}
                {status === "ready" && "录好了，听一遍"}
                {status === "idle" && "准备好就开始"}
                {status === "error" && "录音遇到问题"}
                {status === "unsupported" && "浏览器不支持录音"}
              </p>
              <p className="kids-recorder-time">{formatDuration(elapsed)}</p>
              <p className="kids-recorder-limit">最长 {formatDuration(MAX_RECORD_MS / 1000)}</p>
            </div>
            <div className="kids-recorder-actions">
              {isRecording ? (
                <button type="button" className="btn btn-primary" onClick={stop}>
                  停止
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleStart}
                  disabled={status === "requesting" || status === "processing"}
                >
                  {clip ? "重录" : "开始录音"}
                </button>
              )}
              {clip ? (
                <button type="button" className="btn btn-ghost" onClick={reset}>
                  清空
                </button>
              ) : null}
            </div>
          </div>
          {clip ? (
            <div className="kids-recorder-preview">
              <audio controls src={clip.url} preload="metadata" />
              <span>{formatDuration(clip.duration)}</span>
            </div>
          ) : null}
          {error ? (
            <p className="kids-recorder-error">
              {error}
              <button type="button" onClick={() => setError("")}>
                知道了
              </button>
            </p>
          ) : null}
        </div>

        <label className="kids-asr">
          <input
            type="checkbox"
            checked={autoTranscribe}
            onChange={(event) => {
              setAutoTranscribe(event.target.checked);
              if (!event.target.checked) speech.stop();
            }}
          />
          <span>录音时自动转写（浏览器语音服务）</span>
        </label>
        {autoTranscribe ? (
          <p className={`kids-asr-status ${speech.error ? "is-error" : ""}`}>
            {!speech.supported
              ? "当前浏览器不支持自动转写，可以请家长手动输入。"
              : speech.error
                ? speech.error
                : speech.listening
                  ? "正在自动转写…"
                  : "录完会自动填字，不准可以改。"}
          </p>
        ) : null}

        <label className="kids-record-field">
          <span>转写文字（可以改）</span>
          <textarea
            rows={4}
            value={transcript}
            placeholder="自动转写会出现在这里，也可以手动输入"
            onChange={(event) => {
              setManualEdit(true);
              setTranscript(event.target.value);
            }}
          />
        </label>

        <div className="kids-record-bottom">
          <label className="kids-record-field kids-record-speaker">
            <span>谁在读（选填）</span>
            <input
              value={speaker}
              maxLength={20}
              placeholder="例如：阿珍、公公"
              onChange={(event) => setSpeaker(event.target.value)}
            />
          </label>
          <label className="kids-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>同意把录音保存在本机，不上传。</span>
          </label>
        </div>

        <div className="kids-record-submit">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!clip || !consent || saving}
          >
            {saving ? "保存中…" : existing ? "覆盖保存" : "保存录音"}
          </button>
          <Link className="btn btn-ghost" href={`/kids/${story.slug}`}>
            回故事
          </Link>
        </div>
        {saveError ? <p className="kids-record-error">{saveError}</p> : null}
        {message ? (
          <p className="kids-record-success">
            {message}{" "}
            <Link href={`/kids/${story.slug}`}>去听我家的版本 →</Link>
          </p>
        ) : null}
      </div>

      <p className="kids-note">
        自动转写由浏览器语音服务完成，音频可能发送给浏览器厂商；可以在上面关掉。
        声迹服务器不接收录音。
      </p>
    </main>
  );
}

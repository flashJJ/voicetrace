"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { kidStories } from "../../../lib/kids";
import { localizeStory } from "../../../lib/i18n-content";
import { useLocale } from "../../../components/LocaleProvider";
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

const COPY = {
  zh: {
    eyebrow: "儿童模式 · 录音",
    title: "录一段我家的粤语。",
    lede: "大人可以陪着一起读。读错没关系，重录整段就好。录音只保存在这台设备。",
    storyLabel: "故事",
    sceneLabel: "片段",
    storyOption: (title, ageBand) => `${title} · ${ageBand} 岁`,
    sceneOption: (act, title) => `第 ${act} 幕 · ${title}`,
    sceneHeading: (act, title) => `第 ${act} 幕 / ${title}`,
    existing: "已有录音，可重录",
    showMandarin: "看普通话",
    status: {
      requesting: "正在请求麦克风…",
      recording: "正在录音",
      processing: "正在生成…",
      ready: "录好了，听一遍",
      idle: "准备好就开始",
      error: "录音遇到问题",
      unsupported: "浏览器不支持录音",
    },
    limit: (duration) => `最长 ${duration}`,
    stop: "停止",
    restart: "重录",
    start: "开始录音",
    clear: "清空",
    dismiss: "知道了",
    autoAsr: "录音时自动转写（浏览器语音服务）",
    asrUnsupported: "当前浏览器不支持自动转写，可以请家长手动输入。",
    asrListening: "正在自动转写…",
    asrIdle: "录完会自动填字，不准可以改。",
    transcriptLabel: "转写文字（可以改）",
    transcriptPlaceholder: "自动转写会出现在这里，也可以手动输入",
    speakerLabel: "谁在读（选填）",
    speakerPlaceholder: "例如：阿珍、公公",
    consent: "同意把录音保存在本机，不上传。",
    consentMissing: "请先勾选「同意保存在本机」。",
    saveFailed: "保存失败，请重试。",
    saved: "录好了，已经存在这台设备。可以回故事里听我家的版本。",
    saving: "保存中…",
    overwrite: "覆盖保存",
    save: "保存录音",
    backToStory: "回故事",
    goListen: "去听我家的版本 →",
    note: "自动转写由浏览器语音服务完成，音频可能发送给浏览器厂商；可以在上面关掉。声迹服务器不接收录音。",
  },
  en: {
    eyebrow: "KIDS MODE · RECORDING",
    title: "Record a bit of Cantonese for your family.",
    lede: "A grown-up can read along. Mistakes are fine — just record the whole scene again. Recordings stay on this device.",
    storyLabel: "Story",
    sceneLabel: "Scene",
    storyOption: (title, ageBand) => `${title} · Ages ${ageBand}`,
    sceneOption: (act, title) => `Act ${act} · ${title}`,
    sceneHeading: (act, title) => `Act ${act} / ${title}`,
    existing: "Recording saved — you can record again",
    showMandarin: "Show Mandarin text",
    status: {
      requesting: "Requesting microphone…",
      recording: "Recording",
      processing: "Creating…",
      ready: "Done — give it a listen",
      idle: "Ready when you are",
      error: "Recording problem",
      unsupported: "Recording is not supported in this browser",
    },
    limit: (duration) => `Up to ${duration}`,
    stop: "Stop",
    restart: "Record again",
    start: "Start recording",
    clear: "Clear",
    dismiss: "Got it",
    autoAsr: "Transcribe while recording (browser speech service)",
    asrUnsupported: "This browser can't transcribe automatically. A grown-up can type it in.",
    asrListening: "Transcribing as you record…",
    asrIdle: "The text fills in after you record. Grown-ups can fix it.",
    transcriptLabel: "Transcript (editable)",
    transcriptPlaceholder: "The automatic transcript appears here. You can also type it in.",
    speakerLabel: "Who's reading (optional)",
    speakerPlaceholder: "e.g. Ah Zhen, Grandpa",
    consent: "I agree to save the recording on this device. Nothing is uploaded.",
    consentMissing: "Please tick “agree to save on this device” first.",
    saveFailed: "Saving failed. Please try again.",
    saved: "Saved on this device. Head back to the story to hear your family's version.",
    saving: "Saving…",
    overwrite: "Replace saved recording",
    save: "Save recording",
    backToStory: "Back to story",
    goListen: "Hear your family's version →",
    note: "Auto-transcription uses the browser's speech service, so audio may be sent to the browser vendor; you can turn it off above. VoiceTrace servers never receive recordings.",
  },
};

export default function KidRecordPage() {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
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
  const storyView = useMemo(
    () => localizeStory(story, locale, localize),
    [story, locale, localize]
  );
  const storyOptions = useMemo(
    () =>
      pool.map((item) => {
        const view = localizeStory(item, locale, localize);
        return { slug: item.slug, title: view.title, ageBand: item.ageBand };
      }),
    [locale, localize]
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
      setSaveError(c.consentMissing);
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
      setMessage(c.saved);
    } catch (saveFailure) {
      setSaveError(saveFailure.message || c.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const isRecording = status === "recording";

  return (
    <main className="container kids-page kids-record-page">
      <section className="kids-hero">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1>{c.title}</h1>
        <p>{c.lede}</p>
      </section>

      <div className="kids-record-card">
        <div className="kids-record-selects">
          <label>
            <span>{c.storyLabel}</span>
            <select value={story.slug} onChange={handleStoryChange}>
              {storyOptions.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {localize(c.storyOption(item.title, item.ageBand))}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{c.sceneLabel}</span>
            <select value={scene.id} onChange={(event) => setSceneId(event.target.value)}>
              {story.scenes.map((item) => (
                <option key={item.id} value={item.id}>
                  {localize(c.sceneOption(item.act, item.title))}
                </option>
              ))}
            </select>
          </label>
        </div>

        <article className="kids-record-prompt">
          <div className="kids-record-prompt-head">
            <span>{localize(c.sceneHeading(scene.act, storyView.title))}</span>
            {existing ? <span>{c.existing}</span> : null}
          </div>
          <p>{scene.textYue}</p>
          <details>
            <summary>{c.showMandarin}</summary>
            <p>{scene.textZh}</p>
          </details>
        </article>

        <div className={`kids-recorder ${isRecording ? "is-recording" : ""}`}>
          <div className="kids-recorder-top">
            <div>
              <p className="kids-recorder-label">{c.status[status]}</p>
              <p className="kids-recorder-time">{formatDuration(elapsed)}</p>
              <p className="kids-recorder-limit">
                {localize(c.limit(formatDuration(MAX_RECORD_MS / 1000)))}
              </p>
            </div>
            <div className="kids-recorder-actions">
              {isRecording ? (
                <button type="button" className="btn btn-primary" onClick={stop}>
                  {c.stop}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleStart}
                  disabled={status === "requesting" || status === "processing"}
                >
                  {clip ? c.restart : c.start}
                </button>
              )}
              {clip ? (
                <button type="button" className="btn btn-ghost" onClick={reset}>
                  {c.clear}
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
                {c.dismiss}
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
          <span>{c.autoAsr}</span>
        </label>
        {autoTranscribe ? (
          <p className={`kids-asr-status ${speech.error ? "is-error" : ""}`}>
            {!speech.supported
              ? c.asrUnsupported
              : speech.error
                ? speech.error
                : speech.listening
                  ? c.asrListening
                  : c.asrIdle}
          </p>
        ) : null}

        <label className="kids-record-field">
          <span>{c.transcriptLabel}</span>
          <textarea
            rows={4}
            value={transcript}
            placeholder={c.transcriptPlaceholder}
            onChange={(event) => {
              setManualEdit(true);
              setTranscript(event.target.value);
            }}
          />
        </label>

        <div className="kids-record-bottom">
          <label className="kids-record-field kids-record-speaker">
            <span>{c.speakerLabel}</span>
            <input
              value={speaker}
              maxLength={20}
              placeholder={c.speakerPlaceholder}
              onChange={(event) => setSpeaker(event.target.value)}
            />
          </label>
          <label className="kids-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>{c.consent}</span>
          </label>
        </div>

        <div className="kids-record-submit">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!clip || !consent || saving}
          >
            {saving ? c.saving : existing ? c.overwrite : c.save}
          </button>
          <Link className="btn btn-ghost" href={`/kids/${story.slug}`}>
            {c.backToStory}
          </Link>
        </div>
        {saveError ? <p className="kids-record-error">{saveError}</p> : null}
        {message ? (
          <p className="kids-record-success">
            {message}{" "}
            <Link href={`/kids/${story.slug}`}>{c.goListen}</Link>
          </p>
        ) : null}
      </div>

      <p className="kids-note">{c.note}</p>
    </main>
  );
}

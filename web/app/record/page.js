"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { stories } from "../../lib/stories";
import { localizeStory } from "../../lib/i18n-content";
import { useLocale } from "../../components/LocaleProvider";
import {
  formatBytes,
  formatDuration,
  getRecording,
  recordingId,
  saveRecording,
  getStorageInfo,
} from "../../lib/recordings";
import { MAX_RECORD_MS } from "../../lib/recorder";
import { useRecorder } from "../../hooks/useRecorder";
import { useSpeechRecognition } from "../../hooks/useSpeech";

const relations = ["本人", "阿爷", "阿婆", "爸爸", "妈妈", "外公", "外婆", "其他"];

const COPY = {
  zh: {
    eyebrow: "声音档案 · 录音棚",
    title: "录下我家的版本",
    lede: "挑一个故事片段，用你家的粤语读一遍。录音只存在这台设备，不会上传。",
    storyLabel: "故事",
    sceneLabel: "片段",
    storyOption: (title, modeLabel) => `${title} · ${modeLabel}`,
    sceneOption: (act, title) => `第 ${act} 幕 · ${title}`,
    sceneHeading: (act, title) => `第 ${act} 幕 / ${title}`,
    existing: "已有录音，可重录覆盖",
    showMandarin: "看普通话对照",
    status: {
      requesting: "正在请求麦克风…",
      recording: "正在录音",
      processing: "正在生成录音…",
      ready: "录好了，先听一遍",
      idle: "准备好就开始",
      error: "录音遇到问题",
      unsupported: "浏览器不支持录音",
    },
    limit: (duration) => `单段最长 ${duration}`,
    stop: "停止录音",
    restart: "重新录音",
    start: "开始录音",
    clear: "清空",
    clipMeta: (duration, size, format) => `时长 ${duration} · ${size} · ${format}`,
    dismiss: "知道了",
    speakerLabel: "朗读者称呼（选填）",
    speakerPlaceholder: "例如：阿珍、陈伯",
    relationLabel: "和故事的关系",
    relationOptions: ["本人", "阿爷", "阿婆", "爸爸", "妈妈", "外公", "外婆", "其他"],
    autoAsr: "录音时自动转写（由浏览器语音服务处理）",
    asrUnsupported: "当前浏览器不支持自动转写，可以手动输入。",
    asrListening: "正在自动转写，边录边出字…",
    asrPreparing: "正在准备识别…",
    asrIdle: "录完后自动填入，识别不准可以直接改。",
    asrOff: "自动转写已关闭。若在意隐私，保持关闭，录完手动输入即可。",
    transcriptLabel: "转写文字（可修改，方便长辈校对）",
    transcriptPlaceholder: "自动转写会出现在这里，也可以手动输入",
    consent:
      "同意把这段录音保存在本机浏览器；声迹不会上传录音。自动转写若开启，由浏览器语音服务处理。",
    consentMissing: "请先勾选「同意保存在本机」。",
    saveFailed: "保存失败，请重试。",
    saved: "已保存在这台设备。可以继续录下一段，或去声音档案看看。",
    saving: "保存中…",
    overwrite: "覆盖保存",
    save: "保存这段录音",
    archive: "我的声音档案",
    tipsTitle: "录音小提示",
    tips: [
      "找安静的房间，手机离嘴一尺左右。",
      "先按普通话对照读一遍，再用粤语自然地读。",
      "读错不要紧，停下来重录整段即可。",
      "每段控制在 90 秒内，档案会更轻。",
    ],
    privacyTitle: "只存在这台设备",
    privacy:
      "录音保存在浏览器本地数据库，刷新和关掉页面都还在。清理浏览器数据会一并删除。自动转写由浏览器语音服务完成，音频可能发送给浏览器厂商；在意的话可以在右侧关掉。",
    storage: (count, bytes, quota) =>
      quota
        ? `已录 ${count} 段 · ${bytes} / 可用约 ${quota}`
        : `已录 ${count} 段 · ${bytes}`,
  },
  en: {
    eyebrow: "Voice archive · Studio",
    title: "Record your family's version",
    lede: "Pick a story scene and read it in your family's Cantonese. Recordings stay on this device and are never uploaded.",
    storyLabel: "Story",
    sceneLabel: "Scene",
    storyOption: (title, modeLabel) => `${title} · ${modeLabel}`,
    sceneOption: (act, title) => `Act ${act} · ${title}`,
    sceneHeading: (act, title) => `Act ${act} / ${title}`,
    existing: "Recording saved — record again to replace it",
    showMandarin: "Show Mandarin text",
    status: {
      requesting: "Requesting microphone…",
      recording: "Recording",
      processing: "Creating recording…",
      ready: "Done — take a listen",
      idle: "Ready when you are",
      error: "Recording problem",
      unsupported: "Recording is not supported in this browser",
    },
    limit: (duration) => `Up to ${duration} per take`,
    stop: "Stop recording",
    restart: "Record again",
    start: "Start recording",
    clear: "Clear",
    clipMeta: (duration, size, format) => `Length ${duration} · ${size} · ${format}`,
    dismiss: "Got it",
    speakerLabel: "Reader's name (optional)",
    speakerPlaceholder: "e.g. Ah Zhen, Uncle Chan",
    relationLabel: "Relation to the story",
    relationOptions: [
      "Self",
      "Grandpa (dad's side)",
      "Grandma (dad's side)",
      "Dad",
      "Mom",
      "Grandpa (mom's side)",
      "Grandma (mom's side)",
      "Other",
    ],
    autoAsr: "Transcribe while recording (handled by the browser's speech service)",
    asrUnsupported: "This browser can't transcribe automatically. You can type it in.",
    asrListening: "Transcribing as you record…",
    asrPreparing: "Getting speech recognition ready…",
    asrIdle: "The transcript fills in after you record. Fix anything that looks wrong.",
    asrOff: "Auto-transcription is off. Keep it off if privacy matters — just type the transcript after recording.",
    transcriptLabel: "Transcript (editable, so family can check it)",
    transcriptPlaceholder: "The automatic transcript appears here. You can also type it yourself.",
    consent:
      "I agree to save this recording in this browser. VoiceTrace never uploads recordings. If auto-transcription is on, the browser's speech service handles it.",
    consentMissing: "Please tick “agree to save on this device” first.",
    saveFailed: "Saving failed. Please try again.",
    saved: "Saved on this device. Record the next take, or browse the voice archive.",
    saving: "Saving…",
    overwrite: "Replace saved recording",
    save: "Save this recording",
    archive: "My voice archive",
    tipsTitle: "Recording tips",
    tips: [
      "Find a quiet room and hold the phone about a foot from your mouth.",
      "Read the Mandarin text once first, then read naturally in Cantonese.",
      "Mistakes are fine — just stop and record the whole scene again.",
      "Keep each take under 90 seconds to keep the archive light.",
    ],
    privacyTitle: "Stored only on this device",
    privacy:
      "Recordings live in this browser's local database and survive refreshes and page closes. Clearing browser data deletes them too. Auto-transcription uses the browser's speech service, so audio may be sent to the browser vendor; turn it off on the right if that concerns you.",
    storage: (count, bytes, quota) =>
      quota
        ? `${count} takes recorded · ${bytes} / about ${quota} available`
        : `${count} takes recorded · ${bytes}`,
  },
};

export default function RecordPage() {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const [storySlug, setStorySlug] = useState(stories[0].slug);
  const [sceneId, setSceneId] = useState(stories[0].scenes[0].id);
  const [speaker, setSpeaker] = useState("");
  const [relation, setRelation] = useState("本人");
  const [consent, setConsent] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [manualEdit, setManualEdit] = useState(false);
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  const [existing, setExisting] = useState(null);
  const [storage, setStorage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const { status, error, elapsed, clip, start, stop, reset, setError } = useRecorder();
  const speech = useSpeechRecognition();
  const initializedRef = useRef(false);

  const story = useMemo(
    () => stories.find((item) => item.slug === storySlug) || stories[0],
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
      stories.map((item) => {
        const view = localizeStory(item, locale, localize);
        return { slug: item.slug, title: view.title, modeLabel: view.modeLabel };
      }),
    [locale, localize]
  );

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const wantedStory = params.get("story");
    const wantedScene = params.get("scene");
    const matched = stories.find((item) => item.slug === wantedStory);
    if (matched) {
      setStorySlug(matched.slug);
      const sceneMatched = matched.scenes.find((item) => item.id === wantedScene);
      setSceneId(sceneMatched?.id || matched.scenes[0].id);
    }
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
        setManualEdit(false);
        if (record?.speaker) setSpeaker(record.speaker);
        if (record?.relation) setRelation(record.relation);
      })
      .catch(() => {
        if (alive) setTranscript("");
      });
    getStorageInfo()
      .then((info) => {
        if (alive) setStorage(info);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [reset, story.slug, scene.id, scene.textYue]);

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

  const handleStart = () => {
    setManualEdit(false);
    setSaveError("");
    setMessage("");
    if (autoTranscribe) setTranscript("");
    start();
  };

  const handleStoryChange = (event) => {
    const next = stories.find((item) => item.slug === event.target.value);
    if (!next) return;
    setStorySlug(next.slug);
    setSceneId(next.scenes[0].id);
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
        relation,
        consent: true,
      });
      const record = await getRecording(recordingId(story.slug, scene.id));
      setExisting(record);
      const info = await getStorageInfo();
      setStorage(info);
      setMessage(c.saved);
    } catch (saveFailure) {
      setSaveError(saveFailure.message || c.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const isRecording = status === "recording";
  const canSave = Boolean(clip) && consent && !saving;

  return (
    <main className="container record-page">
      <section className="page-hero record-hero">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1 className="page-title">{c.title}</h1>
        <p className="page-lede">{c.lede}</p>
      </section>

      <div className="record-layout">
        <section className="record-main">
          <div className="record-selectors">
            <label>
              <span>{c.storyLabel}</span>
              <select value={story.slug} onChange={handleStoryChange}>
                {storyOptions.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {c.storyOption(item.title, item.modeLabel)}
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

          <article className="record-prompt">
            <div className="record-prompt-head">
              <span>{localize(c.sceneHeading(scene.act, storyView.title))}</span>
              {existing ? <span className="record-existing">{c.existing}</span> : null}
            </div>
            <p className="record-prompt-text">{scene.textYue}</p>
            <details className="record-prompt-zh">
              <summary>{c.showMandarin}</summary>
              <p>{scene.textZh}</p>
            </details>
            {scene.glossary?.length ? (
              <ul className="record-glossary">
                {scene.glossary.map((item) => (
                  <li key={item.term}>
                    <strong>{item.term}</strong>
                    <span>{item.meaning}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>

          <section className={`recorder ${isRecording ? "is-recording" : ""}`}>
            <div className="recorder-head">
              <div>
                <p className="recorder-label">{c.status[status]}</p>
                <p className="recorder-time">{formatDuration(elapsed)}</p>
                <p className="recorder-limit">
                  {localize(c.limit(formatDuration(MAX_RECORD_MS / 1000)))}
                </p>
              </div>
              <div className="recorder-actions">
                {isRecording ? (
                  <button type="button" className="btn btn-primary record-stop" onClick={stop}>
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
              <div className="recorder-preview">
                <audio controls src={clip.url} preload="metadata" />
                <span>
                  {localize(
                    c.clipMeta(
                      formatDuration(clip.duration),
                      formatBytes(clip.blob.size),
                      clip.mime.includes("mp4") ? "M4A" : "WebM"
                    )
                  )}
                </span>
              </div>
            ) : null}

            {error ? (
              <p className="recorder-error">
                {error}
                <button type="button" className="recorder-retry" onClick={() => setError("")}>
                  {c.dismiss}
                </button>
              </p>
            ) : null}
          </section>

          <section className="record-save">
            <div className="record-fields">
              <label>
                <span>{c.speakerLabel}</span>
                <input
                  value={speaker}
                  maxLength={20}
                  placeholder={c.speakerPlaceholder}
                  onChange={(event) => setSpeaker(event.target.value)}
                />
              </label>
              <label>
                <span>{c.relationLabel}</span>
                <select value={relation} onChange={(event) => setRelation(event.target.value)}>
                  {relations.map((item, index) => (
                    <option key={item} value={item}>
                      {c.relationOptions[index]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="record-asr">
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
              <p className={`record-asr-status ${speech.error ? "is-error" : ""}`}>
                {!speech.supported
                  ? c.asrUnsupported
                  : speech.error
                    ? speech.error
                    : speech.listening
                      ? c.asrListening
                      : status === "recording"
                        ? c.asrPreparing
                        : c.asrIdle}
              </p>
            ) : (
              <p className="record-asr-status is-off">{c.asrOff}</p>
            )}
            <label className="record-transcript">
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
            <label className="record-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>{c.consent}</span>
            </label>
            <div className="record-submit">
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={!canSave}>
                {saving ? c.saving : existing ? c.overwrite : c.save}
              </button>
              <Link href="/archive" className="btn btn-ghost">
                {c.archive}
              </Link>
            </div>
            {saveError ? <p className="record-error">{saveError}</p> : null}
            {message ? <p className="record-success">{message}</p> : null}
          </section>
        </section>

        <aside className="record-aside">
          <div className="record-card">
            <h2>{c.tipsTitle}</h2>
            <ol>
              {c.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ol>
          </div>
          <div className="record-card">
            <h2>{c.privacyTitle}</h2>
            <p>{c.privacy}</p>
            {storage ? (
              <p className="record-storage">
                {localize(
                  c.storage(
                    storage.count,
                    formatBytes(storage.bytes),
                    storage.quota ? formatBytes(storage.quota) : ""
                  )
                )}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { stories } from "../../lib/stories";
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

const relations = ["本人", "阿爷", "阿婆", "爸爸", "妈妈", "外公", "外婆", "其他"];

export default function RecordPage() {
  const [storySlug, setStorySlug] = useState(stories[0].slug);
  const [sceneId, setSceneId] = useState(stories[0].scenes[0].id);
  const [speaker, setSpeaker] = useState("");
  const [relation, setRelation] = useState("本人");
  const [consent, setConsent] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [existing, setExisting] = useState(null);
  const [storage, setStorage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const { status, error, elapsed, clip, start, stop, reset, setError } = useRecorder();
  const initializedRef = useRef(false);

  const story = useMemo(
    () => stories.find((item) => item.slug === storySlug) || stories[0],
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
        setTranscript(record?.transcript || scene.textYue);
        if (record?.speaker) setSpeaker(record.speaker);
        if (record?.relation) setRelation(record.relation);
      })
      .catch(() => {
        if (alive) setTranscript(scene.textYue);
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

  const handleStoryChange = (event) => {
    const next = stories.find((item) => item.slug === event.target.value);
    if (!next) return;
    setStorySlug(next.slug);
    setSceneId(next.scenes[0].id);
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
        relation,
        consent: true,
      });
      const record = await getRecording(recordingId(story.slug, scene.id));
      setExisting(record);
      const info = await getStorageInfo();
      setStorage(info);
      setMessage("已保存在这台设备。可以继续录下一段，或去声音档案看看。");
    } catch (saveFailure) {
      setSaveError(saveFailure.message || "保存失败，请重试。");
    } finally {
      setSaving(false);
    }
  };

  const isRecording = status === "recording";
  const canSave = Boolean(clip) && consent && !saving;

  return (
    <main className="container record-page">
      <section className="page-hero record-hero">
        <span className="eyebrow">声音档案 · 录音棚</span>
        <h1 className="page-title">录下我家的版本</h1>
        <p className="page-lede">
          挑一个故事片段，用你家的粤语读一遍。录音只存在这台设备，不会上传。
        </p>
      </section>

      <div className="record-layout">
        <section className="record-main">
          <div className="record-selectors">
            <label>
              <span>故事</span>
              <select value={story.slug} onChange={handleStoryChange}>
                {stories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.title} · {item.modeLabel}
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

          <article className="record-prompt">
            <div className="record-prompt-head">
              <span>
                第 {scene.act} 幕 / {story.title}
              </span>
              {existing ? <span className="record-existing">已有录音，可重录覆盖</span> : null}
            </div>
            <p className="record-prompt-text">{scene.textYue}</p>
            <details className="record-prompt-zh">
              <summary>看普通话对照</summary>
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
                <p className="recorder-label">
                  {status === "requesting" && "正在请求麦克风…"}
                  {status === "recording" && "正在录音"}
                  {status === "processing" && "正在生成录音…"}
                  {status === "ready" && "录好了，先听一遍"}
                  {status === "idle" && "准备好就开始"}
                  {status === "error" && "录音遇到问题"}
                  {status === "unsupported" && "浏览器不支持录音"}
                </p>
                <p className="recorder-time">{formatDuration(elapsed)}</p>
                <p className="recorder-limit">单段最长 {formatDuration(MAX_RECORD_MS / 1000)}</p>
              </div>
              <div className="recorder-actions">
                {isRecording ? (
                  <button type="button" className="btn btn-primary record-stop" onClick={stop}>
                    停止录音
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={start}
                    disabled={status === "requesting" || status === "processing"}
                  >
                    {clip ? "重新录音" : "开始录音"}
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
              <div className="recorder-preview">
                <audio controls src={clip.url} preload="metadata" />
                <span>
                  时长 {formatDuration(clip.duration)} · {formatBytes(clip.blob.size)} ·{" "}
                  {clip.mime.includes("mp4") ? "M4A" : "WebM"}
                </span>
              </div>
            ) : null}

            {error ? (
              <p className="recorder-error">
                {error}
                <button type="button" className="recorder-retry" onClick={() => setError("")}>
                  知道了
                </button>
              </p>
            ) : null}
          </section>

          <section className="record-save">
            <div className="record-fields">
              <label>
                <span>朗读者称呼（选填）</span>
                <input
                  value={speaker}
                  maxLength={20}
                  placeholder="例如：阿珍、陈伯"
                  onChange={(event) => setSpeaker(event.target.value)}
                />
              </label>
              <label>
                <span>和故事的关系</span>
                <select value={relation} onChange={(event) => setRelation(event.target.value)}>
                  {relations.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="record-transcript">
              <span>转写文字（可修改，方便长辈校对）</span>
              <textarea
                rows={4}
                value={transcript}
                onChange={(event) => setTranscript(event.target.value)}
              />
            </label>
            <label className="record-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>同意把这段录音保存在本机浏览器，不上传服务器。</span>
            </label>
            <div className="record-submit">
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={!canSave}>
                {saving ? "保存中…" : existing ? "覆盖保存" : "保存这段录音"}
              </button>
              <Link href="/archive" className="btn btn-ghost">
                我的声音档案
              </Link>
            </div>
            {saveError ? <p className="record-error">{saveError}</p> : null}
            {message ? <p className="record-success">{message}</p> : null}
          </section>
        </section>

        <aside className="record-aside">
          <div className="record-card">
            <h2>录音小提示</h2>
            <ol>
              <li>找安静的房间，手机离嘴一尺左右。</li>
              <li>先按普通话对照读一遍，再用粤语自然地读。</li>
              <li>读错不要紧，停下来重录整段即可。</li>
              <li>每段控制在 90 秒内，档案会更轻。</li>
            </ol>
          </div>
          <div className="record-card">
            <h2>只存在这台设备</h2>
            <p>
              录音保存在浏览器本地数据库，刷新和关掉页面都还在。清理浏览器数据会一并删除。
            </p>
            {storage ? (
              <p className="record-storage">
                已录 {storage.count} 段 · {formatBytes(storage.bytes)}
                {storage.quota ? ` / 可用约 ${formatBytes(storage.quota)}` : ""}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}

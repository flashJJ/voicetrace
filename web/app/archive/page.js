"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { stories } from "../../lib/stories";
import {
  deleteRecording,
  downloadRecording,
  formatBytes,
  formatDuration,
  getStorageInfo,
  listRecordings,
  recordingId,
  updateTranscript,
} from "../../lib/recordings";
import {
  MAX_IMPORT_BYTES,
  archivePackFilename,
  buildArchivePack,
  buildTaskPack,
  clearTaskPack,
  downloadPack,
  importArchivePack,
  loadTaskPack,
  saveTaskPack,
  taskPackFilename,
  validatePack,
} from "../../lib/family-pack";

function storyTitle(slug) {
  return stories.find((item) => item.slug === slug)?.title || slug;
}

export default function ArchivePage() {
  const [items, setItems] = useState([]);
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState("");
  const [taskPack, setTaskPack] = useState(null);
  const [packStory, setPackStory] = useState(stories[0].slug);
  const [packBusy, setPackBusy] = useState("");
  const [packNotice, setPackNotice] = useState("");
  const [packError, setPackError] = useState("");
  const fileRef = useRef(null);
  const urlsRef = useRef([]);

  const releaseUrls = useCallback(() => {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current = [];
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    releaseUrls();
    try {
      const records = await listRecordings();
      const withUrls = records.map((record) => {
        const url = URL.createObjectURL(record.blob);
        urlsRef.current.push(url);
        return { ...record, url };
      });
      setItems(withUrls);
      const draftsNext = {};
      withUrls.forEach((record) => {
        draftsNext[record.id] = record.transcript || "";
      });
      setDrafts(draftsNext);
      setStorage(await getStorageInfo());
      setTaskPack(loadTaskPack());
    } catch (loadError) {
      setError(loadError.message || "读取本地档案失败。");
    } finally {
      setLoading(false);
    }
  }, [releaseUrls]);

  useEffect(() => {
    load();
    return () => releaseUrls();
  }, [load, releaseUrls]);

  const handleDelete = async (record) => {
    if (!window.confirm(`删除「${storyTitle(record.storySlug)} · ${record.sceneTitle}」这段录音？`)) {
      return;
    }
    try {
      await deleteRecording(record.id);
      setNotice("已删除这段录音。");
      await load();
    } catch (deleteError) {
      setError(deleteError.message || "删除失败。");
    }
  };

  const handleSaveTranscript = async (record) => {
    setSavingId(record.id);
    setNotice("");
    try {
      const next = await updateTranscript(record.id, drafts[record.id] || "");
      setItems((current) =>
        current.map((item) => (item.id === record.id ? { ...item, transcript: next.transcript } : item))
      );
      setNotice("转写已更新。");
    } catch (saveError) {
      setError(saveError.message || "保存转写失败。");
    } finally {
      setSavingId("");
    }
  };

  const handleExportTask = async () => {
    setPackBusy("task");
    setPackError("");
    setPackNotice("");
    try {
      const pack = await buildTaskPack(packStory);
      saveTaskPack(pack);
      setTaskPack(pack);
      downloadPack(pack, taskPackFilename(packStory));
      setPackNotice(`已导出《${pack.storyTitle}》任务包，含 ${pack.scenes.length} 个片段。`);
    } catch (taskError) {
      setPackError(taskError.message || "导出任务包失败。");
    } finally {
      setPackBusy("");
    }
  };

  const handleExportArchive = async () => {
    if (!items.length) {
      setPackError("还没有录音可以导出。");
      return;
    }
    if (storage?.bytes > 20 * 1024 * 1024) {
      const ok = window.confirm(
        `当前录音约 ${formatBytes(storage.bytes)}，导出的文件会更大，确定继续吗？`
      );
      if (!ok) return;
    }
    setPackBusy("archive");
    setPackError("");
    setPackNotice("");
    try {
      const pack = await buildArchivePack();
      downloadPack(pack, archivePackFilename());
      setPackNotice(`已导出完整档案，共 ${pack.entries.length} 段录音。`);
    } catch (archiveError) {
      setPackError(archiveError.message || "导出档案失败。");
    } finally {
      setPackBusy("");
    }
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) {
      setPackError("文件超过 60 MB，请先拆分再导入。");
      return;
    }
    setPackBusy("import");
    setPackError("");
    setPackNotice("");
    try {
      const raw = JSON.parse(await file.text());
      const pack = validatePack(raw);
      if (pack.kind === "task") {
        saveTaskPack(pack);
        setTaskPack(pack);
        setPackStory(pack.storySlug);
        setPackNotice(`已载入《${pack.storyTitle}》家庭任务，共 ${pack.scenes.length} 段。`);
        return;
      }
      const ok = window.confirm(
        `导入 ${pack.entries.length} 段录音？已存在的片段会跳过，不会覆盖。`
      );
      if (!ok) return;
      const result = await importArchivePack(pack);
      await load();
      setPackNotice(
        `导入 ${result.imported} 段，跳过 ${result.skipped} 段已有${
          result.failed ? `，${result.failed} 段失败` : ""
        }。`
      );
    } catch (importError) {
      setPackError(importError.message || "导入失败，请检查文件。");
    } finally {
      setPackBusy("");
    }
  };

  const taskDone = taskPack
    ? taskPack.scenes.filter((scene) =>
        items.some((record) => record.id === recordingId(taskPack.storySlug, scene.sceneId))
      ).length
    : 0;

  const groups = items.reduce((accumulator, record) => {
    const key = record.storySlug;
    if (!accumulator[key]) accumulator[key] = [];
    accumulator[key].push(record);
    return accumulator;
  }, {});

  return (
    <main className="container archive-page">
      <section className="page-hero archive-hero">
        <span className="eyebrow">声音档案 · 本机</span>
        <h1 className="page-title">我的声音档案</h1>
        <p className="page-lede">
          这里是你和家人录下的粤语片段。可以试听、改转写、导出或删除。
        </p>
        <div className="archive-actions">
          <Link href="/record" className="btn btn-primary">
            再录一段
          </Link>
          {storage ? (
            <span className="archive-storage">
              {storage.count} 段 · {formatBytes(storage.bytes)}
            </span>
          ) : null}
        </div>
      </section>

      <section className="archive-packs">
        <div className="archive-pack-head">
          <div>
            <span className="eyebrow">家庭协作</span>
            <h2>家庭任务包</h2>
            <p>
              把某个故事的待录清单发给家人，对方导入后按片段录，再导出带音频的档案包，
              由你导入合并。全程不经过服务器。
            </p>
          </div>
        </div>
        <div className="archive-pack-controls">
          <label>
            <span>任务包故事</span>
            <select value={packStory} onChange={(event) => setPackStory(event.target.value)}>
              {stories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn btn-soft btn-small"
            onClick={handleExportTask}
            disabled={Boolean(packBusy)}
          >
            {packBusy === "task" ? "导出中…" : "导出任务包"}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => fileRef.current?.click()}
            disabled={Boolean(packBusy)}
          >
            {packBusy === "import" ? "导入中…" : "导入任务包 / 档案"}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={handleExportArchive}
            disabled={Boolean(packBusy)}
          >
            {packBusy === "archive" ? "导出中…" : "导出完整档案"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={handleImportFile}
          />
        </div>
        {packNotice ? <p className="archive-notice">{packNotice}</p> : null}
        {packError ? <p className="archive-error">{packError}</p> : null}

        {taskPack ? (
          <div className="archive-task">
            <div className="archive-task-head">
              <div>
                <strong>{taskPack.storyTitle}</strong>
                <span>
                  已录 {taskDone} / {taskPack.scenes.length} 段
                </span>
              </div>
              <button
                type="button"
                className="archive-task-clear"
                onClick={() => {
                  clearTaskPack();
                  setTaskPack(null);
                  setPackNotice("已清除本机任务包。");
                }}
              >
                清除任务
              </button>
            </div>
            <ul className="archive-task-scenes">
              {taskPack.scenes.map((scene) => {
                const done = items.some(
                  (record) => record.id === recordingId(taskPack.storySlug, scene.sceneId)
                );
                return (
                  <li key={scene.sceneId} className={done ? "is-done" : ""}>
                    <span className="archive-task-act">第 {scene.act} 幕</span>
                    <span className="archive-task-title">{scene.sceneTitle}</span>
                    {done ? (
                      <span className="archive-task-status">已录</span>
                    ) : (
                      <Link
                        className="archive-task-link"
                        href={`/record?story=${taskPack.storySlug}&scene=${scene.sceneId}`}
                      >
                        去录
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </section>

      {notice ? <p className="archive-notice">{notice}</p> : null}
      {error ? <p className="archive-error">{error}</p> : null}

      {loading ? (
        <p className="archive-empty">正在读取本机档案…</p>
      ) : items.length === 0 ? (
        <div className="archive-empty">
          <h2>还没有录音</h2>
          <p>挑一个故事片段，录下你家的粤语版本。录音只会保存在这台设备。</p>
          <Link href="/record" className="btn btn-primary">
            去录音棚
          </Link>
        </div>
      ) : (
        <div className="archive-groups">
          {Object.entries(groups).map(([slug, records]) => (
            <section key={slug} className="archive-group">
              <div className="archive-group-head">
                <h2>{storyTitle(slug)}</h2>
                <span>{records.length} 段</span>
              </div>
              {records.map((record) => {
                const dirty = (drafts[record.id] || "") !== (record.transcript || "");
                return (
                  <article key={record.id} className="archive-item">
                    <div className="archive-item-head">
                      <div>
                        <h3>{record.sceneTitle}</h3>
                        <p className="archive-meta">
                          {record.speaker ? `${record.speaker} · ` : ""}
                          {record.relation || "本人"} · {formatDuration(record.duration)} ·{" "}
                          {formatBytes(record.blob.size)} ·{" "}
                          {new Date(record.updatedAt).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                      <div className="archive-item-actions">
                        <Link
                          className="btn btn-ghost btn-small"
                          href={`/record?story=${record.storySlug}&scene=${record.sceneId}`}
                        >
                          重录
                        </Link>
                        <button
                          type="button"
                          className="btn btn-ghost btn-small"
                          onClick={() => downloadRecording(record)}
                        >
                          导出
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-small archive-delete"
                          onClick={() => handleDelete(record)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                    <audio controls src={record.url} preload="metadata" className="archive-audio" />
                    <label className="archive-transcript">
                      <span>转写文字</span>
                      <textarea
                        rows={3}
                        value={drafts[record.id] ?? ""}
                        onChange={(event) =>
                          setDrafts((current) => ({ ...current, [record.id]: event.target.value }))
                        }
                      />
                    </label>
                    <div className="archive-save">
                      <button
                        type="button"
                        className="btn btn-soft btn-small"
                        disabled={!dirty || savingId === record.id}
                        onClick={() => handleSaveTranscript(record)}
                      >
                        {savingId === record.id ? "保存中…" : "保存转写"}
                      </button>
                      {dirty ? <span className="archive-dirty">有未保存的修改</span> : null}
                    </div>
                  </article>
                );
              })}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

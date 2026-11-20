"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { stories } from "../../lib/stories";
import { localizeStory } from "../../lib/i18n-content";
import { useLocale } from "../../components/LocaleProvider";
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

const COPY = {
  zh: {
    eyebrow: "声音档案 · 本机",
    title: "我的声音档案",
    lede: "这里是你和家人录下的粤语片段。可以试听、改转写、导出或删除。",
    recordAgain: "再录一段",
    storageMeta: (count, size) => `${count} 段 · ${size}`,
    familyEyebrow: "家庭协作",
    familyTitle: "家庭任务包",
    familyDesc:
      "把某个故事的待录清单发给家人，对方导入后按片段录，再导出带音频的档案包，由你导入合并。全程不经过服务器。",
    packStoryLabel: "任务包故事",
    exporting: "导出中…",
    exportTask: "导出任务包",
    importing: "导入中…",
    importPack: "导入任务包 / 档案",
    exportArchive: "导出完整档案",
    taskProgress: (done, total) => `已录 ${done} / ${total} 段`,
    clearTask: "清除任务",
    clearedTask: "已清除本机任务包。",
    act: (n) => `第 ${n} 幕`,
    recorded: "已录",
    goRecord: "去录",
    loading: "正在读取本机档案…",
    emptyTitle: "还没有录音",
    emptyText: "挑一个故事片段，录下你家的粤语版本。录音只会保存在这台设备。",
    goStudio: "去录音棚",
    groupCount: (n) => `${n} 段`,
    self: "本人",
    rerecord: "重录",
    exportClip: "导出",
    delete: "删除",
    transcript: "转写文字",
    saving: "保存中…",
    saveTranscript: "保存转写",
    dirty: "有未保存的修改",
    loadFailed: "读取本地档案失败。",
    confirmDelete: (title) => `删除「${title}」这段录音？`,
    deleted: "已删除这段录音。",
    deleteFailed: "删除失败。",
    transcriptUpdated: "转写已更新。",
    saveTranscriptFailed: "保存转写失败。",
    taskExported: (title, count) => `已导出《${title}》任务包，含 ${count} 个片段。`,
    taskExportFailed: "导出任务包失败。",
    noRecordingsExport: "还没有录音可以导出。",
    confirmLarge: (size) => `当前录音约 ${size}，导出的文件会更大，确定继续吗？`,
    archiveExported: (count) => `已导出完整档案，共 ${count} 段录音。`,
    archiveExportFailed: "导出档案失败。",
    fileTooLarge: "文件超过 60 MB，请先拆分再导入。",
    taskImported: (title, count) => `已载入《${title}》家庭任务，共 ${count} 段。`,
    confirmImport: (count) => `导入 ${count} 段录音？已存在的片段会跳过，不会覆盖。`,
    importResult: (imported, skipped, failed) =>
      `导入 ${imported} 段，跳过 ${skipped} 段已有${failed ? `，${failed} 段失败` : ""}。`,
    importFailed: "导入失败，请检查文件。",
    dateLocale: "zh-CN",
  },
  en: {
    eyebrow: "VOICE ARCHIVE · THIS DEVICE",
    title: "My voice archive",
    lede: "Cantonese clips recorded by you and your family. Play them back, edit transcripts, export, or delete them.",
    recordAgain: "Record another",
    storageMeta: (count, size) => `${count} clips · ${size}`,
    familyEyebrow: "FAMILY COLLABORATION",
    familyTitle: "Family task pack",
    familyDesc:
      "Send a story's to-record list to family. They import it, record scene by scene, export a pack with audio, and you import it to merge. Nothing goes through a server.",
    packStoryLabel: "Task pack story",
    exporting: "Exporting…",
    exportTask: "Export task pack",
    importing: "Importing…",
    importPack: "Import task pack / archive",
    exportArchive: "Export full archive",
    taskProgress: (done, total) => `${done} / ${total} clips recorded`,
    clearTask: "Clear task",
    clearedTask: "Task pack cleared from this device.",
    act: (n) => `Act ${n}`,
    recorded: "Recorded",
    goRecord: "Record",
    loading: "Loading this device's archive…",
    emptyTitle: "No recordings yet",
    emptyText: "Pick a story scene and record your family's Cantonese version. Recordings stay on this device only.",
    goStudio: "Open the recorder",
    groupCount: (n) => `${n} clips`,
    self: "Me",
    rerecord: "Re-record",
    exportClip: "Export",
    delete: "Delete",
    transcript: "Transcript",
    saving: "Saving…",
    saveTranscript: "Save transcript",
    dirty: "Unsaved changes",
    loadFailed: "Could not read the local archive.",
    confirmDelete: (title) => `Delete this recording of “${title}”?`,
    deleted: "Recording deleted.",
    deleteFailed: "Delete failed.",
    transcriptUpdated: "Transcript updated.",
    saveTranscriptFailed: "Could not save the transcript.",
    taskExported: (title, count) => `Exported the task pack for “${title}” with ${count} scenes.`,
    taskExportFailed: "Could not export the task pack.",
    noRecordingsExport: "There are no recordings to export yet.",
    confirmLarge: (size) => `Current recordings are about ${size}; the export will be larger. Continue?`,
    archiveExported: (count) => `Exported the full archive with ${count} recordings.`,
    archiveExportFailed: "Could not export the archive.",
    fileTooLarge: "The file is over 60 MB. Split it before importing.",
    taskImported: (title, count) => `Loaded the family task for “${title}” with ${count} scenes.`,
    confirmImport: (count) => `Import ${count} recordings? Existing clips will be skipped, not overwritten.`,
    importResult: (imported, skipped, failed) =>
      `Imported ${imported}, skipped ${skipped} existing${failed ? `, ${failed} failed` : ""}.`,
    importFailed: "Import failed. Please check the file.",
    dateLocale: "en-US",
  },
};

export default function ArchivePage() {
  const { locale, localize, pick } = useLocale();
  const c = useMemo(() => pick(COPY), [pick]);
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

  const storyTitle = useCallback(
    (slug) => {
      const story = stories.find((item) => item.slug === slug);
      return story ? localizeStory(story, locale, localize).title : slug;
    },
    [locale, localize]
  );

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
      setError(loadError.message || c.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [releaseUrls, c.loadFailed]);

  useEffect(() => {
    load();
    return () => releaseUrls();
  }, [load, releaseUrls]);

  const handleDelete = async (record) => {
    if (!window.confirm(c.confirmDelete(`${storyTitle(record.storySlug)} · ${record.sceneTitle}`))) {
      return;
    }
    try {
      await deleteRecording(record.id);
      setNotice(c.deleted);
      await load();
    } catch (deleteError) {
      setError(deleteError.message || c.deleteFailed);
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
      setNotice(c.transcriptUpdated);
    } catch (saveError) {
      setError(saveError.message || c.saveTranscriptFailed);
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
      setPackNotice(c.taskExported(pack.storyTitle, pack.scenes.length));
    } catch (taskError) {
      setPackError(taskError.message || c.taskExportFailed);
    } finally {
      setPackBusy("");
    }
  };

  const handleExportArchive = async () => {
    if (!items.length) {
      setPackError(c.noRecordingsExport);
      return;
    }
    if (storage?.bytes > 20 * 1024 * 1024) {
      const ok = window.confirm(c.confirmLarge(formatBytes(storage.bytes)));
      if (!ok) return;
    }
    setPackBusy("archive");
    setPackError("");
    setPackNotice("");
    try {
      const pack = await buildArchivePack();
      downloadPack(pack, archivePackFilename());
      setPackNotice(c.archiveExported(pack.entries.length));
    } catch (archiveError) {
      setPackError(archiveError.message || c.archiveExportFailed);
    } finally {
      setPackBusy("");
    }
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) {
      setPackError(c.fileTooLarge);
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
        setPackNotice(c.taskImported(pack.storyTitle, pack.scenes.length));
        return;
      }
      const ok = window.confirm(c.confirmImport(pack.entries.length));
      if (!ok) return;
      const result = await importArchivePack(pack);
      await load();
      setPackNotice(c.importResult(result.imported, result.skipped, result.failed));
    } catch (importError) {
      setPackError(importError.message || c.importFailed);
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
        <span className="eyebrow">{c.eyebrow}</span>
        <h1 className="page-title">{c.title}</h1>
        <p className="page-lede">{c.lede}</p>
        <div className="archive-actions">
          <Link href="/record" className="btn btn-primary">
            {c.recordAgain}
          </Link>
          {storage ? (
            <span className="archive-storage">
              {c.storageMeta(storage.count, formatBytes(storage.bytes))}
            </span>
          ) : null}
        </div>
      </section>

      <section className="archive-packs">
        <div className="archive-pack-head">
          <div>
            <span className="eyebrow">{c.familyEyebrow}</span>
            <h2>{c.familyTitle}</h2>
            <p>{c.familyDesc}</p>
          </div>
        </div>
        <div className="archive-pack-controls">
          <label>
            <span>{c.packStoryLabel}</span>
            <select value={packStory} onChange={(event) => setPackStory(event.target.value)}>
              {stories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {localizeStory(item, locale, localize).title}
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
            {packBusy === "task" ? c.exporting : c.exportTask}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => fileRef.current?.click()}
            disabled={Boolean(packBusy)}
          >
            {packBusy === "import" ? c.importing : c.importPack}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={handleExportArchive}
            disabled={Boolean(packBusy)}
          >
            {packBusy === "archive" ? c.exporting : c.exportArchive}
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
                <span>{c.taskProgress(taskDone, taskPack.scenes.length)}</span>
              </div>
              <button
                type="button"
                className="archive-task-clear"
                onClick={() => {
                  clearTaskPack();
                  setTaskPack(null);
                  setPackNotice(c.clearedTask);
                }}
              >
                {c.clearTask}
              </button>
            </div>
            <ul className="archive-task-scenes">
              {taskPack.scenes.map((scene) => {
                const done = items.some(
                  (record) => record.id === recordingId(taskPack.storySlug, scene.sceneId)
                );
                return (
                  <li key={scene.sceneId} className={done ? "is-done" : ""}>
                    <span className="archive-task-act">{c.act(scene.act)}</span>
                    <span className="archive-task-title">{scene.sceneTitle}</span>
                    {done ? (
                      <span className="archive-task-status">{c.recorded}</span>
                    ) : (
                      <Link
                        className="archive-task-link"
                        href={`/record?story=${taskPack.storySlug}&scene=${scene.sceneId}`}
                      >
                        {c.goRecord}
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
        <p className="archive-empty">{c.loading}</p>
      ) : items.length === 0 ? (
        <div className="archive-empty">
          <h2>{c.emptyTitle}</h2>
          <p>{c.emptyText}</p>
          <Link href="/record" className="btn btn-primary">
            {c.goStudio}
          </Link>
        </div>
      ) : (
        <div className="archive-groups">
          {Object.entries(groups).map(([slug, records]) => (
            <section key={slug} className="archive-group">
              <div className="archive-group-head">
                <h2>{storyTitle(slug)}</h2>
                <span>{c.groupCount(records.length)}</span>
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
                          {record.relation || c.self} · {formatDuration(record.duration)} ·{" "}
                          {formatBytes(record.blob.size)} ·{" "}
                          {new Date(record.updatedAt).toLocaleDateString(c.dateLocale)}
                        </p>
                      </div>
                      <div className="archive-item-actions">
                        <Link
                          className="btn btn-ghost btn-small"
                          href={`/record?story=${record.storySlug}&scene=${record.sceneId}`}
                        >
                          {c.rerecord}
                        </Link>
                        <button
                          type="button"
                          className="btn btn-ghost btn-small"
                          onClick={() => downloadRecording(record)}
                        >
                          {c.exportClip}
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-small archive-delete"
                          onClick={() => handleDelete(record)}
                        >
                          {c.delete}
                        </button>
                      </div>
                    </div>
                    <audio controls src={record.url} preload="metadata" className="archive-audio" />
                    <label className="archive-transcript">
                      <span>{c.transcript}</span>
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
                        {savingId === record.id ? c.saving : c.saveTranscript}
                      </button>
                      {dirty ? <span className="archive-dirty">{c.dirty}</span> : null}
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

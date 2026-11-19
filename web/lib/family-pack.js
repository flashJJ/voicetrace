import { stories } from "./stories.js";
import { listRecordings, recordingId, saveRecording } from "./recordings.js";

export const PACK_VERSION = 1;
export const TASK_PACK_KEY = "voicetrace:task-pack";
export const MAX_IMPORT_BYTES = 60 * 1024 * 1024;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("读取录音数据失败。"));
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(base64, mime) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime || "audio/webm" });
}

export async function buildTaskPack(storySlug) {
  const story = stories.find((item) => item.slug === storySlug);
  if (!story) throw new Error("没有找到这个故事。");
  const records = await listRecordings();
  const recorded = new Set(records.map((item) => item.id));
  return {
    version: PACK_VERSION,
    kind: "task",
    createdAt: new Date().toISOString(),
    storySlug: story.slug,
    storyTitle: story.title,
    scenes: story.scenes.map((scene) => ({
      sceneId: scene.id,
      sceneTitle: scene.title,
      act: scene.act,
      textYue: scene.textYue,
      recorded: recorded.has(recordingId(story.slug, scene.id)),
    })),
  };
}

export async function buildArchivePack() {
  const records = await listRecordings();
  const entries = [];
  for (const record of records) {
    entries.push({
      id: record.id,
      storySlug: record.storySlug,
      sceneId: record.sceneId,
      storyTitle: record.storyTitle,
      sceneTitle: record.sceneTitle,
      mime: record.mime,
      duration: record.duration,
      transcript: record.transcript,
      speaker: record.speaker,
      relation: record.relation,
      consent: record.consent,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      audioBase64: await blobToBase64(record.blob),
    });
  }
  return {
    version: PACK_VERSION,
    kind: "archive",
    createdAt: new Date().toISOString(),
    entries,
  };
}

export function validatePack(raw) {
  if (!raw || raw.version !== PACK_VERSION) {
    throw new Error("这不是可识别的声迹文件，或版本不兼容。");
  }
  if (raw.kind === "task") {
    if (!raw.storySlug || !Array.isArray(raw.scenes)) {
      throw new Error("任务包内容不完整。");
    }
    return raw;
  }
  if (raw.kind === "archive") {
    if (!Array.isArray(raw.entries)) {
      throw new Error("档案包内容不完整。");
    }
    return raw;
  }
  throw new Error("无法识别这个文件是任务包还是档案包。");
}

export async function importArchivePack(pack) {
  const existing = await listRecordings();
  const existingIds = new Set(existing.map((item) => item.id));
  const knownStories = new Set(stories.map((item) => item.slug));
  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of pack.entries) {
    if (!entry?.id || !entry.audioBase64 || !knownStories.has(entry.storySlug)) {
      failed += 1;
      continue;
    }
    if (existingIds.has(entry.id)) {
      skipped += 1;
      continue;
    }
    try {
      const blob = base64ToBlob(entry.audioBase64, entry.mime);
      await saveRecording({
        id: entry.id,
        storySlug: entry.storySlug,
        sceneId: entry.sceneId,
        storyTitle: entry.storyTitle,
        sceneTitle: entry.sceneTitle,
        blob,
        mime: entry.mime,
        duration: entry.duration,
        transcript: entry.transcript,
        speaker: entry.speaker,
        relation: entry.relation,
        consent: Boolean(entry.consent),
        createdAt: entry.createdAt,
      });
      imported += 1;
    } catch (error) {
      failed += 1;
    }
  }

  return { imported, skipped, failed };
}

export function downloadPack(pack, filename) {
  const blob = new Blob([JSON.stringify(pack)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function taskPackFilename(storySlug) {
  return `voicetrace-task-${storySlug}-${today()}.json`;
}

export function archivePackFilename() {
  return `voicetrace-archive-${today()}.json`;
}

export function saveTaskPack(pack) {
  try {
    window.localStorage.setItem(TASK_PACK_KEY, JSON.stringify(pack));
  } catch (error) {
    // 隐私模式可能禁用 localStorage，任务包仍可下载使用。
  }
}

export function loadTaskPack() {
  try {
    const raw = window.localStorage.getItem(TASK_PACK_KEY);
    if (!raw) return null;
    return validatePack(JSON.parse(raw));
  } catch (error) {
    return null;
  }
}

export function clearTaskPack() {
  try {
    window.localStorage.removeItem(TASK_PACK_KEY);
  } catch (error) {
    // 忽略清理失败。
  }
}

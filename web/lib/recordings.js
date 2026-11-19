const DB_NAME = "voicetrace";
const DB_VERSION = 1;
const STORE = "recordings";
export const MAX_TOTAL_BYTES = 80 * 1024 * 1024;
export const MAX_CLIP_BYTES = 8 * 1024 * 1024;

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("当前环境不支持本地存储。"));
      return;
    }
    if (!window.indexedDB) {
      reject(new Error("当前浏览器不支持本地存储，换 Chrome 或 Edge 试试。"));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("storySlug", "storySlug");
        store.createIndex("updatedAt", "updatedAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("打开本地档案失败，可能是隐私模式限制。"));
  });
}

function run(mode, work) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        let value;
        try {
          value = work(store);
        } catch (error) {
          db.close();
          reject(error);
          return;
        }
        tx.oncomplete = () => {
          db.close();
          resolve(value);
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error || new Error("本地档案操作失败。"));
        };
      })
  );
}

export function recordingId(storySlug, sceneId) {
  return `${storySlug}::${sceneId}`;
}

function announceChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("voicetrace:recordings-changed"));
  }
}

export function listRecordings() {
  return run("readonly", (store) => {
    const request = store.getAll();
    request.onsuccess = () => {
      request.result.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    };
    return request;
  }).then((request) => request.result || []);
}

export function getRecording(id) {
  return run("readonly", (store) => store.get(id)).then((request) => request?.result || null);
}

export function saveRecording(record) {
  if (!record?.id) throw new Error("录音缺少位置信息。");
  if (!record.blob) throw new Error("录音内容为空。");
  if (record.blob.size > MAX_CLIP_BYTES) {
    throw new Error("这段录音超过 8 MB，请缩短后再保存。");
  }
  return listRecordings().then((all) => {
    const others = all.filter((item) => item.id !== record.id);
    const total = others.reduce((sum, item) => sum + (item.blob?.size || 0), 0);
    if (total + record.blob.size > MAX_TOTAL_BYTES) {
      throw new Error("本机录音总量已满 80 MB，请先删除或导出旧录音。");
    }
    const now = Date.now();
    const payload = {
      ...record,
      createdAt: record.createdAt || now,
      updatedAt: now,
    };
    return run("readwrite", (store) => store.put(payload)).then(() => {
      announceChange();
      return payload;
    });
  });
}

export function deleteRecording(id) {
  return run("readwrite", (store) => store.delete(id)).then(() => {
    announceChange();
  });
}

export function updateTranscript(id, transcript) {
  return getRecording(id).then((record) => {
    if (!record) throw new Error("没有找到这段录音。");
    return saveRecording({ ...record, transcript, updatedAt: Date.now() });
  });
}

export async function getStorageInfo() {
  const all = await listRecordings();
  const bytes = all.reduce((sum, item) => sum + (item.blob?.size || 0), 0);
  let quota = 0;
  let usage = 0;
  if (navigator.storage?.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      quota = estimate.quota || 0;
      usage = estimate.usage || 0;
    } catch (error) {
      // 配额信息拿不到时只用已录字节数。
    }
  }
  return { count: all.length, bytes, quota, usage };
}

export function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function formatDuration(seconds) {
  const total = Math.max(0, Math.round(seconds || 0));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function extensionFor(mime) {
  if ((mime || "").includes("mp4")) return "m4a";
  if ((mime || "").includes("ogg")) return "ogg";
  return "webm";
}

export function downloadRecording(record) {
  const url = URL.createObjectURL(record.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${record.storySlug}-${record.sceneId}.${extensionFor(record.mime)}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

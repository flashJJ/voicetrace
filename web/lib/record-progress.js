import { listRecordings } from "./recordings.js";

let cache = null;

export function clearRecordProgress() {
  cache = null;
}

export function loadRecordProgress() {
  if (!cache) {
    cache = listRecordings()
      .then((records) => {
        const map = new Map();
        for (const record of records) {
          const current = map.get(record.storySlug) || { count: 0, duration: 0 };
          current.count += 1;
          current.duration += record.duration || 0;
          map.set(record.storySlug, current);
        }
        return map;
      })
      .catch(() => new Map());
  }
  return cache;
}

export function subscribeRecordProgress(listener) {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    clearRecordProgress();
    listener();
  };
  window.addEventListener("voicetrace:recordings-changed", handler);
  return () => window.removeEventListener("voicetrace:recordings-changed", handler);
}

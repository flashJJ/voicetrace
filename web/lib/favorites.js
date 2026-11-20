export const FAVORITES_KEY = "voicetrace:favorites";
const FAVORITES_EVENT = "voicetrace:favorites-change";

export function readFavorites() {
  try {
    const raw = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((slug) => typeof slug === "string") : [];
  } catch (error) {
    return [];
  }
}

export function isFavorite(slug) {
  return readFavorites().includes(slug);
}

export function toggleFavorite(slug) {
  const current = readFavorites();
  const next = current.includes(slug)
    ? current.filter((item) => item !== slug)
    : [...current, slug];
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch (error) {
    // 隐私模式禁用 localStorage 时只在内存中生效。
  }
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: next }));
  return next;
}

export function subscribeFavorites(callback) {
  const handler = () => callback(readFavorites());
  window.addEventListener(FAVORITES_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(FAVORITES_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

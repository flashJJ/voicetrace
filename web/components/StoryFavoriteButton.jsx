"use client";

import { useEffect, useState } from "react";
import { isFavorite, subscribeFavorites, toggleFavorite } from "../lib/favorites";
import { useLocale } from "./LocaleProvider";

const COPY = {
  zh: {
    add: "收藏",
    remove: "已收藏",
    addAria: (title) => `收藏《${title}》`,
    removeAria: (title) => `取消收藏《${title}》`,
  },
  en: {
    add: "Save",
    remove: "Saved",
    addAria: (title) => `Save “${title}”`,
    removeAria: (title) => `Remove “${title}” from saved`,
  },
};

export default function StoryFavoriteButton({ slug, title }) {
  const { pick } = useLocale();
  const c = pick(COPY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isFavorite(slug));
    return subscribeFavorites((list) => setSaved(list.includes(slug)));
  }, [slug]);

  return (
    <button
      type="button"
      className={`story-favorite ${saved ? "is-saved" : ""}`}
      aria-pressed={saved}
      aria-label={saved ? c.removeAria(title) : c.addAria(title)}
      onClick={() => setSaved(toggleFavorite(slug).includes(slug))}
    >
      <span aria-hidden="true">{saved ? "★" : "☆"}</span>
      {saved ? c.remove : c.add}
    </button>
  );
}

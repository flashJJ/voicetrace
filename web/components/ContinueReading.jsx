"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStory } from "../lib/stories";
import { localizeStory } from "../lib/i18n-content";
import { useLocale } from "./LocaleProvider";

const LAST_STORY_KEY = "voicetrace:last-story";

const COPY = {
  zh: {
    last: "上次读到",
  },
  en: {
    last: "Last read",
  },
};

export default function ContinueReading() {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const [story, setStory] = useState(null);

  useEffect(() => {
    try {
      const slug = window.localStorage.getItem(LAST_STORY_KEY);
      if (slug) setStory(getStory(slug) || null);
    } catch (error) {
      setStory(null);
    }
  }, []);

  if (!story) return null;

  return (
    <div className="kids-continue stories-continue">
      <span>{c.last}</span>
      <Link href={`/stories/${story.slug}`}>
        {localizeStory(story, locale, localize).title}{" "}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

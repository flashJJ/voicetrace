"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "./LocaleProvider";

const LAST_KID_STORY_KEY = "voicetrace:last-kid-story";

const COPY = {
  zh: {
    last: "上次读到",
    age: (ageBand) => `${ageBand} 岁`,
  },
  en: {
    last: "Last read",
    age: (ageBand) => `ages ${ageBand}`,
  },
};

export default function KidsContinue({ stories }) {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const [last, setLast] = useState(null);

  useEffect(() => {
    try {
      const slug = window.localStorage.getItem(LAST_KID_STORY_KEY);
      if (slug) setLast(stories.find((story) => story.slug === slug) || null);
    } catch (error) {
      setLast(null);
    }
  }, [stories]);

  if (!last) return null;

  return (
    <div className="kids-continue">
      <span>{c.last}</span>
      <Link href={`/kids/${last.slug}`}>
        {localize(last.title)} <span aria-hidden="true">→</span>
      </Link>
      <em>{c.age(last.ageBand)}</em>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LAST_KID_STORY_KEY = "voicetrace:last-kid-story";

export default function KidsContinue({ stories }) {
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
      <span>上次读到</span>
      <Link href={`/kids/${last.slug}`}>
        {last.title} <span aria-hidden="true">→</span>
      </Link>
      <em>{last.ageBand} 岁</em>
    </div>
  );
}

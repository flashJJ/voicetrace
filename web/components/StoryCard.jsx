"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ageBandLabel } from "../lib/stories.js";
import { localizeStory } from "../lib/i18n-content";
import { useLocale } from "./LocaleProvider";

const COPY = {
  zh: { start: "开始阅读", cover: "封面" },
  en: { start: "Start reading", cover: "cover" },
};

export default function StoryCard({ story }) {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const localized = useMemo(
    () => localizeStory(story, locale, localize),
    [story, locale, localize]
  );
  const isSample = story.type.includes("示例");

  return (
    <article className="story-card">
      <img
        className="story-cover"
        src={localized.cover}
        alt={`${localized.title} ${c.cover}`}
        width="900"
        height="675"
        loading="lazy"
        decoding="async"
      />
      <div className="story-body">
        <div className="story-meta">
          <span>{localized.dialect}</span>
          <span className={isSample ? "badge badge-warn" : "badge"}>{localized.type}</span>
          {localized.ageBand ? (
            <span>{locale === "en" ? localized.ageBand : ageBandLabel(localized.ageBand)}</span>
          ) : null}
        </div>
        <h3 className="story-title">{localized.title}</h3>
        <p className="story-subtitle">{localized.subtitle}</p>
        <p className="story-intro">{localized.intro}</p>
        <Link className="story-link" href={`/stories/${localized.slug}`}>
          {c.start} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

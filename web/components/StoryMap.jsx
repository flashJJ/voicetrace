"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { stories } from "../lib/stories";
import { localizeStory } from "../lib/i18n-content";
import { useLocale } from "./LocaleProvider";

const pins = {
  moonlight: { x: 330, y: 300, label: "西关" },
  "mouse-wedding": { x: 520, y: 250, label: "珠三角" },
  "grandma-congee": { x: 430, y: 390, label: "广州河南" },
  "five-goats": { x: 250, y: 210, label: "越秀山" },
  "boluo-festival": { x: 640, y: 430, label: "黄埔庙头" },
  "chicken-lullaby": { x: 300, y: 350, label: "西关" },
  "chen-clan-frieze": { x: 400, y: 230, label: "陈家祠" },
  "guangxiao-bodhi": { x: 380, y: 190, label: "光孝寺" },
  "litchi-bay-ghost": { x: 300, y: 405, label: "荔枝湾" },
  "thirteen-factories-silver": { x: 350, y: 325, label: "十三行" },
  "dragonboat-meal": { x: 470, y: 330, label: "番禺水乡" },
  "qingming-hill": { x: 420, y: 175, label: "白云山" },
  "herbal-tea-night": { x: 285, y: 330, label: "西关老铺" },
  "whampoa-foreigner": { x: 610, y: 360, label: "黄埔古港" },
};

const pinGroups = Object.values(
  stories.reduce((groups, story) => {
    const pin = pins[story.slug] || { x: 400, y: 300, label: "广州" };
    const key = `${pin.x}-${pin.y}`;
    if (!groups[key]) {
      groups[key] = { key, ...pin, stories: [] };
    }
    groups[key].stories.push(story);
    return groups;
  }, {})
);

const COPY = {
  zh: {
    mapAria: "声迹声音地图示意",
    riverLabel: "珠 江 口",
    seaLabel: "南 海",
    mapCaption: "示意地图 · 非精确地理数据",
    pinCount: (count) => `${count} 个故事`,
    pinAriaMulti: (label, count) => `${label}，${count} 个故事，点击展开选择`,
    pinAriaSingle: (title, dialect) => `${title}，${dialect}`,
    expandHint: "点击展开选择",
    collapseHint: "收起故事列表",
    groupAria: (label) => `${label}的故事`,
    chooseStory: "选择故事",
    eyebrow: "声音地图",
    read: "读这个故事",
    coverAlt: (title) => `${title}封面`,
  },
  en: {
    mapAria: "Illustrative sound map of VoiceTrace",
    riverLabel: "PEARL RIVER",
    seaLabel: "SOUTH CHINA SEA",
    mapCaption: "Illustrative map · not accurate geographic data",
    pinCount: (count) => `${count} stories`,
    pinAriaMulti: (label, count) => `${label}, ${count} stories, activate to choose one`,
    pinAriaSingle: (title, dialect) => `${title}, ${dialect}`,
    expandHint: "Choose a story",
    collapseHint: "Hide story list",
    groupAria: (label) => `Stories in ${label}`,
    chooseStory: "Choose a story",
    eyebrow: "SOUND MAP",
    read: "Read this story",
    coverAlt: (title) => `${title} cover`,
  },
};

export default function StoryMap() {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const [activeSlug, setActiveSlug] = useState(stories[0].slug);
  const [openGroupKey, setOpenGroupKey] = useState(null);
  const mapCanvasRef = useRef(null);
  const groupRefs = useRef({});
  const localizedBySlug = new Map(
    stories.map((story) => [story.slug, localizeStory(story, locale, localize)])
  );
  const groups = pinGroups.map((group) => ({
    ...group,
    label: localize(group.label),
    stories: group.stories.map((story) => localizedBySlug.get(story.slug)),
  }));
  const active = localizedBySlug.get(activeSlug) || localizedBySlug.get(stories[0].slug);
  const openGroup = groups.find((group) => group.key === openGroupKey);

  useEffect(() => {
    if (!openGroupKey) return undefined;

    const handlePointerDown = (event) => {
      if (!mapCanvasRef.current?.contains(event.target)) {
        setOpenGroupKey(null);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenGroupKey(null);
        groupRefs.current[openGroupKey]?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openGroupKey]);

  const selectStory = (slug) => {
    setActiveSlug(slug);
    setOpenGroupKey(null);
    if (openGroupKey) {
      groupRefs.current[openGroupKey]?.focus();
    }
  };

  const toggleGroup = (group) => {
    if (group.stories.length === 1) {
      selectStory(group.stories[0].slug);
      return;
    }
    setOpenGroupKey((current) => (current === group.key ? null : group.key));
  };

  const handleGroupKeyDown = (event, group) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleGroup(group);
    }
  };

  return (
    <div className="map-layout">
      <div className="map-frame">
        <div className="map-canvas" ref={mapCanvasRef}>
          <svg viewBox="0 0 800 620" role="img" aria-label={c.mapAria}>
          <rect x="0" y="0" width="800" height="620" fill="#f2e7d4" />
          <path
            d="M70 180 C160 120, 260 130, 340 170 C430 215, 520 190, 610 150 C690 115, 745 140, 750 210 C755 290, 690 330, 720 410 C745 480, 690 540, 600 545 C510 550, 470 505, 390 520 C300 537, 210 520, 150 465 C90 410, 80 330, 70 260 Z"
            fill="#e7d8bf"
            stroke="rgba(31,27,22,0.18)"
            strokeWidth="2"
          />
          <path
            d="M100 330 C190 300, 250 320, 330 300 C420 278, 500 300, 590 270 C650 250, 700 260, 735 290"
            fill="none"
            stroke="#9bb7ae"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.72"
          />
          <path
            d="M330 300 C350 350, 390 390, 430 440 C460 480, 500 510, 540 540"
            fill="none"
            stroke="#9bb7ae"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.55"
          />
          <text x="120" y="120" fill="#7a6d5e" fontSize="14" letterSpacing="4">
            {c.riverLabel}
          </text>
          <text x="590" y="500" fill="#7a6d5e" fontSize="14" letterSpacing="4">
            {c.seaLabel}
          </text>
          <text x="340" y="545" fill="#7a6d5e" fontSize="12" letterSpacing="2">
            {c.mapCaption}
          </text>

          {groups.map((group) => {
            const isMulti = group.stories.length > 1;
            const isActive = group.stories.some((story) => story.slug === activeSlug);
            const isOpen = openGroupKey === group.key;
            const title = isMulti
              ? `${group.label} · ${c.pinCount(group.stories.length)}`
              : group.stories[0].title;

            return (
              <g
                key={group.key}
                ref={(node) => {
                  groupRefs.current[group.key] = node;
                }}
                className={`map-pin ${isActive ? "is-active" : ""}`}
                onClick={() => toggleGroup(group)}
                onKeyDown={(event) => handleGroupKeyDown(event, group)}
                role="button"
                tabIndex={0}
                aria-label={
                  isMulti
                    ? c.pinAriaMulti(group.label, group.stories.length)
                    : c.pinAriaSingle(group.stories[0].title, group.stories[0].dialect)
                }
                aria-expanded={isMulti ? isOpen : undefined}
                aria-controls={isMulti ? `map-group-${group.key}` : undefined}
              >
                <circle
                  cx={group.x}
                  cy={group.y}
                  r={isMulti ? 30 : 26}
                  fill="rgba(166,58,43,0.12)"
                />
                <circle
                  className="map-pin-dot"
                  cx={group.x}
                  cy={group.y}
                  r={isMulti ? 18 : isActive ? 9 : 7}
                  fill={isActive ? "#a63a2b" : "#2f5d50"}
                />
                <circle
                  className="map-pin-ring"
                  cx={group.x}
                  cy={group.y}
                  r={isMulti ? 25 : 16}
                  fill="none"
                  stroke={isActive ? "#a63a2b" : "#2f5d50"}
                  strokeWidth="1.2"
                  opacity={isActive ? 0.9 : 0.45}
                />
                {isMulti && (
                  <text
                    x={group.x}
                    y={group.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff8ec"
                    fontSize="12"
                    fontWeight="700"
                    pointerEvents="none"
                  >
                    {group.stories.length}
                  </text>
                )}
                <text
                  x={group.x + (isMulti ? 26 : 20)}
                  y={group.y + 5}
                  fill={isActive ? "#1f1b16" : "#4f463c"}
                  fontSize="14"
                  fontWeight="600"
                >
                  {title}
                </text>
                <text
                  x={group.x + (isMulti ? 26 : 20)}
                  y={group.y + 24}
                  fill="#7a6d5e"
                  fontSize="11"
                >
                  {isMulti ? (isOpen ? c.collapseHint : c.expandHint) : group.label}
                </text>
              </g>
            );
          })}
          </svg>
          {openGroup && (
            <div
              className="map-pin-menu"
              id={`map-group-${openGroup.key}`}
              role="group"
              aria-label={c.groupAria(openGroup.label)}
              style={{
                left: `${(openGroup.x / 800) * 100}%`,
                top: `${((openGroup.y + 34) / 620) * 100}%`,
              }}
            >
              <span className="map-pin-menu-title">
                {openGroup.label} · {c.chooseStory}
              </span>
              {openGroup.stories.map((story, index) => (
                <button
                  type="button"
                  key={story.slug}
                  className={`map-pin-option ${
                    story.slug === activeSlug ? "is-active" : ""
                  }`}
                  onClick={() => selectStory(story.slug)}
                  aria-pressed={story.slug === activeSlug}
                  autoFocus={index === 0}
                >
                  <span>{story.title}</span>
                  <small>
                    {story.modeLabel} ·{" "}
                    {story.dialect.replace(/^(粤语|粵語|Cantonese) · /, "")}
                  </small>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="map-panel">
        <span className="eyebrow">{c.eyebrow}</span>
        <h2>{active.title}</h2>
        <p>
          {active.dialect} · {active.subtitle}
        </p>
        <img
          src={active.cover}
          alt={c.coverAlt(active.title)}
          width="900"
          height="675"
          loading="eager"
          decoding="async"
          style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 6 }}
        />
        <p style={{ marginTop: 16 }}>{active.intro}</p>
        <Link className="btn btn-primary" href={`/stories/${active.slug}`}>
          {c.read} <span aria-hidden="true">→</span>
        </Link>

        <div className="map-story-list">
          {stories.map((story) => {
            const localized = localizedBySlug.get(story.slug);
            return (
              <button
                type="button"
                key={story.slug}
                className="map-story"
                onClick={() => selectStory(story.slug)}
              >
                <img
                  src={story.cover}
                  alt=""
                  width="900"
                  height="675"
                  loading="lazy"
                  decoding="async"
                />
                <span>
                  <span className="map-story-title" style={{ display: "block" }}>
                    {localized.title}
                  </span>
                  <span className="map-story-meta">
                    {localized.dialect} · {localized.duration}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

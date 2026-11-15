"use client";

import Link from "next/link";
import { useState } from "react";
import { stories } from "../lib/stories";

const pins = {
  moonlight: { x: 330, y: 300, label: "西关" },
  "mouse-wedding": { x: 520, y: 250, label: "珠三角" },
  "grandma-congee": { x: 430, y: 390, label: "广州河南" },
};

export default function StoryMap() {
  const [activeSlug, setActiveSlug] = useState(stories[0].slug);
  const active = stories.find((story) => story.slug === activeSlug) || stories[0];

  return (
    <div className="map-layout">
      <div className="map-frame">
        <svg viewBox="0 0 800 620" role="img" aria-label="声迹声音地图示意">
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
            珠 江 口
          </text>
          <text x="590" y="500" fill="#7a6d5e" fontSize="14" letterSpacing="4">
            南 海
          </text>
          <text x="340" y="545" fill="#7a6d5e" fontSize="12" letterSpacing="2">
            示意地图 · 非精确地理数据
          </text>

          {stories.map((story) => {
            const pin = pins[story.slug] || { x: 400, y: 300, label: "广州" };
            const isActive = story.slug === activeSlug;
            return (
              <g
                key={story.slug}
                className={`map-pin ${isActive ? "is-active" : ""}`}
                onClick={() => setActiveSlug(story.slug)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveSlug(story.slug);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${story.title}，${story.dialect}`}
              >
                <circle cx={pin.x} cy={pin.y} r="26" fill="rgba(166,58,43,0.12)" />
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={isActive ? 9 : 7}
                  fill={isActive ? "#a63a2b" : "#2f5d50"}
                />
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r="16"
                  fill="none"
                  stroke={isActive ? "#a63a2b" : "#2f5d50"}
                  strokeWidth="1.2"
                  opacity={isActive ? 0.9 : 0.45}
                />
                <text
                  x={pin.x + 20}
                  y={pin.y + 5}
                  fill={isActive ? "#1f1b16" : "#4f463c"}
                  fontSize="14"
                  fontWeight="600"
                >
                  {story.title}
                </text>
                <text
                  x={pin.x + 20}
                  y={pin.y + 24}
                  fill="#7a6d5e"
                  fontSize="11"
                >
                  {pin.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="map-panel">
        <span className="eyebrow">声音地图</span>
        <h2>{active.title}</h2>
        <p>
          {active.dialect} · {active.subtitle}
        </p>
        <img
          src={active.cover}
          alt={`${active.title}封面`}
          style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 6 }}
        />
        <p style={{ marginTop: 16 }}>{active.intro}</p>
        <Link className="btn btn-primary" href={`/stories/${active.slug}`}>
          读这个故事 <span aria-hidden="true">→</span>
        </Link>

        <div style={{ marginTop: 24 }}>
          {stories.map((story) => (
            <button
              type="button"
              key={story.slug}
              className="map-story"
              onClick={() => setActiveSlug(story.slug)}
            >
              <img src={story.cover} alt="" />
              <span>
                <span className="map-story-title" style={{ display: "block" }}>
                  {story.title}
                </span>
                <span className="map-story-meta">
                  {story.dialect} · {story.duration}
                </span>
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

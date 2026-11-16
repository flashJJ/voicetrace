"use client";

import { useEffect, useState } from "react";

const LINE = "月光光，照地堂。年卅晚，摘槟榔。";
const MANDARIN = "月光洒在天井里，除夕夜摘槟榔。";

const CHARS = Array.from(LINE);

// 固定波形，避免服务端与客户端渲染不一致
const BARS = Array.from({ length: 56 }, (_, index) => {
  const value =
    Math.sin(index * 0.72) * 0.42 +
    Math.sin(index * 0.21) * 0.3 +
    Math.sin(index * 1.7) * 0.12 +
    0.58;
  return Math.round(Math.min(1, Math.max(0.16, value)) * 100);
});

export default function VoiceMoment() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setActiveIndex(CHARS.length - 1);
      return undefined;
    }

    let timer;
    let step = -1;

    const tick = () => {
      step += 1;
      if (step >= CHARS.length) {
        step = -1;
        setActiveIndex(-1);
        timer = window.setTimeout(tick, 1100);
        return;
      }
      setActiveIndex(step);
      timer = window.setTimeout(tick, 240);
    };

    timer = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const progress = (activeIndex + 1) / CHARS.length;

  return (
    <div className="voice-moment">
      <div className="voice-moment-head">
        <span>粤语 · 西关</span>
        <span className="voice-moment-note">语音示例</span>
      </div>
      <p className="voice-moment-yue" aria-label={`粤语童谣：${LINE}`}>
        {CHARS.map((char, index) => (
          <span
            key={`${char}-${index}`}
            className={index <= activeIndex ? "is-lit" : ""}
          >
            {char}
          </span>
        ))}
      </p>
      <p className="voice-moment-zh">{MANDARIN}</p>
      <div className="voice-bars" aria-hidden="true">
        {BARS.map((height, index) => (
          <span
            key={index}
            className={index / BARS.length < progress ? "is-lit" : ""}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

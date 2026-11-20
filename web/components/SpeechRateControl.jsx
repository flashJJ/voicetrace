"use client";

import { RATES } from "../lib/playback";
import { usePlaybackRate } from "../hooks/usePlaybackRate";
import { useLocale } from "./LocaleProvider";

const COPY = {
  zh: {
    aria: "朗读速度",
    label: "朗读速度",
    labels: { 0.7: "慢速", 0.9: "标准", 1: "原速" },
  },
  en: {
    aria: "Reading speed",
    label: "Speed",
    labels: { 0.7: "Slow", 0.9: "Steady", 1: "Natural" },
  },
};

export default function SpeechRateControl() {
  const { pick } = useLocale();
  const c = pick(COPY);
  const { rate, setRate } = usePlaybackRate();

  return (
    <div className="speech-rate" role="group" aria-label={c.aria}>
      <span className="speech-rate-label">{c.label}</span>
      {RATES.map((value) => (
        <button
          type="button"
          key={value}
          className={rate === value ? "is-active" : ""}
          aria-pressed={rate === value}
          onClick={() => setRate(value)}
        >
          {c.labels[value]}
        </button>
      ))}
    </div>
  );
}

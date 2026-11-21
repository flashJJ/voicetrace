"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "./LocaleProvider";
import { heroImage } from "../lib/stories";

const COPY = {
  zh: {
    sub: "方言故事书 · DIALECT STORYBOOK",
    line: "趁还会唱，把乡音留下来",
    skip: "点击任意处跳过",
  },
  en: {
    sub: "DIALECT STORYBOOK",
    line: "Keep the voice before it fades away",
    skip: "Click anywhere to skip",
  },
};

const SESSION_KEY = "voicetrace:intro";

export default function CinematicIntro() {
  const { pick } = useLocale();
  const c = pick(COPY);
  const [phase, setPhase] = useState("idle");
  const forceRef = useRef(null);

  if (forceRef.current === null && typeof window !== "undefined") {
    forceRef.current =
      new URLSearchParams(window.location.search).get("intro") === "1";
  }

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const force = forceRef.current === true;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }

    if (reduce || (seen && !force)) {
      root.dataset.intro = "off";
      setPhase("done");
      return undefined;
    }

    root.dataset.intro = "on";
    setPhase("play");

    if (force) {
      const url = new URL(window.location.href);
      url.searchParams.delete("intro");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }

    let ended = false;
    let leaveTimer = 0;
    const finish = () => {
      if (ended) return;
      ended = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // 隐私模式下忽略
      }
      root.dataset.intro = "off";
      setPhase("leaving");
      leaveTimer = window.setTimeout(() => {
        setPhase("done");
      }, 540);
    };
    const timer = window.setTimeout(finish, 2300);
    const events = ["pointerdown", "keydown", "wheel", "touchstart"];
    events.forEach((name) => window.addEventListener(name, finish, { passive: true }));

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(leaveTimer);
      events.forEach((name) => window.removeEventListener(name, finish));
      root.dataset.intro = "off";
    };
  }, []);

  if (phase === "idle" || phase === "done") return null;

  return (
    <div className={`cine-intro cine-${phase}`} aria-hidden="true">
      <div className="cine-photo" style={{ backgroundImage: `url(${heroImage})` }} />
      <div className="cine-vignette" />
      <div className="cine-grain" />
      <div className="cine-center">
        <div className="cine-title">
          <span>声</span>
          <span>迹</span>
        </div>
        <p className="cine-sub">{c.sub}</p>
      </div>
      <p className="cine-couplet">{c.line}</p>
      <div className="cine-seal">
        <span>声</span>
        <span>迹</span>
      </div>
      <p className="cine-hint">{c.skip}</p>
    </div>
  );
}

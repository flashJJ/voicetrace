"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_RATE, normalizeRate, RATE_KEY } from "../lib/playback";

const RATE_EVENT = "voicetrace:rate";

export function usePlaybackRate() {
  const [rate, setRateState] = useState(DEFAULT_RATE);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(RATE_KEY));
      if (saved) setRateState(normalizeRate(saved));
    } catch (error) {
      // 隐私模式禁用 localStorage 时使用默认速度。
    }

    const sync = (event) => {
      if (event?.detail != null) {
        setRateState(normalizeRate(Number(event.detail)));
        return;
      }
      try {
        const saved = Number(window.localStorage.getItem(RATE_KEY));
        setRateState(saved ? normalizeRate(saved) : DEFAULT_RATE);
      } catch (error) {
        setRateState(DEFAULT_RATE);
      }
    };

    window.addEventListener(RATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(RATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setRate = useCallback((next) => {
    const value = normalizeRate(Number(next));
    setRateState(value);
    try {
      window.localStorage.setItem(RATE_KEY, String(value));
    } catch (error) {
      // 写不进去也不影响当前会话。
    }
    window.dispatchEvent(new CustomEvent(RATE_EVENT, { detail: value }));
  }, []);

  return { rate, setRate };
}

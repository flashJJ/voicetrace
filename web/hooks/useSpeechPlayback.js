"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "../components/LocaleProvider";

const CANTONESE = /yue|zh-HK|zh_HK|Cantonese|Hong Kong/i;

const COPY = {
  zh: {
    unsupported: "当前浏览器不支持语音播放，可以请家长读。",
    noVoice: "当前浏览器没有可用语音，可以请家长读。",
    noCantonese: "当前浏览器没有粤语语音，已使用中文语音示例。",
    playFail: "语音播放失败，可以请家长读。",
  },
  en: {
    unsupported: "This browser cannot play speech. Ask a grown-up to read it.",
    noVoice: "No voice is available in this browser. Ask a grown-up to read it.",
    noCantonese: "This browser has no Cantonese voice, so a Mandarin sample is playing.",
    playFail: "Speech playback failed. Ask a grown-up to read it.",
  },
};

function loadVoices() {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const ready = synth.getVoices();
    if (ready.length) {
      resolve(ready);
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      synth.removeEventListener("voiceschanged", finish);
      resolve(synth.getVoices());
    };
    synth.addEventListener("voiceschanged", finish);
    window.setTimeout(finish, 1500);
  });
}

// 儿童跟读与读题共用的浏览器语音播放，不保存任何音频。
export function useSpeechPlayback() {
  const { pick } = useLocale();
  const copyRef = useRef(COPY.zh);
  copyRef.current = pick(COPY);
  const [speaking, setSpeaking] = useState(false);
  const [message, setMessage] = useState("");
  const aliveRef = useRef(true);
  const requestRef = useRef(0);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    requestRef.current += 1;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    setMessage("");
  }, []);

  const speak = useCallback(async (text, { lang = "yue" } = {}) => {
    if (!text) return;
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setMessage(copyRef.current.unsupported);
      return;
    }

    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setMessage("");
    setSpeaking(true);

    const voices = await loadVoices();
    if (!aliveRef.current || requestId !== requestRef.current) return;

    const cantonese = voices.find((voice) =>
      CANTONESE.test(`${voice.lang} ${voice.name}`)
    );
    const mandarin =
      voices.find((voice) => /^zh[-_]?CN/i.test(voice.lang)) ||
      voices.find((voice) => /^zh/i.test(voice.lang));
    const selected = lang === "zh" ? mandarin || cantonese : cantonese || mandarin;

    if (!selected) {
      setSpeaking(false);
      setMessage(copyRef.current.noVoice);
      return;
    }

    if (lang === "yue" && !cantonese) {
      setMessage(copyRef.current.noCantonese);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selected.lang;
    utterance.voice = selected;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => {
      if (requestId === requestRef.current) setSpeaking(false);
    };
    utterance.onerror = () => {
      if (requestId !== requestRef.current) return;
      setSpeaking(false);
      setMessage(copyRef.current.playFail);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speaking, message, speak, stop, setMessage };
}

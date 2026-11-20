"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "../components/LocaleProvider";

const LANGUAGES = ["yue-Hant-HK", "zh-HK", "zh-CN"];

const COPY = {
  zh: {
    createFail: "当前浏览器无法启动语音转写，可以手动输入。",
    denied: "浏览器语音服务被拒绝或不可用，可以手动输入转写。",
    network: "语音服务需要网络，当前连接不上，可以手动输入转写。",
    audioCapture: "没有可用的麦克风，自动转写已停止。",
    startFail: "自动转写没有启动，可以手动输入。",
    unsupported: "当前浏览器不支持自动转写，可以手动输入。",
  },
  en: {
    createFail: "This browser could not start speech transcription. You can type the transcript instead.",
    denied: "The browser speech service was denied or is unavailable. You can type the transcript instead.",
    network: "The speech service needs a network connection and could not connect. You can type the transcript instead.",
    audioCapture: "No microphone is available. Automatic transcription has stopped.",
    startFail: "Automatic transcription did not start. You can type the transcript instead.",
    unsupported: "This browser does not support automatic transcription. You can type the transcript instead.",
  },
};

function getRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function describeSpeechError(code, c) {
  if (code === "not-allowed" || code === "service-not-allowed") {
    return c.denied;
  }
  if (code === "network") {
    return c.network;
  }
  if (code === "audio-capture") {
    return c.audioCapture;
  }
  return "";
}

export function useSpeechRecognition() {
  const { pick } = useLocale();
  const copyRef = useRef(COPY.zh);
  copyRef.current = pick(COPY);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);
  const finalRef = useRef("");
  const shouldListenRef = useRef(false);
  const languageIndexRef = useRef(0);
  const restartTimerRef = useRef(null);

  useEffect(() => {
    setSupported(Boolean(getRecognition()));
    return () => {
      shouldListenRef.current = false;
      if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
      try {
        recognitionRef.current?.abort();
      } catch (abortError) {
        // 忽略卸载时的中断错误。
      }
      recognitionRef.current = null;
    };
  }, []);

  const begin = useCallback(function startRecognition() {
    const Recognition = getRecognition();
    if (!Recognition) return;

    let recognition;
    try {
      recognition = new Recognition();
    } catch (createError) {
      setError(copyRef.current.createFail);
      shouldListenRef.current = false;
      return;
    }

    recognition.lang = LANGUAGES[languageIndexRef.current] || "zh-HK";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let finalText = finalRef.current;
      let interimText = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result[0]?.transcript || "";
        if (result.isFinal) finalText += text;
        else interimText += text;
      }
      finalRef.current = finalText;
      setTranscript(finalText);
      setInterim(interimText);
    };

    recognition.onerror = (event) => {
      const code = event.error || "";
      if (code === "language-not-supported" && languageIndexRef.current < LANGUAGES.length - 1) {
        languageIndexRef.current += 1;
        try {
          recognition.abort();
        } catch (abortError) {
          // 忽略；onend 会用下一种语言重启。
        }
        return;
      }
      if (code === "no-speech" || code === "aborted") return;
      const message = describeSpeechError(code, copyRef.current);
      if (message) {
        shouldListenRef.current = false;
        setError(message);
        setListening(false);
      }
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");
      if (!shouldListenRef.current) return;
      restartTimerRef.current = window.setTimeout(() => {
        if (shouldListenRef.current) startRecognition();
      }, 300);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (startError) {
      setError(copyRef.current.startFail);
      shouldListenRef.current = false;
    }
  }, []);

  const start = useCallback(() => {
    if (!getRecognition()) {
      setError(copyRef.current.unsupported);
      return;
    }
    if (shouldListenRef.current) return;
    shouldListenRef.current = true;
    languageIndexRef.current = 0;
    finalRef.current = "";
    setTranscript("");
    setInterim("");
    setError("");
    begin();
  }, [begin]);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch (stopError) {
      // 忽略停止时的错误。
    }
    recognitionRef.current = null;
    setListening(false);
    setInterim("");
  }, []);

  const reset = useCallback(() => {
    stop();
    finalRef.current = "";
    setTranscript("");
    setInterim("");
    setError("");
  }, [stop]);

  return { supported, listening, transcript, interim, error, start, stop, reset };
}

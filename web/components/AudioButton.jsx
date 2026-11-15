"use client";

import { useEffect, useRef, useState } from "react";

function PlayIcon({ playing }) {
  return playing ? (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export default function AudioButton({ text, audioUrl, label = "播放粤语原声" }) {
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState("");
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!audioUrl) return undefined;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    const onEnded = () => setPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
  };

  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setMessage("当前浏览器不支持语音播放，请替换为真实录音。");
      return;
    }
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const cantonese = voices.find((voice) =>
      /yue|zh-HK|zh_HK|Cantonese|Hong Kong/i.test(`${voice.lang} ${voice.name}`)
    );
    const fallback = voices.find((voice) => /^zh/i.test(voice.lang));
    const selected = cantonese || fallback;

    if (!cantonese) {
      setMessage(
        "当前浏览器没有粤语语音，已切换为中文语音示例；正式版会播放经授权的真实粤语录音。"
      );
    } else {
      setMessage("");
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selected ? selected.lang : "zh-HK";
    if (selected) utterance.voice = selected;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => {
      setPlaying(false);
      setMessage("语音播放失败，请替换为真实录音。");
    };
    utteranceRef.current = utterance;
    synth.cancel();
    synth.speak(utterance);
    setPlaying(true);
  };

  const handleClick = () => {
    if (playing) {
      stop();
      return;
    }
    setMessage("");
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          setMessage("音频加载失败，已切换为浏览器语音。");
          speak();
        });
      return;
    }
    speak();
  };

  return (
    <div>
      <div className="audio-row">
        <button
          type="button"
          className="audio-play"
          onClick={handleClick}
          aria-label={playing ? "停止播放" : label}
        >
          <PlayIcon playing={playing} />
        </button>
        <div className="audio-meta">
          <div className="audio-label">{playing ? "正在播放" : "原声 / 示例语音"}</div>
          <div className="audio-note">{label}</div>
        </div>
      </div>
      <p className="audio-hint">
        {message ||
          "当前原型使用浏览器语音作为示例；正式版将播放经授权的真实方言录音，并标注 AI 合成部分。"}
      </p>
    </div>
  );
}

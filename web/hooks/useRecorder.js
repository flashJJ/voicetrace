"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_RECORD_MS, MIN_RECORD_MS, pickMimeType, recorderSupport } from "../lib/recorder";
import { useLocale } from "../components/LocaleProvider";

const COPY = {
  zh: {
    unsupported: "当前浏览器不支持录音，建议用 Chrome、Edge 或较新的 Safari。",
    createFail: "当前浏览器无法创建录音，请换一个浏览器试试。",
    interrupted: "录音中断了，请重试。",
    tooShort: "这段太短了，至少录 1 秒。",
    denied: "麦克风权限被拒绝。请在浏览器地址栏的权限设置里允许麦克风，然后重试。",
    notFound: "没有找到可用的麦克风，请检查设备连接。",
    busy: "麦克风被其他程序占用了，关掉会议或录音软件后再试。",
    overconstrained: "当前麦克风不支持所需参数，换一个输入设备试试。",
    generic: "录音没有启动成功，请重试或更换浏览器。",
  },
  en: {
    unsupported: "This browser cannot record audio. Try Chrome, Edge, or a recent Safari.",
    createFail: "This browser could not start recording. Please try another browser.",
    interrupted: "Recording was interrupted. Please try again.",
    tooShort: "That was too short. Record at least one second.",
    denied: "Microphone permission was denied. Allow the microphone in the browser's site settings, then try again.",
    notFound: "No microphone was found. Please check the device connection.",
    busy: "The microphone is being used by another app. Close meeting or recording apps and try again.",
    overconstrained: "This microphone does not support the required settings. Try another input device.",
    generic: "Recording did not start. Please try again or switch browsers.",
  },
};

function recorderErrorMessage(error, c) {
  const name = error?.name || "";
  if (name === "NotAllowedError" || name === "SecurityError") return c.denied;
  if (name === "NotFoundError" || name === "DevicesNotFoundError") return c.notFound;
  if (name === "NotReadableError" || name === "TrackStartError") return c.busy;
  if (name === "OverconstrainedError") return c.overconstrained;
  return c.generic;
}

export function useRecorder() {
  const { pick } = useLocale();
  const copyRef = useRef(COPY.zh);
  copyRef.current = pick(COPY);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [clip, setClip] = useState(null);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startedAtRef = useRef(0);
  const discardRef = useRef(false);
  const clipRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const setClipSafe = useCallback((next) => {
    setClip((previous) => {
      if (previous?.url && previous.url !== next?.url) URL.revokeObjectURL(previous.url);
      clipRef.current = next;
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    discardRef.current = true;
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    recorderRef.current = null;
    clearTimer();
    stopStream();
    setClipSafe(null);
    setElapsed(0);
    setError("");
    setStatus("idle");
  }, [clearTimer, setClipSafe, stopStream]);

  const start = useCallback(async () => {
    const c = copyRef.current;
    if (recorderSupport() !== "ok") {
      setStatus("unsupported");
      setError(c.unsupported);
      return;
    }
    setError("");
    setElapsed(0);
    setStatus("requesting");
    setClipSafe(null);
    discardRef.current = false;

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (microphoneError) {
      setStatus("error");
      setError(recorderErrorMessage(microphoneError, c));
      return;
    }

    const mimeType = pickMimeType();
    let recorder;
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch (recordError) {
      stream.getTracks().forEach((track) => track.stop());
      setStatus("error");
      setError(c.createFail);
      return;
    }

    streamRef.current = stream;
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data?.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onerror = () => {
      clearTimer();
      stopStream();
      setStatus("error");
      setError(c.interrupted);
    };

    recorder.onstop = () => {
      clearTimer();
      stopStream();
      const duration = Math.min(MAX_RECORD_MS, Date.now() - startedAtRef.current) / 1000;
      if (discardRef.current) {
        discardRef.current = false;
        setStatus("idle");
        return;
      }
      if (duration * 1000 < MIN_RECORD_MS) {
        setStatus("error");
        setError(c.tooShort);
        return;
      }
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || mimeType || "audio/webm",
      });
      chunksRef.current = [];
      setClipSafe({ blob, url: URL.createObjectURL(blob), mime: blob.type, duration });
      setStatus("ready");
    };

    startedAtRef.current = Date.now();
    recorder.start(1000);
    setStatus("recording");
    timerRef.current = window.setInterval(() => {
      const seconds = (Date.now() - startedAtRef.current) / 1000;
      setElapsed(seconds);
      if (seconds * 1000 >= MAX_RECORD_MS && recorder.state !== "inactive") {
        recorder.stop();
      }
    }, 200);
  }, [clearTimer, setClipSafe, stopStream]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      setStatus("processing");
      recorder.stop();
    }
  }, []);

  useEffect(
    () => () => {
      discardRef.current = true;
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
      clearTimer();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (clipRef.current?.url) URL.revokeObjectURL(clipRef.current.url);
    },
    [clearTimer]
  );

  return { status, error, elapsed, clip, start, stop, reset, setError };
}

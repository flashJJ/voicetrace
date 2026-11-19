"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MAX_RECORD_MS,
  MIN_RECORD_MS,
  describeRecorderError,
  pickMimeType,
  recorderSupport,
} from "../lib/recorder";

export function useRecorder() {
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
    if (recorderSupport() !== "ok") {
      setStatus("unsupported");
      setError("当前浏览器不支持录音，建议用 Chrome、Edge 或较新的 Safari。");
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
      setError(describeRecorderError(microphoneError));
      return;
    }

    const mimeType = pickMimeType();
    let recorder;
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch (recordError) {
      stream.getTracks().forEach((track) => track.stop());
      setStatus("error");
      setError("当前浏览器无法创建录音，请换一个浏览器试试。");
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
      setError("录音中断了，请重试。");
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
        setError("这段太短了，至少录 1 秒。");
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

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AudioButton from "./AudioButton";
import { formatDuration, getRecording, recordingId } from "../lib/recordings";
import { useLocale } from "./LocaleProvider";

const COPY = {
  zh: {
    family: "家人",
    ourVersion: "我家的版本",
    reRecord: "重录",
    archive: "声音档案 · 改转写",
    playFamily: "播放我家的版本",
    stop: "停止播放",
    playSample: "播放本幕粤语示例语音",
    recordScene: "录下这一段的粤语 →",
  },
  en: {
    family: "Family",
    ourVersion: "Our family version",
    reRecord: "Re-record",
    archive: "Voice archive · edit transcript",
    playFamily: "Play our family version",
    stop: "Stop",
    playSample: "Play sample Cantonese audio for this act",
    recordScene: "Record this act in Cantonese →",
  },
};

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

export default function SceneAudio({ story, scene, recordBase = "/record" }) {
  const { pick } = useLocale();
  const c = pick(COPY);
  const [status, setStatus] = useState("loading");
  const [record, setRecord] = useState(null);
  const [url, setUrl] = useState("");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let alive = true;
    let objectUrl = "";
    setStatus("loading");
    setRecord(null);
    setUrl("");
    setPlaying(false);

    getRecording(recordingId(story.slug, scene.id))
      .then((found) => {
        if (!alive) return;
        if (!found) {
          setStatus("empty");
          return;
        }
        objectUrl = URL.createObjectURL(found.blob);
        setRecord(found);
        setUrl(objectUrl);
        setStatus("ready");
      })
      .catch(() => {
        if (alive) setStatus("empty");
      });

    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [story.slug, scene.id]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      return;
    }
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  if (status === "loading") return null;

  if (status === "ready" && record) {
    const who = record.speaker || record.relation || c.family;
    return (
      <div className="reader-audio scene-audio">
        <div className="audio-row">
          <button
            type="button"
            className="audio-play"
            onClick={toggle}
            aria-label={playing ? c.stop : c.playFamily}
          >
            <PlayIcon playing={playing} />
          </button>
          <div className="audio-meta">
            <div className="audio-label">{c.ourVersion}</div>
            <div className="audio-note">
              {who} · {formatDuration(record.duration)}
            </div>
          </div>
          <Link
            className="scene-audio-edit"
            href={`${recordBase}?story=${record.storySlug}&scene=${record.sceneId}`}
          >
            {c.reRecord}
          </Link>
        </div>
        <p className="scene-audio-transcript" title={record.transcript || scene.textYue}>
          {record.transcript || scene.textYue}
        </p>
        <div className="scene-audio-links">
          <Link href="/archive">{c.archive}</Link>
        </div>
        <audio ref={audioRef} src={url} preload="metadata" onEnded={() => setPlaying(false)} />
      </div>
    );
  }

  return (
    <div className="reader-audio">
      <AudioButton text={scene.audioText || scene.textYue} label={c.playSample} />
      <Link
        className="scene-record-link"
        href={`${recordBase}?story=${story.slug}&scene=${scene.id}`}
      >
        {c.recordScene}
      </Link>
    </div>
  );
}

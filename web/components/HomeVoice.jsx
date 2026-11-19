"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listRecordings } from "../lib/recordings";
import { subscribeRecordProgress } from "../lib/record-progress";

function minutesLabel(seconds) {
  if (seconds < 60) return "不到 1 分钟";
  const minutes = Math.round(seconds / 60);
  return `约 ${minutes} 分钟`;
}

export default function HomeVoice() {
  const [records, setRecords] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = () => {
      listRecordings()
        .then((items) => {
          if (alive) setRecords(items);
        })
        .catch(() => {
          if (alive) setRecords([]);
        });
    };
    load();
    const unsubscribe = subscribeRecordProgress(load);
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  if (!records) return null;

  if (records.length === 0) {
    return (
      <section className="container home-voice-wrap">
        <div className="home-voice">
          <div>
            <span className="eyebrow">我家的声音</span>
            <h2>我家的声音，还空着。</h2>
            <p>挑一个故事片段，用你家的粤语读一遍。录音只保存在这台设备，随时可以删。</p>
          </div>
          <div className="home-voice-actions">
            <Link className="btn btn-primary" href="/record">
              录第一段
            </Link>
            <Link className="btn btn-ghost" href="/archive">
              声音档案
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const totalDuration = records.reduce((sum, record) => sum + (record.duration || 0), 0);
  const storyCount = new Set(records.map((record) => record.storySlug)).size;
  const latest = records[0];
  const who = latest.speaker ? `${latest.speaker} · ` : "";

  return (
    <section className="container home-voice-wrap">
      <div className="home-voice">
        <div>
          <span className="eyebrow">我家的声音</span>
          <h2>已经留下 {records.length} 段乡音。</h2>
          <p>
            {storyCount} 个故事 · {minutesLabel(totalDuration)}。最近一段：
            {latest.storyTitle || latest.storySlug}《{latest.sceneTitle}》，{who}
            {latest.relation || "本人"}。
          </p>
        </div>
        <div className="home-voice-actions">
          <Link className="btn btn-primary" href="/record">
            继续录音
          </Link>
          <Link className="btn btn-ghost" href="/archive">
            声音档案
          </Link>
        </div>
      </div>
    </section>
  );
}

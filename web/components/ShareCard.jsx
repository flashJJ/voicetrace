"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const W = 1080;
const H = 1440;

function drawCard(canvas, story, quote) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = W;
  canvas.height = H;

  const paper = "#f6efe2";
  const ink = "#1f1b16";
  const soft = "#4f463c";
  const muted = "#7a6d5e";
  const cinnabar = "#a63a2b";
  const gold = "#b98a4b";
  const jade = "#2f5d50";

  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, H);

  // subtle paper grain
  for (let i = 0; i < 1600; i += 1) {
    ctx.fillStyle = `rgba(120, 96, 64, ${Math.random() * 0.035})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }

  // border
  ctx.strokeStyle = "rgba(31,27,22,0.22)";
  ctx.lineWidth = 2;
  ctx.strokeRect(56, 56, W - 112, H - 112);
  ctx.strokeStyle = "rgba(31,27,22,0.1)";
  ctx.strokeRect(72, 72, W - 144, H - 144);

  // header
  ctx.fillStyle = cinnabar;
  ctx.beginPath();
  ctx.arc(132, 150, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff8ec";
  ctx.font = '600 30px "Noto Serif SC", "Songti SC", serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("声", 132, 152);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = ink;
  ctx.font = '600 42px "Noto Serif SC", "Songti SC", serif';
  ctx.fillText("声迹", 190, 150);
  ctx.fillStyle = muted;
  ctx.font = '400 18px "Noto Sans SC", "PingFang SC", sans-serif';
  ctx.fillText("方言故事书 · DIALECT STORYBOOK", 190, 182);

  // dialect tag
  ctx.fillStyle = jade;
  ctx.font = '500 22px "Noto Sans SC", "PingFang SC", sans-serif';
  ctx.fillText(story.dialect, 96, 300);

  // title
  ctx.fillStyle = ink;
  ctx.font = '700 92px "Noto Serif SC", "Songti SC", serif';
  ctx.fillText(story.title, 92, 430);

  // subtitle
  ctx.fillStyle = soft;
  ctx.font = '400 28px "Noto Sans SC", "PingFang SC", sans-serif';
  ctx.fillText(story.subtitle, 96, 484);

  // divider
  ctx.strokeStyle = "rgba(31,27,22,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(96, 536);
  ctx.lineTo(W - 96, 536);
  ctx.stroke();

  // quote
  ctx.fillStyle = cinnabar;
  ctx.font = '700 116px "Noto Serif SC", "Songti SC", serif';
  ctx.fillText("“", 92, 700);

  ctx.fillStyle = ink;
  ctx.font = '600 56px "Noto Serif SC", "Songti SC", serif';
  const words = quote.split("");
  let line = "";
  let y = 790;
  const maxWidth = W - 220;
  words.forEach((char) => {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, 132, y);
      line = char;
      y += 84;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, 132, y);

  // seal
  ctx.save();
  ctx.translate(W - 190, 1080);
  ctx.rotate(-0.08);
  ctx.strokeStyle = cinnabar;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 74, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = cinnabar;
  ctx.font = '600 26px "Noto Serif SC", "Songti SC", serif';
  ctx.textAlign = "center";
  ctx.fillText("留住", 0, -12);
  ctx.fillText("把声", 0, 26);
  ctx.restore();

  // bottom
  ctx.textAlign = "left";
  ctx.fillStyle = soft;
  ctx.font = '400 24px "Noto Sans SC", "PingFang SC", sans-serif';
  ctx.fillText("把爷爷奶奶讲的故事，变成可以玩的方言互动书。", 96, 1190);

  ctx.fillStyle = muted;
  ctx.font = '400 20px "Noto Sans SC", "PingFang SC", sans-serif';
  ctx.fillText("声迹 · 方言故事书  |  TRAE 好应用大赏赛参赛原型", 96, 1240);

  // footer line
  ctx.strokeStyle = "rgba(31,27,22,0.18)";
  ctx.beginPath();
  ctx.moveTo(96, 1288);
  ctx.lineTo(W - 96, 1288);
  ctx.stroke();

  ctx.fillStyle = muted;
  ctx.font = '400 18px "Noto Sans SC", "PingFang SC", sans-serif';
  ctx.fillText("示例内容 · 正式版将替换为经授权的真实家庭故事", 96, 1330);

  // gold accent
  ctx.fillStyle = gold;
  ctx.fillRect(96, 1360, 120, 4);
}

export default function ShareCard({ story, quote }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) drawCard(canvasRef.current, story, quote || story.quote);
  }, [story, quote]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${story.title}-声音故事卡.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [story]);

  const copy = useCallback(async () => {
    const text = `${story.title}｜${story.quote}\n${story.dialect}\n—— 声迹 · 方言故事书`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [story]);

  return (
    <div>
      <div className="share-preview">
        <canvas ref={canvasRef} aria-label={`${story.title}声音故事卡预览`} />
      </div>
      <div className="share-actions" style={{ marginTop: 16 }}>
        <button type="button" className="btn btn-primary" onClick={download}>
          下载故事卡
        </button>
        <button type="button" className="btn btn-ghost" onClick={copy}>
          {copied ? "已复制" : "复制分享文案"}
        </button>
      </div>
    </div>
  );
}

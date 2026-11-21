"use client";

import { useEffect } from "react";

const BLOTS = ["blot-0.png", "blot-1.png", "blot-2.png", "blot-3.png"];
const DROPS = ["drop-0.png", "drop-1.png"];

export default function InkEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    root.style.setProperty(
      "--ink-cursor",
      `url("${basePath}/cursor/brush.png") 2 30, auto`
    );
    root.style.setProperty(
      "--ink-cursor-link",
      `url("${basePath}/cursor/brush-link.png") 2 30, pointer`
    );
    root.dataset.inkCursor = "on";

    const images = {};
    [...BLOTS, ...DROPS, "blot-red.png"].forEach((name) => {
      const img = new Image();
      img.src = `${basePath}/ink/${name}`;
      images[name] = img;
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let canvas = null;
    let ctx = null;
    let particles = [];
    let raf = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ensureCanvas = () => {
      if (canvas) return;
      canvas = document.createElement("canvas");
      canvas.className = "ink-splash-layer";
      canvas.setAttribute("aria-hidden", "true");
      document.body.appendChild(canvas);
      ctx = canvas.getContext("2d");
      resize();
      window.addEventListener("resize", resize);
    };

    const frame = (now) => {
      if (!ctx || !canvas) {
        raf = 0;
        return;
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles = particles.filter((p) => now - p.born < p.life);
      for (const p of particles) {
        const age = Math.max(0, now - p.born);
        const k = Math.min(1, age / p.life);
        const fadeIn = k < 0.12 ? k / 0.12 : 1;
        const alpha = p.alpha * fadeIn * (1 - k);
        const scale = p.scale * (1 + 0.2 * k);
        const img = images[p.name];
        if (!img || !img.complete) continue;
        const size = p.size * scale;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x + p.vx * age, p.y + p.vy * age);
        ctx.rotate(p.rot);
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
      }
      if (particles.length) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const splash = (event) => {
      if (reduce.matches) return;
      if (root.dataset.inkCursor !== "on") return;
      const target = event.target;
      if (target && target.closest && target.closest("[data-no-ink]")) return;
      if (
        target &&
        target.closest &&
        target.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }
      ensureCanvas();

      const now = performance.now();
      const touch = event.pointerType === "touch";
      const pick = (list) => list[Math.floor(Math.random() * list.length)];

      // 主墨团：柔边扩散，像宣纸吸墨
      particles.push({
        name: pick(BLOTS),
        x: event.clientX,
        y: event.clientY,
        size: touch ? 70 + Math.random() * 16 : 78 + Math.random() * 26,
        scale: 0.82,
        rot: Math.random() * Math.PI * 2,
        vx: 0,
        vy: 0,
        born: now,
        life: 760 + Math.random() * 140,
        alpha: 0.78,
      });

      // 淡淡的外晕，模拟洇开
      particles.push({
        name: pick(BLOTS),
        x: event.clientX,
        y: event.clientY,
        size: touch ? 140 : 180,
        scale: 0.9,
        rot: Math.random() * Math.PI * 2,
        vx: 0,
        vy: 0,
        born: now,
        life: 1000,
        alpha: 0.12,
      });

      // 少量墨点飞溅
      const count = touch ? 3 : 5;
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 12 + Math.random() * (touch ? 14 : 24);
        particles.push({
          name: pick(DROPS),
          x: event.clientX + Math.cos(angle) * dist,
          y: event.clientY + Math.sin(angle) * dist,
          size: 9 + Math.random() * (touch ? 5 : 7),
          scale: 0.9,
          rot: Math.random() * Math.PI * 2,
          vx: Math.cos(angle) * (0.015 + Math.random() * 0.035),
          vy: Math.sin(angle) * (0.015 + Math.random() * 0.035),
          born: now + Math.random() * 40,
          life: 420 + Math.random() * 220,
          alpha: 0.5,
        });
      }

      // 偶尔一点朱砂
      if (!touch && Math.random() < 0.12) {
        particles.push({
          name: "blot-red.png",
          x: event.clientX + (Math.random() - 0.5) * 40,
          y: event.clientY + (Math.random() - 0.5) * 40,
          size: 16 + Math.random() * 8,
          scale: 0.8,
          rot: Math.random() * Math.PI * 2,
          vx: 0,
          vy: 0,
          born: now + 30,
          life: 520,
          alpha: 0.35,
        });
      }

      if (!raf) raf = requestAnimationFrame(frame);
    };

    const clearAll = () => {
      particles = [];
      if (canvas && ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    window.addEventListener("pointerdown", splash, { passive: true });
    reduce.addEventListener("change", clearAll);

    return () => {
      window.removeEventListener("pointerdown", splash);
      reduce.removeEventListener("change", clearAll);
      window.removeEventListener("resize", resize);
      clearAll();
      if (canvas) canvas.remove();
      canvas = null;
      ctx = null;
      delete root.dataset.inkCursor;
    };
  }, []);

  return null;
}

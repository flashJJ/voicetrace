"use client";

import { useEffect } from "react";

const INK_RGB = [31, 27, 22];
const RED_RGB = [166, 58, 43];

function drawBlot(ctx, x, y, radius, seed, alpha, rgb) {
  ctx.beginPath();
  const points = 11;
  for (let i = 0; i <= points; i += 1) {
    const angle = (i / points) * Math.PI * 2;
    const wobble =
      1 + 0.24 * Math.sin(angle * 3 + seed) + 0.1 * Math.cos(angle * 5 - seed * 1.7);
    const px = x + Math.cos(angle) * radius * wobble;
    const py = y + Math.sin(angle) * radius * wobble;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  ctx.fill();
}

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
        const k = age / p.life;
        const alpha = (1 - k) * (p.red ? 0.45 : 0.5);
        const radius = p.r * (0.7 + k * 0.9);
        drawBlot(ctx, p.x + p.vx * age, p.y + p.vy * age, radius, p.seed, alpha, p.rgb);
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
      ensureCanvas();

      const now = performance.now();
      const touch = event.pointerType === "touch";
      const count = touch ? 6 : 9;
      particles.push({
        x: event.clientX,
        y: event.clientY,
        r: 11 + Math.random() * 6,
        vx: 0,
        vy: 0,
        born: now,
        life: 620,
        seed: Math.random() * 100,
        rgb: INK_RGB,
        red: false,
      });
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 8 + Math.random() * (touch ? 16 : 24);
        const red = !touch && Math.random() < 0.14;
        particles.push({
          x: event.clientX + Math.cos(angle) * dist,
          y: event.clientY + Math.sin(angle) * dist,
          r: 2.5 + Math.random() * (touch ? 6 : 9),
          vx: Math.cos(angle) * (0.02 + Math.random() * 0.05),
          vy: Math.sin(angle) * (0.02 + Math.random() * 0.05),
          born: now + Math.random() * 40,
          life: 460 + Math.random() * 240,
          seed: Math.random() * 100,
          rgb: red ? RED_RGB : INK_RGB,
          red,
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

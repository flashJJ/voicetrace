"use client";

import { useEffect } from "react";

const INK = "31, 27, 22";

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
        const k = Math.min(1, age / p.life);
        if (p.type === "dot") {
          const alpha = p.alpha * (1 - k);
          const radius = p.r * (1 + 0.8 * k);
          ctx.beginPath();
          ctx.fillStyle = `rgba(${INK}, ${alpha})`;
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const eased = 1 - Math.pow(1 - k, 2.4);
          const radius = p.r0 + (p.r1 - p.r0) * eased;
          const alpha = p.alpha * Math.pow(1 - k, 1.3);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${INK}, ${alpha})`;
          ctx.lineWidth = p.width * (1 - k * 0.4);
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
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
      particles.push({
        type: "dot",
        x: event.clientX,
        y: event.clientY,
        r: touch ? 2.4 : 2,
        born: now,
        life: 320,
        alpha: 0.32,
      });

      const waves = touch ? 2 : 3;
      for (let i = 0; i < waves; i += 1) {
        particles.push({
          type: "ring",
          x: event.clientX,
          y: event.clientY,
          r0: 4 + i * 5,
          r1: (touch ? 44 : 60) + i * 22,
          width: Math.max(0.7, 1.6 - i * 0.25),
          born: now + i * 90,
          life: 620 + i * 160,
          alpha: 0.34 - i * 0.06,
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

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="声迹首页" onClick={close}>
          <span className="brand-mark">声</span>
          <span>
            声迹
            <small>DIALECT STORYBOOK</small>
          </span>
        </Link>
        <button
          type="button"
          className={`nav-toggle ${open ? "is-open" : ""}`}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "关闭导航菜单" : "打开导航菜单"}
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="site-nav" className={`nav ${open ? "is-open" : ""}`} aria-label="主导航">
          <Link href="/stories" onClick={close}>
            故事馆
          </Link>
          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-trigger" aria-haspopup="true">
              创作 <span aria-hidden="true">▾</span>
            </button>
            <div className="nav-dropdown-menu">
              <Link href="/library" onClick={close}>
                资料库
              </Link>
              <Link href="/studio" onClick={close}>
                AI 工坊
              </Link>
              <Link href="/demo" onClick={close}>
                演示
              </Link>
            </div>
          </div>
          <Link href="/map" onClick={close}>
            声音地图
          </Link>
          <Link href="/about" onClick={close}>
            关于
          </Link>
          <Link href="/stories/moonlight" className="nav-cta" onClick={close}>
            听一个故事
          </Link>
        </nav>
      </div>
    </header>
  );
}

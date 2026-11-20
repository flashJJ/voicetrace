"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LIVE_STUDIO_URL, isStaticExport } from "../lib/live";
import { LOCALES, useLocale } from "./LocaleProvider";

const COPY = {
  zh: {
    brand: "声迹",
    brandSub: "DIALECT STORYBOOK",
    home: "声迹首页",
    kidsHome: "儿童模式首页",
    openMenu: "打开导航菜单",
    closeMenu: "关闭导航菜单",
    nav: "主导航",
    kidsStories: "儿童故事",
    myRecordings: "我的录音",
    parent: "家长说明",
    stories: "故事馆",
    kids: "儿童模式",
    create: "创作",
    record: "录音棚",
    archive: "我的声音",
    library: "资料库",
    studio: "AI 工坊",
    demo: "演示",
    map: "声音地图",
    about: "关于",
    listen: "听一个故事",
    language: "语言",
  },
  en: {
    brand: "VoiceTrace",
    brandSub: "CANTONESE STORYBOOK",
    home: "VoiceTrace home",
    kidsHome: "Kids home",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    nav: "Main navigation",
    kidsStories: "Kids stories",
    myRecordings: "My recordings",
    parent: "For parents",
    stories: "Stories",
    kids: "Kids",
    create: "Create",
    record: "Recorder",
    archive: "My voice",
    library: "Library",
    studio: "AI Studio",
    demo: "Demo",
    map: "Sound map",
    about: "About",
    listen: "Listen to a story",
    language: "Language",
  },
};

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const pathname = usePathname();
  const { locale, setLocale, pick } = useLocale();
  const c = pick(COPY);
  const inKids = pathname?.startsWith("/kids");
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
        <Link
          href={inKids ? "/kids" : "/"}
          className="brand"
          aria-label={inKids ? c.kidsHome : c.home}
          onClick={close}
        >
          <span className="brand-mark">{locale === "en" ? "V" : "声"}</span>
          <span>
            {c.brand}
            <small>{c.brandSub}</small>
          </span>
        </Link>
        <button
          type="button"
          className={`nav-toggle ${open ? "is-open" : ""}`}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? c.closeMenu : c.openMenu}
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="site-nav" className={`nav ${open ? "is-open" : ""}`} aria-label={c.nav}>
          {inKids ? (
            <>
              <Link href="/kids" onClick={close}>
                {c.kidsStories}
              </Link>
              <Link href="/archive" onClick={close}>
                {c.myRecordings}
              </Link>
              <Link href="/kids/parent" className="nav-cta" onClick={close}>
                {c.parent}
              </Link>
            </>
          ) : (
            <>
              <Link href="/stories" onClick={close}>
                {c.stories}
              </Link>
              <Link href="/kids" onClick={close}>
                {c.kids}
              </Link>
              <div className="nav-dropdown">
                <button type="button" className="nav-dropdown-trigger" aria-haspopup="true">
                  {c.create} <span aria-hidden="true">▾</span>
                </button>
                <div className="nav-dropdown-menu">
                  <Link href="/record" onClick={close}>
                    {c.record}
                  </Link>
                  <Link href="/archive" onClick={close}>
                    {c.archive}
                  </Link>
                  <Link href="/library" onClick={close}>
                    {c.library}
                  </Link>
                  {isStaticExport ? (
                    <a href={LIVE_STUDIO_URL} target="_blank" rel="noreferrer" onClick={close}>
                      {c.studio} ↗
                    </a>
                  ) : (
                    <Link href="/studio" onClick={close}>
                      {c.studio}
                    </Link>
                  )}
                  <Link href="/demo" onClick={close}>
                    {c.demo}
                  </Link>
                </div>
              </div>
              <Link href="/map" onClick={close}>
                {c.map}
              </Link>
              <Link href="/about" onClick={close}>
                {c.about}
              </Link>
              <Link href="/stories/moonlight" className="nav-cta" onClick={close}>
                {c.listen}
              </Link>
            </>
          )}
          <div className="locale-switch" role="group" aria-label={c.language}>
            {LOCALES.map((item) => (
              <button
                type="button"
                key={item.key}
                className={locale === item.key ? "is-active" : ""}
                aria-pressed={locale === item.key}
                title={item.label}
                onClick={() => setLocale(item.key)}
              >
                {item.short}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

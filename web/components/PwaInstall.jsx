"use client";

import { useEffect, useState } from "react";
import { useLocale } from "./LocaleProvider";

const DISMISS_KEY = "voicetrace:install-dismissed";

const COPY = {
  zh: {
    title: "把声迹装到主屏",
    text: "装好后离线也能听故事，打开就是全屏。",
    install: "安装",
    later: "以后再说",
    banner: "安装声迹",
  },
  en: {
    title: "Add VoiceTrace to your home screen",
    text: "Stories work offline, and the app opens full screen.",
    install: "Install",
    later: "Not now",
    banner: "Install VoiceTrace",
  },
};

export default function PwaInstall() {
  const { pick } = useLocale();
  const c = pick(COPY);
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia("(display-mode: standalone)").matches) return undefined;
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === "1") return undefined;
    } catch (error) {
      // 隐私模式下仍可显示安装提示。
    }

    const handler = (event) => {
      event.preventDefault();
      setPrompt(event);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const onInstalled = () => {
      setVisible(false);
      setPrompt(null);
    };
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch (error) {
      // 写不进去也不影响当前会话。
    }
  };

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    setPrompt(null);
    setVisible(false);
    if (choice?.outcome === "dismissed") {
      try {
        window.localStorage.setItem(DISMISS_KEY, "1");
      } catch (error) {
        // 忽略写入失败。
      }
    }
  };

  if (!visible || !prompt) return null;

  return (
    <div className="pwa-install" role="region" aria-label={c.banner}>
      <div className="pwa-install-copy">
        <strong>{c.title}</strong>
        <span>{c.text}</span>
      </div>
      <div className="pwa-install-actions">
        <button type="button" className="btn btn-primary" onClick={install}>
          {c.install}
        </button>
        <button type="button" className="btn btn-ghost" onClick={dismiss}>
          {c.later}
        </button>
      </div>
    </div>
  );
}

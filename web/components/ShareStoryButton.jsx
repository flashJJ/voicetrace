"use client";

import { useState } from "react";
import { useLocale } from "./LocaleProvider";

const COPY = {
  zh: {
    share: "分享这个故事",
    copied: "链接已复制",
    text: (title) => `一起听《${title}》`,
    failed: "复制失败，请手动复制地址栏链接。",
  },
  en: {
    share: "Share this story",
    copied: "Link copied",
    text: (title) => `Listen to “${title}” together`,
    failed: "Copy failed. Please copy the address bar link manually.",
  },
};

export default function ShareStoryButton({ title }) {
  const { pick } = useLocale();
  const c = pick(COPY);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const share = async () => {
    const url = window.location.href;
    setFailed(false);
    if (navigator.share) {
      try {
        await navigator.share({ title, text: c.text(title), url });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setFailed(true);
    }
  };

  return (
    <button type="button" className="btn btn-ghost" onClick={share}>
      {copied ? c.copied : c.share}
      {failed ? <span className="share-failed">{c.failed}</span> : null}
    </button>
  );
}

"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";

const COPY = {
  zh: {
    brand: "声迹 · 方言故事书",
    text: "声迹是 TRAE 好应用大赏赛参赛原型。示例故事含公有领域改编与虚构示例，正式版将替换为经授权的真实家庭故事。录音与故事可随时删除，AI 合成音会明确标注。",
    stories: "故事馆",
    map: "声音地图",
    about: "关于与隐私",
    contact: "联系我们",
  },
  en: {
    brand: "VoiceTrace · Cantonese Storybook",
    text: "VoiceTrace is a contest prototype. Stories include public-domain adaptations and fictional examples; a future release will use authorized family stories. Recordings and stories can be deleted at any time, and synthetic audio is clearly labeled.",
    stories: "Stories",
    map: "Sound map",
    about: "About & privacy",
    contact: "Contact",
  },
};

export default function SiteFooter() {
  const { pick } = useLocale();
  const c = pick(COPY);

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">{c.brand}</div>
          <p className="footer-text">{c.text}</p>
        </div>
        <div className="footer-links">
          <Link href="/stories">{c.stories}</Link>
          <Link href="/map">{c.map}</Link>
          <Link href="/about">{c.about}</Link>
          <a href="mailto:hello@voicetrace.example">{c.contact}</a>
        </div>
      </div>
    </footer>
  );
}

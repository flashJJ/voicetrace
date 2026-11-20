"use client";

import StoryMap from "../../components/StoryMap";
import { useLocale } from "../../components/LocaleProvider";

const COPY = {
  zh: {
    eyebrow: "声音地图",
    title: "每个故事，都有一个发生的地方。",
    lede: "西关的骑楼、珠三角的巷口、广州河南的码头。故事不只属于时间，也属于地方。点一个 pin，听一段乡音。",
    sourceNote: "",
  },
  en: {
    eyebrow: "SOUND MAP",
    title: "Every story happens somewhere.",
    lede: "The arcades of Xiguan, the alley mouths of the Pearl River Delta, the wharves of Henan in Guangzhou. Stories belong to places as much as to times. Tap a pin and hear a bit of home dialect.",
    sourceNote: "Source material is shown in its original Chinese.",
  },
};

export default function MapPage() {
  const { pick } = useLocale();
  const c = pick(COPY);

  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1 className="page-title">{c.title}</h1>
        <p className="page-lede">{c.lede}</p>
        {c.sourceNote ? <p className="notice">{c.sourceNote}</p> : null}
      </section>
      <div className="container">
        <StoryMap />
      </div>
    </>
  );
}

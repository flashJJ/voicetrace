"use client";

import Link from "next/link";
import { featuredStories, stories, storyModes, heroImage, whyImage } from "../lib/stories";
import StoryCard from "../components/StoryCard";
import VoiceMoment from "../components/VoiceMoment";
import HomeVoice from "../components/HomeVoice";
import CinematicIntro from "../components/CinematicIntro";
import { useLocale } from "../components/LocaleProvider";

const COPY = {
  zh: {
    eyebrow: "方言故事书 · 第一季",
    heroLine1: "趁还会唱，",
    heroPre: "把乡音",
    heroEm: "留下来",
    heroPost: "。",
    heroLede:
      "很多家庭都有一把这样的声音：会唱童谣，会讲旧事，却只响在饭桌上。声迹把它做成可以点、可以听、可以分享的互动故事书——原声是主角，AI 只负责让你听懂它。",
    heroPrivacy: "无需注册 · 录音只存本机 · 无广告与第三方统计",
    listenMoonlight: "听《月光光》",
    why: "为什么做声迹",
    heroAlt: "西关骑楼下的阿婆",
    seal: "留住\n把声",
    storiesEyebrow: "故事馆",
    storiesTitle: (count) => `${count} 个故事，三种乡音`,
    storiesDesc:
      "先从一段童谣、一个民间故事、一碗艇仔粥开始。每个故事 3-8 幕，两三个选择，最后留下一张可以发给家人的声音卡。",
    modesEyebrow: "三种模式",
    modesTitle: "正经、鬼故事、野史",
    modesDesc:
      "同一个广州，可以讲给阿妈听，也可以讲给半夜不睡的朋友听。三种语气，三种受众，同一批地方记忆。",
    modeCount: (count) => `${count} 个故事`,
    howEyebrow: "怎么玩",
    howTitle: "录一段音，然后让它活起来",
    howDesc: "不需要会写代码，也不需要会剪视频。你只需要一段真实的方言录音，剩下的交给声迹。",
    step1Title: "录一段音",
    step1Text: "用手机录下长辈讲的一个故事、一首童谣，或者一句家常话。1-3 分钟就够，原声最重要。",
    step2Title: "让 AI 听懂它",
    step2Text: "自动转写、普通话翻译、方言词注释。你只需要校对，不用逐字打出来。",
    step3Title: "变成一本可以玩的书",
    step3Text: "3-8 幕剧情、两三个选择、两个结局。读完生成一张声音故事卡，发给那个你想念的人。",
    whyEyebrow: "为什么做声迹",
    quotePre: "方言不是一种“落后的普通话”，它是",
    quoteEm: "一个人回家的路",
    quotePost: "。",
    whyText1:
      "我们总以为老人会一直在，故事会一直有人讲。直到有一天，你想录下那个声音，却发现已经来不及了。",
    whyText2:
      "声迹想做的不是方言工具，而是一个家庭的声音抽屉：把那些饭桌上、骑楼下、码头边的故事，好好收起来。",
    stat1: "个故事",
    stat2: "3-8 幕 / 2 个结局",
    stat3: "张可以分享的声音卡",
    listenEyebrow: "现在就听",
    listenTitle: "你有多久，没听过阿婆讲故事了？",
    listenDesc: "从《月光光》开始。三分钟，听完一段月光，也听完一段乡音。",
    startReading: "开始阅读",
    manifestoAlt: "旧录音机与手写菜谱",
  },
  en: {
    eyebrow: "CANTONESE STORYBOOK · SEASON ONE",
    heroLine1: "Keep the voice",
    heroPre: "before it ",
    heroEm: "fades",
    heroPost: " away.",
    heroLede:
      "Many families have a voice like this: it can sing nursery rhymes and tell old stories, but it only sounds at the dinner table. VoiceTrace turns it into an interactive storybook you can tap, hear, and share. The real voice leads; AI only helps you understand it.",
    heroPrivacy: "No sign-up · Recordings stay on this device · No ads or third-party analytics",
    listenMoonlight: "Hear “Moonlight Bright”",
    why: "Why VoiceTrace",
    heroAlt: "A grandmother under the arcades of Xiguan",
    seal: "KEEP\nTHE VOICE",
    storiesEyebrow: "Stories",
    storiesTitle: (count) => `${count} stories, three voices`,
    storiesDesc:
      "Start with a nursery rhyme, a folk tale, or a bowl of congee. Each story runs 3-8 acts with a few choices and a shareable voice card at the end.",
    modesEyebrow: "Three modes",
    modesTitle: "Heritage, ghost stories, hearsay",
    modesDesc:
      "The same Guangzhou can be told to your mother, or to a friend who stays up late. Three tones, three audiences, one pool of local memory.",
    modeCount: (count) => `${count} stories`,
    howEyebrow: "How it works",
    howTitle: "Record a voice, then let it live",
    howDesc: "No coding and no video editing. All you need is a real dialect recording; VoiceTrace handles the rest.",
    step1Title: "Record a voice",
    step1Text: "Use your phone to record a story, a rhyme, or a family phrase. One to three minutes is enough.",
    step2Title: "Let AI understand it",
    step2Text: "Automatic transcription, Mandarin translation, and glossary notes. You only proofread.",
    step3Title: "Turn it into a playable book",
    step3Text: "3-8 acts, a few choices, and two endings. Finish it and share a voice card with someone you miss.",
    whyEyebrow: "Why VoiceTrace",
    quotePre: "A dialect is not “a backwards Mandarin”. It is ",
    quoteEm: "the road home",
    quotePost: ".",
    whyText1:
      "We assume grandparents will always be there and stories will always be told. Then one day you want to record that voice, and it is too late.",
    whyText2:
      "VoiceTrace is not a translation tool. It is a family voice drawer: keeping the stories from dinner tables, arcades, and ferry piers in one place.",
    stat1: "stories",
    stat2: "3-8 acts / 2 endings",
    stat3: "shareable voice card",
    listenEyebrow: "Listen now",
    listenTitle: "How long has it been since you heard Grandma tell a story?",
    listenDesc: "Start with “Moonlight Bright”. Three minutes, a patch of moonlight, and a piece of home.",
    startReading: "Start reading",
    manifestoAlt: "An old recorder and a handwritten recipe",
  },
};

export default function HomePage() {
  const { locale, pick } = useLocale();
  const c = pick(COPY);
  const sealLines = c.seal.split("\n");

  return (
    <>
      <CinematicIntro />
      <section className="container hero">
        <div className="hero-copy">
          <span className="eyebrow fade-in">{c.eyebrow}</span>
          <h1 className="hero-title fade-in-delay">
            {c.heroLine1}
            <br />
            {c.heroPre}
            <em>{c.heroEm}</em>
            {c.heroPost}
          </h1>
          <p className="hero-lede fade-in-delay-2">{c.heroLede}</p>
          <p className="hero-privacy fade-in-delay-2">{c.heroPrivacy}</p>
          <div className="hero-actions fade-in-delay-2">
            <Link className="btn btn-primary" href="/stories/moonlight">
              {c.listenMoonlight} <span aria-hidden="true">→</span>
            </Link>
            <Link className="btn btn-ghost" href="/about">
              {c.why}
            </Link>
          </div>
        </div>
        <div className="hero-visual fade-in-delay">
          <img
            className="hero-image"
            src={heroImage}
            alt={c.heroAlt}
            width="900"
            height="505"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="seal">
            {sealLines[0]}
            <br />
            {sealLines[1]}
          </div>
          <VoiceMoment />
        </div>
      </section>

      <HomeVoice />

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{c.storiesEyebrow}</span>
              <h2 className="section-title">{c.storiesTitle(stories.length)}</h2>
            </div>
            <p className="section-desc">{c.storiesDesc}</p>
          </div>
          <div className="story-grid">
            {featuredStories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{c.modesEyebrow}</span>
              <h2 className="section-title">{c.modesTitle}</h2>
            </div>
            <p className="section-desc">{c.modesDesc}</p>
          </div>
          <div className="steps">
            {storyModes.map((mode, index) => {
              const count = stories.filter((story) => story.mode === mode.key).length;
              return (
                <Link className="step mode-home-card" href={`/stories#${mode.key}`} key={mode.key}>
                  <div className="step-number">0{index + 1}</div>
                  <h3>{locale === "en" ? mode.enLabel : mode.label}</h3>
                  <p>{locale === "en" ? mode.enDescription : mode.description}</p>
                  <span className="story-link">
                    {c.modeCount(count)} <span aria-hidden="true">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{c.howEyebrow}</span>
              <h2 className="section-title">{c.howTitle}</h2>
            </div>
            <p className="section-desc">{c.howDesc}</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <h3>{c.step1Title}</h3>
              <p>{c.step1Text}</p>
            </div>
            <div className="step">
              <div className="step-number">02</div>
              <h3>{c.step2Title}</h3>
              <p>{c.step2Text}</p>
            </div>
            <div className="step">
              <div className="step-number">03</div>
              <h3>{c.step3Title}</h3>
              <p>{c.step3Text}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container manifesto">
        <img
          className="manifesto-image"
          src={whyImage}
          alt={c.manifestoAlt}
          width="900"
          height="675"
          loading="lazy"
          decoding="async"
        />
        <div>
          <span className="eyebrow">{c.whyEyebrow}</span>
          <p className="manifesto-quote">
            {c.quotePre}
            <em>{c.quoteEm}</em>
            {c.quotePost}
          </p>
          <p>{c.whyText1}</p>
          <p>{c.whyText2}</p>
          <div className="stats">
            <div className="stat">
              <strong>{stories.length}</strong>
              <span>{c.stat1}</span>
            </div>
            <div className="stat">
              <strong>3-8</strong>
              <span>{c.stat2}</span>
            </div>
            <div className="stat">
              <strong>1</strong>
              <span>{c.stat3}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            {c.listenEyebrow}
          </span>
          <h2 className="section-title" style={{ marginBottom: 18 }}>
            {c.listenTitle}
          </h2>
          <p className="section-desc" style={{ justifySelf: "center", margin: "0 auto 28px" }}>
            {c.listenDesc}
          </p>
          <Link className="btn btn-primary" href="/stories/moonlight">
            {c.startReading} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

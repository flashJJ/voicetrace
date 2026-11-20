"use client";

import Link from "next/link";
import AudioButton from "../../components/AudioButton";
import { voiceSamples } from "../../lib/voice-samples";
import { useLocale } from "../../components/LocaleProvider";

const COPY = {
  zh: {
    eyebrow: "关于声迹",
    quoteLine1: "我们不想做方言翻译器，",
    quotePre: "我们想做一个",
    quoteStrong: "家庭的声音抽屉",
    quotePost: "。",
    intro1:
      "声迹的起点很简单：外婆讲了一个很长的故事，我听得懂一半，笑了一半。后来想再听，才发现没有录下来。",
    intro2Pre: "市面上的方言产品，大多在解决“听不懂”的问题：翻译、朗读、识别。但还有另一个问题没人解决：",
    intro2Strong: "那些声音，怎么留下来？",
    intro3:
      "声迹把一段真实录音，变成 3-8 幕互动故事：你可以听原声、看翻译、点开方言词，最后带走一张声音卡。它不替代老人，也不生成虚构故事，只是把真实的声音整理成可以传下去的样子。",
    tags: ["TRAE 好应用大赏赛", "游戏娱乐 / 文化体验", "粤语 · 第一季", "原型版本"],
    samplesTitle: "真人粤语样本",
    samplesText:
      "下面三段不是合成音，来自香港社区粤语读本项目「冚唪唥」，由真人朗读、以 CC BY 4.0 授权。我们只做了裁剪与响度归一化，用来说明「原声」应该是什么质感；它们不是本站故事的录音。",
    play: (sample) => `播放${sample.title} · ${sample.reader}`,
    source: "原始页面 ↗",
    license:
      "音频版权归原作者与朗读者所有，依 CC BY 4.0 使用；已裁剪至 60-90 秒并统一响度，完整录音见各段来源页。",
    howTitle: "我们怎么做",
    howItems: [
      { strong: "原声优先：", text: "真实录音是主角；AI 只做转写、翻译、注释和辅助朗读。" },
      {
        strong: "多幕互动：",
        text: "故事 3-8 幕随机，每幕一到两个选择、两个结局，让听故事变成参与故事。",
      },
      { strong: "声音地图：", text: "把故事钉在发生的地方，形成家庭/社区的地方记忆。" },
      { strong: "可分享：", text: "生成声音故事卡，发给家人朋友，而不是看完即走。" },
    ],
    privacyTitle: "录音、隐私与授权",
    privacyItems: [
      "录音前会说明用途：用于生成故事、可能在作品页展示；不会用于训练模型。",
      "需要讲述者本人同意；涉及第三方故事时，需取得相关授权。",
      "故事中不展示真实姓名、住址、电话等个人信息；可用“阿婆/外公”等称呼。",
      "本机录音：录音棚里的音频只保存在这台设备的浏览器里，声迹服务器不接收录音；换设备需要手动导出任务包或完整档案。",
      "自动转写：使用浏览器自带的语音服务（Chrome / Edge 支持），开启时音频可能发送给浏览器厂商；可以在录音棚关闭，改为手动输入。",
      "录音与故事可随时删除；删除会同时移除本机音频与转写，无法恢复。",
      "AI 合成音会明确标注；不会用 AI 冒充真实人物。",
    ],
    prototypeTitle: "关于这个原型",
    prototype1:
      "当前版本是 TRAE 好应用大赏赛的参赛原型，共 25 个互动故事，长度 3-8 幕：既有《月光光》《老鼠娶亲》这样的公有领域改编，也有广州地方传说、民俗与野史。现在已经加入本地录音棚、逐句转写校对、家庭任务包与简体/繁体/英文切换；云端上传、账号与自动转写会在赛后版本补上。",
    prototype2: "如果你是粤语使用者，或者你家里也有一位爱讲故事的老人，欢迎告诉我们。我们想找到第一批真实故事。",
    cta: "先听一个故事",
    techTitle: "技术说明",
    techText:
      "前端使用 Next.js + React；默认语音使用浏览器语音合成，并附 3 段 CC BY 4.0 真人粤语样本；正式版计划接入 CosyVoice/FunASR 等方言语音能力。互动故事使用轻量 JSON 剧情结构，不依赖重型游戏引擎。",
  },
  en: {
    eyebrow: "ABOUT VOICETRACE",
    quoteLine1: "We are not building a dialect translator.",
    quotePre: "We are building a ",
    quoteStrong: "family voice drawer",
    quotePost: ".",
    intro1:
      "VoiceTrace started with something simple: my grandmother told a long story. I understood half of it and laughed at half of it. When I wanted to hear it again, it had never been recorded.",
    intro2Pre:
      "Most dialect products solve the problem of not understanding: translation, read-aloud, recognition. But another problem goes unsolved: ",
    intro2Strong: "how do we keep those voices?",
    intro3:
      "VoiceTrace turns a real recording into a 3-8 act interactive story. You can hear the original voice, read a translation, tap dialect words, and leave with a voice card. It does not replace an elder or invent stories; it simply arranges a real voice so it can be passed on.",
    tags: ["TRAE App Awards", "Games & culture", "Cantonese · Season One", "Prototype"],
    samplesTitle: "Real Cantonese samples",
    samplesText:
      "These three clips are not synthetic. They come from the Hong Kong community Cantonese reading project Ham Baang Laang, read by real people and licensed under CC BY 4.0. We only trimmed and normalized them to show what an original voice should feel like; they are not recordings from this site's stories.",
    play: (sample) => `Play ${sample.enTitle} · ${sample.reader}`,
    source: "Source page ↗",
    license:
      "Audio rights belong to the writers and readers, used under CC BY 4.0. Clips are trimmed to 60-90 seconds with normalized loudness; full recordings are on each source page.",
    howTitle: "How we build it",
    howItems: [
      {
        strong: "Original voice first:",
        text: "A real recording leads; AI only transcribes, translates, annotates, and assists playback.",
      },
      {
        strong: "Multi-act interaction:",
        text: "3-8 acts, one or two choices per act, and two endings, so listening becomes taking part.",
      },
      {
        strong: "Voice map:",
        text: "Stories are pinned to the places they happened, forming family and community memory.",
      },
      {
        strong: "Shareable:",
        text: "A voice story card can be sent to family and friends instead of ending with the last tap.",
      },
    ],
    privacyTitle: "Recording, privacy, and consent",
    privacyItems: [
      "Before recording, we explain the purpose: creating stories, possibly shown on the story page, never used to train models.",
      "The storyteller's consent is required; third-party stories need the relevant permissions.",
      "Stories never show real names, addresses, or phone numbers; “Grandma” or “Grandpa” is enough.",
      "On-device recordings: audio from the studio is stored only in this device's browser. VoiceTrace servers never receive it; switching devices requires exporting a task pack or full archive manually.",
      "Automatic transcription: uses the browser's speech service (Chrome / Edge). When enabled, audio may be sent to the browser vendor; it can be turned off in the studio in favor of typing.",
      "Recordings and stories can be deleted anytime; deletion removes both local audio and transcript and cannot be undone.",
      "AI-generated audio is clearly labeled and never impersonates a real person.",
    ],
    prototypeTitle: "About this prototype",
    prototype1:
      "This is the prototype submitted to the TRAE App Awards: 25 interactive stories of 3-8 acts, mixing public-domain adaptations such as “Moonlight Bright” and “The Mouse Wedding” with Guangzhou legends, folk customs, and hearsay. It now includes a local recording studio, line-by-line transcript proofreading, family task packs, and Simplified Chinese / Traditional Chinese / English switching. Cloud upload, accounts, and automatic transcription will follow after the contest.",
    prototype2:
      "If you speak Cantonese, or if there is an elder in your family who loves telling stories, we would love to hear from you. We are looking for the first real stories.",
    cta: "Listen to a story",
    techTitle: "Technical notes",
    techText:
      "The frontend uses Next.js + React. Default audio uses browser speech synthesis, with three real Cantonese samples under CC BY 4.0. A future release plans to integrate dialect speech tools such as CosyVoice and FunASR. Interactive stories use a lightweight JSON narrative structure with no heavy game engine.",
  },
};

export default function AboutPage() {
  const { locale, localize, pick } = useLocale();
  const c = pick(COPY);
  const sampleTitle = (sample) =>
    locale === "en" ? sample.enTitle : localize(sample.title);
  const sampleNote = (sample) =>
    locale === "en" ? sample.enNote : localize(sample.note);
  const sampleDuration = (sample) =>
    locale === "en" ? sample.enDuration : localize(sample.duration);

  return (
    <div className="container about-layout">
      <div className="about-copy">
        <span className="eyebrow">{c.eyebrow}</span>
        <p className="about-quote">
          {c.quoteLine1}
          <br />
          {c.quotePre}
          <strong>{c.quoteStrong}</strong>
          {c.quotePost}
        </p>
        <p>{c.intro1}</p>
        <p>
          {c.intro2Pre}
          <strong>{c.intro2Strong}</strong>
        </p>
        <p>{c.intro3}</p>
        <div className="tag-row">
          {c.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <section className="about-card about-card-left">
          <h2>{c.samplesTitle}</h2>
          <p>{c.samplesText}</p>
          <ul className="voice-list">
            {voiceSamples.map((sample) => (
              <li className="voice-item" key={sample.id}>
                <div className="voice-head">
                  <strong>{sampleTitle(sample)}</strong>
                  <span>{sampleDuration(sample)}</span>
                </div>
                <p className="voice-note">{sampleNote(sample)}</p>
                <AudioButton
                  audioUrl={sample.src}
                  label={c.play(sample)}
                  hint={`${sample.credit} · CC BY 4.0`}
                />
                <a
                  className="voice-source"
                  href={sample.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {c.source}
                </a>
              </li>
            ))}
          </ul>
          <p className="voice-license">{c.license}</p>
        </section>
      </div>

      <div>
        <section className="about-card">
          <h2>{c.howTitle}</h2>
          <ul>
            {c.howItems.map((item) => (
              <li key={item.strong}>
                <strong>{item.strong}</strong>
                {item.text}
              </li>
            ))}
          </ul>
        </section>

        <section className="about-card">
          <h2>{c.privacyTitle}</h2>
          <ul>
            {c.privacyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="about-card">
          <h2>{c.prototypeTitle}</h2>
          <p>{c.prototype1}</p>
          <p>{c.prototype2}</p>
          <Link className="btn btn-primary" href="/stories/moonlight">
            {c.cta} <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className="about-card">
          <h2>{c.techTitle}</h2>
          <p>{c.techText}</p>
        </section>
      </div>
    </div>
  );
}

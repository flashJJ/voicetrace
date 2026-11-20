"use client";

import Link from "next/link";
import KidsExitGate from "../../../components/KidsExitGate";
import KidProgressPanel from "../../../components/KidProgressPanel";
import { kidStories } from "../../../lib/kids";
import { useLocale } from "../../../components/LocaleProvider";

const COPY = {
  zh: {
    eyebrow: "家长说明",
    title: "给孩子听之前，先看这一页。",
    lede: "儿童模式是给 4-9 岁孩子和家长的粤语启蒙入口。它和成人模式共用故事库，但只展示经过筛选的适龄内容。",
    ageTitle: "适龄与内容",
    ageItems: [
      "4-6 岁：童谣、动物、短故事，建议家长带着读。",
      "6-9 岁：有选择和情节的故事，可以自己读，也可以亲子共读。",
      "鬼故事、野史和 AI 工坊不会出现在儿童模式。",
      "《清明·拜山》《光孝寺的菩提》等涉及祭祖或宗教传说，标注「家长陪同」。",
      (count) => `当前共有 ${count} 个适龄故事。`,
    ],
    privacyTitle: "录音与隐私",
    privacyItems: [
      "跟读练习录音：只在当前页面录制和回放，不保存，换一幕会清空。",
      "家庭正式录音：保存在这台设备的浏览器里，声迹服务器不接收；可试听、删除和导出。",
      "自动转写：可选，由浏览器语音服务完成，音频可能发送给浏览器厂商，可在录音棚关闭。",
      "删除录音会同时删除本机音频和转写，无法恢复；没有账号、上传和社交功能。",
    ],
    manageTitle: "怎么管理",
    manageItems: [
      "录音与转写：进入「声音档案」查看、试听、删除。",
      "学习记录：在下面查看每个故事读了几幕、跟读几段、认识几个词，可单独或全部清除；换手机不会自动同步。",
      "换设备：先在档案页导出完整档案，再在新设备导入；学习记录不支持跨设备同步。",
      "回到成人模式：点右上角「家长说明」，在页面底部由家长完成确认。",
    ],
    progressTitle: "孩子的学习记录",
    progressText: "学习记录只保存在这台设备的浏览器里，不上传服务器，也不做账号和排名。清除记录不会删除录音。",
    goKids: "去儿童故事",
    archive: "声音档案",
    exitTitle: "离开儿童模式",
    exitText: "为了避免孩子误点，请家长完成下面的确认。",
  },
  en: {
    eyebrow: "For grown-ups",
    title: "Before your child listens, read this page.",
    lede: "Kids mode is a Cantonese entry point for children aged 4-9 and their grown-ups. It shares the story library with adult mode but only shows curated, age-appropriate content.",
    ageTitle: "Ages and content",
    ageItems: [
      "Ages 4-6: rhymes, animals, and short stories. Grown-ups should read along.",
      "Ages 6-9: stories with choices and plot. Children can read alone or together with a grown-up.",
      "Ghost stories, hearsay, and the AI studio never appear in kids mode.",
      "Stories touching on ancestor rites or religious legends, such as “Qingming · Grave Sweeping” and “The Bodhi Tree of Guangxiao Temple”, are marked “With a grown-up”.",
      (count) => `There are currently ${count} age-appropriate stories.`,
    ],
    privacyTitle: "Recordings and privacy",
    privacyItems: [
      "Read-along practice: recorded and played back only on this page, never saved, and cleared when you change acts.",
      "Family recordings: stored in this device's browser. VoiceTrace servers never receive them; you can play, delete, and export them.",
      "Automatic transcription: optional, handled by the browser's speech service. Audio may be sent to the browser vendor; it can be turned off in the studio.",
      "Deleting a recording removes both the local audio and transcript, and cannot be undone. There are no accounts, uploads, or social features.",
    ],
    manageTitle: "How to manage",
    manageItems: [
      "Recordings and transcripts: open the voice archive to listen, review, and delete.",
      "Learning records: below you can see acts read, read-alongs, and words learned per story, and clear one or all. They do not sync across phones.",
      "Switching devices: export a full archive on the old device, then import it on the new one. Learning records do not transfer.",
      "Back to adult mode: tap “For grown-ups” in the header, then complete the check at the bottom of this page.",
    ],
    progressTitle: "Your child's learning records",
    progressText: "Learning records stay in this device's browser. They are never uploaded, and there are no accounts or rankings. Clearing records does not delete recordings.",
    goKids: "Go to kids stories",
    archive: "Voice archive",
    exitTitle: "Leaving kids mode",
    exitText: "To prevent accidental taps by children, please complete the check below.",
  },
};

export default function KidsParentPage() {
  const { pick } = useLocale();
  const c = pick(COPY);
  const total = kidStories().length;

  return (
    <main className="container kids-page kids-parent-page">
      <section className="kids-hero">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1>{c.title}</h1>
        <p>{c.lede}</p>
      </section>

      <section className="kids-parent-card kids-parent-block">
        <h2>{c.ageTitle}</h2>
        <ul>
          {c.ageItems.map((item) => (
            <li key={typeof item === "function" ? "count" : item}>
              {typeof item === "function" ? item(total) : item}
            </li>
          ))}
        </ul>
      </section>

      <section className="kids-parent-card kids-parent-block">
        <h2>{c.privacyTitle}</h2>
        <ul>
          {c.privacyItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="kids-parent-card kids-parent-block">
        <h2>{c.manageTitle}</h2>
        <ul>
          {c.manageItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="kids-parent-card kids-parent-block">
        <h2>{c.progressTitle}</h2>
        <p>{c.progressText}</p>
        <KidProgressPanel />
      </section>

      <div className="kids-hero-actions">
        <Link className="btn btn-primary" href="/kids">
          {c.goKids}
        </Link>
        <Link className="btn btn-ghost" href="/archive">
          {c.archive}
        </Link>
      </div>

      <section className="kids-parent-card kids-parent-block kids-exit-section">
        <h2>{c.exitTitle}</h2>
        <p>{c.exitText}</p>
        <KidsExitGate />
      </section>
    </main>
  );
}

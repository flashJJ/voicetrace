import Link from "next/link";
import { stories, storyModes } from "../../lib/stories";

export const metadata = {
  title: "故事馆 · 声迹",
  description: "三种粤语叙事模式：正经、鬼故事、野史。月光光、井边的鹰爪兰、状元及第粥等 9 个互动故事。",
};

export default function StoriesPage() {
  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">故事馆 · 3 种模式</span>
        <h1 className="page-title">同一个广州，三种讲法。</h1>
        <p className="page-lede">
          正经模式留给家里人，鬼故事模式留给半夜不睡的人，野史模式留给爱听八卦的人。
          每个故事三幕、两三个选择、两个结局；可以听语音示例、看普通话翻译、点开方言词注释。
        </p>
        <div className="mode-nav">
          {storyModes.map((mode) => (
            <a key={mode.key} href={`#${mode.key}`} className="mode-chip">
              <strong>{mode.label}</strong>
              <span>{mode.title}</span>
            </a>
          ))}
        </div>
      </section>

      {storyModes.map((mode) => {
        const modeStories = stories.filter((story) => story.mode === mode.key);
        return (
          <section className="container mode-section" id={mode.key} key={mode.key}>
            <div className="mode-heading">
              <span className="eyebrow">{mode.label}</span>
              <h2 className="section-title">{mode.title}</h2>
              <p className="section-desc">{mode.description}</p>
            </div>
            <div className="library-grid">
              {modeStories.map((story) => {
                const isSample = story.type.includes("示例");
                return (
                  <article className="library-card" key={story.slug}>
                    <img src={story.cover} alt={`${story.title}封面`} />
                    <div className="library-card-body">
                      <div className="story-meta">
                        <span>{story.dialect}</span>
                        <span className={isSample ? "badge badge-warn" : "badge"}>
                          {story.modeLabel}
                        </span>
                      </div>
                      <h2 className="story-title">{story.title}</h2>
                      <p className="story-subtitle">{story.subtitle}</p>
                      <p className="story-intro">{story.intro}</p>
                      <div className="story-meta" style={{ marginTop: "auto" }}>
                        <span>{story.duration}</span>
                        <Link className="story-link" href={`/stories/${story.slug}`}>
                          开始阅读 <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="container" style={{ paddingBottom: 80 }}>
        <div className="notice" style={{ marginTop: 0 }}>
          这里有 {stories.length} 个可玩故事。更多粤语童谣、传说、民俗、谚语和 Agent
          黄金样品，在{" "}
          <Link href="/library" style={{ color: "var(--cinnabar)", fontWeight: 600 }}>
            粤语故事资料库
          </Link>
          ；也可以去{" "}
          <Link href="/studio" style={{ color: "var(--cinnabar)", fontWeight: 600 }}>
            AI 工坊
          </Link>{" "}
          自己生成一版。
        </div>
      </section>
    </>
  );
}

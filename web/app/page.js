import Link from "next/link";
import { featuredStories, stories, storyModes, heroImage, whyImage } from "../lib/stories";
import StoryCard from "../components/StoryCard";

export default function HomePage() {
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <span className="eyebrow fade-in">方言故事书 · 第一季</span>
          <h1 className="hero-title fade-in-delay">
            把阿婆讲的故事，
            <br />
            留在<em>声音</em>里。
          </h1>
          <p className="hero-lede fade-in-delay-2">
            声迹把一段方言录音，变成一本可以点、可以听、可以分享的互动故事书。
            原声是主角，AI 只负责让你听懂它。
          </p>
          <div className="hero-actions fade-in-delay-2">
            <Link className="btn btn-primary" href="/stories/moonlight">
              听《月光光》 <span aria-hidden="true">→</span>
            </Link>
            <Link className="btn btn-ghost" href="/about">
              为什么做声迹
            </Link>
          </div>
        </div>
        <div className="hero-visual fade-in-delay">
          <img
            className="hero-image"
            src={heroImage}
            alt="西关骑楼下的阿婆"
            width="1368"
            height="768"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="seal">留住<br />把声</div>
          <div className="hero-caption">
            <strong>广州 · 西关</strong>
            粤语 · 骑楼 · 一碗茶的时间
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">故事馆</span>
              <h2 className="section-title">三个故事，三种乡音</h2>
            </div>
            <p className="section-desc">
              先从一段童谣、一个民间故事、一碗艇仔粥开始。
              每个故事三幕，两三个选择，最后留下一张可以发给家人的声音卡。
            </p>
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
              <span className="eyebrow">三种模式</span>
              <h2 className="section-title">正经、鬼故事、野史</h2>
            </div>
            <p className="section-desc">
              同一个广州，可以讲给阿妈听，也可以讲给半夜不睡的朋友听。
              三种语气，三种受众，同一批地方记忆。
            </p>
          </div>
          <div className="steps">
            {storyModes.map((mode, index) => {
              const count = stories.filter((story) => story.mode === mode.key).length;
              return (
                <Link className="step mode-home-card" href={`/stories#${mode.key}`} key={mode.key}>
                  <div className="step-number">0{index + 1}</div>
                  <h3>{mode.label}</h3>
                  <p>{mode.description}</p>
                  <span className="story-link">
                    {count} 个故事 <span aria-hidden="true">→</span>
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
              <span className="eyebrow">怎么玩</span>
              <h2 className="section-title">录一段音，然后让它活起来</h2>
            </div>
            <p className="section-desc">
              不需要会写代码，也不需要会剪视频。你只需要一段真实的方言录音，
              剩下的交给声迹。
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <h3>录一段音</h3>
              <p>
                用手机录下长辈讲的一个故事、一首童谣，或者一句家常话。
                1-3 分钟就够，原声最重要。
              </p>
            </div>
            <div className="step">
              <div className="step-number">02</div>
              <h3>让 AI 听懂它</h3>
              <p>
                自动转写、普通话翻译、方言词注释。你只需要校对，
                不用逐字打出来。
              </p>
            </div>
            <div className="step">
              <div className="step-number">03</div>
              <h3>变成一本可以玩的书</h3>
              <p>
                三幕剧情、两三个选择、两个结局。读完生成一张声音故事卡，
                发给那个你想念的人。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container manifesto">
        <img
          className="manifesto-image"
          src={whyImage}
          alt="旧录音机与手写菜谱"
          width="1216"
          height="912"
          loading="lazy"
          decoding="async"
        />
        <div>
          <span className="eyebrow">为什么做声迹</span>
          <p className="manifesto-quote">
            方言不是一种“落后的普通话”，
            <br />
            它是<em>一个人回家的路</em>。
          </p>
          <p>
            我们总以为老人会一直在，故事会一直有人讲。
            直到有一天，你想录下那个声音，却发现已经来不及了。
          </p>
          <p>
            声迹想做的不是方言工具，而是一个家庭的声音抽屉：
            把那些饭桌上、骑楼下、码头边的故事，好好收起来。
          </p>
          <div className="stats">
            <div className="stat">
              <strong>3</strong>
              <span>个种子故事</span>
            </div>
            <div className="stat">
              <strong>3</strong>
              <span>幕互动 / 2 个结局</span>
            </div>
            <div className="stat">
              <strong>1</strong>
              <span>张可以分享的声音卡</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            现在就听
          </span>
          <h2 className="section-title" style={{ marginBottom: 18 }}>
            你有多久，没听过阿婆讲故事了？
          </h2>
          <p className="section-desc" style={{ justifySelf: "center", margin: "0 auto 28px" }}>
            从《月光光》开始。三分钟，听完一段月光，也听完一段乡音。
          </p>
          <Link className="btn btn-primary" href="/stories/moonlight">
            开始阅读 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

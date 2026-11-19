import Link from "next/link";
import KidsContinue from "../../components/KidsContinue";
import { kidGroups, kidStories } from "../../lib/kids";

export const metadata = {
  title: "儿童模式 · 声迹",
  description: "4-9 岁孩子的粤语启蒙故事：听故事、看翻译、录下自家的粤语版本。",
};

export default function KidsPage() {
  const groups = kidGroups();
  const pool = kidStories().map(({ slug, title, ageBand }) => ({ slug, title, ageBand }));

  return (
    <main className="container kids-page">
      <section className="kids-hero">
        <span className="eyebrow">儿童模式 · 4-9 岁</span>
        <h1>慢慢听，慢慢讲。</h1>
        <p>
          这里只有适合孩子的粤语故事。可以听示例语音、看普通话、点开方言词，
          也可以录下你家的版本。录音只保存在这台设备。
        </p>
        <div className="kids-hero-actions">
          <a className="btn btn-primary" href="#stories">
            选一个故事
          </a>
          <Link className="btn btn-ghost" href="/kids/parent">
            家长说明
          </Link>
        </div>
      </section>

      <p className="kids-note">
        儿童模式不会出现鬼故事、野史和 AI 工坊。家长可以从右上角「家长说明」回到成人模式。
      </p>

      <KidsContinue stories={pool} />

      <div id="stories">
        {groups.map((group) => (
          <section className="kids-band" key={group.key}>
            <div className="kids-band-head">
              <div>
                <span className="eyebrow">适龄故事</span>
                <h2>{group.label}</h2>
              </div>
              <p>{group.description}</p>
            </div>
            <div className="kids-grid">
              {group.stories.map((story) => (
                <article className="kids-card" key={story.slug}>
                  <img
                    src={story.cover}
                    alt={`${story.title}封面`}
                    width="900"
                    height="675"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="kids-card-body">
                    <div className="kids-card-meta">
                      <span>{story.ageBand} 岁</span>
                      {story.audience === "family" ? <span>家长陪同</span> : null}
                    </div>
                    <h3>{story.title}</h3>
                    <p>{story.subtitle}</p>
                    {story.kidNote ? <p className="kids-card-note">{story.kidNote}</p> : null}
                    <Link className="kids-card-link" href={`/kids/${story.slug}`}>
                      开始听 <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="kids-parent-card">
        <div>
          <h2>给家长的一句话</h2>
          <p>
            儿童模式有 {kidStories().length} 个适龄故事，适合 4-9 岁。录音只存在本机浏览器，
            不上传服务器；自动转写由浏览器语音服务处理，可在录音棚关闭。
          </p>
        </div>
        <div className="kids-hero-actions">
          <Link className="btn btn-ghost" href="/kids/parent">
            适龄与隐私说明
          </Link>
          <Link className="btn btn-ghost" href="/kids/parent#exit">
            回成人模式（家长确认）
          </Link>
        </div>
      </section>
    </main>
  );
}

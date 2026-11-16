import Link from "next/link";

export default function StoryCard({ story }) {
  const isSample = story.type.includes("示例");
  return (
    <article className="story-card">
      <img
        className="story-cover"
        src={story.cover}
        alt={`${story.title}封面`}
        width="1216"
        height="912"
        loading="lazy"
        decoding="async"
      />
      <div className="story-body">
        <div className="story-meta">
          <span>{story.dialect}</span>
          <span className={isSample ? "badge badge-warn" : "badge"}>{story.type}</span>
        </div>
        <h3 className="story-title">{story.title}</h3>
        <p className="story-subtitle">{story.subtitle}</p>
        <p className="story-intro">{story.intro}</p>
        <Link className="story-link" href={`/stories/${story.slug}`}>
          开始阅读 <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

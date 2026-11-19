import Link from "next/link";
import { notFound } from "next/navigation";
import KidSummary from "../../../../components/KidSummary";
import { getKidStory, kidStories } from "../../../../lib/kids";
import { getKidLearning } from "../../../../lib/kid-learning";

export function generateStaticParams() {
  return kidStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = getKidStory(slug);
  if (!story) return { title: "学习小结 · 声迹" };
  return {
    title: `${story.title} · 学习小结 · 声迹`,
    description: `看看 ${story.title} 读了几幕、跟读了几段、认识了几个词。`,
  };
}

export default async function KidSummaryPage({ params }) {
  const { slug } = await params;
  const story = getKidStory(slug);
  const learning = getKidLearning(slug);
  if (!story || !learning) notFound();

  return (
    <main className="container kids-page kid-summary-page">
      <div className="reader-top">
        <Link href={`/kids/${story.slug}`} className="reader-back">
          <span aria-hidden="true">←</span> 回故事
        </Link>
        <span>{story.ageBand} 岁 · 儿童模式</span>
      </div>

      <section className="kids-hero kid-summary-hero">
        <span className="eyebrow">学习小结</span>
        <h1>{story.title}</h1>
        <p>读了几幕、跟读了几段、认识了几个词、答对几题，这里都记着。</p>
      </section>

      <KidSummary story={story} learning={learning} />

      <p className="kids-note">
        小结只统计本机保存的进度；录音文件在「声音档案」里单独管理，清除小结不会删除录音。
      </p>
    </main>
  );
}

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

  return <KidSummary story={story} learning={learning} />;
}

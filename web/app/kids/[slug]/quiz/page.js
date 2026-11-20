import { notFound } from "next/navigation";
import KidQuiz from "../../../../components/KidQuiz";
import { getKidStory, kidStories } from "../../../../lib/kids";
import { getKidLearning } from "../../../../lib/kid-learning";

export function generateStaticParams() {
  return kidStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = getKidStory(slug);
  if (!story) return { title: "故事小测 · 声迹" };
  return {
    title: `${story.title} · 故事小测 · 声迹`,
    description: `用 ${story.title} 的内容做三道理解小测，答错会给提示。`,
  };
}

export default async function KidQuizPage({ params }) {
  const { slug } = await params;
  const story = getKidStory(slug);
  const learning = getKidLearning(slug);
  if (!story || !learning?.quiz?.length) notFound();

  return <KidQuiz story={story} learning={learning} />;
}

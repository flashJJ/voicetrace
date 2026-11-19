import { notFound } from "next/navigation";
import StoryReader from "../../../components/StoryReader";
import { getKidStory, kidStories } from "../../../lib/kids";

export function generateStaticParams() {
  return kidStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = getKidStory(slug);
  if (!story) return { title: "儿童故事 · 声迹" };
  return {
    title: `${story.title} · 儿童模式 · 声迹`,
    description: story.subtitle,
  };
}

export default async function KidStoryPage({ params }) {
  const { slug } = await params;
  const story = getKidStory(slug);
  if (!story) notFound();
  return <StoryReader story={story} kidMode />;
}

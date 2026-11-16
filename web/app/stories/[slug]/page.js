import { notFound } from "next/navigation";
import { getStory, stories } from "../../../lib/stories";
import StoryReader from "../../../components/StoryReader";

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return { title: "故事未找到 · 声迹" };
  return {
    title: `${story.title} · 声迹`,
    description: story.subtitle,
    openGraph: {
      type: "article",
      title: `${story.title} · 声迹`,
      description: story.subtitle,
      images: [
        {
          url: story.cover,
          alt: `${story.title}封面`,
        },
      ],
    },
  };
}

export default async function StoryPage({ params }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  return <StoryReader story={story} />;
}

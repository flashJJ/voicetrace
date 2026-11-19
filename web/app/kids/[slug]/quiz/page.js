import Link from "next/link";
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

  return (
    <main className="container kids-page kid-quiz-page">
      <div className="reader-top">
        <Link href={`/kids/${story.slug}`} className="reader-back">
          <span aria-hidden="true">←</span> 回故事
        </Link>
        <span>{story.ageBand} 岁 · 儿童模式</span>
      </div>

      <section className="kids-hero kid-quiz-hero">
        <span className="eyebrow">故事小测</span>
        <h1>{story.title}</h1>
        <p>
          {learning.quiz.length} 道题都来自故事内容。答错不扣分，会给你一句提示，可以重新选。
        </p>
      </section>

      <KidQuiz slug={story.slug} storyTitle={story.title} quiz={learning.quiz} />

      <p className="kids-note">
        小测结果只保存在这台设备，用来生成学习小结，不上传、不排名。
      </p>
    </main>
  );
}

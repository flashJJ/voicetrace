import StoryMap from "../../components/StoryMap";

export const metadata = {
  title: "声音地图 · 声迹",
  description: "把家庭故事钉在地图上，形成一张有声音的地方记忆地图。",
};

export default function MapPage() {
  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">声音地图</span>
        <h1 className="page-title">每个故事，都有一个发生的地方。</h1>
        <p className="page-lede">
          西关的骑楼、珠三角的巷口、广州河南的码头。故事不只属于时间，也属于地方。
          点一个 pin，听一段乡音。
        </p>
      </section>
      <div className="container">
        <StoryMap />
      </div>
    </>
  );
}

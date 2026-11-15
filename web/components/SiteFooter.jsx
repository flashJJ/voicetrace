import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">声迹 · 方言故事书</div>
          <p className="footer-text">
            声迹是 TRAE 好应用大赏赛参赛原型。示例故事含公有领域改编与虚构示例，正式版将替换为经授权的真实家庭故事。录音与故事可随时删除，AI 合成音会明确标注。
          </p>
        </div>
        <div className="footer-links">
          <Link href="/stories">故事馆</Link>
          <Link href="/map">声音地图</Link>
          <Link href="/about">关于与隐私</Link>
          <a href="mailto:hello@voicetrace.example">联系我们</a>
        </div>
      </div>
    </footer>
  );
}

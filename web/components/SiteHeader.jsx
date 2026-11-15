import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="声迹首页">
          <span className="brand-mark">声</span>
          <span>
            声迹
            <small>DIALECT STORYBOOK</small>
          </span>
        </Link>
        <nav className="nav" aria-label="主导航">
          <Link href="/stories">故事馆</Link>
          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-trigger" aria-haspopup="true">
              创作 <span aria-hidden="true">▾</span>
            </button>
            <div className="nav-dropdown-menu">
              <Link href="/library">资料库</Link>
              <Link href="/studio">AI 工坊</Link>
              <Link href="/demo">演示</Link>
            </div>
          </div>
          <Link href="/map">声音地图</Link>
          <Link href="/about">关于</Link>
          <Link href="/stories/moonlight" className="nav-cta">
            听一个故事
          </Link>
        </nav>
      </div>
    </header>
  );
}

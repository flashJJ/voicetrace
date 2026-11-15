import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "声迹 · 方言故事书",
  description: "把爷爷奶奶讲的故事，变成可以玩的方言互动书。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hans" data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

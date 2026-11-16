import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const description = "把爷爷奶奶讲的故事，变成可以玩的方言互动书。";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "声迹 · 方言故事书",
  description,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "声迹 · 方言故事书",
    title: "声迹 · 方言故事书",
    description,
    url: `${basePath}/`,
    images: [
      {
        url: `${basePath}/og.jpg`,
        width: 1200,
        height: 630,
        alt: "声迹 · 方言故事书：把故事变成可以玩的方言互动书",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "声迹 · 方言故事书",
    description,
    images: [`${basePath}/og.jpg`],
  },
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

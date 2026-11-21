import "./globals.css";
import LocaleProvider from "../components/LocaleProvider";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import PwaRegister from "../components/PwaRegister";
import PwaInstall from "../components/PwaInstall";
import InkEffects from "../components/InkEffects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const description =
  "趁还会唱，把乡音留下来。声迹把粤语童谣、传说和家人的口述，做成可以点、可以听、可以分享的互动故事书。";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "声迹 · 方言故事书",
  description,
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    title: "声迹",
    statusBarStyle: "default",
  },
  icons: {
    apple: `${basePath}/icons/icon-192.png`,
  },
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

export const viewport = {
  themeColor: "#a63a2b",
};

const INTRO_BOOT = `(function(){try{var home=${JSON.stringify(`${basePath}/`)};var path=location.pathname.replace(/index\\.html$/,"");if(path!==home)return;var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;var seen=false;try{seen=sessionStorage.getItem("voicetrace:intro")==="1"}catch(e){}var force=location.search.indexOf("intro=1")!==-1;if(!reduce&&(!seen||force)){document.documentElement.setAttribute("data-intro","on")}}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hans" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
      </head>
      <body>
        <LocaleProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <PwaInstall />
          <PwaRegister />
          <InkEffects />
        </LocaleProvider>
      </body>
    </html>
  );
}

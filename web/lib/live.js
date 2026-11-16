export const LIVE_STUDIO_URL = "https://37k35561j5dpzhkk2yl.traesite.cn/studio";

// 静态导出（GitHub Pages）没有服务端，AI 工坊需要跳到 Trae 部署的在线版本。
export const isStaticExport = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);

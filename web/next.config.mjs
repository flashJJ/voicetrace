/** @type {import('next').NextConfig} */
const isStatic = process.env.STATIC_EXPORT === "true";
const repoName = "voicetrace";

const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isStatic ? `/${repoName}` : "",
    NEXT_PUBLIC_SITE_URL: isStatic
      ? "https://flashjj.github.io"
      : "http://localhost:3000",
  },
  ...(isStatic
    ? {
        output: "export",
        trailingSlash: true,
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : { output: "standalone" }),
};

export default nextConfig;

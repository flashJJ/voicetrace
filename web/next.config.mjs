/** @type {import('next').NextConfig} */
const isStatic = process.env.STATIC_EXPORT === "true";
const repoName = "voicetrace";

const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isStatic ? `/${repoName}` : "",
  },
  ...(isStatic
    ? {
        output: "export",
        trailingSlash: true,
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
};

export default nextConfig;

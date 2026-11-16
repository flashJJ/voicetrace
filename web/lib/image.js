const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const cover = (name) => `${basePath}/covers/${name}.webp`;

export const heroImage = cover("hero");
export const whyImage = cover("why");

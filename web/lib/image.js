const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const cover = (name) => `${basePath}/covers/${name}.jpg`;

export const heroImage = cover("hero");
export const whyImage = cover("why");

import { stories } from "./stories.js";

export const KID_BANDS = [
  {
    key: "4-6",
    label: "4-6 岁 · 亲子共读",
    description: "短故事、童谣和动物，家长带着读，孩子跟着听和说。",
  },
  {
    key: "6-9",
    label: "6-9 岁 · 自己读",
    description: "有情节和选择的故事，孩子可以自己点，也可以和家长一起读。",
  },
];

export function kidStories() {
  return stories.filter((story) => story.kidSafe && story.mode !== "ghost");
}

export function getKidStory(slug) {
  return kidStories().find((story) => story.slug === slug) || null;
}

export function kidGroups() {
  const pool = kidStories();
  return KID_BANDS.map((band) => ({
    ...band,
    stories: pool.filter((story) => story.ageBand === band.key),
  })).filter((band) => band.stories.length > 0);
}

export function isKidSafe(slug) {
  return kidStories().some((story) => story.slug === slug);
}

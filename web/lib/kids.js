import { stories } from "./stories.js";

export const KID_BANDS = [
  {
    key: "4-6",
    label: "4-6 岁 · 亲子共读",
    enLabel: "Ages 4-6 · Read together",
    description: "短故事、童谣和动物，家长带着读，孩子跟着听和说。",
    enDescription:
      "Short stories, rhymes, and animals. Grown-ups lead the reading; children listen and repeat.",
  },
  {
    key: "6-9",
    label: "6-9 岁 · 自己读",
    enLabel: "Ages 6-9 · Read alone",
    description: "有情节和选择的故事，孩子可以自己点，也可以和家长一起读。",
    enDescription:
      "Stories with plot and choices. Children can tap through alone or read with a grown-up.",
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

import learning from "../data/kids/learning.json";

export const kidLearning = learning;

export function getKidLearning(slug) {
  return learning[slug] || null;
}

export function getSceneWords(slug, sceneId) {
  return getKidLearning(slug)?.sceneWords?.[sceneId] || [];
}

export function getKidQuiz(slug) {
  return getKidLearning(slug)?.quiz || [];
}

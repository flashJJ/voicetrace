const STORAGE_KEY = "voicetrace:kid-progress";

export function emptyKidProgress() {
  return {
    visited: [],
    recorded: [],
    words: [],
    quiz: null,
    updatedAt: 0,
  };
}

function normalizeEntry(entry) {
  return {
    visited: Array.isArray(entry?.visited) ? entry.visited : [],
    recorded: Array.isArray(entry?.recorded) ? entry.recorded : [],
    words: Array.isArray(entry?.words) ? entry.words : [],
    quiz: entry?.quiz && typeof entry.quiz === "object" ? entry.quiz : null,
    updatedAt: Number(entry?.updatedAt) || 0,
  };
}

export function readKidProgressAll() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const map = {};
    for (const [slug, entry] of Object.entries(parsed)) {
      map[slug] = normalizeEntry(entry);
    }
    return map;
  } catch (error) {
    return {};
  }
}

export function readKidProgress(slug) {
  return readKidProgressAll()[slug] || emptyKidProgress();
}

function writeAll(map) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("voicetrace:kid-progress-changed"));
  } catch (error) {
    // 隐私模式可能禁用 localStorage，学习记录写入失败不影响阅读。
  }
}

function update(slug, mutate) {
  const all = readKidProgressAll();
  const next = mutate(normalizeEntry(all[slug]));
  next.updatedAt = Date.now();
  all[slug] = next;
  writeAll(all);
  return next;
}

function pushUnique(list, value) {
  return list.includes(value) ? list : [...list, value];
}

export function markSceneVisited(slug, sceneId) {
  return update(slug, (entry) => ({
    ...entry,
    visited: pushUnique(entry.visited, sceneId),
  }));
}

export function markSceneRecorded(slug, sceneId) {
  return update(slug, (entry) => ({
    ...entry,
    recorded: pushUnique(entry.recorded, sceneId),
  }));
}

export function toggleKnownWord(slug, term) {
  return update(slug, (entry) => ({
    ...entry,
    words: entry.words.includes(term)
      ? entry.words.filter((item) => item !== term)
      : [...entry.words, term],
  }));
}

export function saveKidQuiz(slug, { answers = [], correct = 0, total = 0 } = {}) {
  return update(slug, (entry) => ({
    ...entry,
    quiz: {
      answers: answers.filter((answer) => Number.isInteger(answer)),
      correct: Math.max(0, Math.min(Number(correct) || 0, total || answers.length)),
      total,
      finishedAt: Date.now(),
    },
  }));
}

export function clearKidProgress(slug) {
  const all = readKidProgressAll();
  if (!all[slug]) return;
  delete all[slug];
  writeAll(all);
}

export function clearAllKidProgress() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("voicetrace:kid-progress-changed"));
  } catch (error) {
    // 同上，写不进去就不影响页面。
  }
}

export function subscribeKidProgress(listener) {
  if (typeof window === "undefined") return () => {};
  const handler = () => listener();
  window.addEventListener("voicetrace:kid-progress-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("voicetrace:kid-progress-changed", handler);
    window.removeEventListener("storage", handler);
  };
}

export function collectWordTerms(learning) {
  const terms = [];
  const sceneWords = learning?.sceneWords || {};
  for (const words of Object.values(sceneWords)) {
    for (const word of words || []) {
      if (word?.term && !terms.includes(word.term)) terms.push(word.term);
    }
  }
  return terms;
}

export function summarizeKidProgress(story, learning, progress = emptyKidProgress()) {
  const sceneIds = (story?.scenes || []).map((scene) => scene.id);
  const sceneSet = new Set(sceneIds);
  const visitedCount = new Set((progress.visited || []).filter((id) => sceneSet.has(id))).size;
  const recordedCount = new Set((progress.recorded || []).filter((id) => sceneSet.has(id))).size;

  const terms = collectWordTerms(learning);
  const wordsKnown = new Set(
    (progress.words || []).filter((term) => terms.includes(term))
  ).size;

  const quizTotal = Array.isArray(learning?.quiz) ? learning.quiz.length : 0;
  const answers = Array.isArray(progress.quiz?.answers) ? progress.quiz.answers : [];
  const quizAnswered = Math.min(
    quizTotal,
    answers.filter((answer) => Number.isInteger(answer) && answer >= 0).length
  );
  const quizCorrect = Math.min(quizTotal, Math.max(0, Number(progress.quiz?.correct) || 0));

  return {
    scenesTotal: sceneIds.length,
    visitedCount,
    recordedCount,
    wordsTotal: terms.length,
    wordsKnown,
    quizTotal,
    quizAnswered,
    quizCorrect,
    steps: {
      listen: visitedCount > 0,
      readAlong: recordedCount > 0,
      words: wordsKnown > 0,
      quiz: quizAnswered > 0,
    },
  };
}

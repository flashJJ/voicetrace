import meta from "../data/corpus/meta.json";
import nurseryLullaby from "../data/corpus/nursery/01-lullaby.json";
import nurseryPlayCircle from "../data/corpus/nursery/02-play-circle.json";
import nurseryPlayWords from "../data/corpus/nursery/03-play-words.json";
import nurseryLife from "../data/corpus/nursery/04-life.json";
import nurseryNewYear from "../data/corpus/nursery/05-new-year.json";
import nurseryFamily from "../data/corpus/nursery/06-family.json";
import legendsCity from "../data/corpus/legends/01-city-origins.json";
import legendsDeities from "../data/corpus/legends/02-deities.json";
import legendsFaith from "../data/corpus/legends/03-faith.json";
import legendsPlaces from "../data/corpus/legends/04-places.json";
import legendsPeople from "../data/corpus/legends/05-people-craft.json";
import legendsLocal from "../data/corpus/legends/06-local-records.json";
import proverbsXiehouyuA from "../data/corpus/proverbs/01-xiehouyu-a.json";
import proverbsXiehouyuB from "../data/corpus/proverbs/02-xiehouyu-b.json";
import proverbsWeather from "../data/corpus/proverbs/03-weather.json";
import proverbsFarming from "../data/corpus/proverbs/04-farming.json";
import customsNewYear from "../data/corpus/customs/01-new-year.json";
import customsFestivals from "../data/corpus/customs/02-festivals.json";
import customsSeasonal from "../data/corpus/customs/03-seasonal.json";
import customsFood from "../data/corpus/customs/04-food.json";
import catalogFantasy from "../data/corpus/catalog/01-fantasy.json";
import riddles from "../data/corpus/riddles/01-riddles.json";
import tongueTwisters from "../data/corpus/riddles/02-tongue-twisters.json";
import goldenHeritageOne from "../data/corpus/golden/heritage-01.json";
import goldenHeritageTwo from "../data/corpus/golden/heritage-02.json";
import goldenGhost from "../data/corpus/golden/ghost.json";
import goldenWildHistory from "../data/corpus/golden/wild-history.json";

export const corpusMeta = meta;

export const goldenSamples = [
  ...goldenHeritageOne,
  ...goldenHeritageTwo,
  ...goldenGhost,
  ...goldenWildHistory,
];

export const corpusItems = [
  ...nurseryLullaby,
  ...nurseryPlayCircle,
  ...nurseryPlayWords,
  ...nurseryLife,
  ...nurseryNewYear,
  ...nurseryFamily,
  ...legendsCity,
  ...legendsDeities,
  ...legendsFaith,
  ...legendsPlaces,
  ...legendsPeople,
  ...legendsLocal,
  ...proverbsXiehouyuA,
  ...proverbsXiehouyuB,
  ...proverbsWeather,
  ...proverbsFarming,
  ...customsNewYear,
  ...customsFestivals,
  ...customsSeasonal,
  ...customsFood,
  ...catalogFantasy,
  ...riddles,
  ...tongueTwisters,
];

const typeLabels = Object.fromEntries(
  (meta.categories || []).map((item) => [item.key, item.label])
);
const modeLabels = Object.fromEntries(
  (meta.modes || []).map((item) => [item.key, item.label])
);

export function typeLabel(type) {
  return typeLabels[type] || type;
}

export function modeLabel(mode) {
  return modeLabels[mode] || mode;
}

export function getCorpusItem(id) {
  return corpusItems.find((item) => item.id === id);
}

export function getGoldenSample(storyId, mode) {
  const matches = goldenSamples.filter((sample) => sample.storyId === storyId);
  if (!matches.length) return null;
  if (mode) return matches.find((sample) => sample.mode === mode) || matches[0];
  return matches[0];
}

export function corpusStats() {
  const byType = corpusItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const byMode = corpusItems.reduce((acc, item) => {
    for (const mode of item.modes || ["heritage"]) {
      acc[mode] = (acc[mode] || 0) + 1;
    }
    return acc;
  }, {});

  const regions = Array.from(new Set(corpusItems.map((item) => item.region))).sort();

  return {
    total: corpusItems.length,
    byType,
    byMode,
    regions,
    golden: goldenSamples.length,
    needsResearch: corpusItems.filter((item) => item.needsResearch).length,
    withGlossary: corpusItems.filter((item) => (item.glossary || []).length > 0).length,
    withFullText: corpusItems.filter((item) => (item.text || "").trim().length > 0).length,
  };
}

export function searchCorpus({
  query = "",
  type = "all",
  region = "all",
  mode = "all",
  onlyGolden = false,
} = {}) {
  const q = query.trim().toLowerCase();
  return corpusItems.filter((item) => {
    if (type !== "all" && item.type !== type) return false;
    if (region !== "all" && item.region !== region) return false;
    if (mode !== "all" && !(item.modes || ["heritage"]).includes(mode)) return false;
    if (onlyGolden && !item.goldenSample) return false;
    if (!q) return true;
    const haystack = [
      item.title,
      item.subtitle,
      item.summary,
      item.text,
      item.region,
      ...(item.tags || []),
      ...(item.motifs || []),
      ...(item.glossary || []).map((g) => `${g.term} ${g.meaning}`),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function goldenCoverage() {
  const total = goldenSamples.length;
  const withScenes = goldenSamples.filter(
    (sample) => (sample.expected?.scenes || []).length === 3
  ).length;
  const withGlossary = goldenSamples.filter(
    (sample) => (sample.expected?.glossary || []).length > 0
  ).length;
  const withTranslation = goldenSamples.filter(
    (sample) => Boolean(sample.expected?.translationZh)
  ).length;
  return { total, withScenes, withGlossary, withTranslation };
}

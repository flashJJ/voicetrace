import kidNewEn from "../data/i18n/stories-kid-new-en.json";
import heritageKidEn from "../data/i18n/stories-heritage-kid-en.json";
import heritageLongEn from "../data/i18n/stories-heritage-long-en.json";
import ghostEn from "../data/i18n/stories-ghost-en.json";
import wildEn from "../data/i18n/stories-wild-en.json";
import hkEn from "../data/i18n/stories-hk-en.json";
import learningEn from "../data/i18n/learning-en.json";

const storiesEn = {
  ...kidNewEn,
  ...heritageKidEn,
  ...heritageLongEn,
  ...ghostEn,
  ...wildEn,
  ...hkEn,
};

const MODE_LABELS = {
  heritage: { zh: "正经模式", en: "Heritage" },
  ghost: { zh: "鬼故事模式", en: "Ghost story" },
  wild_history: { zh: "野史模式", en: "Hearsay" },
};

export function modeLabelFor(mode, locale) {
  return MODE_LABELS[mode]?.[locale === "en" ? "en" : "zh"] || mode;
}

export function getStoryEn(slug) {
  return storiesEn[slug] || null;
}

function localizeScene(scene, localize) {
  return {
    ...scene,
    title: localize(scene.title),
    textZh: localize(scene.textZh),
    endingText: scene.endingText ? localize(scene.endingText) : scene.endingText,
    choices: (scene.choices || []).map((choice) => ({
      ...choice,
      label: localize(choice.label),
    })),
    glossary: (scene.glossary || []).map((item) => ({
      ...item,
      meaning: localize(item.meaning),
      note: localize(item.note),
    })),
  };
}

// 把故事数据转换成当前语言：英文用覆盖层，繁体用转换函数，简体原样返回。
export function localizeStory(story, locale, localize) {
  if (locale === "zh") return story;

  if (locale === "zh-HK") {
    return {
      ...story,
      title: localize(story.title),
      subtitle: localize(story.subtitle),
      quote: localize(story.quote),
      intro: localize(story.intro),
      dialect: localize(story.dialect),
      type: localize(story.type),
      duration: localize(story.duration),
      modeLabel: localize(story.modeLabel),
      kidNote: story.kidNote ? localize(story.kidNote) : story.kidNote,
      scenes: story.scenes.map((scene) => localizeScene(scene, localize)),
    };
  }

  const overlay = storiesEn[story.slug];
  if (!overlay) return story;

  return {
    ...story,
    title: overlay.title || story.title,
    subtitle: overlay.subtitle || story.subtitle,
    quote: overlay.quote || story.quote,
    intro: overlay.intro || story.intro,
    dialect: overlay.dialect || story.dialect,
    type: overlay.type || story.type,
    duration: overlay.duration || story.duration,
    modeLabel: modeLabelFor(story.mode, "en"),
    kidNote: overlay.kidNote || story.kidNote,
    scenes: story.scenes.map((scene) => {
      const translated = overlay.scenes?.[scene.id] || {};
      const choiceLabels = overlay.choices?.[scene.id] || [];
      return {
        ...scene,
        title: translated.title || scene.title,
        textEn: translated.text || "",
        endingText: translated.endingText || scene.endingText,
        choices: (scene.choices || []).map((choice, index) => ({
          ...choice,
          label: choiceLabels[index] || choice.label,
        })),
        glossary: (scene.glossary || []).map((item) => ({
          ...item,
          meaning: overlay.glossary?.[item.term]?.meaning || item.meaning,
          note: overlay.glossary?.[item.term]?.note || item.note,
        })),
      };
    }),
  };
}

export function localizeLearning(slug, entry, locale, localize) {
  if (!entry || locale === "zh") return entry;

  if (locale === "zh-HK") {
    return {
      ...entry,
      sceneWords: Object.fromEntries(
        Object.entries(entry.sceneWords || {}).map(([sceneId, words]) => [
          sceneId,
          words.map((word) => ({
            ...word,
            meaning: localize(word.meaning),
            example: localize(word.example),
          })),
        ])
      ),
      quiz: (entry.quiz || []).map((question) => ({
        ...question,
        question: localize(question.question),
        options: question.options.map((option) => localize(option)),
        hint: localize(question.hint),
      })),
    };
  }

  const translated = learningEn[slug];
  if (!translated) return entry;

  return {
    ...entry,
    sceneWords: Object.fromEntries(
      Object.entries(entry.sceneWords || {}).map(([sceneId, words]) => {
        const translatedWords = translated.sceneWords?.[sceneId] || [];
        return [
          sceneId,
          words.map((word, index) => ({
            ...word,
            meaning: translatedWords[index]?.meaning || word.meaning,
            example: translatedWords[index]?.example || word.example,
          })),
        ];
      })
    ),
    quiz: (entry.quiz || []).map((question, index) => {
      const translatedQuestion = translated.quiz?.[index];
      return {
        ...question,
        question: translatedQuestion?.question || question.question,
        options: question.options.map(
          (option, optionIndex) =>
            translatedQuestion?.options?.[optionIndex] || option
        ),
        hint: translatedQuestion?.hint || question.hint,
      };
    }),
  };
}

export function localizeCorpusItem(item, locale, localize) {
  if (!item || locale !== "zh-HK") return item;
  return {
    ...item,
    title: localize(item.title),
    subtitle: item.subtitle ? localize(item.subtitle) : item.subtitle,
    summary: localize(item.summary),
    text: item.text ? localize(item.text) : item.text,
    glossary: (item.glossary || []).map((entry) => ({
      ...entry,
      meaning: localize(entry.meaning),
      note: entry.note ? localize(entry.note) : entry.note,
    })),
  };
}

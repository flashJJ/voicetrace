import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const notes = [];

const fail = (message) => errors.push(message);
const ok = (message) => notes.push(message);

const MODES = new Set(["heritage", "ghost", "wild_history"]);
const AUDIENCES = new Set(["kid", "family", "adult"]);
const AGE_BANDS = new Set(["4-6", "6-9", "10+"]);

function walkJson(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkJson(full);
    return entry.name.endsWith(".json") ? [full] : [];
  });
}

function readArray(file) {
  try {
    const value = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(value)) {
      fail(`${path.relative(root, file)} 不是数组`);
      return [];
    }
    return value;
  } catch (error) {
    fail(`${path.relative(root, file)} 解析失败：${error.message}`);
    return [];
  }
}

// 1. 互动故事
const { stories } = await import(pathToFileURL(path.join(root, "lib/stories.js")).href);
const slugs = new Set();

stories.forEach((story) => {
  const label = `故事「${story.title || story.slug}」`;

  if (!story.slug) fail(`${label} 缺少 slug`);
  if (slugs.has(story.slug)) fail(`${label} 的 slug 重复：${story.slug}`);
  slugs.add(story.slug);

  if (!MODES.has(story.mode)) fail(`${label} 的 mode 非法：${story.mode}`);
  if (!AUDIENCES.has(story.audience)) fail(`${label} 的 audience 非法：${story.audience}`);
  if (!AGE_BANDS.has(story.ageBand)) fail(`${label} 的 ageBand 非法：${story.ageBand}`);
  if (typeof story.kidSafe !== "boolean") fail(`${label} 缺少 kidSafe 布尔值`);
  if (story.kidSafe && story.mode === "ghost") fail(`${label} 是鬼故事，不能进儿童模式`);
  if (story.kidSafe && story.audience === "adult") {
    fail(`${label} 标记 kidSafe 但 audience 是 adult`);
  }
  if (story.kidSafe && story.ageBand === "10+") {
    fail(`${label} 标记 kidSafe 但 ageBand 是 10+`);
  }
  if (story.kidNote && typeof story.kidNote !== "string") {
    fail(`${label} 的 kidNote 应为字符串`);
  }
  if (!Array.isArray(story.scenes) || story.scenes.length < 3) {
    fail(`${label} 场景数量不足，实际 ${story.scenes?.length ?? 0}`);
    return;
  }

  const ids = new Set();
  story.scenes.forEach((scene) => {
    if (!scene.id) fail(`${label} 有场景缺少 id`);
    if (ids.has(scene.id)) fail(`${label} 场景 id 重复：${scene.id}`);
    ids.add(scene.id);
    if (!scene.textYue) fail(`${label} 场景 ${scene.id} 缺少粤语原文`);
    if (!scene.textZh) fail(`${label} 场景 ${scene.id} 缺少普通话翻译`);
  });

  const acts = new Set(
    story.scenes.map((scene) => Number(scene.act)).filter((act) => Number.isInteger(act))
  );
  const actCount = Number(story.actCount) || Math.max(...acts);
  if (actCount < 3 || actCount > 8) fail(`${label} 幕数应在 3-8，实际 ${actCount}`);

  const choices = story.scenes.flatMap((scene) => scene.choices || []);
  choices.forEach((choice) => {
    if (!choice.next) fail(`${label} 有选择缺少 next`);
    else if (!ids.has(choice.next)) fail(`${label} 存在悬空引用：${choice.next}`);
  });

  story.scenes.forEach((scene) => {
    const count = (scene.choices || []).length;
    if (!scene.ending && count < 1) fail(`${label} 场景 ${scene.id} 没有选择`);
    if (!scene.ending && count > 3) fail(`${label} 场景 ${scene.id} 选择过多`);
    if (scene.ending && count !== 0) fail(`${label} 结局 ${scene.id} 不应有选择`);
  });

  const endings = story.scenes.filter((scene) => scene.ending);
  if (endings.length < 2) fail(`${label} 应有至少 2 个结局，实际 ${endings.length}`);

  const cover = path.join(root, "public/covers", `${story.slug}.webp`);
  if (!fs.existsSync(cover)) fail(`${label} 缺少封面：public/covers/${story.slug}.webp`);
});

ok(`故事 ${stories.length} 个，其中儿童模式 ${stories.filter((story) => story.kidSafe).length} 个`);

// 2. 资料库素材
const corpusRoot = path.join(root, "data/corpus");
const goldenRoot = path.join(corpusRoot, "golden");
const corpusFiles = walkJson(corpusRoot).filter(
  (file) =>
    path.dirname(file) !== goldenRoot && path.basename(file) !== "meta.json"
);

const items = corpusFiles.flatMap(readArray);
const itemIds = new Set();

items.forEach((item) => {
  const label = `素材「${item.title || item.id}」`;

  if (!item.id) fail(`${label} 缺少 id`);
  if (itemIds.has(item.id)) fail(`${label} 的 id 重复：${item.id}`);
  itemIds.add(item.id);

  if (!Array.isArray(item.modes) || item.modes.length === 0) {
    fail(`${label} 缺少 modes`);
  } else {
    item.modes.forEach((mode) => {
      if (!MODES.has(mode)) fail(`${label} 的 mode 非法：${mode}`);
    });
  }

  if (!Array.isArray(item.source) || item.source.length === 0) {
    fail(`${label} 缺少来源 source`);
  }

  if (!item.title) fail(`${label} 缺少标题`);
  if (!item.summary) fail(`${label} 缺少摘要`);
});

ok(`资料库素材 ${items.length} 条，来自 ${corpusFiles.length} 个文件`);

// 3. 黄金样品
const goldens = walkJson(goldenRoot).flatMap(readArray);
const goldenIds = new Set();

goldens.forEach((sample) => {
  const label = `黄金样品「${sample.id}」`;

  if (!sample.id) fail(`${label} 缺少 id`);
  if (goldenIds.has(sample.id)) fail(`${label} 的 id 重复：${sample.id}`);
  goldenIds.add(sample.id);

  if (!itemIds.has(sample.storyId)) {
    fail(`${label} 的 storyId 找不到对应素材：${sample.storyId}`);
  }

  if (!MODES.has(sample.mode)) fail(`${label} 的 mode 非法：${sample.mode}`);
  if (!sample.expected) fail(`${label} 缺少 expected`);

  const terms = (sample.expected?.glossary || []).map((entry) => entry.term);
  if (new Set(terms).size !== terms.length) {
    fail(`${label} 的 glossary term 重复`);
  }
});

ok(`黄金样品 ${goldens.length} 个`);

// 4. 儿童学习内容
const learningFile = path.join(root, "data/kids/learning.json");
let learning = {};

try {
  learning = JSON.parse(fs.readFileSync(learningFile, "utf8"));
  if (!learning || typeof learning !== "object" || Array.isArray(learning)) {
    fail("data/kids/learning.json 应为以故事 slug 为键的对象");
    learning = {};
  }
} catch (error) {
  fail(`data/kids/learning.json 解析失败：${error.message}`);
}

const kidPool = stories.filter((story) => story.kidSafe);

Object.keys(learning).forEach((slug) => {
  if (!kidPool.some((story) => story.slug === slug)) {
    fail(`学习内容 ${slug} 找不到对应的儿童故事`);
  }
});

kidPool.forEach((story) => {
  const label = `学习内容「${story.title}」`;
  const entry = learning[story.slug];

  if (!entry) {
    fail(`${label} 缺少 data/kids/learning.json 条目`);
    return;
  }

  const scenesById = new Map(story.scenes.map((scene) => [scene.id, scene]));
  const terms = new Set();

  if (!entry.sceneWords || typeof entry.sceneWords !== "object") {
    fail(`${label} 缺少 sceneWords`);
  } else {
    Object.entries(entry.sceneWords).forEach(([sceneId, words]) => {
      const scene = scenesById.get(sceneId);
      if (!scene) {
        fail(`${label} 的词卡场景 id 不存在：${sceneId}`);
        return;
      }
      if (!Array.isArray(words) || words.length === 0) {
        fail(`${label} 的场景 ${sceneId} 没有词条`);
        return;
      }

      words.forEach((word) => {
        if (!word?.term) fail(`${label} 的场景 ${sceneId} 有词条缺少 term`);
        if (!word?.meaning) fail(`${label} 词条「${word?.term}」缺少 meaning`);
        if (!word?.example) fail(`${label} 词条「${word?.term}」缺少 example`);
        if (!word?.term) return;

        if (terms.has(word.term)) fail(`${label} 词条重复：${word.term}`);
        terms.add(word.term);

        const source = `${scene.textYue || ""}${scene.audioText || ""}`;
        const glossaryTerms = (scene.glossary || []).map((item) => item.term);
        if (!source.includes(word.term) && !glossaryTerms.includes(word.term)) {
          fail(`${label} 词条「${word.term}」不在 ${sceneId} 原文或词注中`);
        }
      });
    });
  }

  if (terms.size < 3) {
    fail(`${label} 关键词少于 3 个，实际 ${terms.size}`);
  }

  if (!Array.isArray(entry.quiz) || entry.quiz.length < 3) {
    fail(`${label} 小测少于 3 题`);
  } else {
    entry.quiz.forEach((question, index) => {
      const quizLabel = `${label} 第 ${index + 1} 题`;
      if (!question?.question) fail(`${quizLabel} 缺少题干`);
      if (!question?.hint) fail(`${quizLabel} 缺少提示`);

      if (!Array.isArray(question?.options) || question.options.length < 2) {
        fail(`${quizLabel} 选项少于 2 个`);
      } else {
        if (question.options.length > 4) fail(`${quizLabel} 选项多于 4 个`);
        if (new Set(question.options).size !== question.options.length) {
          fail(`${quizLabel} 选项重复`);
        }
        if (
          !Number.isInteger(question.answer) ||
          question.answer < 0 ||
          question.answer >= question.options.length
        ) {
          fail(`${quizLabel} 的 answer 越界：${question.answer}`);
        }
      }
    });
  }
});

ok(`儿童学习内容 ${Object.keys(learning).length} 个故事`);

// 5. 汇总
console.log("声迹内容校验");
console.log("--------------------------------------");
notes.forEach((note) => console.log(`  ${note}`));
console.log("--------------------------------------");

if (errors.length) {
  console.error(`发现 ${errors.length} 个问题：`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exitCode = 1;
} else {
  console.log("全部通过。");
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const notes = [];

const fail = (message) => errors.push(message);
const ok = (message) => notes.push(message);

const MODES = new Set(["heritage", "ghost", "wild_history"]);

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

ok(`故事 ${stories.length} 个`);

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

// 4. 汇总
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

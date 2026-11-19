import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { kidStories } from "../lib/kids.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const corpusRoot = path.join(root, "data/corpus");

const newSlugs = [
  "ding-ding-zyun",
  "dim-cung-cung",
  "pai-pai-sit-fan-gwo",
  "lok-jyu-daai",
  "nin-jaa-baat-sai-laat-taai",
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".json") ? [full] : [];
  });
}

function readCorpus() {
  return walk(corpusRoot)
    .filter((file) => path.basename(file) !== "meta.json")
    .filter((file) => !file.includes(`${path.sep}golden${path.sep}`))
    .flatMap((file) => JSON.parse(fs.readFileSync(file, "utf8")));
}

test("v0.8 五个适龄故事都进入儿童池", () => {
  const pool = kidStories();
  assert.ok(pool.length >= 8, `儿童池至少 8 个，实际 ${pool.length}`);

  for (const slug of newSlugs) {
    const story = pool.find((item) => item.slug === slug);
    assert.ok(story, `${slug} 不在儿童池`);
    assert.ok(story.ageBand === "4-6" || story.ageBand === "6-9");
    assert.ok(story.cover.endsWith(`${slug}.webp`));
    assert.ok(
      fs.existsSync(path.join(root, "public/covers", `${slug}.webp`)),
      `${slug} 缺少封面`
    );

    const endings = story.scenes.filter((scene) => scene.ending);
    assert.equal(endings.length, 2, `${slug} 应有两个结局`);
    assert.ok(story.scenes.length >= 3 && story.scenes.length <= 8);
  }
});

test("资料库有 10 条以上适龄素材且都标注年龄", () => {
  const items = readCorpus();
  const allIds = items.map((item) => item.id);
  assert.equal(new Set(allIds).size, allIds.length, "资料库存在重复 id");

  const kidItems = items.filter((item) => item.kidSafe);
  assert.ok(kidItems.length >= 10, `适龄素材至少 10 条，实际 ${kidItems.length}`);

  for (const item of kidItems) {
    assert.ok(
      item.ageBand === "4-6" || item.ageBand === "6-9",
      `${item.id} 的年龄不合法`
    );
    assert.ok(Array.isArray(item.source) && item.source.length > 0);
    assert.ok(item.title && item.summary);
  }
});

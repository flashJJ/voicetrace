import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { kidStories } from "../lib/kids.js";
import { stories } from "../lib/stories.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const i18nDir = path.join(root, "data/i18n");

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(i18nDir, name), "utf8"));

const storyFiles = [
  "stories-kid-new-en.json",
  "stories-heritage-kid-en.json",
  "stories-heritage-long-en.json",
  "stories-ghost-en.json",
  "stories-wild-en.json",
];

const overlays = storyFiles.reduce(
  (acc, file) => ({ ...acc, ...readJson(file) }),
  {}
);
const learningEn = readJson("learning-en.json");
const learningZh = JSON.parse(
  fs.readFileSync(path.join(root, "data/kids/learning.json"), "utf8")
);

test("25 个故事都有完整的英文覆盖", () => {
  assert.equal(stories.length, 25);
  assert.equal(Object.keys(overlays).length, stories.length);

  for (const story of stories) {
    const overlay = overlays[story.slug];
    assert.ok(overlay, `${story.slug} 缺少英文覆盖`);

    for (const field of ["title", "subtitle", "quote", "intro", "dialect", "type", "duration"]) {
      assert.ok(
        typeof overlay[field] === "string" && overlay[field].trim(),
        `${story.slug} 的英文 ${field} 为空`
      );
    }

    for (const scene of story.scenes) {
      const translated = overlay.scenes?.[scene.id];
      assert.ok(
        translated?.title?.trim() && translated?.text?.trim(),
        `${story.slug} 的 ${scene.id} 缺少英文标题或正文`
      );
      if (scene.ending) {
        assert.ok(
          translated.endingText?.trim(),
          `${story.slug} 的结局 ${scene.id} 缺少英文结局文字`
        );
      }

      const labels = overlay.choices?.[scene.id] || [];
      assert.equal(
        labels.length,
        scene.choices?.length || 0,
        `${story.slug} 的 ${scene.id} 选项数量不一致`
      );
      labels.forEach((label) => assert.ok(label.trim(), `${story.slug} 存在空选项`));

      for (const entry of scene.glossary || []) {
        assert.ok(
          overlay.glossary?.[entry.term]?.meaning?.trim(),
          `${story.slug} 的方言词「${entry.term}」缺少英文释义`
        );
      }
    }
  }
});

test("14 个儿童故事都有英文词卡与小测覆盖", () => {
  const pool = kidStories();
  assert.equal(pool.length, 14);

  for (const story of pool) {
    const zh = learningZh[story.slug];
    const en = learningEn[story.slug];
    assert.ok(zh, `${story.slug} 缺少中文学习数据`);
    assert.ok(en, `${story.slug} 缺少英文学习数据`);

    for (const scene of story.scenes) {
      const zhWords = zh.sceneWords?.[scene.id] || [];
      const enWords = en.sceneWords?.[scene.id] || [];
      assert.equal(
        enWords.length,
        zhWords.length,
        `${story.slug} 的 ${scene.id} 词卡数量不一致`
      );
      enWords.forEach((word, index) => {
        assert.ok(word.meaning?.trim(), `${story.slug} 的 ${scene.id} 第 ${index + 1} 个词缺少释义`);
        assert.ok(word.example?.trim(), `${story.slug} 的 ${scene.id} 第 ${index + 1} 个词缺少例句`);
      });
    }

    assert.equal(
      en.quiz?.length,
      zh.quiz?.length,
      `${story.slug} 的英文小测题数不一致`
    );
    en.quiz.forEach((question, index) => {
      assert.ok(question.question?.trim(), `${story.slug} 第 ${index + 1} 题缺少题干`);
      assert.ok(question.hint?.trim(), `${story.slug} 第 ${index + 1} 题缺少提示`);
      assert.equal(
        question.options?.length,
        zh.quiz[index].options.length,
        `${story.slug} 第 ${index + 1} 题的选项数量不一致`
      );
      question.options.forEach((option) => {
        assert.ok(option.trim(), `${story.slug} 第 ${index + 1} 题存在空选项`);
      });
    });
  }
});

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { kidStories } from "../lib/kids.js";
import {
  collectWordTerms,
  emptyKidProgress,
  summarizeKidProgress,
} from "../lib/kid-progress.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const learning = JSON.parse(
  fs.readFileSync(path.join(root, "data/kids/learning.json"), "utf8")
);

test("每个儿童故事都有词卡与至少 3 道小测", () => {
  for (const story of kidStories()) {
    const entry = learning[story.slug];
    assert.ok(entry, `${story.slug} 缺少学习内容`);

    const terms = collectWordTerms(entry);
    assert.ok(terms.length >= 3, `${story.slug} 关键词少于 3 个`);
    assert.ok(Array.isArray(entry.quiz), `${story.slug} 缺少 quiz`);
    assert.ok(entry.quiz.length >= 3, `${story.slug} 小测少于 3 题`);
  }
});

test("词卡场景合法且词条来自原文或词注", () => {
  for (const story of kidStories()) {
    const entry = learning[story.slug];
    const scenes = new Map(story.scenes.map((scene) => [scene.id, scene]));

    for (const [sceneId, words] of Object.entries(entry.sceneWords)) {
      const scene = scenes.get(sceneId);
      assert.ok(scene, `${story.slug} 的词卡场景不存在：${sceneId}`);
      assert.ok(words.length > 0, `${story.slug} 的场景 ${sceneId} 没有词条`);

      for (const word of words) {
        assert.ok(word.term && word.meaning && word.example, "词条字段不完整");
        const source = `${scene.textYue || ""}${scene.audioText || ""}`;
        const glossary = (scene.glossary || []).map((item) => item.term);
        assert.ok(
          source.includes(word.term) || glossary.includes(word.term),
          `${story.slug} 的词条「${word.term}」不在 ${sceneId} 原文或词注中`
        );
      }
    }
  }
});

test("小测答案索引合法且选项不重复", () => {
  for (const story of kidStories()) {
    const entry = learning[story.slug];
    for (const question of entry.quiz) {
      assert.ok(question.question, `${story.slug} 有题目缺少题干`);
      assert.ok(question.hint, `${story.slug} 有题目缺少提示`);
      assert.ok(Array.isArray(question.options), `${story.slug} 有题目缺少选项`);
      assert.ok(question.options.length >= 2, `${story.slug} 有题目选项不足`);
      assert.equal(
        new Set(question.options).size,
        question.options.length,
        `${story.slug} 有题目选项重复`
      );
      assert.ok(
        Number.isInteger(question.answer) &&
          question.answer >= 0 &&
          question.answer < question.options.length,
        `${story.slug} 有题目答案越界`
      );
    }
  }
});

test("学习小结只统计有效场景与词语", () => {
  const story = kidStories()[0];
  const entry = learning[story.slug];
  const firstWord = collectWordTerms(entry)[0];

  const summary = summarizeKidProgress(story, entry, {
    visited: [story.scenes[0].id, story.scenes[0].id, "missing-scene"],
    recorded: [story.scenes[0].id],
    words: [firstWord, "missing-word"],
    quiz: { answers: [0, -1], correct: 1 },
    updatedAt: 1,
  });

  assert.equal(summary.scenesTotal, story.scenes.length);
  assert.equal(summary.visitedCount, 1);
  assert.equal(summary.recordedCount, 1);
  assert.equal(summary.wordsKnown, 1);
  assert.equal(summary.quizAnswered, 1);
  assert.equal(summary.quizCorrect, 1);
  assert.equal(summary.steps.listen, true);
  assert.equal(summary.steps.readAlong, true);
  assert.equal(summary.steps.words, true);
  assert.equal(summary.steps.quiz, true);
});

test("空进度返回零值", () => {
  const story = kidStories()[0];
  const summary = summarizeKidProgress(story, learning[story.slug], emptyKidProgress());

  assert.equal(summary.visitedCount, 0);
  assert.equal(summary.recordedCount, 0);
  assert.equal(summary.wordsKnown, 0);
  assert.equal(summary.quizAnswered, 0);
  assert.deepEqual(summary.steps, {
    listen: false,
    readAlong: false,
    words: false,
    quiz: false,
  });
});

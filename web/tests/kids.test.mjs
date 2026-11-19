import assert from "node:assert/strict";
import test from "node:test";

import { KID_BANDS, getKidStory, isKidSafe, kidGroups, kidStories } from "../lib/kids.js";
import { ageBandLabel, stories } from "../lib/stories.js";

test("儿童故事池不含鬼故事与成人内容", () => {
  const pool = kidStories();
  assert.ok(pool.length > 0, "儿童池不应为空");
  assert.equal(pool.length, stories.filter((story) => story.kidSafe).length);

  for (const story of pool) {
    assert.equal(story.kidSafe, true, `${story.slug} 应标记 kidSafe`);
    assert.notEqual(story.mode, "ghost", `${story.slug} 不应是鬼故事`);
    assert.ok(["4-6", "6-9"].includes(story.ageBand), `${story.slug} 年龄分组异常`);
  }
});

test("儿童池按年龄分组且不重复", () => {
  const groups = kidGroups();
  assert.deepEqual(
    groups.map((group) => group.key),
    KID_BANDS.map((band) => band.key)
  );

  const seen = new Set();
  for (const group of groups) {
    assert.ok(group.stories.length > 0, `${group.key} 组不应为空`);
    for (const story of group.stories) {
      assert.equal(story.ageBand, group.key);
      assert.ok(!seen.has(story.slug), `${story.slug} 出现在多个年龄组`);
      seen.add(story.slug);
    }
  }
  assert.equal(seen.size, kidStories().length);
});

test("getKidStory 与 isKidSafe 只认儿童池", () => {
  const kid = kidStories()[0];
  assert.equal(getKidStory(kid.slug)?.slug, kid.slug);
  assert.equal(getKidStory("eagle-orchid"), null);
  assert.equal(getKidStory("not-exist"), null);
  assert.equal(isKidSafe(kid.slug), true);
  assert.equal(isKidSafe("eagle-orchid"), false);
});

test("年龄标签覆盖所有分级", () => {
  assert.equal(ageBandLabel("4-6"), "4-6 岁");
  assert.equal(ageBandLabel("6-9"), "6-9 岁");
  assert.equal(ageBandLabel("10+"), "10 岁以上");
  assert.equal(ageBandLabel(""), "");
});

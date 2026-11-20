import assert from "node:assert/strict";
import test from "node:test";

import { filterStories } from "../lib/story-search.js";

const items = [
  {
    slug: "moonlight",
    title: "月光光",
    subtitle: "一首童谣",
    intro: "西关骑楼下的月光",
    dialect: "粤语 · 广州西关",
    type: "公有领域改编",
    mode: "heritage",
    ageBand: "4-6",
  },
  {
    slug: "ghost-shop",
    title: "夜半敲门的杂货铺",
    subtitle: "西关鬼故事",
    intro: "夜色里的骑楼",
    dialect: "粤语 · 广州",
    type: "虚构示例",
    mode: "ghost",
    ageBand: "10+",
  },
  {
    slug: "five-goats",
    title: "五羊传说",
    subtitle: "五只羊，一座城",
    intro: "越秀山上的仙人",
    dialect: "粤语 · 广州",
    type: "地方传说",
    mode: "heritage",
    ageBand: "6-9",
  },
];

test("搜索可匹配标题、地点与方言", () => {
  assert.deepEqual(
    filterStories(items, { query: "月光" }).map((item) => item.slug),
    ["moonlight"]
  );
  assert.deepEqual(
    filterStories(items, { query: "越秀山" }).map((item) => item.slug),
    ["five-goats"]
  );
  assert.deepEqual(
    filterStories(items, { query: "西关" }).map((item) => item.slug),
    ["moonlight", "ghost-shop"]
  );
});

test("模式、年龄与收藏筛选可叠加", () => {
  assert.deepEqual(
    filterStories(items, { mode: "heritage" }).map((item) => item.slug),
    ["moonlight", "five-goats"]
  );
  assert.deepEqual(
    filterStories(items, { ageBand: "4-6" }).map((item) => item.slug),
    ["moonlight"]
  );
  assert.deepEqual(
    filterStories(items, { favoritesOnly: true }, ["five-goats"]).map((item) => item.slug),
    ["five-goats"]
  );
  assert.deepEqual(
    filterStories(
      items,
      { query: "广州", mode: "heritage", ageBand: "6-9" },
      []
    ).map((item) => item.slug),
    ["five-goats"]
  );
});

test("空关键词与空白关键词返回全部结果", () => {
  assert.equal(filterStories(items, {}).length, 3);
  assert.equal(filterStories(items, { query: "   " }).length, 3);
});

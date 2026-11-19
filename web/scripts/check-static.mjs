import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");
const errors = [];

function exists(relative) {
  return fs.existsSync(path.join(outDir, relative));
}

function read(relative) {
  return fs.readFileSync(path.join(outDir, relative), "utf8");
}

function requirePage(relative) {
  if (!exists(relative)) {
    errors.push(`缺少静态页面：out/${relative}`);
    return "";
  }
  return read(relative);
}

if (!fs.existsSync(outDir)) {
  console.error("找不到 out 目录，请先运行 node scripts/build-static.mjs");
  process.exit(1);
}

const basePages = [
  "index.html",
  "404.html",
  "stories/index.html",
  "kids/index.html",
  "kids/parent/index.html",
  "kids/record/index.html",
  "record/index.html",
  "archive/index.html",
  "map/index.html",
];

basePages.forEach(requirePage);

const { kidStories } = await import(pathToFileURL(path.join(root, "lib/kids.js")).href);
const { stories } = await import(pathToFileURL(path.join(root, "lib/stories.js")).href);

const kidsIndex = exists("kids/index.html") ? read("kids/index.html") : "";

for (const story of kidStories()) {
  const html = requirePage(`kids/${story.slug}/index.html`);
  if (html) {
    if (!html.includes("儿童模式")) {
      errors.push(`儿童故事页 ${story.slug} 缺少「儿童模式」标识`);
    }
    if (!html.includes("返回儿童故事")) {
      errors.push(`儿童故事页 ${story.slug} 缺少「返回儿童故事」链接`);
    }
  }
  if (kidsIndex && !kidsIndex.includes(story.title)) {
    errors.push(`儿童首页缺少故事《${story.title}》`);
  }
}

for (const story of stories.filter((item) => item.mode === "ghost")) {
  if (kidsIndex.includes(story.title)) {
    errors.push(`儿童首页不应出现鬼故事《${story.title}》`);
  }
}

function bundleContains(chunksDir, keyword) {
  if (!fs.existsSync(chunksDir)) return false;
  return fs.readdirSync(chunksDir, { withFileTypes: true }).some((entry) => {
    const full = path.join(chunksDir, entry.name);
    if (entry.isDirectory()) return bundleContains(full, keyword);
    if (!entry.name.endsWith(".js")) return false;
    return fs.readFileSync(full, "utf8").includes(keyword);
  });
}

if (!bundleContains(path.join(outDir, "_next/static"), "/kids/record")) {
  errors.push("客户端产物里找不到 /kids/record 链接");
}

const parentHtml = exists("kids/parent/index.html") ? read("kids/parent/index.html") : "";
if (parentHtml && !parentHtml.includes("这一步请家长完成")) {
  errors.push("家长说明页缺少家长门确认");
}

const chunksDir = path.join(outDir, "_next/static");
if (!bundleContains(chunksDir, "voicetrace:last-kid-story")) {
  errors.push("客户端产物里找不到「记住上次故事」逻辑");
}

console.log("声迹静态产物检查");
console.log("--------------------------------------");
console.log(`  儿童故事页 ${kidStories().length} 个`);
console.log(`  基础页面 ${basePages.length} 个`);
console.log(`  儿童录音链接 ${bundleContains(chunksDir, "/kids/record") ? "已打包" : "缺失"}`);
console.log(`  家长门 ${parentHtml.includes("这一步请家长完成") ? "已生成" : "缺失"}`);
console.log("--------------------------------------");

if (errors.length) {
  console.error(`发现 ${errors.length} 个问题：`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exitCode = 1;
} else {
  console.log("全部通过。");
}

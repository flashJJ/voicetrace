import assert from "node:assert/strict";
import test from "node:test";

import {
  PACK_VERSION,
  archivePackFilename,
  taskPackFilename,
  validatePack,
} from "../lib/family-pack.js";
import {
  extensionFor,
  formatBytes,
  formatDuration,
  recordingId,
} from "../lib/recordings.js";

test("任务包校验通过", () => {
  const pack = validatePack({
    version: PACK_VERSION,
    kind: "task",
    storySlug: "moonlight",
    scenes: [],
  });
  assert.equal(pack.kind, "task");
});

test("档案包校验通过", () => {
  const pack = validatePack({ version: PACK_VERSION, kind: "archive", entries: [] });
  assert.equal(pack.kind, "archive");
});

test("非法文件会被拒绝", () => {
  assert.throws(() => validatePack(null), /可识别/);
  assert.throws(() => validatePack({ version: 999, kind: "task" }), /可识别/);
  assert.throws(() => validatePack({ version: PACK_VERSION, kind: "task" }), /任务包内容不完整/);
  assert.throws(() => validatePack({ version: PACK_VERSION, kind: "archive" }), /档案包内容不完整/);
  assert.throws(() => validatePack({ version: PACK_VERSION, kind: "other" }), /无法识别/);
});

test("导出文件名带日期和故事", () => {
  assert.match(taskPackFilename("moonlight"), /^voicetrace-task-moonlight-\d{4}-\d{2}-\d{2}\.json$/);
  assert.match(archivePackFilename(), /^voicetrace-archive-\d{4}-\d{2}-\d{2}\.json$/);
});

test("录音工具函数", () => {
  assert.equal(recordingId("moonlight", "moonlight-1"), "moonlight::moonlight-1");
  assert.equal(formatDuration(0), "0:00");
  assert.equal(formatDuration(65), "1:05");
  assert.equal(formatBytes(0), "0 KB");
  assert.equal(formatBytes(2048), "2 KB");
  assert.equal(formatBytes(2 * 1024 * 1024), "2.0 MB");
  assert.equal(extensionFor("audio/webm;codecs=opus"), "webm");
  assert.equal(extensionFor("audio/mp4"), "m4a");
  assert.equal(extensionFor("audio/ogg"), "ogg");
});

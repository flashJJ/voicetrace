import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_RATE, RATES, normalizeRate } from "../lib/playback.js";

test("朗读速度只接受慢速、标准、原速三档", () => {
  assert.deepEqual(RATES, [0.7, 0.9, 1]);
  assert.equal(DEFAULT_RATE, 0.9);
  assert.equal(normalizeRate(0.7), 0.7);
  assert.equal(normalizeRate(1), 1);
  assert.equal(normalizeRate(1.5), DEFAULT_RATE);
  assert.equal(normalizeRate(Number.NaN), DEFAULT_RATE);
  assert.equal(normalizeRate("0.9"), DEFAULT_RATE);
});

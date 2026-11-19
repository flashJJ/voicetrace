import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_ACTS,
  MIN_ACTS,
  describePlan,
  normalizeActs,
  planNarrative,
  validatePlan,
} from "../lib/narrative.js";

function buildOutput(plan) {
  return {
    scenes: plan.scenes.map((scene) => ({
      id: scene.id,
      act: scene.act,
      ending: Boolean(scene.ending),
      choices: scene.choices.map((next) => ({ label: `去 ${next}`, next })),
    })),
  };
}

test("幕数归一化只接受 3-8", () => {
  assert.equal(normalizeActs(3), 3);
  assert.equal(normalizeActs("8"), 8);
  assert.equal(normalizeActs(2), null);
  assert.equal(normalizeActs(9), null);
  assert.equal(normalizeActs("abc"), null);
});

test("同一个 seed 生成相同计划", () => {
  assert.deepEqual(planNarrative("same-seed"), planNarrative("same-seed"));
});

test("100 个种子都生成合法计划", () => {
  for (let index = 0; index < 100; index += 1) {
    const plan = planNarrative(`seed-${index}`);
    assert.ok(plan.actCount >= MIN_ACTS && plan.actCount <= MAX_ACTS);
    assert.ok(plan.scenes.length >= plan.actCount + 1);

    const ids = new Set(plan.scenes.map((scene) => scene.id));
    assert.equal(new Set(ids).size, plan.scenes.length, `seed-${index} 场景 id 重复`);

    const endings = plan.scenes.filter((scene) => scene.ending);
    assert.equal(endings.length, 2, `seed-${index} 应有 2 个结局`);

    for (const scene of plan.scenes) {
      if (scene.ending) {
        assert.deepEqual(scene.choices, []);
        continue;
      }
      assert.ok(scene.choices.length >= 1 && scene.choices.length <= 2);
      for (const next of scene.choices) {
        assert.ok(ids.has(next), `${scene.id} 指向未知场景 ${next}`);
      }
    }

    assert.deepEqual(validatePlan(buildOutput(plan), plan), []);
    assert.match(describePlan(plan), new RegExp(`^${plan.actCount} 幕`));
  }
});

test("指定幕数会覆盖随机", () => {
  const plan = planNarrative("fixed", 6);
  assert.equal(plan.actCount, 6);
  assert.equal(Math.max(...plan.scenes.map((scene) => scene.act)), 6);
});

test("validatePlan 能发现缺场景与悬空选择", () => {
  const plan = planNarrative("broken", 4);
  const output = buildOutput(plan);
  output.scenes.pop();
  output.scenes[0].choices[0] = { label: "飞走", next: "nowhere" };

  const issues = validatePlan(output, plan);
  assert.ok(issues.some((issue) => issue.includes("缺少场景")));
  assert.ok(issues.some((issue) => issue.includes("未知场景") || issue.includes("多出场景")) || issues.length >= 2);
});

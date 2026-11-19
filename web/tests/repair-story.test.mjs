import assert from "node:assert/strict";
import test from "node:test";

import { planNarrative, validatePlan } from "../lib/narrative.js";
import { repairStory } from "../lib/repair-story.js";

function makeOutput(plan, rawChoices) {
  return {
    scenes: plan.scenes.map((scene) => ({
      id: scene.id,
      act: scene.act,
      title: scene.id,
      textYue: "测试粤语",
      textZh: "测试普通话",
      ending: Boolean(scene.ending),
      choices: typeof rawChoices === "function" ? rawChoices(scene) : rawChoices,
    })),
  };
}

test("数字 choices 会按计划重建", () => {
  const plan = planNarrative("repair-seed", 5);
  const output = makeOutput(plan, [2024, 2024]);

  const { output: fixed, repairs } = repairStory(output, plan);
  assert.ok(repairs > 0);
  assert.equal(fixed.scenes.length, plan.scenes.length);

  for (const scene of fixed.scenes) {
    const planScene = plan.scenes.find((item) => item.id === scene.id);
    if (planScene.ending) {
      assert.deepEqual(scene.choices, []);
      continue;
    }
    assert.equal(scene.choices.length, planScene.choices.length);
    scene.choices.forEach((choice, index) => {
      assert.equal(typeof choice.label, "string");
      assert.ok(choice.label.length > 0);
      assert.equal(choice.next, planScene.choices[index]);
    });
  }

  assert.deepEqual(validatePlan(fixed, plan), []);
});

test("合法输出不会被修复", () => {
  const plan = planNarrative("clean-seed", 4);
  const output = makeOutput(plan, (scene) =>
    scene.choices.map((next) => ({ label: `前往 ${next}`, next }))
  );

  const { output: fixed, repairs } = repairStory(output, plan);
  assert.equal(repairs, 0);
  assert.deepEqual(validatePlan(fixed, plan), []);
});

test("缺场景时不会凭空补造", () => {
  const plan = planNarrative("missing-seed", 3);
  const output = makeOutput(plan, (scene) =>
    scene.choices.map((next) => ({ label: `前往 ${next}`, next }))
  );
  output.scenes = output.scenes.slice(1);

  const { output: fixed } = repairStory(output, plan);
  const ids = new Set(fixed.scenes.map((scene) => scene.id));
  assert.ok(!ids.has(plan.scenes[0].id));
});

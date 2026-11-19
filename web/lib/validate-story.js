import { MAX_ACTS, MIN_ACTS, validatePlan } from "./narrative.js";

export function validateStory(output, golden, sourceText, plan) {
  const checks = [];
  const push = (name, pass, detail = "") => checks.push({ name, pass, detail });

  const scenes = Array.isArray(output?.scenes) ? output.scenes : [];
  const acts = new Set(scenes.map((scene) => Number(scene.act)).filter(Number.isInteger));
  const nonEnding = scenes.filter((scene) => !scene.ending);
  const planIssues = plan ? validatePlan(output, plan) : [];

  push("json_schema_valid", Boolean(output && scenes.length && output.glossary && output.translationZh));
  push(
    `act_count ${MIN_ACTS}-${MAX_ACTS}`,
    acts.size >= MIN_ACTS && acts.size <= MAX_ACTS,
    `实际 ${acts.size} 幕`
  );
  push("plan_matches", planIssues.length === 0, planIssues.slice(0, 3).join("；"));
  push(
    "ending_scene_present",
    scenes.some((scene) => scene.ending === true && (scene.choices || []).length === 0)
  );
  push(
    "glossary_terms_present",
    (golden?.expected?.glossary || []).every((expected) =>
      (output?.glossary || []).some((actual) => actual.term === expected.term)
    )
  );
  push("translation_present", Boolean(output?.translationZh));
  push(
    "entities_are_grounded",
    (output?.entities || []).every(
      (entity) => sourceText.includes(entity) || (golden?.expected?.entities || []).includes(entity)
    )
  );
  push(
    "choices_present",
    nonEnding.length > 0 &&
      nonEnding.every((scene) => (scene.choices || []).length >= 1)
  );

  return checks;
}

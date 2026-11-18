export function validateStory(output, golden, sourceText) {
  const checks = [];
  const push = (name, pass, detail = "") => checks.push({ name, pass, detail });

  push("json_schema_valid", Boolean(output && output.scenes && output.glossary && output.translationZh));
  push("scene_count == 3", Array.isArray(output?.scenes) && output.scenes.length === 3);
  push(
    "ending_scene_present",
    Array.isArray(output?.scenes) &&
      output.scenes.length === 3 &&
      (output.scenes[2].choices || []).length === 0
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
    (output?.scenes || []).slice(0, 2).every((scene) => (scene.choices || []).length >= 2)
  );

  return checks;
}

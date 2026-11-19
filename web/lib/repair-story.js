const FALLBACK_LABELS = {
  1: "继续走下去",
  2: "换一个方向",
};

function fallbackLabel(next, index) {
  const base = FALLBACK_LABELS[Math.min(index + 1, 2)] || "继续";
  return `${base}`;
}

function labelOf(choice, index) {
  if (choice && typeof choice === "object" && typeof choice.label === "string") {
    const clean = choice.label.trim();
    if (clean) return clean.slice(0, 30);
  }
  return fallbackLabel(null, index);
}

export function repairStory(output, plan) {
  if (!output || !Array.isArray(output.scenes) || !plan) {
    return { output, repairs: 0 };
  }

  const byId = new Map(
    output.scenes.filter((scene) => scene && typeof scene.id === "string").map((scene) => [scene.id, scene])
  );
  const planIds = new Set(plan.scenes.map((scene) => scene.id));
  let repairs = 0;

  const scenes = plan.scenes
    .map((planScene) => {
      const scene = byId.get(planScene.id);
      if (!scene) return null;

      if (planScene.ending) {
        if (!scene.ending) scene.ending = true;
        if (!Array.isArray(scene.choices) || scene.choices.length > 0) {
          scene.choices = [];
          repairs += 1;
        }
        return scene;
      }

      const rawChoices = Array.isArray(scene.choices) ? scene.choices : [];
      const validChoices = rawChoices.filter(
        (choice) =>
          choice &&
          typeof choice === "object" &&
          typeof choice.next === "string" &&
          planIds.has(choice.next)
      );

      if (validChoices.length !== planScene.choices.length || validChoices.length !== rawChoices.length) {
        scene.choices = planScene.choices.map((next, index) => ({
          label: labelOf(rawChoices[index], index),
          next,
        }));
        repairs += 1;
      } else {
        scene.choices = validChoices.map((choice, index) => ({
          label: labelOf(choice, index),
          next: choice.next,
        }));
      }
      return scene;
    })
    .filter(Boolean);

  return { output: { ...output, scenes }, repairs };
}

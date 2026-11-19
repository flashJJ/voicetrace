export const MIN_ACTS = 3;
export const MAX_ACTS = 8;

export const SKELETONS = ["straight", "early_split", "late_split", "double_fork"];

export const SKELETON_LABELS = {
  straight: "单线递进",
  early_split: "早分叉晚汇合",
  late_split: "晚分叉",
  double_fork: "双分叉",
};

const ACT_WEIGHTS = [
  [3, 8],
  [4, 18],
  [5, 26],
  [6, 22],
  [7, 16],
  [8, 10],
];

export function normalizeActs(value) {
  const acts = Number(value);
  if (!Number.isInteger(acts)) return null;
  if (acts < MIN_ACTS || acts > MAX_ACTS) return null;
  return acts;
}

function hashSeed(input) {
  const text = String(input);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pickActs(rng) {
  const total = ACT_WEIGHTS.reduce((sum, [, weight]) => sum + weight, 0);
  let point = rng() * total;
  for (const [acts, weight] of ACT_WEIGHTS) {
    point -= weight;
    if (point <= 0) return acts;
  }
  return 5;
}

function sideActsFor(skeleton, actCount) {
  const maxSide = actCount - 2;
  if (maxSide < 2) return [];
  if (skeleton === "early_split") return [2];
  if (skeleton === "late_split") return [maxSide];
  if (skeleton === "double_fork") {
    return Array.from(new Set([2, maxSide])).filter((act) => act <= maxSide);
  }
  return [];
}

export function planNarrative(seedInput, requestedActs) {
  const seed = hashSeed(seedInput);
  const rng = createRng(seed);
  const actCount = normalizeActs(requestedActs) || pickActs(rng);

  let skeleton = SKELETONS[Math.floor(rng() * SKELETONS.length)];
  let sideActs = sideActsFor(skeleton, actCount);
  if (skeleton !== "straight" && sideActs.length === 0) {
    skeleton = "straight";
    sideActs = [];
  }

  const scenes = [];
  for (let act = 1; act < actCount; act += 1) {
    scenes.push({ id: `s${act}`, act, ending: false });
  }
  for (const act of sideActs) {
    scenes.push({ id: `s${act}b`, act, ending: false });
  }
  scenes.push({ id: "e1", act: actCount, ending: true });
  scenes.push({ id: "e2", act: actCount, ending: true });

  const sceneIds = new Set(scenes.map((scene) => scene.id));
  for (const scene of scenes) {
    if (scene.ending) {
      scene.choices = [];
      continue;
    }
    if (scene.id.endsWith("b")) {
      scene.choices = [`s${scene.act + 1}`];
      continue;
    }
    if (scene.act === actCount - 1) {
      scene.choices = ["e1", "e2"];
      continue;
    }
    if (sideActs.includes(scene.act)) {
      scene.choices = [`s${scene.act + 1}`, `s${scene.act}b`];
      continue;
    }
    scene.choices = [`s${scene.act + 1}`, `s${scene.act + 1}`];
    if (!sceneIds.has(scene.choices[0])) scene.choices = ["e1", "e2"];
  }

  return {
    seed,
    actCount,
    skeleton,
    skeletonLabel: SKELETON_LABELS[skeleton],
    scenes,
  };
}

export function describePlan(plan) {
  return `${plan.actCount} 幕 · ${plan.skeletonLabel} · seed ${plan.seed}`;
}

export function planTable(plan) {
  return plan.scenes
    .map((scene) => {
      if (scene.ending) {
        return `- ${scene.id}（第 ${scene.act} 幕 · 结局）→ 必须 ending: true，choices 为空数组`;
      }
      return `- ${scene.id}（第 ${scene.act} 幕）→ choices 的 next 必须是：${scene.choices.join("、")}`;
    })
    .join("\n");
}

export function validatePlan(output, plan) {
  const scenes = Array.isArray(output?.scenes) ? output.scenes : [];
  const byId = new Map(scenes.map((scene) => [scene.id, scene]));
  const expected = new Set(plan.scenes.map((scene) => scene.id));
  const issues = [];

  for (const scene of plan.scenes) {
    if (!byId.has(scene.id)) issues.push(`缺少场景 ${scene.id}`);
  }
  for (const scene of scenes) {
    if (!expected.has(scene.id)) issues.push(`多出场景 ${scene.id}`);
  }
  for (const scene of plan.scenes) {
    const actual = byId.get(scene.id);
    if (!actual) continue;
    if (scene.ending) {
      if ((actual.choices || []).length !== 0) issues.push(`${scene.id} 结局不应有选择`);
      continue;
    }
    const choices = actual.choices || [];
    if (choices.length < 1 || choices.length > 2) {
      issues.push(`${scene.id} 选择数量应为 1-2`);
    }
    for (const choice of choices) {
      if (!expected.has(choice.next)) issues.push(`${scene.id} 指向未知场景 ${choice.next}`);
    }
  }

  const acts = new Set(scenes.map((scene) => Number(scene.act)).filter(Number.isInteger));
  if (acts.size < MIN_ACTS || acts.size > MAX_ACTS) {
    issues.push(`幕数 ${acts.size} 不在 ${MIN_ACTS}-${MAX_ACTS}`);
  }
  if (acts.size !== plan.actCount) {
    issues.push(`幕数 ${acts.size} 与计划 ${plan.actCount} 不一致`);
  }

  return issues;
}

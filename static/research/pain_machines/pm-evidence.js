import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const C = {
  bg: 0x030405,
  pain: 0xb85c55,
  pleasure: 0x7a9a8c,
  gold: 0xb89a6a,
  muted: 0x8a9199,
  dim: 0x555c64,
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => window.matchMedia('(max-width: 720px)').matches;

function v3(x, y, z) {
  return new THREE.Vector3(x, y, z);
}

function bindControls(root, widget) {
  const presetWrap = root.querySelector('.pm-ev-presets');
  widget.preset = presetWrap?.dataset.default || '';
  if (presetWrap) {
    presetWrap.querySelectorAll('.pm-ev-preset').forEach((btn) => {
      const on = btn.dataset.preset === widget.preset;
      btn.classList.toggle('is-active', on);
      btn.addEventListener('click', () => {
        widget.preset = btn.dataset.preset;
        presetWrap.querySelectorAll('.pm-ev-preset').forEach((b) => {
          b.classList.toggle('is-active', b.dataset.preset === widget.preset);
        });
      });
    });
  }
  const scrubEl = root.querySelector('[data-scrub]');
  widget.months = scrubEl ? Number(scrubEl.value) : 0;
  if (scrubEl) {
    const valEl = root.querySelector(`[data-scrub-val="${scrubEl.dataset.scrub}"]`);
    scrubEl.addEventListener('input', () => {
      widget.months = Number(scrubEl.value);
      if (valEl) valEl.textContent = scrubEl.value;
    });
  }
}

function icd11Case(months) {
  const m = Number(months) || 0;
  const injury = Math.max(0, 1 - m / 8);
  const branches = Math.min(7, Math.max(0, Math.round((m - 2) / 2.5)));
  return {
    state: { injury, branches, months: m },
    lesson:
      m < 3
        ? 'Weeks 0–8: acute injury signal still visible — taxonomy not yet needed.'
        : m < 12
          ? 'Months 3–12: tissue heals but MG30 branches light up — alarm outlives fire.'
          : 'Month 12+: acute trigger faded — chronic pain is its own ICD-11 disease class.',
    readout: `Month ${m} — injury ${Math.round(injury * 100)}% · ${branches}/7 chronic classes active`,
    metrics: { injury: `${Math.round(injury * 100)}%`, branches },
  };
}

const CASES = {
  'fig-neuromatrix': {
    acute: {
      state: { somatic: 0.92, memory: 0.22, stress: 0.3 },
      lesson: 'Melzack: fresh tissue injury — somatic input is high, but still only one input among many.',
      metrics: { output: 84, somatic: 'HIGH' },
    },
    phantom: {
      state: { somatic: 0.04, memory: 0.95, stress: 0.72 },
      lesson: 'Phantom limb: limb is gone — somatic input near zero — yet pain output stays high from memory + map.',
      metrics: { output: 79, somatic: 'ZERO' },
    },
    stress_flare: {
      state: { somatic: 0.08, memory: 0.62, stress: 0.96 },
      lesson: 'Stress flare with no new damage: arousal + prior memory drive output — the neuromatrix does not need fresh injury.',
      metrics: { output: 76, somatic: 'LOW' },
    },
  },
  'fig-iasp': {
    sensory_only: {
      state: { sensory: 0.92, affect: 0.06, qualifies: false },
      lesson: 'Body signal alone is not IASP pain — without the emotional channel the fused experience collapses.',
      metrics: { qualifies: 'NO', fusion: 18 },
    },
    iasp_pain: {
      state: { sensory: 0.82, affect: 0.8, qualifies: true },
      lesson: 'IASP 2020: pain = unpleasant sensory AND emotional experience — both channels must fuse.',
      metrics: { qualifies: 'YES', fusion: 88 },
    },
    grief_led: {
      state: { sensory: 0.35, affect: 0.94, qualifies: true },
      lesson: 'Emotion-led pain still qualifies — sensory channel can be modest while affect carries the diagnosis.',
      metrics: { qualifies: 'YES', fusion: 81 },
    },
  },
  'fig-mcgill': {
    mpq_clinical: {
      state: { painWords: 78, pleasWords: 12, mode: 'pain' },
      lesson: 'McGill MPQ: 78 clinical descriptors across sensory, affective, evaluative, and misc domains.',
      metrics: { words: 78, ratio: '6.5×' },
    },
    pleasure_colloquial: {
      state: { painWords: 78, pleasWords: 12, mode: 'pleasure' },
      lesson: 'Everyday pleasure vocabulary stays sparse (~12 words) — language factorizes pain far more finely.',
      metrics: { words: 12, ratio: '6.5×' },
    },
  },
  'fig-price': {
    capsaicin: {
      state: { intensity: 0.92, unpleasant: 0.38, secondary: 0.22 },
      lesson: 'Price: capsaicin — burning intensity high, unpleasantness lower — ledgers dissociate.',
      metrics: { layers: 2, dissoc: 'HIGH' },
    },
    colic: {
      state: { intensity: 0.88, unpleasant: 0.95, secondary: 0.9 },
      lesson: 'Labor/colic: all three Price dimensions climb together — total suffering, not one dial.',
      metrics: { layers: 3, dissoc: 'LOW' },
    },
    neuropathic: {
      state: { intensity: 0.28, unpleasant: 0.92, secondary: 0.85 },
      lesson: 'Neuropathic sting: modest sensory intensity, high unpleasantness + secondary affect — suffering without loud signal.',
      metrics: { layers: 3, dissoc: 'HIGH' },
    },
  },
  'fig-berridge': {
    healthy_meal: {
      state: { wanting: 0.38, liking: 0.78 },
      lesson: 'Sated meal: wanting and liking track together — normal hedonic balance.',
      metrics: { orbit: 'tight', cluster: 78 },
    },
    addiction: {
      state: { wanting: 0.97, liking: 0.22 },
      lesson: 'Addiction: dopaminergic wanting sprawls while opioid liking shrinks — pursuit without joy.',
      metrics: { orbit: 'wide', cluster: 22 },
    },
    hotspot: {
      state: { wanting: 0.45, liking: 0.92 },
      lesson: 'Direct opioid hotspot stimulation: tight hedonic cluster — liking without compulsive orbit.',
      metrics: { orbit: 'tight', cluster: 92 },
    },
  },
  'fig-leknes': {
    mild_relief: {
      state: { threat: 0.22, relief: 0.25 },
      lesson: 'Minor annoyance ends: little prior threat → relief pleasure stays weak.',
      metrics: { relief: 18, residual: 12 },
    },
    burn_relief: {
      state: { threat: 0.94, relief: 0.82 },
      lesson: 'Burn then cool water: high threat history → relief spike borrows opioid/dopamine substrate from red.',
      metrics: { relief: 86, residual: 35 },
    },
    chronic: {
      state: { threat: 0.9, relief: 0.12 },
      lesson: 'Chronic threat: system stays red — relief exhausted, no clean green spike.',
      metrics: { relief: 11, residual: 88 },
    },
  },
  'fig-baumeister': {
    one_compliment: {
      state: { bad: 0.18, good: 0.72, ratio: 1.2 },
      lesson: 'One compliment: scale tilts slightly — good events register, but lightly.',
      metrics: { tilt: '1.2×', net: '+54' },
    },
    one_insult: {
      state: { bad: 0.92, good: 0.2, ratio: 4.6 },
      lesson: 'One matched insult outweighs a compliment ~2–5× in memory — Baumeister asymmetry.',
      metrics: { tilt: '4.6×', net: '−72' },
    },
    paired: {
      state: { bad: 0.75, good: 0.75, ratio: 3.1 },
      lesson: 'Same-day pair with equal intensity: net remembered valence still negative — bad writes heavier ink.',
      metrics: { tilt: '3.1×', net: '−38' },
    },
  },
  'fig-rozin': {
    clean: {
      state: { radius: 0.15 },
      lesson: 'Before event: neutral grid — good and bad categories not yet linked.',
      metrics: { spread: 0, isolated: 4 },
    },
    one_drop: {
      state: { radius: 0.85 },
      lesson: 'One bad event: local stain — contamination begins at the source node.',
      metrics: { spread: 2, isolated: 4 },
    },
    spread: {
      state: { radius: 2.8 },
      lesson: 'After rumination: bad infects neighbors and meaning — negativity dominance (Rozin & Royzman).',
      metrics: { spread: 11, isolated: 2 },
    },
  },
  'fig-eisenberger': {
    included: {
      state: { exclusion: 0.04 },
      lesson: 'Included in Cyberball: dACC quiet — social belonging, no bodily-hurt overlap.',
      metrics: { acc: 8, overlap: 5 },
    },
    excluded: {
      state: { exclusion: 0.96 },
      lesson: 'Cyberball exclusion: dACC activates like bodily hurt — no peripheral nociception needed (Eisenberger 2003).',
      metrics: { acc: 91, overlap: 78 },
    },
  },
  'fig-lazarus': {
    threat: {
      state: { threat: 0.92, challenge: 0.12, blame: 0.78 },
      lesson: 'Job loss framed as threat + self-blame: high suffering output from the same stressor.',
      metrics: { output_a: 88, output_b: 14 },
    },
    challenge: {
      state: { threat: 0.15, challenge: 0.88, blame: 0.1 },
      lesson: 'Same stressor as challenge with coping resources: suffering output drops — appraisal is causal.',
      metrics: { output_a: 16, output_b: 72 },
    },
  },
  'pmx-00': {
    defects: {
      state: { mode: 'defects' },
      lesson: 'Warranty card: pain, fear, grief, decay, death — shipped before consent.',
      metrics: { defects_n: 5, locks: 0 },
    },
    regimes: {
      state: { mode: 'regimes' },
      lesson: 'Christian, Islamic, secular — three regimes, one clause: repair OK, exit forbidden.',
      metrics: { defects_n: 5, locks: 3 },
    },
  },
  'pmx-03': {
    logged: {
      state: { bugs: 1, blame: 0.08 },
      lesson: 'Genesis 2–3 as QA: birth pain, toil, mortality, shame — defects logged in the product spec.',
      metrics: { defects: 4, blame: 8 },
    },
    blame_shift: {
      state: { bugs: 1, blame: 0.88 },
      lesson: 'After logging: fault moves downstream — operator blamed for design defects.',
      metrics: { defects: 4, blame: 88 },
    },
  },
  'pmx-04': {
    traditional: {
      state: { user: 0.88, design: 0.15 },
      lesson: 'Traditional reading: disobedient user carries the fault vector.',
      metrics: { upstream: 15, downstream: 88 },
    },
    manufacture: {
      state: { user: 0.12, design: 0.94 },
      lesson: 'Manufacture reading: consciousness built inside a pain machine — fault moves upstream.',
      metrics: { upstream: 94, downstream: 12 },
    },
  },
  'pmx-09': {
    repair_ok: {
      state: { repair: 1, exit: 0.05 },
      lesson: 'Medical repair: all three regimes approve — sanctify, steward, or dignify the chassis.',
      metrics: { aligned: 100, veto: 0 },
    },
    exit_attempt: {
      state: { repair: 0.2, exit: 0.98 },
      lesson: 'Morphological exit: every regime deploys the lock — repair yes, exit no.',
      metrics: { aligned: 100, veto: 98 },
    },
  },
  'pmx-05': {
    therapy: {
      state: { rung: 2, wall: 0.1 },
      lesson: 'Therapy rung: fully warrantied — treat symptoms inside the chassis.',
      metrics: { rung: 3, wall: 'NO' },
    },
    enhance: {
      state: { rung: 5, wall: 0.25 },
      lesson: 'Enhancement rung: still approved — improve the machine, do not leave it.',
      metrics: { rung: 6, wall: 'NO' },
    },
    exit: {
      state: { rung: 6, wall: 0.98 },
      lesson: 'Exit attempt: climber hits the wall — morphological escape vetoed.',
      metrics: { rung: 7, wall: 'YES' },
    },
  },
  'pmx-11': {
    status_quo: {
      state: { involuntary: 78, audit: 12 },
      lesson: 'Status quo: involuntary suffering unmeasured — no audit trail.',
      metrics: { involuntary: 78, trajectory: 12 },
    },
    audit_on: {
      state: { involuntary: 42, audit: 68 },
      lesson: 'Audit deployed: involuntary harm tracked and falling — engineering, not vibes.',
      metrics: { involuntary: 42, trajectory: 68 },
    },
    target: {
      state: { involuntary: 3, audit: 95 },
      lesson: 'Abolition target: drive involuntary suffering toward zero without new captive minds.',
      metrics: { involuntary: 3, trajectory: 95 },
    },
  },
};

function resolveCase(sceneId, widget) {
  if (sceneId === 'fig-icd11') return icd11Case(widget.months);
  const table = CASES[sceneId];
  if (!table) return null;
  return table[widget.preset] || table[Object.keys(table)[0]];
}

function applyNodeWeight(node, w, labelEl, min = 0.08) {
  const on = Math.max(min, w);
  node.coreMat.emissiveIntensity = 0.25 + on * 2.4;
  node.scale.setScalar(0.35 + on * 0.85);
  node.visible = w > 0.06;
  if (labelEl) labelEl.el.dataset.opacity = String(0.12 + on * 0.88);
}

function createNode(color, size = 0.14) {
  const coreMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.75,
    transparent: true,
    opacity: 0.9,
    roughness: 0.25,
  });
  const ringMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const core = new THREE.Mesh(new THREE.SphereGeometry(size, 24, 20), coreMat);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(size * 1.35, size * 0.06, 10, 36), ringMat);
  ring.rotation.x = Math.PI / 2.4;
  const group = new THREE.Group();
  group.add(core, ring);
  group.coreMat = coreMat;
  group.ringMat = ringMat;
  group.core = core;
  group.ring = ring;
  return group;
}

function makeCurve(points) {
  return new THREE.CatmullRomCurve3(points.map((p) => (Array.isArray(p) ? v3(...p) : p.clone())));
}

function createTube(curve, color, opacity = 0.55) {
  const geo = new THREE.TubeGeometry(curve, 64, 0.018, 8, false);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Mesh(geo, mat);
}

function createStarfield(count = 280) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const r = 8 + Math.random() * 14;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: C.dim, size: 0.03, transparent: true, opacity: 0.32, depthWrite: false }),
  );
}

function createFlowParticles(curves, countPer = 12) {
  const entries = [];
  const positions = [];
  const colors = [];
  curves.forEach(({ curve, color, key }) => {
    for (let i = 0; i < countPer; i += 1) {
      entries.push({ curve, key, t: Math.random(), speed: 0.08 + Math.random() * 0.18, color });
      positions.push(0, 0, 0);
      const col = new THREE.Color(color);
      colors.push(col.r, col.g, col.b);
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  return {
    points,
    entries,
    mat,
    speeds: Object.fromEntries(curves.map((c) => [c.key, 0.2])),
    advance(dt) {
      const pos = geo.attributes.position.array;
      entries.forEach((e, i) => {
        e.t = (e.t + dt * (this.speeds[e.key] || 0.2) * e.speed) % 1;
        const p = e.curve.getPoint(e.t);
        pos[i * 3] = p.x;
        pos[i * 3 + 1] = p.y;
        pos[i * 3 + 2] = p.z;
      });
      geo.attributes.position.needsUpdate = true;
    },
  };
}

function addLabel(layer, mesh, title, sub = '') {
  const el = document.createElement('div');
  el.className = 'pm-ev-label';
  el.innerHTML = `<strong>${title}</strong>${sub ? `<span>${sub}</span>` : ''}`;
  layer.appendChild(el);
  return { mesh, el };
}

function projectLabels(view, camera, labels) {
  const rect = view.getBoundingClientRect();
  labels.forEach(({ mesh, el, minOpacity = 0.12 }) => {
    const p = mesh.getWorldPosition(new THREE.Vector3()).project(camera);
    if (p.z > 1) {
      el.style.opacity = '0';
      return;
    }
    const x = (p.x * 0.5 + 0.5) * rect.width;
    const y = (-p.y * 0.5 + 0.5) * rect.height;
    const op = el.dataset.opacity || minOpacity;
    el.style.opacity = op;
    el.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 100%))`;
  });
}

const SCENE_BUILDERS = {
  'fig-neuromatrix': buildNeuromatrix,
  'fig-iasp': buildIasp,
  'fig-icd11': buildIcd11,
  'fig-mcgill': buildMcGill,
  'fig-price': buildPrice,
  'fig-berridge': buildBerridge,
  'fig-leknes': buildLeknes,
  'fig-baumeister': buildBaumeister,
  'fig-rozin': buildRozin,
  'fig-eisenberger': buildEisenberger,
  'fig-lazarus': buildLazarus,
  'pmx-00': buildWarranty,
  'pmx-03': buildGenesis,
  'pmx-04': buildInversion,
  'pmx-09': buildRegimes,
  'pmx-05': buildLadder,
  'pmx-11': buildAudit,
};

function buildNeuromatrix(group, labelState) {
  const hub = createNode(C.pain, 0.22);
  group.add(hub);
  const inputs = [
    { label: 'somatic', sub: 'one input', pos: [0, 1.35, 0], color: C.pain },
    { label: 'memory', sub: 'prior pain', pos: [-1.25, 0.35, 0.55], color: C.gold },
    { label: 'stress', sub: 'arousal gate', pos: [1.2, 0.25, 0.45], color: C.gold },
    { label: 'social', sub: 'context', pos: [-0.85, -0.55, 1.05], color: C.muted },
    { label: 'expectation', sub: 'prediction', pos: [0.95, -0.45, -0.85], color: C.muted },
  ];
  const nodes = inputs.map((inp) => {
    const n = createNode(inp.color, 0.11);
    n.position.set(...inp.pos);
    group.add(n);
    labelState.list.push(addLabel(labelState.layer, n, inp.label, inp.sub));
    return n;
  });
  labelState.list.push(addLabel(labelState.layer, hub, 'neuromatrix', 'pain output'));
  const curves = nodes.map((n, i) => ({
    curve: makeCurve([n.position, v3(n.position.x * 0.55, n.position.y * 0.4, n.position.z * 0.4), hub.position]),
    color: inputs[i].color,
    key: `in${i}`,
  }));
  const particles = createFlowParticles(curves, mobile() ? 6 : 10);
  group.add(particles.points);
  return {
    particles,
    hub,
    nodes,
    update(widget, now, labelState) {
      const c = resolveCase('fig-neuromatrix', widget);
      if (!c) return null;
      const { somatic, memory, stress } = c.state;
      const load = Math.max(somatic, memory * 0.95, stress * 0.9);
      applyNodeWeight(hub, load, labelState.list[5]);
      nodes.forEach((n, i) => {
        const w = [somatic, memory, stress, memory * 0.5, stress * 0.55][i];
        applyNodeWeight(n, w, labelState.list[i]);
      });
      particles.speeds.in0 = 0.04 + somatic * 0.95;
      particles.speeds.in1 = 0.04 + memory * 0.9;
      particles.speeds.in2 = 0.04 + stress * 0.88;
      particles.speeds.in3 = 0.04 + memory * 0.35;
      particles.speeds.in4 = 0.04 + stress * 0.32;
      particles.mat.opacity = 0.15 + load * 0.75;
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildIasp(group, labelState) {
  const sensory = createNode(C.pain, 0.16);
  sensory.position.set(-1.1, 0.35, 0);
  const affect = createNode(C.gold, 0.16);
  affect.position.set(1.1, 0.35, 0);
  const fusion = createNode(C.pain, 0.24);
  fusion.position.set(0, -0.35, 0);
  group.add(sensory, affect, fusion);
  labelState.list.push(addLabel(labelState.layer, sensory, 'sensory', 'IASP channel'));
  labelState.list.push(addLabel(labelState.layer, affect, 'affective', 'IASP channel'));
  labelState.list.push(addLabel(labelState.layer, fusion, 'pain experience', 'always both'));
  const particles = createFlowParticles([
    { curve: makeCurve([sensory.position, v3(-0.35, 0, 0.2), fusion.position]), color: C.pain, key: 's' },
    { curve: makeCurve([affect.position, v3(0.35, 0, 0.2), fusion.position]), color: C.gold, key: 'a' },
  ], mobile() ? 8 : 14);
  group.add(particles.points);
  return {
    particles,
    fusion,
    update(widget, now, labelState) {
      const c = resolveCase('fig-iasp', widget);
      if (!c) return null;
      const { sensory, affect, qualifies } = c.state;
      applyNodeWeight(sensory, sensory, labelState.list[0]);
      applyNodeWeight(affect, affect, labelState.list[1]);
      const fusionW = qualifies ? Math.min(1, sensory * 0.5 + affect * 0.55) : Math.min(0.35, sensory * 0.35);
      applyNodeWeight(fusion, fusionW, labelState.list[2], 0.05);
      fusion.coreMat.color.setHex(qualifies ? C.pain : C.dim);
      fusion.coreMat.emissive.setHex(qualifies ? C.pain : C.dim);
      particles.speeds.s = qualifies ? 0.1 + sensory * 0.75 : 0.04;
      particles.speeds.a = qualifies ? 0.1 + affect * 0.75 : 0.04;
      particles.mat.opacity = qualifies ? 0.65 : 0.15;
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildIcd11(group, labelState) {
  const root = createNode(C.pain, 0.14);
  root.position.set(0, 1.05, 0);
  group.add(root);
  labelState.list.push(addLabel(labelState.layer, root, 'trigger injury', 'acute event'));
  const branches = [];
  const curves = [];
  for (let i = 0; i < 7; i += 1) {
    const ang = (i / 7) * Math.PI * 2 - Math.PI / 2;
    const n = createNode(i % 2 ? C.gold : C.pain, 0.09);
    n.position.set(Math.cos(ang) * 1.35, -0.55 + Math.sin(ang) * 0.35, Math.sin(ang) * 0.45);
    group.add(n);
    branches.push(n);
    labelState.list.push(addLabel(labelState.layer, n, `MG30.${i + 1}`, 'chronic class'));
    curves.push({
      curve: makeCurve([root.position, v3(n.position.x * 0.45, 0.35, n.position.z * 0.45), n.position]),
      color: C.pain,
      key: `b${i}`,
    });
  }
  const particles = createFlowParticles(curves, mobile() ? 3 : 5);
  group.add(particles.points);
  return {
    particles,
    branches,
    root,
    update(widget, now, labelState) {
      const c = resolveCase('fig-icd11', widget);
      if (!c) return null;
      const { injury, branches: branchCount } = c.state;
      applyNodeWeight(root, injury, labelState.list[0], 0.05);
      branches.forEach((b, i) => {
        const on = i < branchCount ? 0.75 + (i % 3) * 0.08 : 0.04;
        applyNodeWeight(b, on, labelState.list[i + 1], 0.04);
        particles.speeds[`b${i}`] = on > 0.2 ? 0.15 + on * 0.45 : 0.02;
      });
      particles.mat.opacity = 0.15 + branchCount * 0.09;
      return { ...c.metrics, readout: c.readout, lesson: c.lesson };
    },
  };
}

function buildMcGill(group, labelState) {
  const painCloud = new THREE.Group();
  const pleasCloud = new THREE.Group();
  group.add(painCloud, pleasCloud);
  const painPts = [];
  const pleasPts = [];
  for (let i = 0; i < 48; i += 1) {
    const n = createNode(C.pain, 0.035 + (i % 5) * 0.008);
    n.position.set((Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 1.2);
    painCloud.add(n);
    painPts.push(n);
  }
  for (let i = 0; i < 12; i += 1) {
    const n = createNode(C.pleasure, 0.05);
    n.position.set(1.05 + (Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.9, (Math.random() - 0.5) * 0.5);
    pleasCloud.add(n);
    pleasPts.push(n);
  }
  const hub = createNode(C.gold, 0.12);
  hub.position.set(-0.95, 0, 0);
  group.add(hub);
  labelState.list.push(addLabel(labelState.layer, hub, 'MPQ lexicon', '78 descriptors'));
  return {
    painPts,
    pleasPts,
    update(widget) {
      const c = resolveCase('fig-mcgill', widget);
      if (!c) return null;
      const { painWords, pleasWords, mode } = c.state;
      const showPain = mode === 'pain';
      const pCount = showPain ? painPts.length : 0;
      const gCount = showPain ? Math.round(pleasPts.length * 0.25) : pleasPts.length;
      painPts.forEach((n, i) => {
        n.visible = i < pCount;
        if (n.visible) n.coreMat.emissiveIntensity = 0.55 + (i % 7) * 0.06;
      });
      pleasPts.forEach((n, i) => {
        n.visible = i < gCount;
        if (n.visible) n.coreMat.emissiveIntensity = 0.65;
      });
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildPrice(group, labelState) {
  const layers = [];
  const names = ['intensity', 'unpleasantness', 'secondary affect'];
  names.forEach((name, i) => {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.22 + i * 0.08),
      new THREE.MeshBasicMaterial({
        color: C.pain,
        transparent: true,
        opacity: 0.12 + i * 0.06,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    plane.position.set(-0.55, 0.35 - i * 0.38, 0);
    plane.rotation.y = 0.35;
    group.add(plane);
    layers.push(plane);
    labelState.list.push(addLabel(labelState.layer, plane, name, 'Price dimension'));
  });
  const pleasure = createNode(C.pleasure, 0.13);
  pleasure.position.set(0.95, -0.05, 0.15);
  group.add(pleasure);
  labelState.list.push(addLabel(labelState.layer, pleasure, 'pleasure band', 'single layer'));
  return {
    layers,
    pleasure,
    update(widget, now, labelState) {
      const c = resolveCase('fig-price', widget);
      if (!c) return null;
      const { intensity, unpleasant, secondary } = c.state;
      const vals = [intensity, unpleasant, secondary];
      let active = 0;
      layers.forEach((pl, i) => {
        const s = vals[i];
        pl.scale.y = 0.15 + s * 2.2;
        pl.material.opacity = s > 0.25 ? 0.12 + s * 0.65 : 0.04;
        pl.visible = s > 0.2;
        if (s > 0.35) active += 1;
        if (labelState.list[i]) labelState.list[i].el.dataset.opacity = String(0.15 + s * 0.85);
      });
      pleasure.scale.setScalar(0.45 + intensity * 0.35);
      pleasure.coreMat.emissiveIntensity = 0.2 + intensity * 0.45;
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildBerridge(group, labelState) {
  const liking = createNode(C.pleasure, 0.12);
  liking.position.set(0, 0, 0);
  group.add(liking);
  labelState.list.push(addLabel(labelState.layer, liking, 'liking hotspots', 'NAc · VP'));
  const wanting = [];
  for (let i = 0; i < 10; i += 1) {
    const w = createNode(C.gold, 0.055);
    const ang = (i / 10) * Math.PI * 2;
    w.position.set(Math.cos(ang) * 1.15, Math.sin(ang) * 0.55, Math.sin(ang * 2) * 0.35);
    group.add(w);
    wanting.push(w);
  }
  labelState.list.push(addLabel(labelState.layer, wanting[0], 'wanting orbit', 'mesolimbic sprawl'));
  return {
    liking,
    wanting,
    update(widget, now, labelState) {
      const c = resolveCase('fig-berridge', widget);
      if (!c) return null;
      const { wanting, liking } = c.state;
      const wr = 0.55 + wanting * 1.35;
      wanting.forEach((w, i) => {
        const ang = (i / wanting.length) * Math.PI * 2 + now * 0.0005 * (0.3 + wanting);
        w.position.set(Math.cos(ang) * wr, Math.sin(ang) * wr * 0.55, Math.sin(ang * 2) * 0.35);
        applyNodeWeight(w, wanting, null, 0.05);
      });
      applyNodeWeight(liking, liking, labelState.list[0]);
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildLeknes(group, labelState) {
  const curve = makeCurve([v3(-1.45, 0.35, 0), v3(-0.45, -0.55, 0.25), v3(0.35, 0.15, -0.15), v3(1.25, -0.25, 0.1)]);
  const tube = createTube(curve, C.muted, 0.25);
  group.add(tube);
  const threat = createNode(C.pain, 0.13);
  threat.position.copy(curve.getPoint(0.15));
  const relief = createNode(C.pleasure, 0.16);
  relief.position.copy(curve.getPoint(0.78));
  group.add(threat, relief);
  labelState.list.push(addLabel(labelState.layer, threat, 'threat memory', 'red residue'));
  labelState.list.push(addLabel(labelState.layer, relief, 'relief spike', 'borrowed green'));
  const particles = createFlowParticles([
    { curve, color: C.pain, key: 't' },
    { curve, color: C.pleasure, key: 'r' },
  ], mobile() ? 10 : 16);
  group.add(particles.points);
  return {
    particles,
    threat,
    relief,
    update(widget, now, labelState) {
      const c = resolveCase('fig-leknes', widget);
      if (!c) return null;
      const { threat, relief } = c.state;
      applyNodeWeight(threat, threat, labelState.list[0]);
      const reliefW = relief * (0.35 + threat * 0.75);
      applyNodeWeight(relief, reliefW, labelState.list[1], 0.05);
      particles.speeds.t = 0.05 + threat * 0.75;
      particles.speeds.r = 0.04 + reliefW * 0.65;
      particles.mat.opacity = 0.2 + threat * 0.55;
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildBaumeister(group, labelState) {
  const bar = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.06, 0.12),
    new THREE.MeshStandardMaterial({ color: C.dim, roughness: 0.8 }),
  );
  group.add(bar);
  const bad = createNode(C.pain, 0.22);
  bad.position.set(-0.75, 0.35, 0);
  const good = createNode(C.pleasure, 0.12);
  good.position.set(0.75, 0.35, 0);
  group.add(bad, good);
  labelState.list.push(addLabel(labelState.layer, bad, 'harm weight', 'heavier'));
  labelState.list.push(addLabel(labelState.layer, good, 'benefit weight', 'lighter'));
  return {
    bad,
    good,
    bar,
    update(widget, now, labelState) {
      const c = resolveCase('fig-baumeister', widget);
      if (!c) return null;
      const { bad, good, ratio } = c.state;
      const tilt = (bad - good) * 0.65;
      bar.parent.rotation.z = tilt;
      bad.scale.setScalar(0.5 + bad * 1.1);
      good.scale.setScalar(0.45 + good * 0.55);
      bad.position.y = 0.15 + bad * 0.55;
      good.position.y = 0.15 + good * 0.25;
      applyNodeWeight(bad, bad, labelState.list[0]);
      applyNodeWeight(good, good, labelState.list[1]);
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildRozin(group, labelState) {
  const grid = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      const n = createNode(c < 2 && r > 1 ? C.pleasure : C.muted, 0.07);
      n.position.set(-0.95 + c * 0.62, 0.75 - r * 0.52, 0);
      n.userData.base = n.position.clone();
      n.userData.idx = r * 4 + c;
      group.add(n);
      grid.push(n);
    }
  }
  const seed = createNode(C.pain, 0.14);
  seed.position.set(0.95, 0.75, 0);
  group.add(seed);
  labelState.list.push(addLabel(labelState.layer, seed, 'contamination', 'bad spreads'));
  return {
    grid,
    seed,
    update(widget, now, labelState) {
      const c = resolveCase('fig-rozin', widget);
      if (!c) return null;
      const { radius } = c.state;
      let infected = 0;
      let good = 0;
      grid.forEach((n) => {
        const d = n.position.distanceTo(seed.position);
        const hit = d < radius;
        if (hit) {
          n.coreMat.color.setHex(C.pain);
          n.coreMat.emissive.setHex(C.pain);
          n.coreMat.emissiveIntensity = 0.85;
          n.scale.setScalar(0.85);
          infected += 1;
        } else if (n.userData.idx < 4) {
          n.coreMat.color.setHex(C.pleasure);
          n.coreMat.emissive.setHex(C.pleasure);
          n.coreMat.emissiveIntensity = 0.55;
          good += 1;
        } else {
          n.coreMat.color.setHex(C.muted);
          n.coreMat.emissive.setHex(C.muted);
          n.coreMat.emissiveIntensity = 0.25;
          n.scale.setScalar(0.65);
        }
      });
      applyNodeWeight(seed, Math.min(1, radius / 2), labelState.list[0]);
      return {
        spread: infected,
        isolated: good,
        readout: c.lesson,
        lesson: c.lesson,
      };
    },
  };
}

function buildEisenberger(group, labelState) {
  const acc = createNode(C.pain, 0.18);
  acc.position.set(0, 0, 0);
  group.add(acc);
  labelState.list.push(addLabel(labelState.layer, acc, 'dACC', 'social pain'));
  const ring = [];
  for (let i = 0; i < 5; i += 1) {
    const n = createNode(C.muted, 0.08);
    const ang = (i / 5) * Math.PI * 2;
    n.position.set(Math.cos(ang) * 1.05, Math.sin(ang) * 0.55, Math.sin(ang) * 0.25);
    group.add(n);
    ring.push(n);
  }
  const outcast = createNode(C.pain, 0.11);
  outcast.position.set(1.45, 0, 0.15);
  group.add(outcast);
  labelState.list.push(addLabel(labelState.layer, outcast, 'excluded self', 'Cyberball'));
  const particles = createFlowParticles([
    { curve: makeCurve([outcast.position, v3(0.65, 0, 0.1), acc.position]), color: C.pain, key: 'x' },
  ], mobile() ? 10 : 16);
  group.add(particles.points);
  return {
    acc,
    outcast,
    particles,
    update(widget, now, labelState) {
      const c = resolveCase('fig-eisenberger', widget);
      if (!c) return null;
      const { exclusion } = c.state;
      applyNodeWeight(acc, exclusion, labelState.list[0], 0.06);
      outcast.visible = exclusion > 0.2;
      outcast.position.x = 0.85 + exclusion * 0.75;
      applyNodeWeight(outcast, exclusion, labelState.list[1], 0.05);
      particles.speeds.x = 0.02 + exclusion * 0.85;
      particles.mat.opacity = 0.1 + exclusion * 0.75;
      ring.forEach((n) => {
        n.coreMat.emissiveIntensity = 0.15 + (1 - exclusion) * 0.45;
      });
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildLazarus(group, labelState) {
  const event = createNode(C.muted, 0.12);
  event.position.set(0, 0.95, 0);
  group.add(event);
  labelState.list.push(addLabel(labelState.layer, event, 'stressor', 'same event'));
  const threat = createNode(C.pain, 0.15);
  threat.position.set(-0.95, -0.35, 0.2);
  const challenge = createNode(C.pleasure, 0.13);
  challenge.position.set(0.95, -0.35, -0.1);
  group.add(threat, challenge);
  labelState.list.push(addLabel(labelState.layer, threat, 'threat frame', 'high suffering'));
  labelState.list.push(addLabel(labelState.layer, challenge, 'challenge frame', 'lower suffering'));
  const particles = createFlowParticles([
    { curve: makeCurve([event.position, v3(-0.35, 0.35, 0.15), threat.position]), color: C.pain, key: 't' },
    { curve: makeCurve([event.position, v3(0.35, 0.35, -0.05), challenge.position]), color: C.pleasure, key: 'c' },
  ], mobile() ? 8 : 12);
  group.add(particles.points);
  return {
    particles,
    threat,
    challenge,
    update(widget, now, labelState) {
      const c = resolveCase('fig-lazarus', widget);
      if (!c) return null;
      const { threat, challenge, blame } = c.state;
      const threatW = Math.min(1, threat + blame * 0.45);
      applyNodeWeight(threat, threatW, labelState.list[1]);
      applyNodeWeight(challenge, challenge, labelState.list[2]);
      applyNodeWeight(event, 0.75, labelState.list[0]);
      particles.speeds.t = 0.04 + threatW * 0.8;
      particles.speeds.c = 0.04 + challenge * 0.75;
      particles.mat.opacity = 0.2 + Math.max(threatW, challenge) * 0.65;
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildWarranty(group, labelState) {
  const card = new THREE.Mesh(
    new THREE.BoxGeometry(1.55, 1.05, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x120909, emissive: 0x2a1010, emissiveIntensity: 0.15, roughness: 0.55 }),
  );
  group.add(card);
  labelState.list.push(addLabel(labelState.layer, card, 'Homo sapiens', 'warranty card'));
  const defects = [];
  ['pain', 'fear', 'grief', 'decay', 'death'].forEach((d, i) => {
    const n = createNode(C.pain, 0.06);
    n.position.set(-0.55 + i * 0.28, 0.15 - (i % 2) * 0.18, 0.12);
    card.add(n);
    defects.push(n);
  });
  const locks = [];
  ['Christianity', 'Islam', 'Secular'].forEach((name, i) => {
    const col = createNode(C.gold, 0.09);
    col.position.set(-0.75 + i * 0.75, -0.95, 0);
    group.add(col);
    locks.push(col);
    labelState.list.push(addLabel(labelState.layer, col, name, 'repair OK · exit no'));
  });
  return {
    card,
    defects,
    locks,
    update(widget, now, labelState) {
      const c = resolveCase('pmx-00', widget);
      if (!c) return null;
      const { mode } = c.state;
      defects.forEach((n, i) => {
        n.visible = true;
        applyNodeWeight(n, 0.85, null);
      });
      locks.forEach((l, i) => {
        const on = mode === 'regimes' ? 0.92 : 0.12;
        applyNodeWeight(l, on, labelState.list[i + 1], 0.05);
      });
      card.rotation.y = mode === 'regimes' ? 0.45 : 0;
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildGenesis(group, labelState) {
  const tree = createNode(C.gold, 0.16);
  tree.position.set(0, 0.55, 0);
  group.add(tree);
  labelState.list.push(addLabel(labelState.layer, tree, 'Eden ship', 'QA tree'));
  const bugs = [];
  ['birth pain', 'toil', 'mortality', 'shame'].forEach((b, i) => {
    const n = createNode(C.pain, 0.09);
    n.position.set(-0.95 + i * 0.65, -0.65 - (i % 2) * 0.15, 0.1);
    group.add(n);
    bugs.push(n);
    labelState.list.push(addLabel(labelState.layer, n, b, 'defect log'));
  });
  const particles = createFlowParticles(
    bugs.map((n, i) => ({
      curve: makeCurve([tree.position, v3(n.position.x * 0.4, 0.1, 0), n.position]),
      color: C.pain,
      key: `d${i}`,
    })),
    4,
  );
  group.add(particles.points);
  return {
    bugs,
    particles,
    update(widget, now, labelState) {
      const c = resolveCase('pmx-03', widget);
      if (!c) return null;
      const { bugs, blame } = c.state;
      bugs.forEach((n, i) => {
        applyNodeWeight(n, bugs, labelState.list[i + 1]);
        particles.speeds[`d${i}`] = 0.12 + bugs * 0.45;
      });
      particles.mat.opacity = 0.25 + bugs * 0.55;
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildInversion(group, labelState) {
  const user = createNode(C.muted, 0.12);
  user.position.set(-1.05, 0, 0);
  const design = createNode(C.pain, 0.16);
  design.position.set(1.05, 0, 0);
  group.add(user, design);
  labelState.list.push(addLabel(labelState.layer, user, 'user blame', 'downstream'));
  labelState.list.push(addLabel(labelState.layer, design, 'design blame', 'upstream'));
  const particles = createFlowParticles([
    { curve: makeCurve([user.position, v3(0, 0.35, 0), design.position]), color: C.pain, key: 'flip' },
  ], mobile() ? 12 : 20);
  group.add(particles.points);
  return {
    user,
    design,
    particles,
    update(widget, now, labelState) {
      const c = resolveCase('pmx-04', widget);
      if (!c) return null;
      const { user, design } = c.state;
      applyNodeWeight(user, user, labelState.list[0]);
      applyNodeWeight(design, design, labelState.list[1]);
      user.position.x = -1.05 + user * 0.35;
      design.position.x = 0.75 + design * 0.45;
      particles.speeds.flip = 0.05 + design * 0.75;
      particles.mat.opacity = 0.15 + Math.max(user, design) * 0.65;
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildRegimes(group, labelState) {
  const cols = [];
  ['Christian', 'Islamic', 'Secular'].forEach((name, i) => {
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.08, 0.35),
      new THREE.MeshStandardMaterial({ color: C.gold, emissive: C.gold, emissiveIntensity: 0.12 }),
    );
    base.position.set(-0.85 + i * 0.85, -0.55, 0);
    const lock = createNode(C.pain, 0.07);
    lock.position.set(-0.85 + i * 0.85, -0.95, 0.12);
    group.add(base, lock);
    cols.push({ base, lock, name });
    labelState.list.push(addLabel(labelState.layer, base, name, 'repair ↑'));
  });
  return {
    cols,
    update(widget, now, labelState) {
      const c = resolveCase('pmx-09', widget);
      if (!c) return null;
      const { repair, exit } = c.state;
      cols.forEach(({ base, lock }, i) => {
        base.scale.y = 0.4 + repair * 2.2;
        base.material.emissiveIntensity = 0.08 + repair * 0.65;
        applyNodeWeight(lock, exit, labelState.list[i], 0.08);
        lock.scale.setScalar(0.5 + exit * 0.95);
      });
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildLadder(group, labelState) {
  const steps = [];
  for (let i = 0; i < 7; i += 1) {
    const s = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.07, 0.28),
      new THREE.MeshStandardMaterial({ color: C.gold, emissive: C.gold, emissiveIntensity: 0.08 }),
    );
    s.position.set(-0.35 + (i % 2) * 0.7, -0.95 + i * 0.28, 0);
    group.add(s);
    steps.push(s);
  }
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.35, 0.45),
    new THREE.MeshStandardMaterial({ color: C.pain, emissive: C.pain, emissiveIntensity: 0.2, transparent: true, opacity: 0.75 }),
  );
  wall.position.set(0.95, 0.15, 0);
  group.add(wall);
  const climber = createNode(C.gold, 0.09);
  group.add(climber);
  labelState.list.push(addLabel(labelState.layer, wall, 'exit wall', 'vetoed'));
  return {
    steps,
    wall,
    climber,
    update(widget, now, labelState) {
      const c = resolveCase('pmx-05', widget);
      if (!c) return null;
      const { rung, wall } = c.state;
      steps.forEach((s, i) => {
        const on = i <= rung;
        s.material.emissiveIntensity = on ? 0.55 : 0.06;
        s.material.opacity = on ? 1 : 0.2;
      });
      climber.position.set(steps[rung].position.x, steps[rung].position.y + 0.18, 0.15);
      applyNodeWeight(climber, 0.9, null);
      wall.material.emissiveIntensity = 0.12 + wall * 0.95;
      wall.scale.y = 0.7 + wall * 0.55;
      wall.visible = wall > 0.15;
      if (labelState.list[0]) labelState.list[0].el.dataset.opacity = String(0.2 + wall * 0.85);
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

function buildAudit(group, labelState) {
  const bars = [];
  for (let i = 0; i < 6; i += 1) {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.5, 0.18),
      new THREE.MeshStandardMaterial({ color: C.pain, emissive: C.pain, emissiveIntensity: 0.15 }),
    );
    b.position.set(-1.05 + i * 0.42, -0.35, 0);
    group.add(b);
    bars.push(b);
  }
  const target = createNode(C.pleasure, 0.14);
  target.position.set(1.05, 0.65, 0);
  group.add(target);
  labelState.list.push(addLabel(labelState.layer, target, 'target → 0', 'involuntary harm'));
  return {
    bars,
    target,
    update(widget, now, labelState) {
      const c = resolveCase('pmx-11', widget);
      if (!c) return null;
      const { involuntary, audit } = c.state;
      const inv = involuntary / 100;
      bars.forEach((b, i) => {
        const h = 0.12 + inv * (0.55 + (5 - i) * 0.06);
        b.scale.y = h;
        b.position.y = -0.65 + h * 0.5;
        b.material.emissiveIntensity = 0.1 + inv * 0.75;
      });
      applyNodeWeight(target, audit / 100, labelState.list[0]);
      return { ...c.metrics, readout: c.lesson, lesson: c.lesson };
    },
  };
}

class EvidenceWidget {
  constructor(root) {
    this.root = root;
    this.sceneId = root.dataset.scene;
    this.canvas = root.querySelector('.pm-ev-canvas');
    this.view = root.querySelector('.pm-ev-view');
    this.labelLayer = root.querySelector('.pm-ev-labels');
    this.readoutEl = root.querySelector('[data-readout]');
    this.lessonEl = root.querySelector('[data-lesson]');
    bindControls(root, this);
    this.running = false;
  }

  start() {
    if (this.running || !SCENE_BUILDERS[this.sceneId]) return;
    if (this.ready) {
      this.running = true;
      this.t0 = performance.now();
      this.raf = requestAnimationFrame(this.animate);
      return;
    }
    this.running = true;
    this.boot();
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  boot() {
    const builder = SCENE_BUILDERS[this.sceneId];
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(C.bg, 0.07);
    this.scene.add(createStarfield(mobile() ? 160 : 260));

    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.labelState = { layer: this.labelLayer, list: [] };

    this.logic = builder(this.group, this.labelState);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    this.camera.position.set(0, 0.35, 3.4);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile() ? 1.5 : 2));
    this.renderer.setClearColor(C.bg, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 2.2;
    this.controls.maxDistance = 6;
    this.controls.autoRotate = !reducedMotion;
    this.controls.autoRotateSpeed = 0.22;

    this.scene.add(new THREE.HemisphereLight(0xd8cfc4, 0x120808, 0.5));
    const key = new THREE.DirectionalLight(0xffefe6, 0.95);
    key.position.set(2, 3, 4);
    this.scene.add(key);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.35, 0.2);
    this.composer.addPass(this.bloom);

    this.resize = () => {
      const w = this.view.clientWidth;
      const h = Math.max(mobile() ? 300 : 340, this.view.clientHeight || Math.min(480, w * 0.72));
      this.view.style.height = `${h}px`;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.bloom.setSize(w, h);
    };
    this.ro = new ResizeObserver(this.resize);
    this.ro.observe(this.view);
    this.resize();

    this.t0 = performance.now();
    this.ready = true;
    this.animate = (now) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(this.animate);
      const dt = Math.min(0.05, (now - this.t0) / 1000);
      this.t0 = now;
      const metrics = this.logic.update(this, now, this.labelState);
      if (metrics) {
        Object.entries(metrics).forEach(([k, val]) => {
          if (k === 'readout') {
            if (this.readoutEl) this.readoutEl.textContent = val;
          } else if (k === 'lesson') {
            if (this.lessonEl) this.lessonEl.textContent = val;
          } else {
            const el = this.root.querySelector(`[data-m="${k}"]`);
            if (el) el.textContent = String(val);
          }
        });
      }
      if (this.logic.particles) this.logic.particles.advance(dt);
      projectLabels(this.view, this.camera, this.labelState.list);
      this.controls.update();
      this.composer.render();
    };
    this.animate(this.t0);
  }
}

function initAll() {
  const instances = new Map();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const root = e.target;
        if (e.isIntersecting) {
          if (!instances.has(root)) instances.set(root, new EvidenceWidget(root));
          instances.get(root).start();
        } else {
          const inst = instances.get(root);
          if (inst) inst.stop();
        }
      });
    },
    { rootMargin: '100px', threshold: 0.08 },
  );
  document.querySelectorAll('.pm-evidence').forEach((el) => io.observe(el));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
else initAll();

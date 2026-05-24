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

function bindSlider(root, name) {
  const input = root.querySelector(`[data-slider="${name}"]`);
  const valEl = root.querySelector(`[data-slider-val="${name}"]`);
  if (!input) return { get value() { return 0.5; } };
  input.addEventListener('input', () => {
    if (valEl) valEl.textContent = input.value;
  });
  return {
    get value() {
      const mn = Number(input.min || 0);
      const mx = Number(input.max || 100);
      return (Number(input.value) - mn) / Math.max(mx - mn, 1);
    },
    raw() {
      return Number(input.value);
    },
  };
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
    update(v, now, labelState) {
      const load = Math.max(v.somatic * 0.9, v.memory, v.stress);
      hub.coreMat.emissiveIntensity = 0.6 + load * 2.2;
      hub.scale.setScalar(0.85 + load * 0.45 + Math.sin(now * 0.003) * load * 0.06);
      nodes.forEach((n, i) => {
        const w = [v.somatic, v.memory, v.stress, (v.somatic + v.memory) * 0.45, v.stress * 0.7][i];
        n.coreMat.emissiveIntensity = 0.35 + w * 1.8;
        n.scale.setScalar(0.7 + w * 0.55);
        labelState.list[i].el.dataset.opacity = String(0.15 + w * 0.85);
      });
      particles.speeds.in0 = 0.12 + v.somatic * 0.75;
      particles.speeds.in1 = 0.1 + v.memory * 0.7;
      particles.speeds.in2 = 0.1 + v.stress * 0.72;
      particles.mat.opacity = 0.35 + load * 0.55;
      return {
        output: Math.round(20 + load * 80),
        inputs: Math.round(1 + v.somatic * 2 + v.memory * 2 + v.stress * 2),
        readout: load > 0.55 ? 'Distributed inputs converge — tissue signal is insufficient alone' : 'Raise memory or stress — output grows without new injury',
      };
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
    update(v, now) {
      const f = Math.min(1, v.sensory * 0.55 + v.affective * 0.55);
      fusion.scale.setScalar(0.8 + f * 0.55 + Math.sin(now * 0.004) * f * 0.08);
      fusion.coreMat.emissiveIntensity = 0.55 + f * 2.4;
      particles.speeds.s = 0.15 + v.sensory * 0.65;
      particles.speeds.a = 0.15 + v.affective * 0.65;
      return {
        fusion: Math.round(30 + f * 70),
        ratio: (v.sensory / Math.max(v.affective, 0.08)).toFixed(2),
        readout: 'Both channels feed diagnosis — neither is optional',
      };
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
    update(v, now, labelState) {
      const persist = v.persistence;
      const injuryFade = Math.max(0, 1 - now * 0.00008 * (1.4 - v.injury));
      root.coreMat.opacity = 0.25 + injuryFade * 0.65;
      let active = 0;
      branches.forEach((b, i) => {
        const on = persist * (0.55 + (i % 3) * 0.15);
        b.coreMat.emissiveIntensity = 0.3 + on * 2;
        b.scale.setScalar(0.65 + on * 0.55);
        labelState.list[i + 1].el.dataset.opacity = String(0.12 + on * 0.88);
        particles.speeds[`b${i}`] = 0.08 + on * 0.35;
        if (on > 0.35) active += 1;
      });
      return {
        branches: active,
        lag: Math.round(3 + persist * 24),
        readout: injuryFade < 0.35 ? 'Injury faded — alarm branches stay lit (ICD-11 chronic classes)' : 'Acute trigger still visible while categories branch',
      };
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
    update(v) {
      const painWords = v.pain_lex_raw ?? Math.round(20 + v.pain_lex * 58);
      const pleasWords = v.pleas_lex_raw ?? Math.round(4 + v.pleas_lex * 20);
      const pCount = Math.round((painWords / 78) * painPts.length);
      const gCount = Math.round((pleasWords / 24) * pleasPts.length);
      painPts.forEach((n, i) => {
        const on = i < pCount;
        n.visible = on;
        if (on) {
          n.coreMat.emissiveIntensity = 0.45 + (i % 7) * 0.08;
        }
      });
      pleasPts.forEach((n, i) => {
        n.visible = i < gCount;
        n.coreMat.emissiveIntensity = 0.35 + v.pleas_lex * 0.8;
      });
      const ratio = painWords / Math.max(pleasWords, 1);
      return {
        ratio: `${ratio.toFixed(1)}×`,
        density: painWords,
        readout: 'Clinical language factorizes pain into many more axes than pleasure',
      };
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
    update(v, now) {
      const vals = [v.intensity, v.unpleasant, v.secondary];
      let active = 0;
      layers.forEach((pl, i) => {
        const s = vals[i];
        pl.scale.y = 0.4 + s * 1.6;
        pl.material.opacity = 0.08 + s * 0.55;
        pl.position.z = i * 0.08 + Math.sin(now * 0.002 + i) * s * 0.05;
        if (s > 0.35) active += 1;
      });
      pleasure.scale.setScalar(0.65 + v.intensity * 0.25);
      pleasure.coreMat.emissiveIntensity = 0.35 + v.intensity * 0.45;
      return {
        layers: active,
        pleasure: Math.round(15 + v.intensity * 35),
        readout: active > 1 ? 'One injury — multiple ledgers climbing independently' : 'Separate sensory vs affective ledgers (Price 2000)',
      };
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
    update(v, now) {
      const wr = 0.75 + v.wanting * 1.05;
      wanting.forEach((w, i) => {
        const ang = (i / wanting.length) * Math.PI * 2 + now * 0.0006 * (0.5 + v.wanting);
        w.position.set(Math.cos(ang) * wr, Math.sin(ang) * wr * 0.55, Math.sin(ang * 2) * 0.35);
        w.coreMat.emissiveIntensity = 0.25 + v.wanting * 1.6;
      });
      liking.scale.setScalar(0.55 + v.liking * 0.55);
      liking.coreMat.emissiveIntensity = 0.4 + v.liking * 2.2;
      return {
        orbit: wr.toFixed(2),
        cluster: Math.round(20 + v.liking * 65),
        readout: v.wanting > v.liking + 0.25 ? 'Pursuit outruns felt joy — wanting ≠ liking' : 'Tight hedonic cluster vs wide dopaminergic orbit',
      };
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
    update(v, now) {
      threat.scale.setScalar(0.7 + v.threat * 0.65);
      threat.coreMat.emissiveIntensity = 0.45 + v.threat * 1.8;
      relief.scale.setScalar(0.55 + v.relief * v.threat * 0.85);
      relief.coreMat.emissiveIntensity = 0.35 + v.relief * v.threat * 2.2;
      particles.speeds.t = 0.12 + v.threat * 0.55;
      particles.speeds.r = 0.08 + v.relief * 0.45;
      return {
        borrow: Math.round(v.relief * v.threat * 100),
        residual: Math.round(v.threat * 70),
        readout: 'Relief pleasure scales with prior threat — shared opioid/dopamine substrate',
      };
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
    update(v, now) {
      const tilt = (v.bad - v.good) * 0.55;
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, tilt, 0.08);
      bad.scale.setScalar(0.65 + v.bad * 0.75);
      good.scale.setScalar(0.55 + v.good * 0.45);
      bad.position.y = 0.25 + v.bad * 0.35;
      good.position.y = 0.25 + v.good * 0.2;
      const ratio = v.bad / Math.max(v.good, 0.08);
      return {
        tilt: `${ratio.toFixed(1)}×`,
        net: Math.round((v.bad - v.good) * 100),
        readout: 'Matched events — bad side drops the scale (Baumeister et al. 2001)',
      };
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
    update(v, now) {
      const radius = 0.5 + v.contagion * 2.2;
      let infected = 0;
      let good = 0;
      grid.forEach((n) => {
        const d = n.position.distanceTo(seed.position);
        const hit = d < radius;
        if (hit) {
          n.coreMat.color.setHex(C.pain);
          n.coreMat.emissive.setHex(C.pain);
          n.coreMat.emissiveIntensity = 0.5 + v.contagion * 1.5;
          infected += 1;
        } else if (n.userData.idx < 4) {
          n.coreMat.color.setHex(C.pleasure);
          n.coreMat.emissive.setHex(C.pleasure);
          good += 1;
        } else {
          n.coreMat.color.setHex(C.muted);
          n.coreMat.emissive.setHex(C.muted);
        }
        n.position.z = Math.sin(now * 0.002 + n.userData.idx) * hit * 0.08;
      });
      seed.scale.setScalar(0.8 + v.contagion * 0.45 + Math.sin(now * 0.004) * 0.06);
      return {
        spread: infected,
        isolated: good,
        readout: 'Negative differentiation — harm stains neighbors; good stays local',
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
    update(v, now) {
      acc.scale.setScalar(0.75 + v.exclusion * 0.65 + Math.sin(now * 0.004) * v.exclusion * 0.08);
      acc.coreMat.emissiveIntensity = 0.45 + v.exclusion * 2.4;
      outcast.position.x = 1.15 + v.exclusion * 0.45;
      particles.speeds.x = 0.12 + v.exclusion * 0.75;
      const overlap = Math.round(40 + v.exclusion * (1 - v.belonging * 0.4) * 55);
      return {
        acc: Math.round(25 + v.exclusion * 75),
        overlap,
        readout: 'Ostracism activates bodily hurt circuits — no peripheral nociception required',
      };
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
    update(v, now) {
      threat.scale.setScalar(0.65 + v.threat * 0.75 + v.blame * 0.35);
      challenge.scale.setScalar(0.6 + v.challenge * 0.55);
      threat.coreMat.emissiveIntensity = 0.4 + v.threat * 1.8 + v.blame * 0.8;
      particles.speeds.t = 0.1 + v.threat * 0.65;
      particles.speeds.c = 0.1 + v.challenge * 0.55;
      return {
        output_a: Math.round(20 + (v.threat + v.blame * 0.5) * 70),
        output_b: Math.round(15 + v.challenge * 55),
        readout: 'Appraisal frame reshapes output — Lazarus & Folkman stress model',
      };
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
    update(v, now, labelState) {
      card.rotation.y = Math.sin(now * 0.0005) * 0.12;
      defects.forEach((n, i) => {
        n.coreMat.emissiveIntensity = 0.35 + v.defects * (1.2 + (i % 3) * 0.15);
        n.visible = v.defects > i * 0.12;
      });
      locks.forEach((l, i) => {
        l.coreMat.emissiveIntensity = 0.35 + v.repair * 1.2;
        l.scale.y = 0.8 + v.repair * 0.55;
        labelState.list[i + 1].el.dataset.opacity = String(0.25 + v.repair * 0.75);
      });
      return {
        locks: 3,
        regimes: Math.round(70 + v.repair * 30),
        readout: 'Three regimes · one clause: repair the chassis, never abandon it',
      };
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
    update(v, now) {
      let open = 0;
      bugs.forEach((n, i) => {
        const on = v.bugs * (0.65 + (i % 2) * 0.2);
        n.coreMat.emissiveIntensity = 0.3 + on * 2;
        n.scale.setScalar(0.55 + on * 0.65);
        n.position.y = -0.65 - (i % 2) * 0.15 - Math.sin(now * 0.002 + i) * on * 0.08;
        particles.speeds[`d${i}`] = 0.08 + on * 0.35;
        if (on > 0.35) open += 1;
      });
      return {
        defects: open,
        severity: Math.round(40 + v.bugs * 55),
        readout: v.blame > 0.55 ? 'Defects logged — then blame assigned downstream' : 'Genesis 2–3 as hardware defect table',
      };
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
    update(v, now) {
      user.scale.setScalar(0.55 + v.user_blame * 0.45);
      design.scale.setScalar(0.65 + v.design_blame * 0.75);
      user.coreMat.emissiveIntensity = 0.2 + v.user_blame * 0.8;
      design.coreMat.emissiveIntensity = 0.45 + v.design_blame * 2.2;
      particles.speeds.flip = 0.1 + v.design_blame * 0.65;
      user.position.x = THREE.MathUtils.lerp(user.position.x, -1.05 + v.user_blame * 0.25, 0.06);
      design.position.x = THREE.MathUtils.lerp(design.position.x, 0.85 + v.design_blame * 0.35, 0.06);
      return {
        upstream: Math.round(20 + v.design_blame * 80),
        downstream: Math.round(v.user_blame * 60),
        readout: 'Original Sin as manufacture — fault moves upstream to design',
      };
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
    update(v, now, labelState) {
      cols.forEach(({ base, lock }, i) => {
        base.scale.y = 0.6 + v.repair * 1.8;
        base.material.emissiveIntensity = 0.1 + v.repair * 0.55;
        lock.coreMat.emissiveIntensity = 0.35 + (1 - v.exit) * 1.5;
        lock.scale.setScalar(0.65 + (1 - v.exit) * 0.55);
        labelState.list[i].el.dataset.opacity = String(0.3 + v.repair * 0.7);
      });
      return {
        aligned: Math.round(80 + v.repair * 20),
        veto: Math.round(70 + (1 - v.exit) * 30),
        readout: 'Theologies diverge — body policy converges: repair yes, exit no',
      };
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
    update(v, now) {
      const rung = Math.min(6, Math.floor(v.therapy * 7));
      steps.forEach((s, i) => {
        s.material.emissiveIntensity = i <= rung ? 0.15 + v.therapy * 0.55 : 0.05;
        s.material.opacity = i <= rung ? 1 : 0.35;
      });
      climber.position.set(steps[rung].position.x, steps[rung].position.y + 0.18, 0.15);
      wall.material.emissiveIntensity = 0.15 + v.exit * 0.85;
      wall.scale.y = 0.85 + v.exit * 0.35;
      return {
        rung: rung + 1,
        wall: Math.round(60 + v.exit * 40),
        readout: rung >= 5 ? 'Therapy ladder climbed — morphological exit hits the wall' : 'Warrantied repair rungs — exit remains forbidden',
      };
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
    update(v, now) {
      bars.forEach((b, i) => {
        const fall = Math.max(0.08, 1 - (now * 0.00004 * v.audit + i * 0.08) % 1.1);
        const h = (0.15 + v.residual * 0.65) * fall;
        b.scale.y = h;
        b.position.y = -0.65 + h * 0.5;
        b.material.emissiveIntensity = 0.12 + v.residual * 0.55;
      });
      target.coreMat.emissiveIntensity = 0.4 + v.audit * 1.5;
      target.scale.setScalar(0.7 + Math.sin(now * 0.003) * 0.06);
      return {
        involuntary: Math.round(v.residual * 100),
        trajectory: Math.round(v.audit * 100),
        readout: 'Abolition metric — drive involuntary suffering toward zero',
      };
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
    this.sliders = {};
    root.querySelectorAll('[data-slider]').forEach((el) => {
      this.sliders[el.dataset.slider] = bindSlider(root, el.dataset.slider);
    });
    this.running = false;
    this.disposed = false;
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
      const v = {};
      Object.entries(this.sliders).forEach(([k, s]) => {
        v[k] = s.value;
        v[`${k}_raw`] = s.raw();
      });
      const metrics = this.logic.update(v, now, this.labelState);
      if (metrics) {
        Object.entries(metrics).forEach(([k, val]) => {
          if (k === 'readout') {
            if (this.readoutEl) this.readoutEl.textContent = val;
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

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

function showBrainError(msg) {
  const readout = document.getElementById('pm-b3d-readout');
  if (readout) readout.textContent = `Brain map failed to load: ${msg}`;
}

function initBrain3d() {
  const root = document.getElementById('pm-brain3d');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  try {
    boot(root);
  } catch (err) {
    showBrainError(err.message || String(err));
    console.error('[pain_machines brain3d]', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBrain3d);
} else {
  initBrain3d();
}

function boot(root) {
  const canvas = root.querySelector('#pm-brain3d-canvas');
  const wrap = root.querySelector('#pm-brain3d-canvas-wrap');
  if (!canvas || !wrap) throw new Error('canvas mount missing');

  const painEl = root.querySelector('#pm-b3d-pain');
  const pleasureEl = root.querySelector('#pm-b3d-pleasure');
  const ratioEl = root.querySelector('#pm-b3d-ratio');
  const readoutEl = root.querySelector('#pm-b3d-readout');
  const painBarEl = root.querySelector('#pm-b3d-pain-bar');
  const pleasureBarEl = root.querySelector('#pm-b3d-pleasure-bar');
  const painBarLabel = root.querySelector('#pm-b3d-pain-bar-label');
  const pleasureBarLabel = root.querySelector('#pm-b3d-pleasure-bar-label');
  const compareRatioEl = root.querySelector('#pm-b3d-compare-ratio');
  const calloutPain = root.querySelector('#pm-b3d-callout-pain');
  const calloutPleasure = root.querySelector('#pm-b3d-callout-pleasure');

  const sliders = {
    somatic: bindSlider(root, 'somatic', 72),
    sensory: bindSlider(root, 'sensory', 85),
    affective: bindSlider(root, 'affective', 88),
    social: bindSlider(root, 'social', 55),
    cognitive: bindSlider(root, 'cognitive', 70),
    pleasure: bindSlider(root, 'pleasure', 42),
    pharma: bindSlider(root, 'pharma', 35),
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030405, 0.055);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0.35, 0.15, 5.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x030405, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  let composer;
  let bloomPass;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.minDistance = 3.4;
  controls.maxDistance = 8.5;
  controls.target.set(0, 0.05, 0);
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 0.28;

  scene.add(new THREE.HemisphereLight(0xd8cfc4, 0x120808, 0.55));
  const key = new THREE.DirectionalLight(0xffefe6, 1.05);
  key.position.set(3, 4, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x8a9199, 0.35);
  fill.position.set(-4, 0, 2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0x7a9a8c, 0.55);
  rim.position.set(-2, 2, -4);
  scene.add(rim);

  const brainGroup = new THREE.Group();
  scene.add(brainGroup);

  const brainParts = createAnatomicalBrain();
  brainGroup.add(brainParts.group);

  const scaleVolumes = createScaleVolumes();
  brainGroup.add(scaleVolumes.group);

  const spinal = new THREE.Vector3(0, -1.72, -0.08);
  const socialIngress = new THREE.Vector3(0.05, 0.62, 1.35);

  const REGIONS = [
    { id: 'si', label: 'SI / SII', pos: [0.92, 0.22, -0.42], color: 0xb85c55, layer: 'sensory', source: 'Raja · Price' },
    { id: 'thalamus', label: 'thalamus', pos: [0.02, 0.08, 0.12], color: 0xb89a6a, layer: 'sensory', source: 'Hunt & Mantyh' },
    { id: 'acc', label: 'ACC / dACC', pos: [0.06, 0.68, 0.38], color: 0xb85c55, layer: 'affective', source: 'Price · Eisenberger' },
    { id: 'amygdala', label: 'amygdala', pos: [-0.48, -0.08, 0.52], color: 0xb89a6a, layer: 'affective', source: 'Hunt & Mantyh' },
    { id: 'hippocampus', label: 'hippocampus', pos: [-0.68, -0.18, -0.12], color: 0x9a7b6a, layer: 'cognitive', source: 'Melzack' },
    { id: 'mpfc', label: 'mPFC / OFC', pos: [0.12, 0.78, 0.72], color: 0x9a7b6a, layer: 'cognitive', source: 'Lazarus' },
    { id: 'nac', label: 'NAc', pos: [-0.22, -0.48, 0.42], color: 0x7a9a8c, layer: 'pleasure', source: 'Berridge' },
    { id: 'vp', label: 'VP', pos: [0.06, -0.52, 0.32], color: 0x7a9a8c, layer: 'pleasure', source: 'Berridge' },
    { id: 'vta', label: 'VTA', pos: [0.02, -0.68, 0.08], color: 0x7a9a8c, layer: 'pleasure', source: 'Leknes' },
  ];

  const regionMeshes = {};
  const labelEls = [];
  const labelLayer = root.querySelector('.pm-brain3d-labels');

  REGIONS.forEach((r) => {
    const node = createRegionNode(r.color);
    node.position.set(...r.pos);
    node.userData = r;
    brainGroup.add(node);
    regionMeshes[r.id] = node;

    const el = document.createElement('div');
    el.className = 'pm-b3d-label';
    el.innerHTML = `<strong>${r.label}</strong><span>${r.source}</span>`;
    labelLayer.appendChild(el);
    labelEls.push({ mesh: node, el, layer: r.layer });
  });

  const paths = {
    sensory: makeCurve([spinal, v3(0, -0.95, 0.02), regionMeshes.thalamus.position.clone(), regionMeshes.si.position.clone()]),
    affective: makeCurve([spinal, v3(-0.18, -0.88, 0.28), regionMeshes.amygdala.position.clone(), regionMeshes.acc.position.clone()]),
    social: makeCurve([socialIngress.clone(), v3(0.04, 0.68, 0.88), regionMeshes.acc.position.clone()]),
    cognitive: makeCurve([regionMeshes.hippocampus.position.clone(), v3(-0.22, 0.28, 0.22), regionMeshes.acc.position.clone()]),
    appraisal: makeCurve([regionMeshes.mpfc.position.clone(), v3(0.1, 0.72, 0.52), regionMeshes.acc.position.clone()]),
    pleasure: makeCurve([regionMeshes.vta.position.clone(), regionMeshes.nac.position.clone(), regionMeshes.vp.position.clone()]),
  };

  const tubes = {};
  Object.entries(paths).forEach(([key, curve]) => {
    const tube = createPathTube(curve, pathColor(key));
    tube.userData.pathKey = key;
    brainGroup.add(tube);
    tubes[key] = tube;
  });

  const particles = createParticleSystem(paths);
  brainGroup.add(particles.points);

  const spinalMarker = createIngressMarker(0xb85c55, 0.11);
  spinalMarker.position.copy(spinal);
  brainGroup.add(spinalMarker);

  const socialMarker = createIngressMarker(0x8a9199, 0.09);
  socialMarker.position.copy(socialIngress);
  brainGroup.add(socialMarker);

  const starfield = createStarfield();
  scene.add(starfield);

  function setupComposer(w, h) {
    if (composer) composer.dispose();
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.62, 0.38, 0.22);
    composer.addPass(bloomPass);
  }

  function resize() {
    const w = wrap.clientWidth;
    const h = Math.max(340, wrap.clientHeight || Math.min(560, w * 0.82));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    setupComposer(w, h);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  resize();

  let t0 = performance.now();
  const introT = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - t0) / 1000);
    t0 = now;

    const vals = readSliders(sliders);
    updateVisuals(vals, now, brainParts, scaleVolumes, tubes, regionMeshes, labelEls, particles, spinalMarker, socialMarker, starfield);
    updateMetrics(vals, readoutEl, painEl, pleasureEl, ratioEl, painBarEl, pleasureBarEl, painBarLabel, pleasureBarLabel, compareRatioEl);
    updateLabels(wrap, labelEls, camera, scaleVolumes, calloutPain, calloutPleasure);

    const intro = Math.min(1, (now - introT) / 2200);
    if (intro < 1 && !reducedMotion) {
      camera.position.z = THREE.MathUtils.lerp(6.8, 5.2, easeOutCubic(intro));
    }

    controls.autoRotateSpeed = reducedMotion ? 0 : 0.18 + vals.affective * 0.32;
    brainGroup.rotation.y = Math.sin(now * 0.00008) * 0.04;
    controls.update();
    composer.render();
    advanceParticles(particles, dt);
  }

  animate(t0);
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function readSliders(s) {
  return {
    somatic: s.somatic.value / 100,
    sensory: s.sensory.value / 100,
    affective: s.affective.value / 100,
    social: s.social.value / 100,
    cognitive: s.cognitive.value / 100,
    pleasure: s.pleasure.value / 100,
    pharma: s.pharma.value / 100,
  };
}

function updateVisuals(v, now, brainParts, scaleVolumes, tubes, regionMeshes, labelEls, particles, spinalMarker, socialMarker, starfield) {
  const pulse = 0.5 + 0.5 * Math.sin(now * 0.0024);
  const painLoad = Math.max(v.somatic * v.sensory, v.somatic * v.affective, v.social, v.cognitive);
  const pleasureLoad = v.pleasure * (1 - v.pharma * 0.55);

  brainParts.cortexMat.emissive.setHex(0x2a1010);
  brainParts.cortexMat.emissiveIntensity = 0.04 + painLoad * 0.22 + pulse * painLoad * 0.06;
  brainParts.innerMat.opacity = 0.08 + painLoad * 0.18;
  brainParts.innerMat.color.setHex(painLoad > 0.45 ? 0x6a1820 : 0x3a1018);

  const painScale = 1 + painLoad * 0.14 + pulse * 0.02;
  scaleVolumes.painEnvelope.scale.set(1.18 * painScale, 1.02 * painScale, 1.12 * painScale);
  scaleVolumes.painEnvelope.material.opacity = 0.28 + painLoad * 0.42;
  scaleVolumes.painShell.material.opacity = 0.04 + painLoad * 0.14;

  const pod = 0.82 + pleasureLoad * 0.28 - v.pharma * 0.38;
  scaleVolumes.pleasurePod.scale.set(pod * 1.05, pod * 0.72, pod * 0.9);
  scaleVolumes.pleasurePod.material.opacity = 0.42 + pleasureLoad * 0.45;
  scaleVolumes.pleasureRing.scale.setScalar(0.9 + pleasureLoad * 0.35 - v.pharma * 0.25);
  scaleVolumes.pleasureRing.material.opacity = 0.45 + pleasureLoad * 0.5;
  scaleVolumes.pleasureCore.material.opacity = 0.35 + pleasureLoad * 0.55;
  scaleVolumes.pleasureCore.scale.setScalar(0.85 + pleasureLoad * 0.4 - v.pharma * 0.3);

  Object.entries(tubes).forEach(([key, tube]) => {
    let strength = 0;
    if (key === 'sensory') strength = v.somatic * v.sensory;
    if (key === 'affective') strength = v.somatic * v.affective;
    if (key === 'social') strength = v.social;
    if (key === 'cognitive' || key === 'appraisal') strength = v.cognitive * 0.88;
    if (key === 'pleasure') strength = v.pleasure * (1 - v.pharma * 0.65);
    tube.material.opacity = 0.04 + strength * 0.92;
    tube.visible = strength > 0.02;
    tube.scale.setScalar(0.65 + strength * 0.55);
  });

  labelEls.forEach(({ mesh, el, layer }) => {
    let on = 0.15;
    if (layer === 'sensory') on = v.somatic * v.sensory;
    if (layer === 'affective') on = Math.max(v.somatic * v.affective, v.social * 0.85);
    if (layer === 'cognitive') on = v.cognitive;
    if (layer === 'pleasure') on = v.pleasure * (1 - v.pharma * 0.55);
    const scale = 0.65 + on * 0.75 + (on > 0.35 ? pulse * 0.12 : 0);
    mesh.scale.setScalar(scale);
    mesh.coreMat.emissiveIntensity = 0.45 + on * 2.2;
    mesh.coreMat.opacity = 0.35 + on * 0.65;
    mesh.ringMat.opacity = 0.08 + on * 0.55;
    el.style.opacity = String(0.1 + on * 0.9);
  });

  regionMeshes.acc.coreMat.emissiveIntensity = 0.55 + Math.max(v.affective, v.social, v.cognitive) * 1.8;

  particles.speeds.sensory = 0.14 + v.somatic * v.sensory * 0.72;
  particles.speeds.affective = 0.14 + v.somatic * v.affective * 0.72;
  particles.speeds.social = 0.12 + v.social * 0.62;
  particles.speeds.cognitive = 0.1 + v.cognitive * 0.52;
  particles.speeds.appraisal = 0.1 + v.cognitive * 0.46;
  particles.speeds.pleasure = 0.12 + v.pleasure * (1 - v.pharma * 0.5) * 0.42;
  particles.mat.opacity = 0.4 + painLoad * 0.55;
  particles.mat.size = 0.045 + painLoad * 0.035;

  spinalMarker.coreMat.emissiveIntensity = 0.4 + v.somatic * 1.5;
  socialMarker.coreMat.emissiveIntensity = 0.2 + v.social * 1.6;
  socialMarker.scale.setScalar(0.7 + v.social * 0.65);

  starfield.rotation.y += 0.00015;
}

function updateMetrics(v, readoutEl, painEl, pleasureEl, ratioEl, painBarEl, pleasureBarEl, painBarLabel, pleasureBarLabel, compareRatioEl) {
  const painAxes = [
    1 + Math.round(v.somatic * 5),
    1 + Math.round(v.sensory * 5),
    1 + Math.round(v.affective * 5),
    1 + Math.round(v.social * 4),
    1 + Math.round(v.cognitive * 5),
    6,
    4,
  ];
  const painStates = painAxes.reduce((a, b) => a * b, 1);
  const pleasureRaw = Math.round(5 * 4 * 6 * (0.35 + v.pleasure * 0.65));
  const receptorClasses = Math.max(2, Math.round(4 * (1 - v.pharma * 0.55)));
  const pleasureStates = Math.max(1, Math.round(pleasureRaw / receptorClasses));
  const ratio = painStates / Math.max(pleasureStates, 1);
  const log10 = Math.log10(ratio);

  const painFmt = painStates >= 10000 ? `${(painStates / 1000).toFixed(1)}k` : painStates.toLocaleString();
  painEl.textContent = painFmt;
  pleasureEl.textContent = String(pleasureStates);
  ratioEl.textContent = `10^${log10.toFixed(2)}`;

  const maxLog = 5.2;
  const painBarW = Math.min(100, (Math.log10(Math.max(painStates, 10)) / maxLog) * 100);
  const pleasureBarW = Math.max(6, Math.min(100, (Math.log10(Math.max(pleasureStates, 2)) / maxLog) * 100));
  if (painBarEl) painBarEl.style.width = `${painBarW}%`;
  if (pleasureBarEl) pleasureBarEl.style.width = `${pleasureBarW}%`;
  if (painBarLabel) painBarLabel.textContent = `${painFmt} states · whole-brain envelope`;
  if (pleasureBarLabel) pleasureBarLabel.textContent = `${pleasureStates} states · ventral pod`;
  if (compareRatioEl) compareRatioEl.textContent = `pain footprint ≈ ${Math.round(ratio).toLocaleString()}× larger`;

  if (readoutEl) {
    readoutEl.textContent = v.pharma > 0.55
      ? 'Red envelope = pain sprawl · green pod shrinks under pharmacology'
      : 'Red wireframe wraps cortex/limbic · green pod stays ventral and tiny';
  }
}

function updateLabels(wrap, labelEls, camera, scaleVolumes, calloutPain, calloutPleasure) {
  const rect = wrap.getBoundingClientRect();
  const project = (obj, el) => {
    if (!el || !obj) return;
    const p = obj.getWorldPosition(new THREE.Vector3()).project(camera);
    if (p.z > 1) {
      el.style.opacity = '0';
      return;
    }
    const x = (p.x * 0.5 + 0.5) * rect.width;
    const y = (-p.y * 0.5 + 0.5) * rect.height;
    el.style.opacity = '1';
    el.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 100%))`;
  };

  labelEls.forEach(({ mesh, el }) => {
    const p = mesh.getWorldPosition(new THREE.Vector3()).project(camera);
    if (p.z > 1) {
      el.style.opacity = '0';
      return;
    }
    const x = (p.x * 0.5 + 0.5) * rect.width;
    const y = (-p.y * 0.5 + 0.5) * rect.height;
    el.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  });

  project(scaleVolumes.painEnvelope, calloutPain);
  project(scaleVolumes.pleasurePod, calloutPleasure);
}

function gyriNoise(x, y, z) {
  return (
    Math.sin(x * 7.8 + y * 2.4) * Math.cos(z * 6.5 + x * 1.8) * 0.058 +
    Math.sin(x * 14.5 + z * 11.2) * 0.034 +
    Math.cos(y * 12.3 + x * 9.1) * Math.sin(z * 13.4) * 0.026 +
    Math.sin((x * 3 + y * 5 + z * 4) * 4.2) * 0.018
  );
}

function displaceHemisphereGeometry(geo, side) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    if (side * x < 0.04) x = side * 0.04;

    y *= 0.92;
    z *= 1.18;
    x = side * (Math.abs(x) * 1.08 + 0.06);

    if (y > 0.35) y *= 1.06;
    if (y < -0.25) y *= 0.88;
    if (z < -0.2) z *= 0.94;

    const n = gyriNoise(x * 1.4, y * 1.4, z * 1.4);
    const s = 1 + n;
    pos.setXYZ(i, x * s, y * s, z * s);
  }
  geo.computeVertexNormals();
}

function createAnatomicalBrain() {
  const group = new THREE.Group();

  const cortexMat = new THREE.MeshPhysicalMaterial({
    color: 0x9a7068,
    emissive: 0x2a1010,
    emissiveIntensity: 0.06,
    roughness: 0.48,
    metalness: 0.08,
    clearcoat: 0.35,
    clearcoatRoughness: 0.4,
    sheen: 0.4,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color(0xc4a8a0),
  });

  const leftGeo = new THREE.IcosahedronGeometry(1.05, 6);
  const rightGeo = new THREE.IcosahedronGeometry(1.05, 6);
  displaceHemisphereGeometry(leftGeo, -1);
  displaceHemisphereGeometry(rightGeo, 1);

  const left = new THREE.Mesh(leftGeo, cortexMat);
  const right = new THREE.Mesh(rightGeo, cortexMat);
  group.add(left, right);

  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x4a1520,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
  });
  const innerLeft = new THREE.Mesh(leftGeo.clone(), innerMat);
  const innerRight = new THREE.Mesh(rightGeo.clone(), innerMat);
  innerLeft.scale.setScalar(0.96);
  innerRight.scale.setScalar(0.96);
  group.add(innerLeft, innerRight);

  const falx = new THREE.Mesh(
    new THREE.PlaneGeometry(0.04, 2.1),
    new THREE.MeshBasicMaterial({ color: 0x1a0808, transparent: true, opacity: 0.55 }),
  );
  group.add(falx);

  const cerebellumGeo = new THREE.SphereGeometry(0.44, 36, 28);
  const cPos = cerebellumGeo.attributes.position;
  for (let i = 0; i < cPos.count; i += 1) {
    let x = cPos.getX(i);
    let y = cPos.getY(i);
    let z = cPos.getZ(i);
    x *= 1.45;
    y *= 0.62;
    z *= 0.95;
    const fold = Math.sin(y * 38 + x * 8) * Math.cos(z * 22) * 0.022;
    const s = 1 + fold;
    cPos.setXYZ(i, x * s, y * s, z * s);
  }
  cerebellumGeo.computeVertexNormals();
  const cerebellum = new THREE.Mesh(
    cerebellumGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0x886860,
      roughness: 0.52,
      metalness: 0.06,
      clearcoat: 0.2,
    }),
  );
  cerebellum.position.set(0, -0.42, -0.78);
  group.add(cerebellum);

  const stem = new THREE.Group();
  const medulla = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.15, 0.42, 20),
    new THREE.MeshStandardMaterial({ color: 0x6a5858, roughness: 0.75 }),
  );
  medulla.position.y = -0.18;
  const spinalCord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.09, 0.55, 16),
    new THREE.MeshStandardMaterial({ color: 0x554848, roughness: 0.8 }),
  );
  spinalCord.position.y = -0.62;
  stem.add(medulla, spinalCord);
  stem.position.set(0, -1.05, -0.12);
  group.add(stem);

  group.rotation.x = -0.08;
  return { group, cortexMat, innerMat };
}

function createScaleVolumes() {
  const group = new THREE.Group();

  const painEnvelope = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color: 0xb85c55,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    }),
  );
  painEnvelope.scale.set(1.18, 1.02, 1.12);

  const painShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.04, 3),
    new THREE.MeshBasicMaterial({
      color: 0xb85c55,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  painShell.scale.set(1.14, 1.0, 1.08);

  const pleasurePod = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 28, 22),
    new THREE.MeshBasicMaterial({
      color: 0x7a9a8c,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    }),
  );
  pleasurePod.position.set(-0.04, -0.5, 0.36);

  const pleasureCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 20, 16),
    new THREE.MeshBasicMaterial({
      color: 0x9ec4b8,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  pleasureCore.position.copy(pleasurePod.position);

  const pleasureRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.014, 10, 48),
    new THREE.MeshBasicMaterial({
      color: 0x7a9a8c,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    }),
  );
  pleasureRing.position.copy(pleasurePod.position);
  pleasureRing.rotation.x = Math.PI / 2.2;

  group.add(painEnvelope, painShell, pleasurePod, pleasureCore, pleasureRing);

  return { group, painEnvelope, painShell, pleasurePod, pleasureCore, pleasureRing };
}

function createStarfield() {
  const count = 420;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const r = 12 + Math.random() * 18;
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
    new THREE.PointsMaterial({ color: 0x555c64, size: 0.035, transparent: true, opacity: 0.35, depthWrite: false }),
  );
}

function v3(x, y, z) {
  return new THREE.Vector3(x, y, z);
}

function bindSlider(root, name, initial) {
  const input = root.querySelector(`[data-slider="${name}"]`);
  const valEl = root.querySelector(`[data-slider-val="${name}"]`);
  if (!input) return { get value() { return initial; } };
  input.value = String(initial);
  if (valEl) valEl.textContent = String(initial);
  input.addEventListener('input', () => {
    if (valEl) valEl.textContent = input.value;
  });
  return { get value() { return Number(input.value); } };
}

function createRegionNode(color) {
  const coreMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.65,
    transparent: true,
    opacity: 0.85,
    roughness: 0.25,
    metalness: 0.35,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.075, 1), coreMat);

  const ringMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.008, 8, 28), ringMat);
  ring.rotation.x = Math.PI / 2;

  const group = new THREE.Group();
  group.add(core, ring);
  group.coreMat = coreMat;
  group.ringMat = ringMat;
  return group;
}

function createIngressMarker(color, size) {
  const coreMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.85, roughness: 0.35 });
  const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(size, 0), coreMat);
  mesh.coreMat = coreMat;
  return mesh;
}

function makeCurve(points) {
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.38);
}

function pathColor(key) {
  if (key === 'pleasure') return 0x7a9a8c;
  if (key === 'social') return 0x8a9199;
  if (key === 'cognitive' || key === 'appraisal') return 0x9a7b6a;
  if (key === 'affective') return 0xb89a6a;
  return 0xb85c55;
}

function createPathTube(curve, color) {
  return new THREE.Mesh(
    new THREE.TubeGeometry(curve, 80, 0.014, 10, false),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
}

function createParticleSystem(paths) {
  const count = 320;
  const positions = new Float32Array(count * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.048,
    color: 0xffb8ae,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const pathKeys = Object.keys(paths);
  const agents = Array.from({ length: count }, (_, i) => ({
    key: pathKeys[i % pathKeys.length],
    t: Math.random(),
  }));

  return {
    points: new THREE.Points(geo, mat),
    agents,
    positions,
    paths,
    mat,
    speeds: { sensory: 0.3, affective: 0.3, social: 0.2, cognitive: 0.18, appraisal: 0.16, pleasure: 0.14 },
  };
}

function advanceParticles(system, dt) {
  const { agents, positions, paths, speeds } = system;
  agents.forEach((a, i) => {
    const speed = speeds[a.key] || 0;
    const curve = paths[a.key];
    if (!curve || speed < 0.04) return;
    a.t = (a.t + dt * speed) % 1;
    const p = curve.getPoint(a.t);
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
  });
  system.points.geometry.attributes.position.needsUpdate = true;
}

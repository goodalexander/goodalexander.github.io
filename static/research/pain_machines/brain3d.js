import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const root = document.getElementById('pm-brain3d');
if (root && !root.dataset.ready) {
  root.dataset.ready = 'true';
  boot(root);
}

function boot(root) {
  const canvas = root.querySelector('#pm-brain3d-canvas');
  const wrap = root.querySelector('#pm-brain3d-canvas-wrap');
  const painEl = root.querySelector('#pm-b3d-pain');
  const pleasureEl = root.querySelector('#pm-b3d-pleasure');
  const ratioEl = root.querySelector('#pm-b3d-ratio');
  const readoutEl = root.querySelector('#pm-b3d-readout');

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
  scene.fog = new THREE.FogExp2(0x040506, 0.075);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0.15, 0.25, 4.85);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x040506, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 3.1;
  controls.maxDistance = 7.8;
  controls.target.set(0, 0.02, 0);
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 0.32;

  scene.add(new THREE.AmbientLight(0xb8b0a8, 0.38));
  const key = new THREE.DirectionalLight(0xffe8dc, 0.9);
  key.position.set(2.5, 3, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7a9a8c, 0.5);
  rim.position.set(-3, 1, -2);
  scene.add(rim);

  const brainGroup = new THREE.Group();
  scene.add(brainGroup);

  const brainShell = createBrainShell();
  brainGroup.add(brainShell.mesh);
  brainGroup.add(brainShell.wire);
  brainGroup.add(createCerebellum());
  brainGroup.add(createBrainstem());

  const spinal = new THREE.Vector3(0, -2.05, -0.05);
  const socialIngress = new THREE.Vector3(-0.15, 0.95, 1.65);

  const REGIONS = [
    { id: 'si', label: 'SI / SII', pos: [1.05, 0.45, 0.35], color: 0xb85c55, layer: 'sensory', source: 'Raja · Price' },
    { id: 'thalamus', label: 'thalamus', pos: [0.05, 0.12, 0.18], color: 0xb89a6a, layer: 'sensory', source: 'Hunt & Mantyh' },
    { id: 'acc', label: 'ACC / dACC', pos: [0.15, 0.92, 0.55], color: 0xb85c55, layer: 'affective', source: 'Price · Eisenberger' },
    { id: 'amygdala', label: 'amygdala', pos: [-0.55, -0.05, 0.62], color: 0xb89a6a, layer: 'affective', source: 'Hunt & Mantyh' },
    { id: 'hippocampus', label: 'hippocampus', pos: [-0.82, -0.28, 0.08], color: 0x9a7b6a, layer: 'cognitive', source: 'Melzack' },
    { id: 'mpfc', label: 'mPFC / OFC', pos: [0.25, 1.05, 0.82], color: 0x9a7b6a, layer: 'cognitive', source: 'Lazarus' },
    { id: 'nac', label: 'NAc', pos: [-0.28, -0.72, 0.48], color: 0x7a9a8c, layer: 'pleasure', source: 'Berridge' },
    { id: 'vp', label: 'VP', pos: [0.08, -0.78, 0.38], color: 0x7a9a8c, layer: 'pleasure', source: 'Berridge' },
    { id: 'vta', label: 'VTA', pos: [0.02, -1.02, 0.12], color: 0x7a9a8c, layer: 'pleasure', source: 'Leknes' },
  ];

  const regionMeshes = {};
  const labelEls = [];
  const labelLayer = root.querySelector('.pm-brain3d-labels');

  REGIONS.forEach((r) => {
    const mesh = createRegionNode(r.color);
    mesh.position.set(...r.pos);
    mesh.userData = r;
    brainGroup.add(mesh);
    regionMeshes[r.id] = mesh;

    const el = document.createElement('div');
    el.className = 'pm-b3d-label';
    el.innerHTML = `<strong>${r.label}</strong><span>${r.source}</span>`;
    labelLayer.appendChild(el);
    labelEls.push({ mesh, el, layer: r.layer });
  });

  const paths = {
    sensory: makeCurve([spinal, v3(0, -0.55, 0.05), regionMeshes.thalamus.position.clone(), regionMeshes.si.position.clone()]),
    affective: makeCurve([spinal, v3(-0.2, -0.65, 0.35), regionMeshes.amygdala.position.clone(), regionMeshes.acc.position.clone()]),
    social: makeCurve([socialIngress.clone(), v3(0.05, 0.95, 1.05), regionMeshes.acc.position.clone()]),
    cognitive: makeCurve([regionMeshes.hippocampus.position.clone(), v3(-0.2, 0.35, 0.35), regionMeshes.acc.position.clone()]),
    appraisal: makeCurve([regionMeshes.mpfc.position.clone(), v3(0.2, 0.98, 0.68), regionMeshes.acc.position.clone()]),
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

  const spinalMarker = createIngressMarker(0xb85c55);
  spinalMarker.position.copy(spinal);
  brainGroup.add(spinalMarker);

  const socialMarker = createIngressMarker(0x8a9199);
  socialMarker.position.copy(socialIngress);
  brainGroup.add(socialMarker);

  function resize() {
    const w = wrap.clientWidth;
    const h = Math.max(340, wrap.clientHeight || Math.min(540, w * 0.78));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  resize();

  let t0 = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - t0) / 1000);
    t0 = now;

    const vals = readSliders(sliders);
    updateVisuals(vals, now);
    updateMetrics(vals);
    updateLabels();

    controls.autoRotateSpeed = reducedMotion ? 0 : 0.22 + vals.affective * 0.28;
    controls.update();
    renderer.render(scene, camera);
    advanceParticles(particles, dt);
  }

  animate(t0);

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

  function updateVisuals(v, now) {
    const pulse = 0.5 + 0.5 * Math.sin(now * 0.0022);

    Object.entries(tubes).forEach(([key, tube]) => {
      let strength = 0;
      if (key === 'sensory') strength = v.somatic * v.sensory;
      if (key === 'affective') strength = v.somatic * v.affective;
      if (key === 'social') strength = v.social;
      if (key === 'cognitive' || key === 'appraisal') strength = v.cognitive * 0.88;
      if (key === 'pleasure') strength = v.pleasure * (1 - v.pharma * 0.65);
      tube.material.opacity = 0.06 + strength * 0.78;
      tube.material.emissiveIntensity = strength * 0.95;
      tube.visible = strength > 0.03;
    });

    labelEls.forEach(({ mesh, el, layer }) => {
      let on = 0.2;
      if (layer === 'sensory') on = v.somatic * v.sensory;
      if (layer === 'affective') on = Math.max(v.somatic * v.affective, v.social * 0.85);
      if (layer === 'cognitive') on = v.cognitive;
      if (layer === 'pleasure') on = v.pleasure * (1 - v.pharma * 0.55);
      const scale = 0.72 + on * 0.58 + (on > 0.35 ? pulse * 0.07 : 0);
      mesh.scale.setScalar(scale);
      mesh.material.emissiveIntensity = 0.3 + on * 1.45;
      mesh.material.opacity = 0.3 + on * 0.68;
      el.style.opacity = String(0.12 + on * 0.88);
    });

    regionMeshes.acc.material.emissiveIntensity = 0.45 + Math.max(v.affective, v.social, v.cognitive) * 1.25;
    brainShell.mesh.material.emissiveIntensity = 0.06 + v.somatic * 0.06 + v.cognitive * 0.04;

    particles.speeds.sensory = 0.12 + v.somatic * v.sensory * 0.62;
    particles.speeds.affective = 0.12 + v.somatic * v.affective * 0.62;
    particles.speeds.social = 0.1 + v.social * 0.55;
    particles.speeds.cognitive = 0.08 + v.cognitive * 0.48;
    particles.speeds.appraisal = 0.08 + v.cognitive * 0.42;
    particles.speeds.pleasure = 0.1 + v.pleasure * (1 - v.pharma * 0.5) * 0.38;

    particles.mat.opacity = 0.35 + Math.max(v.somatic, v.social, v.cognitive) * 0.55;
    particles.mat.color.setHex(v.pleasure > v.affective ? 0xa8c4b8 : 0xffc4bc);

    spinalMarker.material.emissiveIntensity = 0.35 + v.somatic * 1.25;
    socialMarker.material.emissiveIntensity = 0.15 + v.social * 1.35;
    socialMarker.scale.setScalar(0.75 + v.social * 0.55);
  }

  function updateMetrics(v) {
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

    painEl.textContent = painStates >= 10000 ? `${(painStates / 1000).toFixed(1)}k` : painStates.toLocaleString();
    pleasureEl.textContent = String(pleasureStates);
    ratioEl.textContent = `10^${Math.log10(ratio).toFixed(2)}`;

    if (readoutEl) {
      readoutEl.textContent = v.pharma > 0.55
        ? 'Pharmacology compresses the green pleasure cluster — red pain layers stay separable.'
        : 'Drag to rotate · parallel routes feed ACC / neuromatrix — suffering enumerates, bliss compresses.';
    }
  }

  function updateLabels() {
    const rect = wrap.getBoundingClientRect();
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
  }
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

function createBrainShell() {
  const geo = new THREE.IcosahedronGeometry(1.55, 5);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    x *= 1.05;
    y = y * 0.82 - 0.08;
    z *= 1.18;
    const bump = 0.045 * Math.sin(x * 7.2) * Math.cos(y * 6.1) * Math.sin(z * 5.4);
    const s = 1 + bump;
    pos.setXYZ(i, x * s, y * s, z * s);
  }
  geo.computeVertexNormals();

  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x141618,
    emissive: 0x1a0808,
    emissiveIntensity: 0.08,
    metalness: 0.15,
    roughness: 0.62,
    clearcoat: 0.25,
    transparent: true,
    opacity: 0.94,
  });

  const mesh = new THREE.Mesh(geo, mat);
  const wire = new THREE.Mesh(
    geo.clone(),
    new THREE.MeshBasicMaterial({ color: 0xb85c55, wireframe: true, transparent: true, opacity: 0.045 }),
  );
  wire.scale.setScalar(1.012);
  return { mesh, wire };
}

function createCerebellum() {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 24, 18),
    new THREE.MeshPhysicalMaterial({ color: 0x101214, roughness: 0.7, metalness: 0.1, transparent: true, opacity: 0.9 }),
  );
  mesh.position.set(-0.05, -0.55, -0.95);
  mesh.scale.set(1.3, 0.75, 1);
  return mesh;
}

function createBrainstem() {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 0.55, 16),
    new THREE.MeshStandardMaterial({ color: 0x0d0e10, roughness: 0.85 }),
  );
  mesh.position.set(0, -1.35, -0.15);
  return mesh;
}

function createRegionNode(color) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.85,
    roughness: 0.35,
    metalness: 0.2,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 16), mat);
  mesh.add(new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 16, 12),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12 }),
  ));
  return mesh;
}

function createIngressMarker(color) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 12),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.8, roughness: 0.4 }),
  );
}

function makeCurve(points) {
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.35);
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
    new THREE.TubeGeometry(curve, 64, 0.018, 8, false),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.35,
      roughness: 0.45,
    }),
  );
}

function createParticleSystem(paths) {
  const count = 240;
  const positions = new Float32Array(count * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.038,
    color: 0xffc4bc,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
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

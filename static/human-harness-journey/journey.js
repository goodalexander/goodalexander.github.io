import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const realms = window.HARNESS_REALMS || [];
const canvas = document.getElementById('journey-canvas');
const loading = document.getElementById('loading-screen');
const rail = document.getElementById('portal-rail');
const title = document.getElementById('realm-title');
const kicker = document.getElementById('realm-kicker');
const dictum = document.getElementById('realm-dictum');
const body = document.getElementById('realm-body');
const truth = document.getElementById('realm-truth');
const indexLabel = document.getElementById('portal-index');
const meter = document.getElementById('portal-meter');
const prev = document.getElementById('prev-portal');
const next = document.getElementById('next-portal');

let active = 0;
let dragStart = null;
let dragOffset = 0;
let targetDragOffset = 0;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050408, 0.036);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.1, 0.2);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const group = new THREE.Group();
scene.add(group);

const portalGroup = new THREE.Group();
group.add(portalGroup);

const loader = new THREE.TextureLoader();
const radius = 11.5;
const step = (Math.PI * 2) / realms.length;
const portalMeshes = [];

const ambient = new THREE.AmbientLight(0x9bf7ff, 1.2);
scene.add(ambient);

const coreLight = new THREE.PointLight(0x54fff1, 30, 26);
coreLight.position.set(0, 2, 0);
scene.add(coreLight);

const redLight = new THREE.PointLight(0xff4d5b, 16, 28);
redLight.position.set(-8, 4, 5);
scene.add(redLight);

const goldLight = new THREE.PointLight(0xffd45e, 12, 22);
goldLight.position.set(8, -1, -5);
scene.add(goldLight);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(5.8, 0.015, 8, 160),
  new THREE.MeshBasicMaterial({ color: 0x54fff1, transparent: true, opacity: 0.28 })
);
torus.rotation.x = Math.PI / 2;
torus.position.y = -1.3;
scene.add(torus);

const innerTorus = new THREE.Mesh(
  new THREE.TorusGeometry(2.2, 0.01, 8, 120),
  new THREE.MeshBasicMaterial({ color: 0xffd45e, transparent: true, opacity: 0.22 })
);
innerTorus.rotation.x = Math.PI / 2;
innerTorus.position.y = -1.28;
scene.add(innerTorus);

function makeFallbackTexture(realm, index) {
  const fallback = document.createElement('canvas');
  fallback.width = 1536;
  fallback.height = 512;
  const ctx = fallback.getContext('2d');
  const hue = (index * 31) % 360;
  const gradient = ctx.createLinearGradient(0, 0, fallback.width, fallback.height);
  gradient.addColorStop(0, `hsl(${hue} 70% 10%)`);
  gradient.addColorStop(0.48, '#09070d');
  gradient.addColorStop(1, `hsl(${(hue + 150) % 360} 70% 13%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, fallback.width, fallback.height);
  ctx.strokeStyle = 'rgba(84, 255, 241, 0.35)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 18; i += 1) {
    const x = (i / 17) * fallback.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(fallback.width - x * 0.24, fallback.height);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(245, 241, 231, 0.92)';
  ctx.font = '900 44px Inter, sans-serif';
  ctx.fillText(String(index + 1).padStart(2, '0'), 56, 96);
  ctx.font = '900 72px Inter, sans-serif';
  ctx.fillText(realm.title, 56, 200, fallback.width - 112);
  const texture = new THREE.CanvasTexture(fallback);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildPortals() {
  const geometry = new THREE.PlaneGeometry(7.8, 2.6, 24, 1);

  realms.forEach((realm, index) => {
    const material = new THREE.MeshStandardMaterial({
      map: makeFallbackTexture(realm, index),
      roughness: 0.48,
      metalness: 0.08,
      emissive: new THREE.Color(0x0b2b2c),
      emissiveIntensity: 0.42,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    const angle = index * step;
    mesh.position.set(Math.sin(angle) * radius, 1.05, -Math.cos(angle) * radius);
    mesh.lookAt(0, 1.05, 0);
    mesh.userData.index = index;
    portalGroup.add(mesh);
    portalMeshes.push(mesh);

    loader.load(
      realm.image,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        material.map = texture;
        material.needsUpdate = true;
      },
      undefined,
      () => {}
    );
  });
}

function buildParticles() {
  const count = 900;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorA = new THREE.Color(0x54fff1);
  const colorB = new THREE.Color(0xff4d5b);
  const colorC = new THREE.Color(0xffd45e);

  for (let i = 0; i < count; i += 1) {
    const radiusJitter = 4 + Math.random() * 24;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.sin(angle) * radiusJitter;
    positions[i * 3 + 1] = -5 + Math.random() * 13;
    positions[i * 3 + 2] = Math.cos(angle) * radiusJitter;
    const color = i % 9 === 0 ? colorB : (i % 5 === 0 ? colorC : colorA);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.72
  });
  scene.add(new THREE.Points(geometry, material));
}

function updateCopy(index) {
  const realm = realms[index];
  if (!realm) return;
  kicker.textContent = realm.kicker;
  title.textContent = realm.title;
  dictum.textContent = realm.dictum;
  body.textContent = realm.body;
  truth.textContent = realm.truth;
  indexLabel.textContent = String(index + 1).padStart(2, '0');
  meter.style.width = `${((index + 1) / realms.length) * 100}%`;
  rail.querySelectorAll('button').forEach((button, buttonIndex) => {
    button.classList.toggle('is-active', buttonIndex === index);
    button.setAttribute('aria-current', buttonIndex === index ? 'step' : 'false');
  });
}

function goTo(index) {
  active = (index + realms.length) % realms.length;
  targetDragOffset = 0;
  updateCopy(active);
}

function buildRail() {
  realms.forEach((realm, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(index + 1).padStart(2, '0');
    button.setAttribute('aria-label', `Open portal ${index + 1}: ${realm.title}`);
    button.addEventListener('click', () => goTo(index));
    rail.appendChild(button);
  });
}

function bindInput() {
  prev.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') goTo(active - 1);
    if (event.key === 'ArrowRight') goTo(active + 1);
  });

  canvas.addEventListener('pointerdown', (event) => {
    dragStart = { x: event.clientX, offset: targetDragOffset };
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!dragStart) return;
    const delta = event.clientX - dragStart.x;
    targetDragOffset = dragStart.offset + delta * 0.003;
  });

  canvas.addEventListener('pointerup', () => {
    dragStart = null;
    targetDragOffset *= 0.35;
  });

  canvas.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) < 20) return;
    goTo(active + (event.deltaY > 0 ? 1 : -1));
  }, { passive: true });
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  dragOffset += (targetDragOffset - dragOffset) * 0.08;
  const targetRotation = -(active * step) + dragOffset;
  portalGroup.rotation.y += (targetRotation - portalGroup.rotation.y) * 0.08;
  torus.rotation.z += 0.0018;
  innerTorus.rotation.z -= 0.0024;

  portalMeshes.forEach((mesh, index) => {
    const distance = Math.min(
      Math.abs(index - active),
      realms.length - Math.abs(index - active)
    );
    const scale = 1 + Math.max(0, 1 - distance) * 0.12;
    mesh.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);
    mesh.material.emissiveIntensity += ((index === active ? 0.72 : 0.2) - mesh.material.emissiveIntensity) * 0.07;
  });

  camera.lookAt(0, 1.05, -8);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

if (realms.length) {
  buildRail();
  buildPortals();
  buildParticles();
  bindInput();
  updateCopy(active);
  window.addEventListener('resize', resize);
  resize();
  animate();
  window.setTimeout(() => loading?.classList.add('is-hidden'), 650);
} else {
  loading.querySelector('strong').textContent = 'Journey data missing';
}

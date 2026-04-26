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
const focusToggle = document.getElementById('toggle-focus');
const journeyUi = document.getElementById('journey-ui');
const ASSET_VERSION = 'sigil-v4';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function versionedUrl(url) {
  return url.includes('?') ? `${url}&v=${ASSET_VERSION}` : `${url}?v=${ASSET_VERSION}`;
}

let active = 0;
let requestSerial = 0;
let animationFrame = null;
let isPointerDown = false;
let pointerStartX = 0;
let pointerStartY = 0;
let lonStart = 0;
let latStart = 0;
let lon = 0;
let lat = 0;
let targetOpacity = 1;
let lastInteraction = window.performance.now();
let focused = false;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050408);

const DEFAULT_FOV = 82;
const MIN_FOV = 38;
const MAX_FOV = 96;

const camera = new THREE.PerspectiveCamera(DEFAULT_FOV, window.innerWidth / window.innerHeight, 1, 1100);
const target = new THREE.Vector3();

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const panoramaGeometry = new THREE.SphereGeometry(500, 96, 56);
panoramaGeometry.scale(-1, 1, 1);

const panoramaMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0
});

const panorama = new THREE.Mesh(panoramaGeometry, panoramaMaterial);
scene.add(panorama);

const loader = new THREE.TextureLoader();
loader.setCrossOrigin('anonymous');
const textureCache = new Map();
const fallbackCache = new Map();

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

function getFallbackTexture(index) {
  if (!fallbackCache.has(index)) {
    fallbackCache.set(index, makeFallbackTexture(realms[index], index));
  }
  return fallbackCache.get(index);
}

function applyTexture(texture, opacity = 1) {
  panoramaMaterial.map = texture;
  panoramaMaterial.opacity = 0.35;
  panoramaMaterial.needsUpdate = true;
  targetOpacity = opacity;
}

function preloadTexture(index) {
  const realm = realms[index];
  const imageUrl = realm ? versionedUrl(realm.image) : '';
  if (!realm || textureCache.has(imageUrl)) {
    return;
  }

  loader.load(
    imageUrl,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      textureCache.set(imageUrl, texture);
    },
    undefined,
    () => {}
  );
}

function loadWorld(index) {
  const realm = realms[index];
  const imageUrl = realm ? versionedUrl(realm.image) : '';
  const requestId = requestSerial + 1;
  requestSerial = requestId;
  targetOpacity = 1;

  if (!realm) {
    return;
  }

  const cachedTexture = textureCache.get(imageUrl);
  if (cachedTexture) {
    applyTexture(cachedTexture);
    return;
  }

  applyTexture(getFallbackTexture(index), 0.85);
  loader.load(
    imageUrl,
    (texture) => {
      if (requestId !== requestSerial) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      textureCache.set(imageUrl, texture);
      applyTexture(texture);
      loading?.classList.add('is-hidden');
    },
    undefined,
    () => {
      if (requestId === requestSerial) {
        loading?.classList.add('is-hidden');
      }
    }
  );
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
  lon = 0;
  lat = 0;
  camera.fov = DEFAULT_FOV;
  camera.updateProjectionMatrix();
  lastInteraction = window.performance.now();
  updateCopy(active);
  loadWorld(active);
  preloadTexture((active + 1) % realms.length);
  preloadTexture((active - 1 + realms.length) % realms.length);
}

function buildRail() {
  realms.forEach((realm, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(index + 1).padStart(2, '0');
    button.setAttribute('aria-label', `Open world ${index + 1}: ${realm.title}`);
    button.addEventListener('click', () => goTo(index));
    rail.appendChild(button);
  });
}

function updateCamera() {
  lat = clamp(lat, -82, 82);
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  target.x = 500 * Math.sin(phi) * Math.cos(theta);
  target.y = 500 * Math.cos(phi);
  target.z = 500 * Math.sin(phi) * Math.sin(theta);
  camera.lookAt(target);
}

function noteInteraction() {
  lastInteraction = window.performance.now();
}

function setFocused(value) {
  focused = Boolean(value);
  journeyUi?.classList.toggle('is-focus', focused);
  focusToggle?.setAttribute('aria-pressed', focused ? 'true' : 'false');
  if (focusToggle) {
    focusToggle.textContent = focused ? 'Text' : 'Focus';
  }
}

function bindInput() {
  prev.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  focusToggle?.addEventListener('click', () => setFocused(!focused));

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      goTo(active - 1);
    }
    if (event.key === 'ArrowRight') {
      goTo(active + 1);
    }
    if (event.key === '+' || event.key === '=') {
      camera.fov = clamp(camera.fov - 5, MIN_FOV, MAX_FOV);
      camera.updateProjectionMatrix();
      noteInteraction();
    }
    if (event.key === '-' || event.key === '_') {
      camera.fov = clamp(camera.fov + 5, MIN_FOV, MAX_FOV);
      camera.updateProjectionMatrix();
      noteInteraction();
    }
    if (event.key.toLowerCase() === 'f') {
      setFocused(!focused);
      noteInteraction();
    }
  });

  canvas.addEventListener('pointerdown', (event) => {
    isPointerDown = true;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    lonStart = lon;
    latStart = lat;
    canvas.classList.add('is-grabbing');
    canvas.setPointerCapture?.(event.pointerId);
    noteInteraction();
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!isPointerDown) {
      return;
    }
    lon = lonStart - ((event.clientX - pointerStartX) * 0.12);
    lat = latStart + ((event.clientY - pointerStartY) * 0.12);
    noteInteraction();
  });

  const releasePointer = (event) => {
    isPointerDown = false;
    canvas.classList.remove('is-grabbing');
    canvas.releasePointerCapture?.(event.pointerId);
  };

  canvas.addEventListener('pointerup', releasePointer);
  canvas.addEventListener('pointercancel', releasePointer);

  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    camera.fov = clamp(camera.fov + (event.deltaY * 0.03), MIN_FOV, MAX_FOV);
    camera.updateProjectionMatrix();
    noteInteraction();
  }, { passive: false });
}

function resize() {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function animate() {
  const now = window.performance.now();
  if (!isPointerDown && now - lastInteraction > 2200) {
    lon += 0.012;
  }

  updateCamera();
  panoramaMaterial.opacity += (targetOpacity - panoramaMaterial.opacity) * 0.07;
  renderer.render(scene, camera);
  animationFrame = window.requestAnimationFrame(animate);
}

if (realms.length) {
  buildRail();
  bindInput();
  updateCopy(active);
  loadWorld(active);
  preloadTexture(1 % realms.length);
  window.addEventListener('resize', resize);
  resize();
  animate();
  window.setTimeout(() => loading?.classList.add('is-hidden'), 1400);
} else {
  loading.querySelector('strong').textContent = 'Journey data missing';
}

window.addEventListener('pagehide', () => {
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
  }
  textureCache.forEach((texture) => texture.dispose());
  fallbackCache.forEach((texture) => texture.dispose());
  panoramaGeometry.dispose();
  panoramaMaterial.dispose();
  renderer.dispose();
});

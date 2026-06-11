/* Katy Technologies — hero blueprint field (Three.js)
   A quiet drifting plane of survey points in brand slate tones.
   Disabled for reduced motion; page falls back to the grainy gradient. */

const canvas = document.getElementById('field-canvas');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && !reduced) {
  init().catch(() => { /* atmosphere gradient remains the fallback */ });
}

async function init() {
  const THREE = await import('three');

  const hero = canvas.closest('.hero');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'low-power'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x071a33, 0.052);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 4.6, 13);
  camera.lookAt(0, 0, 0);

  // --- survey point field ---
  const COLS = 130;
  const ROWS = 72;
  const SPACING = 0.6;
  const count = COLS * ROWS;
  const positions = new Float32Array(count * 3);
  const base = []; // x,z pairs for wave math

  let p = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = (c - COLS / 2) * SPACING;
      const z = (r - ROWS / 2) * SPACING;
      positions[p * 3] = x;
      positions[p * 3 + 1] = 0;
      positions[p * 3 + 2] = z;
      base.push(x, z);
      p++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0x7f95aa,
    size: 0.045,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    depthWrite: false
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // faint reference grid beneath the points
  const grid = new THREE.GridHelper(COLS * SPACING, 26, 0x263d54, 0x263d54);
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  grid.position.y = -1.1;
  scene.add(grid);

  // --- sizing ---
  function resize() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // --- pointer parallax ---
  let targetX = 0;
  let targetY = 0;
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 1.4;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.8;
    }, { passive: true });
  }

  // --- visibility gating ---
  let inView = true;
  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
  }).observe(hero);

  // --- animate ---
  const pos = geo.attributes.position;
  const clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    if (!inView || document.hidden) return;

    const t = clock.getElapsedTime() * 0.45;
    for (let i = 0; i < count; i++) {
      const x = base[i * 2];
      const z = base[i * 2 + 1];
      pos.array[i * 3 + 1] =
        Math.sin(x * 0.32 + t) * Math.cos(z * 0.27 + t * 0.8) * 0.42;
    }
    pos.needsUpdate = true;

    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (4.6 - targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  tick();
  canvas.classList.add('is-on');
}

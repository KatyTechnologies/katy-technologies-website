/*
 * Katy Technologies — Flow Field
 * Particle theatre: 5 formations morphed by scroll progress.
 * Three.js 0.160 via importmap ("three"). No postprocessing — glow is faked
 * with a canvas radial sprite + additive blending.
 */
import * as THREE from 'three';

const html = document.documentElement;
const REDUCED = window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function enableFallback() {
  html.classList.add('no-webgl');
  window.__flowSceneFailed = true;
}

if (REDUCED || html.classList.contains('no-webgl')) {
  enableFallback();
} else {
  try {
    boot();
  } catch (err) {
    enableFallback();
  }
}

function boot() {
  const canvas = document.getElementById('scene');
  if (!canvas) throw new Error('scene canvas missing');

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance'
  });

  const scene = new THREE.Scene();
  const FOV = 55;
  const CAMZ = 92;
  const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(0, 0, CAMZ);

  /* ------------------------------------------------------------------ *
   * Particle data
   * ------------------------------------------------------------------ */
  const SMALL = Math.min(window.innerWidth, window.innerHeight) < 700;
  const N = SMALL ? 14000 : 25000;
  const TAU = Math.PI * 2;

  const pos = new Float32Array(N * 3);
  const colArr = new Float32Array(N * 3);
  const sizeArr = new Float32Array(N);
  const phaseArr = new Float32Array(N);

  // per-particle seeds + roles
  const sA = new Float32Array(N);
  const sB = new Float32Array(N);
  const sC = new Float32Array(N);
  const sD = new Float32Array(N);
  const sE = new Float32Array(N);
  const lane = new Uint8Array(N);   // 0..3 — intake / triage / review / approval
  const role = new Uint8Array(N);   // 0 base slate, 1 blue highlight, 2 taupe "manual touch"
  const thru = new Uint8Array(N);   // formation 3: stays on the straight lane through the choke
  const core = new Uint8Array(N);   // formation 5: forms the bright review node

  const scratchA = new Float32Array(N * 3);
  const scratchB = new Float32Array(N * 3);

  /* Colors ------------------------------------------------------------ */
  function hx(h) { return [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255]; }
  const C_BASE = hx(0x7F95AA);
  const C_SKY = hx(0x7CC4FF);
  const C_ELE = hx(0x2E7CFF);
  const C_TAUPE = hx(0xAFA7A7);
  const C_CORE = hx(0xD9ECFF);
  function mixc(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }
  function put(arr, j, c, m) {
    arr[j] = Math.min(1, c[0] * m);
    arr[j + 1] = Math.min(1, c[1] * m);
    arr[j + 2] = Math.min(1, c[2] * m);
  }

  // 5 precomputed per-particle color sets — lerped alongside positions.
  const colSets = [];
  for (let k = 0; k < 5; k++) colSets.push(new Float32Array(N * 3));

  for (let i = 0; i < N; i++) {
    sA[i] = Math.random();
    sB[i] = Math.random();
    sC[i] = Math.random();
    sD[i] = Math.random();
    sE[i] = Math.random();
    lane[i] = i % 4;
    const r = Math.random();
    role[i] = r < 0.10 ? 2 : (r < 0.30 ? 1 : 0);
    thru[i] = (role[i] === 2 || Math.random() < 0.10) ? 1 : 0;
    core[i] = Math.random() < 0.035 ? 1 : 0;
    sizeArr[i] = 1.1 + sD[i] * 2.3 + (role[i] === 2 ? 0.5 : 0);
    phaseArr[i] = Math.random();

    const hi = sE[i] < 0.5 ? C_SKY : C_ELE;
    const j = 3 * i;

    // 0 HERO chaos — quiet mixed cloud
    if (role[i] === 2) put(colSets[0], j, C_TAUPE, 0.9);
    else if (role[i] === 1) put(colSets[0], j, hi, 0.85);
    else put(colSets[0], j, mixc(C_BASE, C_SKY, sD[i] * 0.25), 0.8);

    // 1 MAP lanes — each lane tinted a touch bluer
    const laneTint = mixc(C_BASE, C_SKY, 0.12 + (lane[i] / 3) * 0.3);
    if (role[i] === 2) put(colSets[1], j, C_TAUPE, 0.95);
    else if (role[i] === 1) put(colSets[1], j, hi, 0.95);
    else put(colSets[1], j, laneTint, 0.9);

    // 2 NAME bottleneck — taupe burns brighter at the jam, blues dim
    if (role[i] === 2) put(colSets[2], j, C_TAUPE, 1.25);
    else if (role[i] === 1) put(colSets[2], j, mixc(hi, C_BASE, 0.45), 0.8);
    else put(colSets[2], j, C_BASE, 0.72);

    // 3 ROUTE bypass — the arc goes electric, the straight lane stays manual
    if (thru[i]) put(colSets[3], j, role[i] === 2 ? C_TAUPE : C_BASE, 0.95);
    else put(colSets[3], j, mixc(C_ELE, C_SKY, sD[i]), 1.0);

    // 4 TRUST loop — calm ring, bright center node
    if (core[i]) put(colSets[4], j, C_CORE, 1.4);
    else if (role[i] === 1) put(colSets[4], j, C_SKY, 0.95);
    else if (role[i] === 2) put(colSets[4], j, mixc(C_TAUPE, C_BASE, 0.5), 0.85);
    else put(colSets[4], j, mixc(C_BASE, C_SKY, 0.3), 0.85);
  }
  colArr.set(colSets[0]);

  /* Sprite — canvas-generated radial glow ------------------------------ */
  function makeSprite() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0.0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.22, 'rgba(255,255,255,0.62)');
    grd.addColorStop(0.55, 'rgba(255,255,255,0.13)');
    grd.addColorStop(1.0, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    const tx = new THREE.CanvasTexture(c);
    tx.colorSpace = THREE.SRGBColorSpace;
    return tx;
  }
  const spriteTex = makeSprite();

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPx: { value: 1 },
      uMap: { value: spriteTex }
    },
    vertexShader: [
      'attribute float aSize;',
      'attribute float aPhase;',
      'attribute vec3 aColor;',
      'uniform float uTime;',
      'uniform float uPx;',
      'varying vec3 vColor;',
      'varying float vTw;',
      'void main(){',
      '  vColor = aColor;',
      '  vTw = 0.78 + 0.22 * sin(uTime * (0.6 + aPhase * 1.8) + aPhase * 43.0);',
      '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
      '  gl_PointSize = aSize * uPx * vTw * (140.0 / -mv.z);',
      '  gl_Position = projectionMatrix * mv;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform sampler2D uMap;',
      'varying vec3 vColor;',
      'varying float vTw;',
      'void main(){',
      '  vec4 tex = texture2D(uMap, gl_PointCoord);',
      '  gl_FragColor = vec4(vColor * (0.55 + 0.45 * vTw), tex.a);',
      '}'
    ].join('\n'),
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending
  });

  const geom = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(pos, 3); posAttr.setUsage(THREE.DynamicDrawUsage);
  const colAttr = new THREE.BufferAttribute(colArr, 3); colAttr.setUsage(THREE.DynamicDrawUsage);
  geom.setAttribute('position', posAttr);
  geom.setAttribute('aColor', colAttr);
  geom.setAttribute('aSize', new THREE.BufferAttribute(sizeArr, 1));
  geom.setAttribute('aPhase', new THREE.BufferAttribute(phaseArr, 1));
  const points = new THREE.Points(geom, material);
  points.frustumCulled = false;
  scene.add(points);

  /* Chokepoint ring (formation 3) -------------------------------------- */
  const ringPts = [];
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * TAU;
    ringPts.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
  }
  const ring = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(ringPts),
    new THREE.LineBasicMaterial({ color: 0x7CC4FF, transparent: true, opacity: 0 })
  );
  ring.visible = false;
  scene.add(ring);

  /* Bright review node (formation 5) ------------------------------------ */
  const coreSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: spriteTex,
    color: 0x9FD4FF,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false
  }));
  coreSprite.visible = false;
  scene.add(coreSprite);

  /* Viewport-derived dimensions ----------------------------------------- */
  let VW = 1; let VH = 1; let SR = 1;
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const pr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h);
    material.uniforms.uPx.value = pr;
    VH = 2 * Math.tan((FOV / 2) * (Math.PI / 180)) * CAMZ;
    VW = VH * camera.aspect;
    SR = Math.min(VW, VH); // portrait-safe formation radius
    ring.scale.setScalar(SR * 0.085);
    coreSprite.scale.set(SR * 0.3, SR * 0.3, 1);
  }
  window.addEventListener('resize', resize);
  resize();

  /* ------------------------------------------------------------------ *
   * Formations — each fills out[] with live (time-animated) targets
   * ------------------------------------------------------------------ */
  const wrap = (v) => v - Math.floor(v);
  const smooth = (t) => t * t * (3 - 2 * t);

  // 1. HERO — turbulent drifting cloud
  function fill0(time, out) {
    const amp = SR * 0.055;
    for (let i = 0; i < N; i++) {
      const j = 3 * i;
      const w = time * (0.22 + sD[i] * 0.45) + sE[i] * TAU;
      out[j] = (sA[i] - 0.5) * VW * 1.15 + Math.sin(w) * amp;
      out[j + 1] = (sB[i] - 0.5) * VH * 1.15 + Math.cos(w * 0.93) * amp;
      out[j + 2] = (sC[i] - 0.5) * 42 + Math.sin(w * 0.71) * 5;
    }
  }

  // 2. MAP — four clean lanes flowing left→right
  function fill1(time, out) {
    for (let i = 0; i < N; i++) {
      const j = 3 * i;
      const ly = (lane[i] - 1.5) * VH * 0.17;
      out[j] = (wrap(sA[i] + time * 0.034 * (0.8 + sD[i] * 0.45)) - 0.5) * VW * 1.12;
      out[j + 1] = ly + (sB[i] - 0.5) * VH * 0.035;
      out[j + 2] = (sC[i] - 0.5) * 7;
    }
  }

  // 3. NAME — lanes funnel into one chokepoint; advection-warp jams density there
  function funnelEnv(x) {
    const a = Math.min(1, Math.abs(x) / (VW * 0.3));
    return 0.06 + 0.94 * smooth(a);
  }
  function fill2(time, out) {
    for (let i = 0; i < N; i++) {
      const j = 3 * i;
      if (role[i] === 2) {
        // manual touches pile up just before the choke
        const d = sD[i] * sD[i];
        const x = -SR * 0.02 - d * SR * 0.3
          + Math.sin(time * 0.5 + sE[i] * TAU) * SR * 0.007;
        const env = funnelEnv(x);
        out[j] = x;
        out[j + 1] = (sB[i] - 0.5) * VH * 0.26 * Math.max(env, 0.12)
          + Math.cos(time * 0.4 + sA[i] * TAU) * SR * 0.004;
        out[j + 2] = (sC[i] - 0.5) * 4;
      } else {
        // g(s) plateaus near s=0.5 → particles spend longer near x=0 → visible jam
        const s = wrap(sA[i] + time * 0.02 * (0.85 + sD[i] * 0.3));
        const g = s + 0.88 * Math.sin(TAU * s) / TAU;
        const x = (g - 0.5) * VW * 1.06;
        const env = funnelEnv(x);
        const ly = (lane[i] - 1.5) * VH * 0.17;
        out[j] = x;
        out[j + 1] = ly * env + (sB[i] - 0.5) * VH * 0.02 * Math.max(env, 0.3);
        out[j + 2] = (sC[i] - 0.5) * 6 * Math.max(env, 0.2);
      }
    }
  }

  // 4. ROUTE — wide fast arc around the choke + thin straight lane through it
  function fill3(time, out) {
    for (let i = 0; i < N; i++) {
      const j = 3 * i;
      if (thru[i]) {
        out[j] = (wrap(sA[i] + time * 0.05) - 0.5) * VW * 1.06;
        out[j + 1] = (sB[i] - 0.5) * VH * 0.018;
        out[j + 2] = (sC[i] - 0.5) * 4;
      } else {
        const s = wrap(sA[i] + time * 0.058 * (0.9 + sD[i] * 0.25));
        out[j] = (s - 0.5) * VW * 1.06;
        out[j + 1] = Math.sin(s * Math.PI) * SR * 0.36 - SR * 0.105
          + (sB[i] - 0.5) * SR * 0.04;
        out[j + 2] = (sC[i] - 0.5) * 9;
      }
    }
  }

  // 5. TRUST — slow tilted orbital ring around a bright review node
  function fill4(time, out) {
    const tilt = 0.5;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    for (let i = 0; i < N; i++) {
      const j = 3 * i;
      if (core[i]) {
        const r = SR * 0.05 * Math.sqrt(sD[i]) * (1 + 0.08 * Math.sin(time * 1.2 + sE[i] * TAU));
        const a1 = sA[i] * TAU;
        const a2 = sB[i] * Math.PI;
        out[j] = r * Math.sin(a2) * Math.cos(a1);
        out[j + 1] = r * Math.sin(a2) * Math.sin(a1) * 0.8;
        out[j + 2] = r * Math.cos(a2) + 8;
      } else {
        const a = sA[i] * TAU + time * 0.1;
        const rr = SR * 0.36 * (1 + (sB[i] - 0.5) * 0.2);
        const ex = Math.cos(a) * rr * 1.28;
        const ey = Math.sin(a) * rr * 0.8;
        const ez = (sC[i] - 0.5) * SR * 0.07;
        out[j] = ex;
        out[j + 1] = ey * ct - ez * st;
        out[j + 2] = ey * st + ez * ct;
      }
    }
  }

  const fills = [fill0, fill1, fill2, fill3, fill4];

  /* Scroll progress over the story wrapper ------------------------------ */
  let pTarget = 0;
  let p = 0;
  const story = document.getElementById('story');
  if (window.gsap && window.ScrollTrigger && story) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.create({
      trigger: story,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { pTarget = self.progress; }
    });
  } else if (story) {
    const calc = () => {
      const r = story.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      pTarget = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    };
    window.addEventListener('scroll', calc, { passive: true });
    calc();
  }

  /* Pointer parallax ----------------------------------------------------- */
  let mx = 0; let my = 0; let cmx = 0; let cmy = 0;
  window.addEventListener('pointermove', (e) => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  /* Render loop ----------------------------------------------------------- */
  const clock = new THREE.Clock();
  let lastSteadyK = -1;
  function weight(k, i0, t) {
    if (k === i0) return 1 - t;
    if (k === i0 + 1) return t;
    return 0;
  }

  renderer.setAnimationLoop(() => {
    const time = clock.getElapsedTime();
    p += (pTarget - p) * 0.075;

    const f = Math.min(3.9999, Math.max(0, p * 4));
    const i0 = Math.floor(f);
    let t = f - i0;
    // dwell: hold each formation, morph through the middle of the boundary
    t = t <= 0.18 ? 0 : (t >= 0.82 ? 1 : smooth((t - 0.18) / 0.64));

    const out = posAttr.array;
    if (t <= 0.0001 || t >= 0.9999) {
      const k = t >= 0.9999 ? i0 + 1 : i0;
      fills[k](time, out);
      if (k !== lastSteadyK) {
        colAttr.array.set(colSets[k]);
        colAttr.needsUpdate = true;
        lastSteadyK = k;
      }
    } else {
      fills[i0](time, scratchA);
      fills[i0 + 1](time, scratchB);
      const ca = colSets[i0];
      const cb = colSets[i0 + 1];
      const col = colAttr.array;
      for (let j = 0; j < N * 3; j++) {
        out[j] = scratchA[j] + (scratchB[j] - scratchA[j]) * t;
        col[j] = ca[j] + (cb[j] - ca[j]) * t;
      }
      colAttr.needsUpdate = true;
      lastSteadyK = -1;
    }
    posAttr.needsUpdate = true;

    const w2 = weight(2, i0, t);
    const w4 = weight(4, i0, t);
    ring.material.opacity = w2 * 0.85;
    ring.visible = w2 > 0.01;
    coreSprite.material.opacity = w4 * 0.9;
    coreSprite.visible = w4 > 0.01;

    material.uniforms.uTime.value = time;

    cmx += (mx - cmx) * 0.05;
    cmy += (my - cmy) * 0.05;
    camera.position.x = cmx * SR * 0.05;
    camera.position.y = -cmy * SR * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    if (!window.__flowSceneReady) {
      window.__flowSceneReady = true;
      // if the watchdog flipped us to fallback while the CDN was slow, undo it
      if (window.__autoFallback) {
        html.classList.remove('no-webgl');
        window.__autoFallback = false;
      }
    }
  });
}

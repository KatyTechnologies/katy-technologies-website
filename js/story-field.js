/* Katy Technologies — cinematic story background (Three.js)
   A dark terrain valley with a vibrant glowing workflow-path flowing through it.
   The camera travels along the path as the user scrolls the .story block.
   Bloom post-processing gives the hubtown-style luminous "video" feel.
   Falls back to a static gradient (CSS) when WebGL/reduced-motion rules it out. */

const canvas = document.getElementById('story-canvas');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && !reduced) {
  init().catch(() => document.documentElement.classList.add('no-webgl'));
} else {
  document.documentElement.classList.add('no-webgl');
}

async function init() {
  const THREE = await import('three');
  const { EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js');
  const { RenderPass } = await import('three/addons/postprocessing/RenderPass.js');
  const { UnrealBloomPass } = await import('three/addons/postprocessing/UnrealBloomPass.js');
  const { OutputPass } = await import('three/addons/postprocessing/OutputPass.js');

  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const CAMERA_SCROLL_SCALE = 0.46;
  const PARTICLE_FLOW_SPEED = 0.006;
  const story = document.querySelector('.story');
  const pathScrollRange = document.getElementById('main') || story;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.75));
  const fogColor = new THREE.Color(0x020812);
  renderer.setClearColor(fogColor, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(fogColor, isMobile ? 0.022 : 0.02);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 240);

  /* ---------- the glowing path ---------- */
  const cameraPathPoints = [
    new THREE.Vector3(0, 1.2, 34),
    new THREE.Vector3(5, 1.0, 10),
    new THREE.Vector3(-6, 0.9, -14),
    new THREE.Vector3(4.5, 0.8, -38),
    new THREE.Vector3(-5, 0.9, -62),
    new THREE.Vector3(3.5, 0.7, -86),
    new THREE.Vector3(-2.5, 0.8, -110),
    new THREE.Vector3(0, 0.4, -138)
  ];
  const cameraCurve = new THREE.CatmullRomCurve3(cameraPathPoints);
  const pathCurve = new THREE.CatmullRomCurve3(cameraPathPoints.concat([
    new THREE.Vector3(4, 0.25, -180),
    new THREE.Vector3(-2, 0.15, -230),
    new THREE.Vector3(3, 0.05, -285)
  ]));

  // bright core — fog on, so the path fades into the dark instead of
  // streaking white to the horizon
  const core = new THREE.Mesh(
    new THREE.TubeGeometry(pathCurve, 460, 0.11, 12, false),
    new THREE.MeshBasicMaterial({
      color: 0x6fb7ff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: true
    })
  );
  scene.add(core);

  // soft halo
  const halo = new THREE.Mesh(
    new THREE.TubeGeometry(pathCurve, 460, 0.42, 12, false),
    new THREE.MeshBasicMaterial({
      color: 0x2e7cff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: true
    })
  );
  scene.add(halo);

  /* ---------- round particle sprite ---------- */
  function makeSprite() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const sprite = makeSprite();

  /* ---------- particles flowing along the path ---------- */
  const FLOW = isMobile ? 500 : 1000;
  const flowPos = new Float32Array(FLOW * 3);
  const flowT = new Float32Array(FLOW);
  const flowOff = [];
  for (let i = 0; i < FLOW; i++) {
    flowT[i] = Math.random();
    flowOff.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.9,
      Math.random() * 0.8,
      (Math.random() - 0.5) * 0.9
    ));
  }
  const flowGeo = new THREE.BufferGeometry();
  flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
  const flow = new THREE.Points(flowGeo, new THREE.PointsMaterial({
    color: 0xa8d8ff,
    size: 0.055,
    map: sprite,
    alphaTest: 0.01,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  }));
  scene.add(flow);

  /* ---------- ambient dust ---------- */
  const DUST = isMobile ? 600 : 1400;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 90;
    dustPos[i * 3 + 1] = Math.random() * 26;
    dustPos[i * 3 + 2] = 40 - Math.random() * 190;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0x536b80,
    size: 0.06,
    map: sprite,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  scene.add(dust);

  /* ---------- valley terrain ---------- */
  function ridgeNoise(x, z) {
    return (
      Math.sin(x * 0.11 + 1.7) * Math.cos(z * 0.07 + 0.4) * 0.55 +
      Math.sin(x * 0.045 - z * 0.05 + 3.1) * 0.85 +
      Math.sin(x * 0.23 + z * 0.17) * 0.22 +
      Math.sin(z * 0.025 + 1.1) * 0.6
    );
  }
  function smoothstep(a, b, v) {
    const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  const terrGeo = new THREE.PlaneGeometry(360, 390, 190, 150);
  terrGeo.rotateX(-Math.PI / 2);
  terrGeo.translate(0, 0, -105);
  const tp = terrGeo.attributes.position;
  const colors = new Float32Array(tp.count * 3);
  const cLow = new THREE.Color(0x040b18);
  const cHigh = new THREE.Color(0x1c3a5e);
  const tmp = new THREE.Color();
  for (let i = 0; i < tp.count; i++) {
    const x = tp.getX(i);
    const z = tp.getZ(i);
    const edge = smoothstep(5, 26, Math.abs(x));
    const farSoft = 1 - smoothstep(-120, -265, z);
    const sideSoft = 1 - smoothstep(138, 180, Math.abs(x));
    const terrainSoft = Math.min(farSoft, sideSoft);
    const n = (ridgeNoise(x, z) + 1.6) / 3.2; // 0..1ish
    const h = -2.2 + edge * terrainSoft * (n * 13 + 1.5);
    tp.setY(i, h);
    const k = Math.min(1, Math.max(0, (h + 2.2) / 13));
    tmp.copy(cLow).lerp(cHigh, k * k);
    tmp.lerp(fogColor, (1 - terrainSoft) * 0.9);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  terrGeo.computeVertexNormals();
  terrGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const terrain = new THREE.Mesh(terrGeo, new THREE.MeshBasicMaterial({ vertexColors: true, fog: true }));
  scene.add(terrain);

  /* ---------- post-processing: bloom ---------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), isMobile ? 0.55 : 0.68, 0.7, 0.24);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* ---------- sizing ---------- */
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---------- scroll progress over the full landing page ---------- */
  let target = 0;
  let progress = 0;
  if (pathScrollRange && window.gsap && window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: pathScrollRange,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: function (self) { target = self.progress; }
    });
  }

  /* ---------- pointer parallax ---------- */
  let px = 0, py = 0;
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      px = (e.clientX / window.innerWidth - 0.5) * 1.6;
      py = (e.clientY / window.innerHeight - 0.5) * 0.9;
    }, { passive: true });
  }

  /* ---------- visibility gating ---------- */
  const pathVisibilityRange = pathScrollRange || story;
  let inView = true;
  if (pathVisibilityRange) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      canvas.style.visibility = inView ? 'visible' : 'hidden';
    }).observe(pathVisibilityRange);
  }

  /* ---------- animate ---------- */
  const camPos = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  const clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    if (!inView || document.hidden) return;

    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // ease toward scroll target
    progress += (target - progress) * Math.min(1, dt * 5);

    // camera rides beside/above the path so the glow sweeps ahead, not
    // underfoot; on narrow (portrait) viewports keep it nearly centered or
    // the path leaves the frame entirely
    const side = camera.aspect < 1 ? 1.0 : 3.4;
    const ct = THREE.MathUtils.clamp(progress * CAMERA_SCROLL_SCALE, 0, CAMERA_SCROLL_SCALE);
    cameraCurve.getPointAt(ct, camPos);
    camPos.x += side + px * 1.4;
    camPos.y += 3.0 + Math.sin(t * 0.5) * 0.08;
    camera.position.copy(camPos);

    cameraCurve.getPointAt(Math.min(ct + 0.07, 1), lookAt);
    lookAt.y += 0.6 - py * 0.8;
    camera.lookAt(lookAt);

    // flow particles ride the path
    const pos = flowGeo.attributes.position;
    for (let i = 0; i < FLOW; i++) {
      flowT[i] += dt * PARTICLE_FLOW_SPEED * (0.6 + (i % 5) * 0.2);
      if (flowT[i] > 1) flowT[i] -= 1;
      pathCurve.getPointAt(flowT[i], camPos); // reuse vector
      const o = flowOff[i];
      pos.array[i * 3] = camPos.x + o.x;
      pos.array[i * 3 + 1] = camPos.y + o.y * (0.6 + 0.4 * Math.sin(t + i));
      pos.array[i * 3 + 2] = camPos.z + o.z;
    }
    pos.needsUpdate = true;

    // restore camera position (camPos was reused for particle math)
    cameraCurve.getPointAt(ct, camPos);
    camPos.x += side + px * 1.4;
    camPos.y += 3.0 + Math.sin(t * 0.5) * 0.08;
    camera.position.copy(camPos);

    composer.render();
  }

  tick();
  canvas.classList.add('is-on');
}

// Import WebGL only when the courtyard approaches the viewport.
const section = document.getElementById('courtyard');
if (section) {
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect(); start().catch(() => {
      document.getElementById('courtyard-fallback').hidden = false;
      document.getElementById('courtyard-fallback-text').textContent = 'The courtyard is resting as a still image. Your browser could not open the 3D view.';
      document.getElementById('courtyard-tools').hidden = true;
      document.getElementById('courtyard-canvas').hidden = true;
      section.dataset.state = 'fallback';
    });
  }, { rootMargin: '300px' });
  observer.observe(section);
}

async function start() {
  const [THREE, { makeCourtyard, makeFlower }] = await Promise.all([import('./vendor/three/three.module.js'), import('./courtyard-model.mjs')]);
  const canvas = document.getElementById('courtyard-canvas');
  const stage = document.getElementById('courtyard-stage');
  const status = document.getElementById('courtyard-status');
  const motionButton = document.getElementById('courtyard-motion');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-10, 10, 7, -7, .1, 100);
  const world = makeCourtyard(); scene.add(world.root);
  const fill = new THREE.HemisphereLight('#dbe6e1', '#645144', 2.8); scene.add(fill);
  const sun = new THREE.DirectionalLight('#ffcf94', 3.8); sun.position.set(-6, 12, 6); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 11, bottom: -10, near: .5, far: 40 });
  sun.shadow.bias = -.001; sun.shadow.normalBias = .03; scene.add(sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .16 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.27; ground.receiveShadow = true; scene.add(ground);
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, light: { value: 1 }, ripple: { value: new THREE.Vector3(0, 0, -10) } },
    vertexShader: 'varying vec2 p; void main(){ p=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `varying vec2 p; uniform float time; uniform float light; uniform vec3 ripple;
      void main(){
        float wave=sin(p.x*45.0+p.y*29.0+time*.65)*sin(p.y*53.0-p.x*17.0-time*.42);
        float shimmer=pow(max(0.0,sin(p.y*145.0+p.x*21.0+wave*.7-time*.3)),20.0);
        vec3 color=mix(vec3(.045,.16,.15),vec3(.15,.34,.28),p.y*.45+wave*.08+.35);
        color+=vec3(.19,.18,.12)*shimmer*.16;
        float age=time-ripple.z; float distance=length((p-ripple.xy)*vec2(5.3,4.35));
        float ring=exp(-pow((distance-age*.7)*18.0,2.0))*max(0.0,1.0-age/3.0)*step(0.0,age);
        color+=ring*vec3(.19,.22,.15); color*=light;
        gl_FragColor=vec4(color,1.0);
        #include <colorspace_fragment>
      }`
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(5.3, 4.35), waterMaterial);
  water.rotation.x = -Math.PI / 2; water.position.set(0, .63, .9); scene.add(water);
  const flowerTemplate = makeFlower(), flowers = [];
  let flowerIndex = 0, time = 0, yaw = .55, targetYaw = .55, velocity = 0;
  let paused = preference.matches, visible = false, raf = 0, last = 0, lightValue = 1, lightTarget = 1, viewMoving = false;
  let autoTurn = true, pointer = null, needsFrame = true;
  const lightSets = [
    { sky: '#dce7e1', sun: '#fff1d0', intensity: 3.3, fill: 3.3, water: 1.14, flame: .12 },
    { sky: '#eddcba', sun: '#ffd099', intensity: 3.8, fill: 2.8, water: 1, flame: .3 },
    { sky: '#869cb4', sun: '#a5c4ee', intensity: 1.3, fill: 1.35, water: .43, flame: 1 }
  ];
  const colorA = new THREE.Color(), colorB = new THREE.Color();
  function setLight() {
    const lower = Math.floor(lightValue), upper = Math.min(2, lower + 1), t = lightValue - lower;
    const a = lightSets[lower], b = lightSets[upper];
    sun.color.copy(colorA.set(a.sun).lerp(colorB.set(b.sun), t));
    fill.color.copy(colorA.set(a.sky).lerp(colorB.set(b.sky), t));
    sun.intensity = THREE.MathUtils.lerp(a.intensity, b.intensity, t); fill.intensity = THREE.MathUtils.lerp(a.fill, b.fill, t);
    world.flameMaterial.opacity = THREE.MathUtils.lerp(a.flame, b.flame, t);
    waterMaterial.uniforms.light.value = THREE.MathUtils.lerp(a.water, b.water, t);
  }
  function addFlower(x, z, announce = true) {
    if (flowers.length === 8) scene.remove(flowers.shift().mesh);
    const mesh = flowerTemplate.clone(); mesh.position.set(x, .68, z); scene.add(mesh);
    flowers.push({ mesh, x, z, phase: flowerIndex++ * 1.7 });
    waterMaterial.uniforms.ripple.value.set(x / 5.3 + .5, .5 - (z - .9) / 4.35, time);
    canvas.dataset.flowers = String(flowers.length);
    if (announce) status.textContent = 'A flower is floating on the water.';
    needsFrame = true; schedule();
  }
  function cameraPosition() { camera.position.set(Math.sin(yaw) * 20, 14, Math.cos(yaw) * 20); camera.lookAt(0, 2.35, 0); }
  function render() {
    cameraPosition(); setLight(); waterMaterial.uniforms.time.value = time;
    for (const flower of flowers) {
      flower.mesh.position.set(flower.x + Math.sin(time * .16 + flower.phase) * .12, .69 + Math.sin(time * 1.1 + flower.phase) * .018, flower.z + Math.cos(time * .13 + flower.phase) * .09);
      flower.mesh.rotation.y = Math.sin(time * .18 + flower.phase) * .2;
    }
    renderer.render(scene, camera); canvas.dataset.view = yaw.toFixed(3); canvas.dataset.time = time.toFixed(2); canvas.dataset.lightLevel = lightValue.toFixed(3);
    canvas.dataset.drawCalls = String(renderer.info.render.calls); needsFrame = false;
  }
  function frame(now) {
    raf = 0; if (!visible || document.hidden) { last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, .035) : 1 / 60; last = now;
    if (!paused) { time += dt; if (autoTurn && !pointer) targetYaw += Math.cos(time * .12) * dt * .017; }
    if (preference.matches) { yaw = targetYaw; velocity = 0; lightValue = lightTarget; }
    else {
      // Critically damped spring: a held drag can retarget without a restart.
      velocity += ((targetYaw - yaw) * 100 - velocity * 20) * dt; yaw += velocity * dt;
      lightValue += (lightTarget - lightValue) * (1 - Math.exp(-dt * 7));
    }
    viewMoving = Math.abs(targetYaw - yaw) > .0001 || Math.abs(velocity) > .0001 || Math.abs(lightTarget - lightValue) > .0001;
    render();
    if (!paused || viewMoving || pointer) raf = requestAnimationFrame(frame); else last = 0;
  }
  function schedule() {
    const rect = stage.getBoundingClientRect(); visible = rect.bottom > 0 && rect.top < innerHeight;
    if (!raf && visible && !document.hidden && (!paused || needsFrame || viewMoving)) raf = requestAnimationFrame(frame);
  }
  function syncPause() { motionButton.textContent = paused ? 'Play motion' : 'Pause motion'; motionButton.setAttribute('aria-pressed', String(paused)); }
  function resize() {
    const { width, height } = stage.getBoundingClientRect(); if (!width || !height) return;
    const aspect = width / height, span = Math.max(13.3, 16.5 / aspect);
    camera.left = -span * aspect / 2; camera.right = span * aspect / 2; camera.top = span / 2; camera.bottom = -span / 2; camera.updateProjectionMatrix();
    renderer.setSize(width, height, false); needsFrame = true; render();
  }
  function visibility() {
    const rect = stage.getBoundingClientRect(); visible = rect.bottom > 0 && rect.top < innerHeight;
    if (!visible || document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; }
    else { needsFrame = true; schedule(); }
  }
  window.addEventListener('scroll', visibility, { passive: true });
  window.addEventListener('resize', visibility, { passive: true });
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('studiochange', () => { resize(); visibility(); });
  function changePause(value) {
    paused = value; cancelAnimationFrame(raf); raf = 0; last = 0;
    syncPause(); needsFrame = true; schedule();
  }
  preference.addEventListener('change', () => changePause(preference.matches));
  motionButton.addEventListener('click', () => changePause(!paused));
  function turn(amount, instant = false) {
    targetYaw += amount; autoTurn = false;
    if (instant || preference.matches) { yaw = targetYaw; velocity = 0; }
    viewMoving = true; needsFrame = true; schedule();
  }
  document.getElementById('courtyard-left').addEventListener('click', event => turn(-.35, event.detail === 0));
  document.getElementById('courtyard-right').addEventListener('click', event => turn(.35, event.detail === 0));
  document.getElementById('courtyard-reset').addEventListener('click', event => {
    targetYaw = .55; autoTurn = true; if (event.detail === 0 || preference.matches) yaw = targetYaw;
    viewMoving = true; needsFrame = true; schedule(); status.textContent = 'View reset.';
  });
  canvas.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); turn(event.key === 'ArrowLeft' ? -.2 : .2, true); }
  });
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, startX: event.clientX, startY: event.clientY, moved: false };
    canvas.setPointerCapture(event.pointerId); canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 6) pointer.moved = true;
    turn(-(event.clientX - pointer.x) * .006); pointer.x = event.clientX;
  });
  const ray = new THREE.Raycaster();
  canvas.addEventListener('pointerup', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    if (!pointer.moved) {
      const rect = canvas.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
      const hit = ray.intersectObject(water)[0];
      if (hit) addFlower(THREE.MathUtils.clamp(hit.point.x, -2.2, 2.2), THREE.MathUtils.clamp(hit.point.z, -.8, 2.6));
    }
    pointer = null; canvas.classList.remove('is-dragging');
  });
  canvas.addEventListener('pointercancel', () => { pointer = null; canvas.classList.remove('is-dragging'); });
  document.getElementById('courtyard-flower').addEventListener('click', () => {
    const a = flowerIndex * 2.39996; addFlower(Math.sin(a) * 1.7, .9 + Math.cos(a) * 1.35);
  });
  document.querySelectorAll('[data-courtyard-light]').forEach(button => button.addEventListener('click', event => {
    lightTarget = Number(button.dataset.courtyardLight);
    if (event.detail === 0 || preference.matches) lightValue = lightTarget;
    document.querySelectorAll('[data-courtyard-light]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    section.dataset.light = ['morning', 'golden', 'night'][lightTarget];
    status.textContent = `${button.textContent} in the courtyard.`; viewMoving = true; needsFrame = true; schedule();
  }));
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); cancelAnimationFrame(raf); raf = 0;
    document.getElementById('courtyard-fallback').hidden = false;
    document.getElementById('courtyard-fallback-text').textContent = 'The 3D view paused. Reload the page to open it again.';
    canvas.hidden = true; document.getElementById('courtyard-tools').hidden = true;
  });
  addFlower(-1.2, 1.4, false); addFlower(.85, .2, false); addFlower(1.55, 2, false);
  canvas.hidden = false; document.getElementById('courtyard-fallback').hidden = true; document.getElementById('courtyard-tools').hidden = false;
  section.dataset.state = 'ready'; syncPause(); new ResizeObserver(resize).observe(stage); resize(); visibility();
}

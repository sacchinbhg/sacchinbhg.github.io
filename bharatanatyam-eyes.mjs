import { eyesAt, STORY_LENGTH, CHAPTERS, storyAt, storyTime } from './eye-story.mjs?v=3';
import { createStoryStage } from './story-stage.mjs?v=3';

const canvas = document.getElementById('ascii-portrait');
if (canvas) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const drawing = document.createElement('canvas');
  const pen = drawing.getContext('2d', { willReadFrequently: true });
  if (!ctx || !pen) throw new Error('The eye study needs a two-dimensional canvas.');
  const pause = document.getElementById('gaze-pause');
  const replay = document.getElementById('gaze-replay');
  const next = document.getElementById('gaze-next');
  const status = document.getElementById('gaze-status');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const ramp = ' .,:;=+*x%#@';
  let width = 1100, height = 440, cols = 160, rows = 50, cellW, cellH, dpr;
  const params = new URLSearchParams(location.search);
  let atlas, tileW, tileH, time = storyTime(Number(params.get('t'))), last = null, lastPaint = 0, raf = 0;
  let paused = preference.matches || params.get('paused') === '1' || time === STORY_LENGTH, visible = false;
  let previousDrawing = '';
  const stage = createStoryStage();

  function path(d, fill, stroke, lineWidth = 2) {
    const shape = new Path2D(d);
    if (fill) { pen.fillStyle = fill; pen.fill(shape); }
    if (stroke) { pen.strokeStyle = stroke; pen.lineWidth = lineWidth; pen.stroke(shape); }
  }
  function ellipse(x, y, rx, ry, fill, stroke, lineWidth = 2) {
    pen.beginPath(); pen.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    if (fill) { pen.fillStyle = fill; pen.fill(); }
    if (stroke) { pen.strokeStyle = stroke; pen.lineWidth = lineWidth; pen.stroke(); }
  }
  function drawEye(cx, side, e) {
    pen.save(); pen.translate(cx, 254); pen.scale(side, 1);
    const open = side < 0 ? e.openL : e.openR;
    const topA = 8 - (88 - e.sorrow * 10) * open;
    const topB = 1 - (85 + e.sorrow * 5) * open;
    // Raised lower lids make warmth and smiling read differently from drowsiness.
    const lowA = 1 + (60 - e.squint * 32) * open;
    const lowB = 7 + (58 - e.squint * 28) * open;
    const aperture = new Path2D(`M-132 5 C-62 ${topA} 64 ${topB} 142 -15 C77 ${lowA} -56 ${lowB} -132 5Z`);
    // The pale opening and dark pupil are enclosed by long, tapered kohl contours.
    pen.save(); pen.clip(aperture);
    const white = pen.createLinearGradient(0, -75, 0, 55);
    white.addColorStop(0, '#777365'); white.addColorStop(.55, '#c7c0ab'); white.addColorStop(1, '#8d8878');
    pen.fillStyle = white; pen.fillRect(-150, -120, 320, 230);
    const ix = e.x * 72 * side, iy = e.y * 35 - 3;
    ellipse(ix, iy, 47, 49, '#292a25', '#7a7561', 3);
    // Fine iris strands are fixed to the iris, rather than random noise each frame.
    for (let i = 0; i < 24; i++) {
      const a = i / 24 * Math.PI * 2;
      path(`M${ix + Math.cos(a) * 29} ${iy + Math.sin(a) * 30} L${ix + Math.cos(a) * 43} ${iy + Math.sin(a) * 45}`, null, i % 3 ? '#696653' : '#8d8467', 1.4);
    }
    ellipse(ix, iy, 25 * e.pupil, 30 * e.pupil, '#080a08');
    ellipse(ix - 13 * side, iy - 17, 7, 8, '#f3ecd6');
    ellipse(ix + 12 * side, iy + 16, 3, 3, '#b4ac93');
    pen.restore();
    // A warm waterline and a tiny inner-corner accent add character to the kohl.
    path(`M-132 5 C-56 ${lowB - 3} 77 ${lowA - 3} 140 -13`, null, '#965b48', 3);
    ellipse(-127, 6, 5, 3.5, '#bd6350');
    path(`M-132 5 C-62 ${topA} 64 ${topB} 142 -15 C165 -22 185 -37 206 -56 C188 -24 171 -9 143 -4 C65 ${topB + 10} -60 ${topA + 10} -132 5Z`, '#eee4c9');
    path(`M-132 5 C-56 ${lowB} 77 ${lowA} 142 -15`, null, '#c9bea1', 5);
    path(`M-124 14 C-48 ${lowB + 15} 75 ${lowA + 14} 135 0`, null, '#655e4e', 2);
    path(`M-93 ${topA * .58 - 20} Q18 ${topB * .85 - 29} 104 -39`, null, '#625c4d', 2);
    // Short lashes stay attached to the lid and close with it.
    path(`M119 -17 Q137 -29 140 -43 M135 -14 Q154 -20 163 -35 M147 -12 Q166 -14 181 -27`, null, '#e7dbc0', 4);
    const brow = (side < 0 ? e.browL : e.browR) + (side > 0 ? .06 : 0);
    const inner = -103 + e.furrow * 56 - brow * 38 - e.sorrow * 40;
    const arch = -153 - brow * 36 + e.furrow * 20;
    const outer = -105 - brow * 10 + e.sorrow * 26;
    const pinch = e.furrow * 17;
    path(`M${-135 - pinch} ${inner} C-67 ${arch - 7} 42 ${arch - 15} 151 ${outer} Q174 ${outer + 13} 188 ${outer + 26} C99 ${outer - 20} 13 ${arch + 12} -66 ${inner - 8} Q-107 ${inner + 7} ${-135 - pinch} ${inner + 8}Z`, '#c9b58d');
    path(`M${-126 - pinch} ${inner - 3} C-53 ${arch - 11} 43 ${arch - 6} 146 ${outer}`, null, '#edddbc', 2);
    pen.restore();
  }
  function draw(e) {
    pen.setTransform(drawing.width / 1100, 0, 0, drawing.height / 440, 0, 0);
    pen.fillStyle = '#000'; pen.fillRect(0, 0, 1100, 440);
    pen.lineCap = 'round'; pen.lineJoin = 'round';
    pen.translate(550, 220); pen.scale(1.12, 1.12); pen.translate(-550, -220);
    // A slight inclination supports an expression; there is no continuous head bob.
    pen.translate(550 + e.shift, 240); pen.rotate(e.tilt); pen.translate(-550, -240);
    drawEye(323, -1, e); drawEye(777, 1, e);
    // A small forehead pendant and an off-centre beauty mark give her a signature.
    path('M550 29 L550 61', null, '#b39b65', 2);
    for (const y of [32, 45, 58]) ellipse(550, y, 3.5, 4, '#cdb77b');
    path('M550 64 Q572 80 550 103 Q528 80 550 64Z', '#75623e', '#dfc485', 3);
    ellipse(550, 83, 6, 8, '#b54c3c');
    ellipse(550, 142, 11, 14, '#bf4939');
    ellipse(906, 328, 4.2, 4.2, '#b6aa8c');
    if (e.furrow > .1) {
      pen.save(); pen.globalAlpha = Math.min(1, e.furrow * .8);
      path('M534 167 Q528 182 534 195 M566 167 Q572 182 566 195', null, '#a3987c', 2.5);
      pen.restore();
    }
  }
  function buildAtlas() {
    tileW = Math.ceil(cellW * dpr); tileH = Math.ceil(cellH * dpr);
    atlas = document.createElement('canvas'); atlas.width = tileW * ramp.length; atlas.height = tileH * 36;
    const ink = atlas.getContext('2d');
    ink.font = `700 ${cellH * dpr * 1.05}px "Courier New", monospace`;
    ink.textAlign = 'center'; ink.textBaseline = 'middle';
    for (let tone = 0; tone < 36; tone++) {
      const bright = 60 + (tone % 12) * 17;
      ink.fillStyle = tone < 12 ? `rgb(${bright},${bright * .94},${bright * .79})` : tone < 24 ? `rgb(${Math.max(bright, 185)},${bright * .35},${bright * .26})` : `rgb(${bright},${bright * .8},${bright * .48})`;
      for (let c = 1; c < ramp.length; c++) ink.fillText(ramp[c], (c + .5) * tileW, (tone + .54) * tileH);
    }
  }
  function render(immediate = false) {
    stage?.update(time, immediate);
    if (next) {
      const label = time >= 120 ? 'First scene' : 'Next scene';
      if (next.textContent !== label) next.textContent = label;
    }
    const e = eyesAt(time);
    canvas.dataset.expression = e.beat; canvas.dataset.frame = time.toFixed(2);
    const signature = Object.values(e).map(value => typeof value === 'number' ? value.toFixed(4) : value).join('|');
    if (signature === previousDrawing) return;
    previousDrawing = signature;
    draw(e);
    const pixels = pen.getImageData(0, 0, drawing.width, drawing.height).data;
    ctx.fillStyle = '#10110f'; ctx.fillRect(0, 0, width, height);
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
      const i = ((row * 2 + 1) * drawing.width + col * 2 + 1) * 4;
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      const light = (r * .2126 + g * .7152 + b * .0722) / 255;
      if (light < .055) continue;
      const value = Math.pow(light, .88), red = r > g * 1.48;
      const gold = !red && r > g * 1.12 && g > b * 1.3;
      const letter = Math.max(1, Math.min(11, Math.round(value * 11)));
      const tone = Math.min(11, Math.floor(value * 12)) + (red ? 12 : gold ? 24 : 0);
      ctx.drawImage(atlas, letter * tileW, tone * tileH, tileW, tileH, col * cellW, row * cellH, cellW, cellH);
    }
  }
  function resize() {
    const r = canvas.getBoundingClientRect(); if (!r.width) return;
    width = r.width; height = r.height; cols = width < 600 ? 116 : 170;
    rows = Math.round(cols * .32); cellW = width / cols; cellH = height / rows;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); drawing.width = cols * 2; drawing.height = rows * 2;
    previousDrawing = ''; buildAtlas(); render();
  }
  function syncControls() {
    if (pause) { pause.textContent = paused ? 'Play' : 'Pause'; pause.setAttribute('aria-pressed', String(paused)); }
    if (next) next.textContent = time >= 120 ? 'First scene' : 'Next scene';
    stage?.setRunning(!paused && visible && !document.hidden);
  }
  function frame(now) {
    raf = 0; if (paused || !visible || document.hidden) { last = null; return; }
    if (last !== null) time = Math.min(STORY_LENGTH, time + Math.max((now - last) / 1000, 0));
    last = now;
    if (time === STORY_LENGTH) {
      paused = true; render(true); syncControls(); last = null;
      status.textContent = replay ? 'The story is complete. Replay to watch it again.' : 'The story is complete.';
      return;
    }
    // Fast glances get up to 60fps; held expressions reuse the previous drawing.
    if (now - lastPaint >= 1000 / 60 - .75) { render(); lastPaint = now; }
    raf = requestAnimationFrame(frame);
  }
  function schedule() {
    if (!raf && !paused && visible && !document.hidden) { last = null; raf = requestAnimationFrame(frame); }
  }
  function visibility() {
    const r = canvas.getBoundingClientRect(); visible = r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight;
    if (!visible || document.hidden) { cancelAnimationFrame(raf); raf = 0; last = null; } else schedule();
    syncControls();
  }
  function seekTo(seconds) {
    cancelAnimationFrame(raf); raf = 0; last = null;
    time = storyTime(seconds);
    if (time === STORY_LENGTH) paused = true;
    render(true); syncControls(); schedule();
  }
  replay?.addEventListener('click', () => {
    paused = false; seekTo(0);
    status.textContent = 'Playing A late arrival from the beginning.';
  });
  next?.addEventListener('click', () => {
    const following = CHAPTERS.find(chapter => chapter.at > time + .1) || CHAPTERS[0];
    seekTo(following.at + (paused && following.at > 0 ? 3 : 0));
    status.textContent = `${following.title}. ${paused ? 'Paused.' : 'Playing.'}`;
  });
  pause?.addEventListener('click', () => {
    paused = !paused;
    if (!paused && time === STORY_LENGTH) seekTo(0);
    if (paused) { cancelAnimationFrame(raf); raf = 0; last = null; } else schedule();
    syncControls();
    status.textContent = paused ? 'Paused.' : 'Playing.';
  });
  preference.addEventListener('change', () => {
    if (preference.matches) paused = true;
    // Keep the current scene and let the visitor explicitly restart motion.
    seekTo(time);
  });
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('scroll', visibility, { passive: true });
  window.addEventListener('resize', visibility, { passive: true });
  window.addEventListener('studiochange', () => { resize(); visibility(); });
  canvas.hidden = false; document.getElementById('ascii-fallback').hidden = true;
  const controls = document.getElementById('gaze-controls');
  if (controls) controls.hidden = false;
  new ResizeObserver(() => { resize(); visibility(); }).observe(canvas);
  resize(); syncControls(); visibility();
}

import * as THREE from './vendor/three/three.module.js';

// An imagined Madurai courtyard, drawn as a small, painted architectural model.
// Static pieces are merged by material so the ornament does not cost a draw call each.
export function makeCourtyard() {
  const root = new THREE.Group();
  const batches = new Map(), materials = new Map();
  const palette = { stone: '#b99c78', edge: '#d8c6a1', rose: '#ad594b', cream: '#f1d8ab', teal: '#407d79', blue: '#527690', green: '#728652', gold: '#caa05b', shadow: '#3d4a43', leaf: '#48745b' };
  function add(geometry, color, x, y, z, scale = [1, 1, 1], rotation = [0, 0, 0]) {
    const object = new THREE.Object3D();
    object.position.set(x, y, z); object.scale.set(...scale); object.rotation.set(...rotation); object.updateMatrix();
    geometry.applyMatrix4(object.matrix);
    const plain = geometry.index ? geometry.toNonIndexed() : geometry;
    if (plain !== geometry) geometry.dispose();
    if (!batches.has(color)) batches.set(color, []);
    batches.get(color).push(plain);
  }
  const box = (x, y, z, w, h, d, color) => add(new THREE.BoxGeometry(w, h, d), color, x, y, z);
  const ball = (x, y, z, rx, ry, rz, color) => add(new THREE.SphereGeometry(1, 10, 7), color, x, y, z, [rx, ry, rz]);
  const cylinder = (x, y, z, top, bottom, height, color, sides = 12) => add(new THREE.CylinderGeometry(top, bottom, height, sides), color, x, y, z);
  function ring(w, d, y, h, thickness, color) {
    box(0, y, .9 - (d - thickness) / 2, w, h, thickness, color);
    box(0, y, .9 + (d - thickness) / 2, w, h, thickness, color);
    box(-(w - thickness) / 2, y, .9, thickness, h, d - thickness * 2, color);
    box((w - thickness) / 2, y, .9, thickness, h, d - thickness * 2, color);
  }
  box(0, .05, 0, 12.2, .6, 11.1, palette.rose);
  box(0, .39, 0, 12.4, .14, 11.3, palette.edge);
  box(0, .86, -3.7125, 12, .8, 3.075, palette.stone);
  box(0, .86, 4.6125, 12, .8, 1.275, palette.stone);
  box(-4.775, .86, .9, 2.45, .8, 6.15, palette.stone);
  box(4.775, .86, .9, 2.45, .8, 6.15, palette.stone);
  // Six descending steps reveal the water instead of painting a blue square on a slab.
  for (let i = 0; i < 6; i++) {
    ring(7.1 - i * .33, 6.15 - i * .33, 1.23 - i * .115, .17, .19, i % 2 ? '#baa582' : '#cfba96');
  }
  // The floor joints are actual shallow inlays with a deterministic irregular rhythm.
  for (let x = -5.5; x <= 5.5; x += .65) {
    box(x, 1.268, 4.57, .012, .012, 1.15, '#9b8266');
    box(x, 1.268, -3.97, .012, .012, 2.9, '#9b8266');
  }
  for (let z = -5; z <= 5; z += .65) {
    box(-4.8, 1.268, z, 2.35, .012, .012, '#9b8266');
    box(4.8, 1.268, z, 2.35, .012, .012, '#9b8266');
  }
  // Red-and-cream boundary walls, with an open front to see into the tank.
  box(0, 1.55, -5.05, 12, .62, .25, palette.cream);
  box(-5.88, 1.55, 0, .24, .62, 10.4, palette.cream);
  box(5.88, 1.55, 0, .24, .62, 10.4, palette.cream);
  for (let x = -5.5; x < 6; x += .65) box(x, 1.55, -4.905, .28, .59, .025, palette.rose);
  for (let z = -4.7; z < 5; z += .65) {
    box(-5.74, 1.55, z, .025, .59, .28, palette.rose);
    box(5.74, 1.55, z, .025, .59, .28, palette.rose);
  }
  // A long colonnade at the back: cap, shafts, plinths, and a terracotta roof.
  for (let x = -5.2; x <= 5.3; x += .72) {
    if (Math.abs(x) < 1.65) continue;
    box(x, 1.38, -4.15, .43, .24, .43, palette.edge);
    box(x, 2.05, -4.15, .19, 1.2, .2, '#8f9c88');
    box(x, 2.62, -4.15, .36, .15, .39, palette.cream);
  }
  for (const side of [-1, 1]) {
    box(side * 3.77, 2.8, -4.15, 4.5, .22, 1.22, palette.cream);
    box(side * 3.77, 2.98, -4.15, 4.7, .14, 1.45, palette.rose);
    for (let n = 0; n < 18; n++) box(side * 3.77 - 2.17 + n * .25, 3.065, -4.15, .07, .04, 1.4, '#ce8270');
  }
  // Gopuram: tiered profiles, coloured niches and a row of gold finials.
  const tz = -3.64;
  box(-1.05, 1.93, tz, .8, 1.35, 1.56, palette.edge);
  box(1.05, 1.93, tz, .8, 1.35, 1.56, palette.edge);
  box(0, 2.75, tz, 2.9, .34, 1.72, palette.cream);
  box(0, 2.95, tz, 3.13, .16, 1.9, palette.rose);
  const colors = [palette.teal, palette.blue, palette.rose, palette.green, palette.blue, palette.teal, palette.rose];
  for (let tier = 0; tier < 7; tier++) {
    const w = 3.05 - tier * .27, d = 1.83 - tier * .12, y = 3.3 + tier * .52;
    box(0, y, tz, w, .42, d, colors[tier]);
    box(0, y + .24, tz, w + .16, .12, d + .16, palette.cream);
    box(0, y + .32, tz, w + .26, .07, d + .23, colors[(tier + 2) % colors.length]);
    const count = Math.max(3, 9 - tier);
    for (let n = 0; n < count; n++) {
      const x = (n - (count - 1) / 2) * (w - .25) / count;
      for (const side of [-1, 1]) {
        const z = tz + side * (d / 2 + .045);
        box(x, y, z, .2, .28, .08, palette.shadow);
        ball(x, y + .02, z + side * .06, .065, .13, .06, n % 3 ? palette.cream : palette.gold);
        ball(x, y + .16, z + side * .04, .13, .08, .08, colors[(tier + 3) % colors.length]);
      }
    }
    for (const side of [-1, 1]) {
      ball(side * (w / 2 + .06), y + .11, tz, .16, .15, d * .48, colors[(tier + 1) % colors.length]);
    }
  }
  box(0, 7.05, tz, 1.45, .18, 1.05, palette.cream);
  add(new THREE.CylinderGeometry(.36, .36, 1.38, 14, 1, false, 0, Math.PI), palette.rose, 0, 7.17, tz, [1, 1, 1], [0, 0, Math.PI / 2]);
  for (let i = -2; i <= 2; i++) {
    cylinder(i * .27, 7.51, tz, .045, .075, .26, palette.gold);
    ball(i * .27, 7.64, tz, .075, .09, .075, palette.gold);
  }
  // Palm leaves are curved tapered strips, with a clear silhouette at phone sizes.
  function palm(x, z, height, lean) {
    const tip = new THREE.Vector3(x + lean, 1.35 + height, z + .18);
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 1.27, z), new THREE.Vector3(x + lean * .3, 1.3 + height * .6, z), tip]);
    add(new THREE.TubeGeometry(curve, 9, .09, 7, false), '#816b4e', 0, 0, 0);
    for (let k = 0; k < 9; k++) {
      const a = k * Math.PI * 2 / 9, vertices = [], indices = [];
      for (let j = 0; j <= 9; j++) {
        const t = j / 9, r = 1.45 * t, y = .48 * Math.sin(t * Math.PI) - .53 * t * t;
        const w = Math.sin(t * Math.PI) * .21;
        for (const s of [-1, 1]) vertices.push(tip.x + Math.cos(a) * r + Math.sin(a) * w * s, tip.y + y, tip.z + Math.sin(a) * r - Math.cos(a) * w * s);
        if (j < 9) { const p = j * 2; indices.push(p, p + 1, p + 2, p + 1, p + 3, p + 2); }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); g.setIndex(indices); g.computeVertexNormals();
      add(g, k % 2 ? '#648156' : '#3f6a50', 0, 0, 0);
    }
  }
  palm(-4.65, -.8, 3.2, .35); palm(4.6, -2.35, 3.7, -.3); palm(4.8, 3.6, 2.5, -.25);
  // Small clay lamps around the tank catch the evening light.
  const lampPositions = [];
  for (const x of [-3.8, 3.8]) for (const z of [-2.65, .3, 3.55]) {
    cylinder(x, 1.34, z, .16, .1, .12, palette.rose);
    lampPositions.push([x, 1.44, z]);
  }
  for (const [color, pieces] of batches) {
    let length = 0; for (const g of pieces) length += g.attributes.position.array.length;
    const positions = new Float32Array(length), normals = new Float32Array(length); let offset = 0;
    for (const g of pieces) { positions.set(g.attributes.position.array, offset); normals.set(g.attributes.normal.array, offset); offset += g.attributes.position.array.length; g.dispose(); }
    const merged = new THREE.BufferGeometry(); merged.setAttribute('position', new THREE.BufferAttribute(positions, 3)); merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    const material = new THREE.MeshStandardMaterial({ color, roughness: .88, metalness: color === palette.gold ? .3 : 0, side: THREE.DoubleSide });
    materials.set(color, material);
    const mesh = new THREE.Mesh(merged, material); mesh.castShadow = true; mesh.receiveShadow = true; root.add(mesh);
  }
  const flameMaterial = new THREE.MeshBasicMaterial({ color: '#ffc36d', transparent: true, opacity: .2 });
  const flames = new THREE.Group();
  for (const p of lampPositions) {
    const flame = new THREE.Mesh(new THREE.SphereGeometry(.075, 8, 6), flameMaterial);
    flame.scale.set(.65, 1.8, .65); flame.position.set(...p); flames.add(flame);
  }
  root.add(flames);
  return { root, flameMaterial };
}

export function makeFlower() {
  const flower = new THREE.Group();
  const petalMaterial = new THREE.MeshStandardMaterial({ color: '#de837e', roughness: .72, side: THREE.DoubleSide });
  const petalGeometry = new THREE.SphereGeometry(1, 8, 5);
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    const petal = new THREE.Mesh(petalGeometry, petalMaterial);
    petal.scale.set(.1, .09, .22); petal.position.set(Math.sin(a) * .13, .04, Math.cos(a) * .13); petal.rotation.y = a; flower.add(petal);
  }
  const center = new THREE.Mesh(new THREE.SphereGeometry(.095, 8, 5), new THREE.MeshStandardMaterial({ color: '#e8bd69', roughness: .7 }));
  center.scale.y = .55; center.position.y = .11; flower.add(center);
  const leaf = new THREE.Mesh(new THREE.CircleGeometry(.34, 18, .15, Math.PI * 1.9), new THREE.MeshStandardMaterial({ color: '#688b61', roughness: .85, side: THREE.DoubleSide }));
  leaf.rotation.x = -Math.PI / 2; leaf.position.set(.08, -.02, 0); flower.add(leaf);
  return flower;
}

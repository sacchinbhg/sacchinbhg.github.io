export const SIZE = 6;
export const TILE = 64;
export const PALETTES = {
  terracotta: { ground: '#713e32', thread: '#f5e8ce', dot: '#dcb38d' },
  indigo: { ground: '#293e51', thread: '#f5e8ce', dot: '#a6bac7' },
  leaf: { ground: '#384c3c', thread: '#f5e8ce', dot: '#b3c3a2' }
};

// Reflections reverse the two quarter-circle connections; a half-turn preserves them.
export function reflections(row, col) {
  return [
    [row, col, 0], [row, SIZE - 1 - col, 1],
    [SIZE - 1 - row, col, 1], [SIZE - 1 - row, SIZE - 1 - col, 0]
  ];
}

export function mirror(pattern) {
  const next = [...pattern];
  for (let row = 0; row < SIZE / 2; row++) {
    for (let col = 0; col < SIZE / 2; col++) {
      for (const [r, c, flip] of reflections(row, col)) {
        next[r * SIZE + c] = pattern[row * SIZE + col] ^ flip;
      }
    }
  }
  return next;
}

export function turn(pattern, index, symmetric) {
  const next = [...pattern];
  const cells = symmetric ? reflections(Math.floor(index / SIZE), index % SIZE) : [[Math.floor(index / SIZE), index % SIZE]];
  for (const [row, col] of cells) next[row * SIZE + col] ^= 1;
  return next;
}

export function generate(symmetric = true, random = Math.random) {
  const pattern = Array.from({ length: SIZE * SIZE }, () => random() < .5 ? 0 : 1);
  return symmetric ? mirror(pattern) : pattern;
}

export function tilePath(index, orientation, colour) {
  const x = (index % SIZE) * TILE;
  const y = Math.floor(index / SIZE) * TILE;
  return `<g transform="translate(${x} ${y})"><path transform="rotate(${orientation * 90} 32 32)" d="M0 32A32 32 0 0 0 32 0M32 64A32 32 0 0 1 64 32" fill="none" stroke="${colour}" stroke-width="3.5" stroke-linecap="round"/></g>`;
}

export function drawing(pattern, paletteName) {
  const colours = PALETTES[paletteName];
  let paths = pattern.map((value, index) => tilePath(index, value, colours.thread)).join('');
  // Pair up edge threads outside the grid. Every path is closed, including at the boundary.
  const edge = [];
  for (let pair = 0; pair < SIZE; pair += 2) {
    const a = pair * TILE + TILE / 2;
    const b = a + TILE;
    edge.push(`M${a} 0A32 32 0 0 1 ${b} 0`, `M${a} 384A32 32 0 0 0 ${b} 384`,
      `M0 ${a}A32 32 0 0 0 0 ${b}`, `M384 ${a}A32 32 0 0 1 384 ${b}`);
  }
  paths += `<path d="${edge.join('')}" fill="none" stroke="${colours.thread}" stroke-width="3.5" stroke-linecap="round"/>`;
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      paths += `<circle cx="${col * TILE + 32}" cy="${row * TILE + 32}" r="2.4" fill="${colours.dot}" stroke="none"/>`;
    }
  }
  return paths;
}

export function exportSVG(pattern, paletteName) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="944" height="944" viewBox="-44 -44 472 472"><title>A kolam-inspired pattern</title><desc>A pattern made in Sacchin Sundar's interactive kolam playground.</desc><rect x="-44" y="-44" width="472" height="472" fill="${PALETTES[paletteName].ground}"/>${drawing(pattern, paletteName)}</svg>`;
}

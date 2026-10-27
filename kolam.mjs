import { SIZE, PALETTES, generate, mirror, turn, drawing, exportSVG } from './kolam-pattern.mjs';

const section = document.getElementById('kolam');
if (section) {
  const grid = document.getElementById('kolam-grid');
  const board = document.getElementById('kolam-board');
  const picture = document.getElementById('kolam-drawing');
  const symmetry = document.getElementById('kolam-symmetry');
  const undo = document.getElementById('kolam-undo');
  const status = document.getElementById('kolam-status');
  const save = document.getElementById('kolam-save');
  const history = [];
  let pattern = mirror([0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, ...Array(18).fill(0)]);
  let palette = 'terracotta';
  let activeCell = 14;
  let downloadURL;

  // Native buttons provide touch, Enter and Space activation. Only one tile is a tab stop.
  for (let row = 0; row < SIZE; row++) {
    const line = document.createElement('div');
    line.className = 'kolam-row';
    line.setAttribute('role', 'row');
    for (let col = 0; col < SIZE; col++) {
      const cell = document.createElement('div');
      cell.setAttribute('role', 'gridcell');
      const button = document.createElement('button');
      const index = row * SIZE + col;
      button.type = 'button';
      button.className = 'kolam-tile';
      button.dataset.index = String(index);
      button.tabIndex = index === activeCell ? 0 : -1;
      button.setAttribute('aria-label', `Turn tile, row ${row + 1}, column ${col + 1}`);
      cell.append(button);
      line.append(cell);
    }
    grid.append(line);
  }
  const buttons = [...grid.querySelectorAll('button')];

  function remember() {
    history.push({ pattern: [...pattern], palette, symmetric: symmetry.checked });
    if (history.length > 40) history.shift();
  }

  function render(message) {
    picture.innerHTML = drawing(pattern, palette);
    board.dataset.palette = palette;
    buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(Boolean(pattern[index]))));
    document.querySelectorAll('[data-palette].colour-choice').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.palette === palette));
    });
    undo.disabled = history.length === 0;
    const previousURL = downloadURL;
    downloadURL = URL.createObjectURL(new Blob([exportSVG(pattern, palette)], { type: 'image/svg+xml' }));
    save.href = downloadURL;
    if (previousURL) URL.revokeObjectURL(previousURL);
    if (message) status.textContent = message;
  }

  function select(index) {
    buttons[activeCell].tabIndex = -1;
    activeCell = index;
    buttons[activeCell].tabIndex = 0;
  }

  grid.addEventListener('click', event => {
    const tile = event.target.closest('button[data-index]');
    if (!tile) return;
    const index = Number(tile.dataset.index);
    select(index);
    remember();
    pattern = turn(pattern, index, symmetry.checked);
    render(symmetry.checked ? 'Four mirrored tiles turned.' : 'Tile turned.');
    // Direct manipulation remains instant; a brief lightening confirms the turn.
    if (event.detail > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tile.animate([{ backgroundColor: 'rgba(245,232,206,.18)' }, { backgroundColor: 'rgba(245,232,206,0)' }], { duration: 160, easing: 'ease-out' });
    }
  });

  grid.addEventListener('keydown', event => {
    let next = activeCell;
    const row = Math.floor(activeCell / SIZE), col = activeCell % SIZE;
    if (event.key === 'ArrowLeft') next = row * SIZE + Math.max(0, col - 1);
    else if (event.key === 'ArrowRight') next = row * SIZE + Math.min(SIZE - 1, col + 1);
    else if (event.key === 'ArrowUp') next = Math.max(0, activeCell - SIZE);
    else if (event.key === 'ArrowDown') next = Math.min(SIZE * SIZE - 1, activeCell + SIZE);
    else if (event.key === 'Home') next = event.ctrlKey ? 0 : row * SIZE;
    else if (event.key === 'End') next = event.ctrlKey ? SIZE * SIZE - 1 : row * SIZE + SIZE - 1;
    else return;
    event.preventDefault();
    select(next);
    buttons[next].focus({ preventScroll: true });
  });

  document.getElementById('kolam-shuffle').addEventListener('click', () => {
    remember();
    let next = generate(symmetry.checked);
    // Ensure even a rare repeated random draw gives visible feedback.
    if (next.every((value, i) => value === pattern[i])) next = turn(next, 0, symmetry.checked);
    pattern = next;
    render('A new pattern, ready for your next turn.');
  });

  symmetry.addEventListener('change', () => {
    const requested = symmetry.checked;
    symmetry.checked = !requested;
    remember();
    symmetry.checked = requested;
    if (requested) pattern = mirror(pattern);
    render(requested ? 'Four-way symmetry on.' : 'Free turns. Each tile changes independently.');
  });

  document.querySelectorAll('.colour-choice').forEach(button => button.addEventListener('click', () => {
    const next = button.dataset.palette;
    if (!PALETTES[next] || next === palette) return;
    remember();
    palette = next;
    render(`Pattern colour: ${button.textContent.trim()}.`);
  }));

  undo.addEventListener('click', () => {
    const previous = history.pop();
    if (!previous) return;
    pattern = previous.pattern;
    palette = previous.palette;
    symmetry.checked = previous.symmetric;
    render('Last change undone.');
  });

  render();
  section.hidden = false;
}

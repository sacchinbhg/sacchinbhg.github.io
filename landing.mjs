const legacy = {
  '#about': 'about.html', '#work': 'about.html', '#contact': 'about.html',
  '#studio': 'studio.html', '#ascii-study': 'studio.html#ascii-study',
  '#kolam': 'studio.html#ascii-study', '#courtyard': 'studio.html#courtyard',
  '#accidents': 'studio.html#accidents', '#aintinai': 'sangam.html'
};
function redirectLegacy() {
  const destination = legacy[location.hash];
  if (!destination) return false;
  location.replace(new URL(destination, location.href));
  return true;
}
window.addEventListener('hashchange', redirectLegacy);
if (!redirectLegacy()) {
  // The homepage always opens with the approved eye choreography.
  import('./bharatanatyam-eyes.mjs?v=6').catch(() => {
    document.getElementById('scene-status').textContent =
      'The eye animation could not load. A still of the artwork is shown.';
  });
}

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
  import('./aquarium/aquarium.mjs?v=1').catch(error => {
    console.error('The ASCII canvas could not start:', error);
    document.getElementById('loading').hidden = true;
    document.getElementById('fallback').hidden = false;
    document.querySelector('.study-controls').hidden = true;
    document.getElementById('study-hint').textContent = 'Reload to try the artwork again.';
  });
}

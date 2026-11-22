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
  import('./ascii-world.mjs?v=4').then(module => module.mountWorld()).catch(error => {
    console.error('The ASCII canvas could not start:', error);
    document.getElementById('art-invitation').hidden = true;
    document.getElementById('art-trigger').disabled = true;
    document.getElementById('art-fallback').hidden = false;
    document.getElementById('art-hint').textContent = 'Reload to try the artwork again.';
  });
}

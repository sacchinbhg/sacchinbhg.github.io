// Clips rest on their poster. The hero clip plays while it is on screen.
// Every other clip plays while the pointer or the focus is on it; a tap toggles it.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

for (const host of document.querySelectorAll('[data-clip]')) {
  const v = host.querySelector('video');
  if (!v) continue;
  if (reduce) { v.controls = true; continue; }
  if (host.tabIndex < 0) host.tabIndex = 0;
  const play = () => { v.preload = 'auto'; v.play().catch(() => {}); };
  const stop = () => v.pause();

  if (host.hasAttribute('data-autoplay') && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop()), { threshold: 0.3 }).observe(host);
    host.addEventListener('click', () => (v.paused ? play() : stop()));
    continue;
  }
  host.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') play(); });
  host.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') stop(); });
  host.addEventListener('focusin', play);
  host.addEventListener('focusout', stop);
  host.addEventListener('click', (e) => { if (e.pointerType !== 'mouse') (v.paused ? play : stop)(); });
}

(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let artIndex = 0;
  const art = document.getElementById('siren-art');
  let artChange = 0;
  async function changeArt(direction, keyboard = false) {
    artIndex = (artIndex + direction + 6) % 6;
    const index = artIndex, request = ++artChange;
    const path = `siren_art/siren_${artIndex + 1}.png`;
    const next = new Image(); next.src = path;
    try { await next.decode(); } catch { return; }
    if (request !== artChange) return;
    art.parentElement.querySelector('.art-outgoing')?.remove();
    const outgoing = art.cloneNode(); outgoing.removeAttribute('id'); outgoing.alt = ''; outgoing.setAttribute('aria-hidden', 'true'); outgoing.classList.add('art-outgoing');
    art.parentElement.append(outgoing);
    art.getAnimations().forEach(animation => animation.cancel());
    art.src = path;
    art.alt = `Experimental SIREN artwork ${index + 1} of 6: colourful abstract neural patterns.`;
    document.getElementById('slide-counter').textContent = `${index + 1} / 6`;
    if (!reduced.matches && !keyboard) {
      const options = { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' };
      art.animate([{ opacity: .5, transform: `translateX(${direction * 18}px) scale(1.025)` }, { opacity: 1, transform: 'translateX(0) scale(1)' }], options);
      outgoing.animate([{ opacity: 1 }, { opacity: 0 }], options).finished.then(() => outgoing.remove(), () => outgoing.remove());
    } else outgoing.remove();
  }
  if (art) {
    const stack = document.createElement('div'); stack.className = 'art-image-stack'; art.before(stack); stack.append(art);
    document.getElementById('previous-art').addEventListener('click', event => changeArt(-1, event.detail === 0));
    document.getElementById('next-art').addEventListener('click', event => changeArt(1, event.detail === 0));
  }
})();

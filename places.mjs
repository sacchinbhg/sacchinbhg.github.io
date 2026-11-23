// About page: cycle "I’ve lived in" Delhi, Chennai, Ann Arbor, then "Currently in" the Bay Area, and repeat.
const host = document.querySelector('.places');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
if (host && !reduce.matches) {
  const places = [...host.querySelectorAll('.place')];
  const leads = [...host.querySelectorAll('.lead')];
  let i = 0;
  let timer;
  host.classList.add('is-cycling');
  const show = () => {
    places.forEach((p, n) => {
      const on = n === i;
      p.classList.toggle('is-on', on);
      p.classList.toggle('is-off', !on);
    });
    const lead = places[i].dataset.lead;
    leads.forEach((l) => l.classList.toggle('is-on', l.dataset.lead === lead));
  };
  const next = () => { i = (i + 1) % places.length; show(); };
  const start = () => { clearInterval(timer); timer = setInterval(next, 3800); };
  show();
  start();
  // Pause while the tab is hidden so it does not race through on return.
  document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(timer) : start()));
}

// The portrait converges from noise on a loop; hold the finished frame for reduced motion.
const portrait = document.querySelector('video.about-portrait');
if (portrait && reduce.matches) { portrait.removeAttribute('autoplay'); portrait.pause(); }

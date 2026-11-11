import { storyAt } from './eye-story.mjs?v=3';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => (1 - Math.cos(Math.PI * clamp(value))) / 2;

export function createStoryStage() {
  const root = document.getElementById('story-companion');
  if (!root) return null;
  const title = document.getElementById('story-chapter');
  const caption = document.getElementById('story-caption');
  const flame = document.getElementById('story-flame');
  const door = document.getElementById('story-door');
  const doorLeaf = document.getElementById('story-door-leaf');
  const footsteps = document.getElementById('story-footsteps');
  const rain = document.getElementById('story-rain');
  const flower = document.getElementById('story-flower');
  const petals = document.getElementById('story-petals');
  const ns = 'http://www.w3.org/2000/svg';
  const drops = Array.from({ length: 12 }, (_, i) => {
    const drop = document.createElementNS(ns, 'path');
    const x = 207 + (i * 19) % 115;
    drop.setAttribute('d', `M${x} 14l-3 8`);
    rain.append(drop);
    return drop;
  });
  const flowerPetals = Array.from({ length: 7 }, (_, i) => {
    const petal = document.createElementNS(ns, 'path');
    // One curved jasmine petal, repeated around a shared, living centre.
    petal.setAttribute('d', 'M180 64C171 57 173 45 180 42C187 46 189 58 180 64Z');
    petal.style.transformOrigin = '180px 64px';
    petals.append(petal);
    return petal;
  });
  let cue = -1, fade, running = false;
  root.hidden = false;

  function setRunning(value) {
    if (running === value) return;
    running = value;
    if (fade && (fade.playState === 'running' || fade.playState === 'paused')) value ? fade.play() : fade.pause();
  }
  function update(seconds, immediate = false) {
    const story = storyAt(seconds);
    const t = story.time;
    root.dataset.chapter = String(story.index);
    if (story.cue !== cue) {
      fade?.cancel();
      fade = null;
      title.textContent = story.title;
      caption.textContent = story.caption;
      if (cue >= 0 && !immediate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        fade = caption.animate([{ opacity: .15, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
        if (!running) fade.pause();
      }
      cue = story.cue;
    } else if (immediate) {
      fade?.cancel();
      fade = null;
    }
    // All supporting motion is sampled from the same clock as the eyes.
    // Pause, seeking, reduced-motion stills and hidden tabs therefore stay in sync.
    flame.style.transform = `rotate(${Math.sin(t * 1.6) * 3 + Math.sin(t * 3.1)}deg) scaleY(${1 + Math.sin(t * 2.2) * .055})`;
    flame.style.opacity = String(.83 + Math.sin(t * 1.4) * .12);
    door.style.opacity = String(.28 + smooth((t - 40) / 5) * .35 - smooth((t - 123) / 8) * .28);
    doorLeaf.style.opacity = String(1 - smooth((t - 42) / 5) * .85);
    footsteps.style.opacity = String(smooth((t - 24) / 2) * (1 - smooth((t - 45) / 3)));
    [...footsteps.children].forEach((step, i) => {
      const cycle = ((t - 24 - i * .9) % 4.8 + 4.8) % 4.8;
      step.style.opacity = String(smooth(cycle / .5) * (1 - smooth((cycle - 1.8) / 2)));
    });
    rain.style.opacity = String(smooth((t - 72) / 2) * (1 - smooth((t - 90) / 6)) * .65);
    drops.forEach((drop, i) => {
      const phase = (t * .52 + i * .173) % 1;
      drop.style.transform = `translate(${-phase * 12}px, ${phase * 65}px)`;
      drop.style.opacity = String(Math.sin(phase * Math.PI));
    });
    flower.style.opacity = String(smooth((t - 84) / 3));
    const bloom = smooth((t - 96) / 22);
    flowerPetals.forEach((petal, i) => {
      const angle = i * 360 / 7;
      petal.style.transform = `rotate(${angle}deg) scale(${.35 + bloom * .65}, ${.6 + bloom * .4})`;
      petal.style.opacity = String(.6 + bloom * .25);
    });
  }
  return { update, setRunning };
}

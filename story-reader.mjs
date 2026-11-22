import { storyAt } from './eye-story.mjs?v=3';

// The transcript follows the artwork's clock; it never starts a second timer.
export function createStoryReader({ onSeek, onReadingMode }) {
  const transcript = document.getElementById('story-transcript');
  if (!transcript) return null;
  const lines = [...transcript.querySelectorAll('.story-line')];
  const verses = [...transcript.querySelectorAll('.story-verse')];
  const returnButton = document.getElementById('return-to-story');
  const readingMode = document.getElementById('read-at-pace');
  let cue = -1;
  let following = true;

  function revealCurrent() {
    const line = lines[cue];
    if (!line) return;
    const box = transcript.getBoundingClientRect();
    const target = line.getBoundingClientRect();
    if (target.top < box.top + 12 || target.bottom > box.bottom - 24) {
      transcript.scrollTo({ top: transcript.scrollTop + target.top - box.top - 56, behavior: 'instant' });
    }
  }
  function stopFollowing() {
    following = false;
    returnButton.hidden = false;
  }
  transcript.addEventListener('wheel', stopFollowing, { passive: true });
  transcript.addEventListener('touchstart', stopFollowing, { passive: true });
  transcript.addEventListener('pointerdown', event => {
    if (event.target === transcript) stopFollowing();
  });
  transcript.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', 'Tab'].includes(event.key)) stopFollowing();
  });
  // Tabbing into another line is reading, too. Do not scroll focus out of view.
  transcript.addEventListener('focusin', stopFollowing);
  transcript.addEventListener('click', event => {
    const line = event.target.closest('.story-line');
    if (!line || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    following = true;
    returnButton.hidden = true;
    onSeek(Number(line.dataset.time));
  });
  returnButton.addEventListener('click', () => {
    following = true;
    returnButton.hidden = true;
    revealCurrent();
    lines[cue]?.focus({ preventScroll: true });
    // The focus event should not disable this explicit request to follow.
    following = true;
    returnButton.hidden = true;
  });
  readingMode.addEventListener('change', () => onReadingMode(readingMode.checked));
  document.getElementById('reading-mode').hidden = false;

  return {
    setReadingMode(paused) { readingMode.checked = paused; },
    update(seconds) {
      const story = storyAt(seconds);
      if (cue === story.cue) return;
      lines[cue]?.removeAttribute('aria-current');
      cue = story.cue;
      lines[cue]?.setAttribute('aria-current', 'true');
      verses.forEach((verse, i) => verse.classList.toggle('is-current', i === story.index));
      if (following) revealCurrent();
    }
  };
}

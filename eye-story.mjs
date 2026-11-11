// An original 2:24 story inspired by Bharatanatyam's expressive gaze.
// The poses are an art interpretation, not a codified dance demonstration.
export const STORY_LENGTH = 144;
export const CHAPTERS = [
  { at: 0, title: 'Waiting', motif: 'lamp', lines: [
    'Dusk settles. She lights a lamp for someone.',
    'The doorway is empty. There is still time.',
    'A glance at the sky. The evening grows quiet.',
    'She listens. Even the flame seems to wait.'
  ] },
  { at: 24, title: 'A sound in the distance', motif: 'steps', lines: [
    'A footstep. Then another. Could it be you?',
    'Her eyes turn before she dares to hope.',
    'Nothing at the doorway. She looks again.',
    'There. A familiar shadow, at last.'
  ] },
  { at: 48, title: 'You are late', motif: 'door', lines: [
    'Recognition lights her eyes. Then, a raised brow.',
    'You promised to be here before the lamps were lit.',
    'She looks you over. Well? An explanation?',
    'Beneath the reproach: I thought you would not come.'
  ] },
  { at: 72, title: 'What the rain kept', motif: 'rain', lines: [
    'Only now does she notice the rain on your shoulders.',
    'A flooded path. A long way round.',
    'And in your hand, a little jasmine, kept dry.',
    'You remembered. Her question falls quiet.'
  ] },
  { at: 96, title: 'Trying not to smile', motif: 'flower', lines: [
    'She looks away. She is not forgiving you so easily.',
    'But the corners of her eyes have already softened.',
    'A sidelong glance. Did you see that smile?',
    'The jasmine opens. So does the silence between you.'
  ] },
  { at: 120, title: 'Stay a little longer', motif: 'home', lines: [
    'She meets your gaze. There is no question left.',
    'Come closer. The rain can wait outside.',
    'A lamp, a flower, a little room for two.',
    'Some things are said without a word.'
  ] }
];
export const STILL_MOMENTS = CHAPTERS.map(chapter => chapter.at);
export const storyTime = seconds => Math.max(0, Math.min(STORY_LENGTH, Number.isFinite(seconds) ? seconds : 0));
export function storyAt(seconds) {
  const time = storyTime(seconds);
  const index = Math.min(CHAPTERS.length - 1, Math.floor(time / 24));
  const chapter = CHAPTERS[index];
  const line = Math.min(3, Math.floor((time - chapter.at) / 6));
  return { ...chapter, index, line, caption: chapter.lines[line], time, local: time - chapter.at, cue: index * 4 + line };
}
const base = { x: -.15, y: .1, openL: .78, openR: .74, browL: .12, browR: 0, furrow: 0, sorrow: 0, squint: 0, pupil: 1, tilt: 0, shift: 0 };
const pose = (at, duration, values, beat, gaze = duration, brows = duration) => ({ at, duration, gaze, brows, ...base, ...values, beat });
// Short, deliberate glances arrive quickly; long holds let the meaning settle.
const score = [
  pose(0, 0, {}, 'waiting'),
  pose(2, 1.1, {x: -.45, y: .55, openL: .68, openR: .7, browL: .3, browR: .2}, 'lighting the lamp', .5),
  pose(5, .7, {x: .82, openL: .92, openR: .98, browL: .35, browR: .55}, 'the doorway', .18),
  pose(8, .9, {x: .1, y: .12, browL: .2, browR: .25}, 'there is time', .4),
  pose(12.5, .8, {x: -.35, y: -.8, openL: 1.02, openR: 1.04, browL: .5, browR: .55}, 'watching the sky', .3),
  pose(16, 1.2, {x: .15, y: .35, openL: .66, openR: .7, sorrow: .35, tilt: -.012}, 'evening settles', .6),
  pose(19.5, .5, {x: .65, openL: .87, openR: .95, browL: .1, browR: .65, tilt: .015}, 'listening', .18),
  pose(23, 1, {x: .2, y: .12, openL: .8, openR: .8}, 'still waiting', .5),
  pose(24.6, .5, {x: 1.02, y: -.12, openL: 1.15, openR: 1.1, browL: .4, browR: 1, pupil: 1.12, shift: 3}, 'a footstep', .15, .4),
  pose(27, .45, {x: .98, openL: .75, openR: 1.02, browL: -.25, browR: 1.4, tilt: .018}, 'who is there?', .16),
  pose(30.5, .5, {x: -.98, y: -.1, openL: 1.1, openR: 1.12, browL: .9, browR: .65, shift: -5}, 'search left', .14, .3),
  pose(32.6, .4, {x: 1, y: -.12, openL: 1.1, openR: 1.12, browL: .65, browR: .9, shift: 5}, 'search right', .13, .28),
  pose(35, .9, {x: .55, openL: .9, openR: 1, browL: .5, browR: 1, tilt: .018}, 'hope', .3),
  pose(38, 1.1, {x: .1, y: .3, openL: .7, openR: .75, sorrow: .5}, 'an empty doorway', .5),
  pose(41, .55, {x: .96, y: -.1, openL: 1.2, openR: 1.18, browL: .8, browR: 1.1, pupil: 1.12}, 'another sound', .15),
  pose(44, .65, {x: .35, y: -.08, openL: 1.34, openR: 1.3, browL: 1.32, browR: 1.4, pupil: 1.16}, 'there you are', .17, .4),
  pose(47, .9, {x: .75, y: -.24, openL: 1.12, openR: 1.07, browL: .72, browR: 1, pupil: 1.08, shift: 3}, 'recognition', .45),
  pose(50, .65, {x: .94, y: .05, openL: .6, openR: 1.03, browL: -.35, browR: 1.48, tilt: .026, shift: 4, pupil: .92}, 'you are late', .16, .55),
  pose(54, .7, {x: -.6, y: .48, openL: .7, openR: .86, browL: -.15, browR: 1.2, tilt: .025}, 'the lamps are lit', .22),
  pose(57, .5, {x: .96, y: .68, openL: .75, openR: .9, browL: -.15, browR: 1.25, pupil: .9}, 'looking you over', .16),
  pose(58.3, .3, {x: .96, y: -.5, openL: 1.05, openR: 1.08, browL: .2, browR: 1.3, pupil: .9}, 'looking you over', .13, .25),
  pose(61, .5, {x: 0, y: 0, openL: .89, openR: .89, browL: -.48, browR: -.4, furrow: 1.12, pupil: .78, shift: -3}, 'explain yourself', .14, .42),
  pose(63.5, .4, {x: 0, openL: 1.08, openR: 1.1, browL: .75, browR: .9, furrow: .3, pupil: .84}, 'well?', .15, .28),
  pose(65.3, .4, {x: .08, openL: .8, openR: .82, browL: -.45, browR: -.35, furrow: 1.05, pupil: .8}, 'still waiting', .15),
  pose(68.5, 1.5, {x: .05, y: .26, openL: .8, openR: .74, browL: .15, browR: .12, sorrow: 1, pupil: 1.06, tilt: -.014}, 'I thought you would not come', .6),
  pose(71, 1.1, {x: .55, y: .55, openL: .51, openR: .58, browL: .3, browR: .55, sorrow: .4, tilt: -.023, shift: -5}, 'looking away', .5),
  pose(74, .7, {x: .85, y: .6, openL: 1.03, openR: 1.05, browL: .65, browR: .9, pupil: 1.1}, 'rain on your shoulders', .2),
  pose(77, .8, {x: .6, y: -.15, openL: 1.1, openR: 1.05, browL: .75, browR: 1.1, tilt: .015}, 'listening to your story', .35),
  pose(80, .7, {x: -.75, y: .1, openL: .94, openR: .97, browL: .6, browR: .6}, 'the long way round', .2),
  pose(83, .9, {x: .45, y: .4, openL: .86, openR: .85, browL: .6, browR: .75, sorrow: .2, pupil: 1.12}, 'understanding', .4),
  pose(86, .65, {x: .2, y: .6, openL: 1.23, openR: 1.2, browL: 1.12, browR: 1.25, pupil: 1.18}, 'a little jasmine', .18, .5),
  pose(89, 1.1, {x: .15, y: .35, openL: .86, openR: .85, browL: .6, browR: .75, squint: .55, pupil: 1.15, tilt: -.012}, 'you remembered', .5),
  pose(92, 1.1, {x: 0, y: .05, openL: .9, openR: .94, browL: .5, browR: .75, squint: .5, pupil: 1.12}, 'the question falls quiet', .45),
  pose(97, .65, {x: -.96, y: .08, openL: .67, openR: .88, browL: -.05, browR: 1.2, squint: .4, tilt: .018}, 'trying not to smile', .15, .48),
  pose(100, .9, {x: -.6, y: .3, openL: .65, openR: .72, browL: .25, browR: .65, squint: .75, tilt: -.016}, 'looking away', .4),
  pose(104, 1.1, {x: .05, y: .1, openL: .82, openR: .84, browL: .62, browR: .75, squint: 1, pupil: 1.14, tilt: -.018}, 'a smile in the eyes', .45),
  pose(108.5, .5, {x: .9, y: .05, openL: .74, openR: .94, browL: .15, browR: 1.12, squint: .65, tilt: .02}, 'did you see?', .15),
  pose(111, .65, {x: -.8, y: .28, openL: .69, openR: .76, browL: .3, browR: .55, squint: .9, tilt: -.02}, 'a shy retreat', .17),
  pose(114.5, 1.1, {x: -.35, y: .5, openL: .53, openR: .59, browL: .38, browR: .5, squint: .52, pupil: 1.1, tilt: -.024, shift: -4}, 'jasmine opens', .5),
  pose(118, 1, {x: 0, y: .1, openL: .88, openR: .91, browL: .6, browR: .7, squint: .8, pupil: 1.12}, 'the silence changes', .45),
  pose(122, .85, {x: 0, y: 0, openL: .97, openR: .94, browL: .62, browR: .7, squint: .35, pupil: 1.1}, 'welcome', .2),
  pose(126.5, .9, {x: .7, y: .18, openL: .78, openR: .86, browL: .4, browR: .8, squint: .55, tilt: .016}, 'come closer', .25),
  pose(129, .8, {x: 0, y: .1, openL: .88, openR: .89, browL: .6, browR: .65, squint: .85, pupil: 1.12}, 'stay', .3),
  pose(133, 1, {x: -.35, y: .45, openL: .65, openR: .7, browL: .35, browR: .5, squint: .6, tilt: -.018}, 'a lamp and a flower', .4),
  pose(137, 1.2, {x: 0, y: 0, openL: .86, openR: .88, browL: .55, browR: .65, squint: .85, pupil: 1.14, tilt: -.008}, 'without a word', .5),
  pose(141.5, 1.3, {x: 0, y: .08, openL: .75, openR: .78, browL: .4, browR: .5, squint: .7, pupil: 1.1}, 'home', .6)
];
const clamp = x => Math.min(1, Math.max(0, x));
// Existing sine ease-in-out preserves the character of the approved choreography.
const soft = t => (1 - Math.cos(Math.PI * clamp(t))) / 2;
function blinkAt(t, start) {
  const p = t - start;
  if (p < 0 || p > .34) return 0;
  if (p < .1) return soft(p / .1);
  if (p < .14) return 1;
  return 1 - soft((p - .14) / .2);
}
const blinks = [0.5, 3.7, 7.3, 10.9, 14.4, 17.7, 21.5, 26, 29, 34, 37, 40, 43, 46, 51.5, 55, 59.4, 64.5, 67, 70, 75.4, 78.6, 82, 85, 88, 91, 94, 98.5, 102, 106.3, 110, 112.5, 116, 119, 123.5, 127.5, 131, 135, 138.8, 140];
export function eyesAt(seconds) {
  const t = storyTime(seconds);
  let a = score[0], b = score[0];
  for (let i = 1; i < score.length; i++) {
    b = score[i];
    if (t <= b.at) break;
    a = b;
  }
  const since = t - (b.at - b.duration);
  const progress = b.duration ? clamp(since / b.duration) : 1;
  const result = { beat: progress > .05 ? b.beat : a.beat };
  for (const key of Object.keys(base)) {
    const gaze = key === 'x' || key === 'y';
    const brow = key.startsWith('brow') || key === 'furrow' || key === 'sorrow';
    const delay = brow && b.gaze < b.duration ? .06 : 0;
    const duration = gaze ? b.gaze : brow ? Math.min(b.brows, b.duration - delay) : b.duration;
    const mix = duration > 0 ? soft((since - delay) / duration) : 1;
    result[key] = a[key] + (b[key] - a[key]) * mix;
  }
  let leftBlink = 0, rightBlink = 0;
  for (const at of blinks) {
    leftBlink = Math.max(leftBlink, blinkAt(t, at));
    rightBlink = Math.max(rightBlink, blinkAt(t, at + .018));
  }
  result.openL *= 1 - leftBlink; result.openR *= 1 - rightBlink;
  return result;
}

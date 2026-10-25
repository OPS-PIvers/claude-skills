/* A gear train: the reference example for a machine that runs (motion, a speed control, live readouts).

   Read-back it was built from (a typical simple-machines figure: three spur gears in a row on a board, a crank on
   the small one, "driver", "idler" and "driven" labelled, tooth counts printed):
   - Topic: how gears pass a turn along and trade speed for turning force. Type: machine.
   - Labels as printed: gear A (12 teeth), gear B (24 teeth), gear C (36 teeth), crank, axle, board.
   - Colours: one colour per gear, a red mark on one tooth of each (the book's arrows become the marks you can
     count). Page: white paper, sans type, leader lines.
   - Process (from the book): meshing gears turn opposite ways; the middle (idler) gear only reverses the direction;
     the ratio of teeth sets the ratio of turns. Supplied by Claude: the turning-force trade (torque), and bikes.
   - Geometry: procedural spur gears at a 0.5 cm module, so they really mesh: A is 6 cm across, C 18 cm.
   - Features: all but Cut (nothing hidden inside). Extras: motion with Run/Stop and a speed slider, turn counters. */
const M = .5, W = 1.2;                                    // module (cm per tooth of diameter) and gear thickness
const N = { a: 12, b: 24, c: 36 };
const R = k => M * N[k] / 2;                              // pitch radius
const X = { a: -12, b: -12 + R('a') + R('b'), c: -12 + R('a') + 2 * R('b') + R('c') };
const COLOR = { a: '#4a78c2', b: '#9aa3ad', c: '#e0913a' };
const NAME = { a: 'Gear A', b: 'Gear B', c: 'Gear C' };
const INFO = {
  a: 'The driver: the crank turns it. 12 teeth.',
  b: 'The idler: it passes the turn from A to C and flips the direction back. 24 teeth.',
  c: 'The driven gear: 36 teeth, so it turns once for every three turns of A.',
};

const gear = k => [
  { id: `gear-${k}`, name: `${NAME[k]} (${N[k]} teeth)`, info: INFO[k], at: [X[k], 0, 0], color: COLOR[k],
    shape: { gear: { teeth: N[k], m: M, w: W, hole: .5 } } },
  { id: `mark-${k}`, name: `Mark on ${NAME[k]}`, label: false, tap: false, at: [X[k], 0, 0], offset: [R(k) - .1, 0, W / 2 + .06],
    shape: { box: { size: [M * 1.6, M * .9, .12] } }, color: '#d23a2a' },
  { id: `axle-${k}`, name: 'Axle', label: k === 'b' ? undefined : false, at: [X[k], 0, -.4], rot: [Math.PI / 2, 0, 0],
    shape: { cylinder: { r: .5, h: 3.2 } }, color: '#59606b', info: 'A steel rod fixed to the board. The gear spins on it.' },
];

// A turns clockwise seen from the front (negative about z). Meshing gears turn the other way, scaled by teeth.
// B is set half a tooth round so its gaps meet A's and C's teeth.
const drive = turns => {
  const a = -2 * Math.PI * turns, b = -a * N.a / N.b + Math.PI / N.b, c = a * N.a / N.c;
  return { 'gear-a': { rot: [0, 0, a] }, 'mark-a': { rot: [0, 0, a] }, crank: { rot: [0, 0, a] }, handle: { rot: [0, 0, a] },
           'gear-b': { rot: [0, 0, b] }, 'mark-b': { rot: [0, 0, b] }, 'gear-c': { rot: [0, 0, c] }, 'mark-c': { rot: [0, 0, c] } };
};

mountModel({
  fig: '9.6', title: 'A gear train',
  style: { paper: '#fbfbf8', ink: '#1c2230', muted: '#5d6472', accent: '#c8432b', font: 'sans', labels: 'leader' },
  caption: 'Three gears on a board. Press Run, or Walk through to see how they pass a turn along.',
  view: { az: 20, el: 14 },
  views: { Front: { az: 0, el: 4 }, Angle: { az: 35, el: 22 }, Side: { az: 90, el: 6 }, Top: { az: 0, el: 80 } },
  parts: [
    { id: 'board', name: 'Board', at: [3, 0, -1.6], shape: { box: { size: [44, 23, 1] } }, color: '#ead9b5',
      info: 'Holds the axles the right distance apart, so the teeth mesh.' },
    ...gear('a'), ...gear('b'), ...gear('c'),
    { id: 'crank', name: 'Crank', at: [X.a, 0, 0], offset: [2.3, 0, 1.3], shape: { box: { size: [4.6, .9, .5] } },
      color: '#3c64a6', info: 'Turn it by the handle and gear A turns with it.' },
    { id: 'handle', name: 'Handle', label: false, at: [X.a, 0, 0], rot: [Math.PI / 2, 0, 0], offset: [4.2, 0, 2.6],
      shape: { cylinder: { r: .38, h: 2.4 } }, color: '#2d3440', info: 'Hold here to turn the crank.' },
  ],
  motion: { drive, speed: { value: .4, min: .1, max: 1.5, name: 'Speed', unit: 'turns of A a second' } },
  stats: st => [
    { label: 'Gear A turns', value: st.turns.toFixed(1) },
    { label: 'Gear C turns', value: (st.turns * N.a / N.c).toFixed(1) },
    { label: 'Gear A speed', value: Math.round(st.speed * 60) + ' rpm' },
  ],
  apart: {
    flow: 'the turn',
    order: ['crank', 'gear-a', 'gear-b', 'gear-c'],
    offsets: {
      crank: [-6, 3, 12], handle: [-6, 3, 12], 'gear-a': [-5, 0, 7], 'mark-a': [-5, 0, 7], 'gear-b': [0, 4, 5], 'mark-b': [0, 4, 5],
      'gear-c': [5, 0, 7], 'mark-c': [5, 0, 7], 'axle-a': [0, 0, 0], 'axle-b': [0, 0, 0], 'axle-c': [0, 0, 0], board: [0, 0, -3],
    },
    caption: 'The turn goes crank, gear A, gear B, gear C. Each gear spins on its own axle.',
    predict: 'Each gear sits on an axle fixed to the board. What keeps the teeth from slipping apart?',
  },
  steps: [
    { label: 'Three gears', view: { az: 0, el: 5 }, run: false, reset: true,
      caption: 'Three gears on a board. The crank turns gear A, the small blue one.' },
    { label: 'Turn the crank', view: { az: 25, el: 16 }, run: true, speed: .4, highlight: ['crank', 'handle', 'gear-a', 'mark-a'],
      caption: 'Turn the crank and gear A turns. Its teeth push on the teeth of gear B.' },
    { label: 'Opposite ways', view: { az: 0, el: 5 }, run: true, highlight: ['gear-a', 'mark-a', 'gear-b', 'mark-b'],
      predict: 'Gear A turns clockwise. Which way will gear B turn?',
      caption: 'Gears that touch turn opposite ways. A turns clockwise, so B turns counterclockwise.' },
    { label: 'Same way again', view: { az: 0, el: 5 }, run: true, highlight: ['gear-b', 'mark-b', 'gear-c', 'mark-c'],
      caption: 'B turns C the other way again, so C turns clockwise, the same way as A.' },
    { label: 'Count the turns', view: { az: 0, el: 5 }, run: true, speed: .5, reset: true,
      highlight: ['gear-a', 'mark-a', 'gear-c', 'mark-c'],
      predict: 'A has 12 teeth and C has 36. While A turns 3 times, how many times will C turn?',
      caption: 'Watch the red marks: C has 3 times as many teeth, so it turns once for every 3 turns of A.',
      beats: [{ caption: 'The middle gear’s size makes no difference. It only passes the turn along.',
                highlight: ['gear-b', 'mark-b'] }] },
    { label: 'Slower, stronger', view: { az: 30, el: 18 }, run: true, speed: .4, highlight: ['gear-c', 'mark-c'],
      caption: 'C turns 3 times slower, but with 3 times the turning force. Bike gears use this trade.' },
    { label: 'Faster', view: { az: 15, el: 12 }, run: true, speed: 1.2,
      caption: 'Turn the crank faster and every gear speeds up, but the 3 to 1 stays the same.' },
  ],
});

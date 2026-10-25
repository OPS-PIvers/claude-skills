/* The trumpet: the reference example for a machine built from procedural parts (tube, lathe, cylinder), with
   parts that move per step (pistons pressed down) and a flow path that changes with them.

   Read-back it was built from (a typical music-class figure of a B♭ trumpet, side view, parts labelled):
   - Topic: how the valves of a trumpet change the note. Type: machine.
   - Labels as printed: mouthpiece, leadpipe, main tuning slide, valves 1, 2 and 3, 1st, 2nd and 3rd valve slides,
     bell.
   - Colours: brass tubing, silver pistons, pearl finger buttons. Page: white paper, sans type, leader lines.
   - Process (from the book): lips buzz in the mouthpiece; the air goes through about 1.4 m of tube to the bell;
     pressing a valve sends it through an extra loop, so the tube is longer and the note lower.
     Supplied by Claude: the loop lengths (about 8, 17 and 27 cm on a B♭ trumpet: a half step, a whole step and a
     step and a half lower), and that valve 1 + 2 together is about the same as valve 3.
   - Geometry: procedural, simplified. The real tubing wraps more tightly and the ports inside the valves aren't
     drawn: the air dots show which way it goes. Real size, in centimetres (about 48 cm long).
   - Features: all. Extras: pistons move, the air path changes with the valves, layers. */
const BRASS = '#d9ab45', BRASS_D = '#c39230', SILVER = '#b9bec6', PEARL = '#f2ece0';
const R = .6;                                        // tube radius (cm)

// tubing centre lines (cm): x forward toward the bell, y up, z toward the player's right
const LEAD = [[-22, 3, 2.2], [-8, 3, 2.2], [6, 3, 2.2], [14, 3, 2.2]];
const TUNING = [[14, 3, 2.2], [17.6, 3, 2.1], [19.3, 1.3, 1.1], [17.6, -.6, 0], [12, -.6, 0], [5.2, -.6, 0]];
const BELL_TAIL = [[-5.2, -2, 0], [-12, -2, 0], [-16.5, -2.4, -.4], [-19.4, -.5, -1.6], [-17.4, 1.4, -2.2],
                   [-12, 1.5, -2.2], [0, 1.5, -2.2], [14, 1.5, -2.2]];
const loop = (x, dx, y) => [[x, -4.5, 1], [x, y + .4, 1], [x + dx * .7, y, 1], [x + dx, y, 0], [x + dx * .7, y, -1],
                            [x, y + .4, -1], [x, -4.5, -1]];
const SLIDE1 = loop(-4, -8, -5.8), SLIDE3 = loop(4, 10, -5.8);
const SLIDE2 = [[0, -4.5, .9], [0, -6.9, .9], [0, -7.9, 0], [0, -6.9, -.9], [0, -4.5, -.9]];

// the air: in at the mouthpiece, through the valves (and any pressed valve's loop), out of the bell
const IN = [[-30, 3, 2.2], ...LEAD.slice(0, 3), ...TUNING.slice(0, 5), [4, -.6, 0]];
const OUT = [[-4, -2, 0], ...BELL_TAIL.slice(1), [22, 1.5, -2.2], [30, 1.5, -2.2]];
const via = (x, slide) => slide ? [[x, -.6, 0], [x, -3.6, 0], ...slide.slice(1, -1), [x, -3.6, 0], [x, -.6, 0]] : [[x, -.6, 0]];
const air = (v1, v2, v3) => ({ path: [...IN, ...via(4, v3 && SLIDE3), ...via(0, v2 && SLIDE2), ...via(-4, v1 && SLIDE1), ...OUT],
                               color: '#2f5fa8', dots: 34, speed: 1.6 });
const DOWN = [0, -1.5, 0];
const press = (...n) => Object.fromEntries(n.flatMap(i => [[`piston-${i}`, DOWN], [`button-${i}`, DOWN]]));

const valve = i => {
  const x = (i - 2) * 4;                             // valve 1 is nearest the mouthpiece
  return [
    { id: `valve-${i}`, name: `Valve ${i}`, shape: { cylinder: { r: 1.2, h: 9 } }, at: [x, 0, 0], color: BRASS, group: 'casings',
      info: `A brass tube with a piston inside. Press it and the air goes round the ${['1st', '2nd', '3rd'][i - 1]} valve slide.` },
    { id: `piston-${i}`, name: i === 2 ? 'Piston' : `Piston ${i}`, label: i === 2 ? undefined : false, shape: { cylinder: { r: .98, h: 8.6 } },
      at: [x, .2, 0], color: SILVER, info: 'Holes through the piston line up with one tube or another, depending on whether it is up or down.' },
    { id: `button-${i}`, name: `Finger button ${i}`, label: false, at: [x, 4.5, 0], color: PEARL,
      shape: { lathe: { profile: [[0, 0], [.28, 0], [.28, 1.6], [1, 1.65], [1.05, 2], [.9, 2.2], [0, 2.25]] } },
      info: 'Press it with a finger to push the piston down.' },
  ];
};

mountModel({
  fig: '12.4', title: 'The trumpet',
  style: { paper: '#fdfcf8', ink: '#1f2328', muted: '#5f6670', accent: '#b5462b', font: 'sans', labels: 'leader' },
  caption: 'A trumpet is about 1.4 metres of brass tube, coiled up so you can hold it.',
  view: { az: 20, el: 14 },
  views: { Side: { az: 0, el: 6 }, Player: { az: -70, el: 12 }, Top: { az: 0, el: 80 }, Below: { az: 20, el: -40 } },
  layers: [{ id: 'casings', name: 'Valve casings (hide to see the pistons)' }, { id: 'slides', name: 'Valve slides' }],
  parts: [
    { id: 'mouthpiece', name: 'Mouthpiece', at: [-22, 3, 2.2], rot: [0, 0, Math.PI / 2], color: SILVER,
      shape: { lathe: { profile: [[.45, 0], [.5, 5.6], [.62, 6.8], [1.0, 7.6], [1.35, 8.2], [1.4, 8.6], [1.2, 8.7]] } },
      info: 'Your lips press here and buzz. The buzz is where every note starts.' },
    { id: 'leadpipe', name: 'Leadpipe', shape: { tube: { points: LEAD, r: R * .92 } }, color: BRASS,
      info: 'Carries the buzzing air from the mouthpiece toward the valves.' },
    { id: 'tuning-slide', name: 'Main tuning slide', shape: { tube: { points: TUNING, r: R } }, color: BRASS_D,
      info: 'Pull it out a little to make every note slightly lower, to play in tune with others.' },
    ...valve(1), ...valve(2), ...valve(3),
    { id: 'slide-1', name: '1st valve slide', shape: { tube: { points: SLIDE1, r: R } }, color: BRASS_D, group: 'slides',
      info: 'About 17 cm of extra tube. Used when valve 1 is pressed.' },
    { id: 'slide-2', name: '2nd valve slide', shape: { tube: { points: SLIDE2, r: R } }, color: BRASS_D, group: 'slides',
      info: 'The shortest loop, about 8 cm. Used when valve 2 is pressed.' },
    { id: 'slide-3', name: '3rd valve slide', shape: { tube: { points: SLIDE3, r: R } }, color: BRASS_D, group: 'slides',
      info: 'The longest loop, about 27 cm. Used when valve 3 is pressed.' },
    { id: 'bell-tail', name: 'Bell tube', label: false, shape: { tube: { points: BELL_TAIL, r: R } }, color: BRASS,
      info: 'Carries the air from the valves round the back and forward to the bell.' },
    { id: 'bell', name: 'Bell', at: [14, 1.5, -2.2], rot: [0, 0, -Math.PI / 2], color: BRASS,
      shape: { lathe: { seg: 96, profile: [[.6, 0], [.7, 4], [.95, 7], [1.5, 9.5], [2.6, 11.5], [4.3, 13], [6, 13.9], [6.3, 14.1], [6.2, 14.25]] } },
      info: 'The flare at the end lets the sound spread out into the room.' },
  ],
  flows: { open: air(0, 0, 0), v1: air(1, 0, 0), v2: air(0, 1, 0), v3: air(0, 0, 1), v12: air(1, 1, 0) },
  apart: {
    flow: 'air',
    order: ['mouthpiece', 'leadpipe', 'tuning-slide', 'valve-3', 'valve-2', 'valve-1', 'bell-tail', 'bell'],
    offsets: {
      mouthpiece: [-7, 0, 0], leadpipe: [0, 5, 4], 'tuning-slide': [7, 3, 4],
      'valve-1': [-3, 7, 0], 'valve-2': [0, 7, 0], 'valve-3': [3, 7, 0],
      'piston-1': [-3, 15, 0], 'piston-2': [0, 15, 0], 'piston-3': [3, 15, 0],
      'button-1': [-3, 18, 0], 'button-2': [0, 18, 0], 'button-3': [3, 18, 0],
      'slide-1': [-4, -5, 0], 'slide-2': [0, -6, 0], 'slide-3': [4, -5, 0],
      'bell-tail': [-3, -2, -5], bell: [8, 0, -5],
    },
    caption: 'Air goes mouthpiece, leadpipe, tuning slide, valves 3, 2 and 1, round the back, out the bell.',
    predict: 'The air goes through every valve even when none is pressed. Why might that be?',
  },
  section: { normal: [0, 0, 1], range: [-3, 3], caption: 'Cut through the valves to see the silver pistons inside.' },
  steps: [
    { label: 'Buzz', view: { az: -35, el: 14 }, flows: ['open'], highlight: ['mouthpiece', 'leadpipe'],
      caption: 'Your lips buzz in the mouthpiece and set the air in the tube vibrating.' },
    { label: 'No valves', view: { az: 15, el: 12 }, flows: ['open'],
      highlight: ['tuning-slide', 'valve-1', 'valve-2', 'valve-3', 'bell-tail', 'bell'],
      caption: 'With no valves pressed, the air takes the shortest way to the bell.' },
    { label: 'Valve 2', view: { az: 10, el: 4 }, flows: ['v2'], move: press(2), highlight: ['valve-2', 'button-2', 'slide-2'],
      predict: 'Pressing a valve sends the air through an extra loop of tube. Will the note go up or down?',
      caption: 'Valve 2 adds about 8 cm of tube. A longer tube plays lower: half a step lower.' },
    { label: 'Valve 1', view: { az: -15, el: 4 }, flows: ['v1'], move: press(1), highlight: ['valve-1', 'button-1', 'slide-1'],
      caption: 'Valve 1 adds about 17 cm of tube, so the note drops a whole step.' },
    { label: 'Valve 3', view: { az: 30, el: 4 }, flows: ['v3'], move: press(3), highlight: ['valve-3', 'button-3', 'slide-3'],
      predict: 'Valve 3 adds about 27 cm. Which two other valves together would do almost the same?',
      caption: 'Valve 3 adds the longest loop, about 27 cm: a step and a half lower.',
      beats: [{ caption: 'Valves 1 and 2 together add about 25 cm, nearly the same note.', move: press(1, 2), flows: ['v12'],
                highlight: ['valve-1', 'button-1', 'slide-1', 'valve-2', 'button-2', 'slide-2'] }] },
    { label: 'Inside a valve', view: { az: 0, el: 8 }, cut: .5, move: press(2), flows: ['v2'],
      highlight: ['piston-1', 'piston-2', 'piston-3', 'valve-1', 'valve-2', 'valve-3'],
      caption: 'Inside each valve is a piston. Pushed down, its holes send the air the long way round.' },
    { label: 'Tuning', view: { az: 25, el: 16 }, cut: null, highlight: ['tuning-slide'],
      caption: 'Pull the main tuning slide out a little and every note gets slightly lower.' },
    { label: 'The bell', view: { az: 45, el: 10 }, flows: ['open'], highlight: ['bell'],
      caption: 'The bell’s wide flare lets the sound spread out into the room.' },
  ],
});

/* A bookcase from flat-pack: the reference example for an instruction manual (a parts list, parts added step by
   step, the manual's own step numbers).

   Read-back it was built from (a typical flat-pack manual page: a parts list with letters and counts, then
   numbered drawings with arrows showing where each part goes):
   - Topic: putting a two-shelf bookcase together. Type: assembly.
   - Labels as printed: side panel A (×2), shelf B (×2), top C, back panel D, wooden dowel E (×8), nail F (×6).
   - Colours: the manual's plain line drawing becomes pale wood with ink outlines; the step number in a box.
     Page: white paper, sans type, boxed labels.
   - Steps (from the manual): sides and dowels, shelves, the other side, the top, the back, the nails.
     Supplied by Claude: why the dowels go first, and why a back panel stops the frame racking.
   - Geometry: real size, 60 × 82 × 28 cm, 1.8 cm boards.
   - Features: Take apart (the manual's exploded drawing). Extras: the parts tray, parts flying in, step numbers. */
const W = 60, H = 80, D = 28, T = 1.8;
const PANEL = '#f3efe6', BACK = '#dccfb4', DOWEL = '#d2a868', NAIL = '#7b8089';
const sub = (a, b) => a.map((v, i) => +(v - b[i]).toFixed(2));

const HOME = {
  'side-a': [-(W / 2 - T / 2), H / 2, 0], 'side-b': [W / 2 - T / 2, H / 2, 0],
  'shelf-1': [0, 6, .5], 'shelf-2': [0, 42, .5], top: [0, H + T / 2, 0], back: [0, H / 2, -D / 2 + .2],
};
const DOWELS = [-1, 1].flatMap(side => [6, 42].flatMap(y => [8, -7].map(z => [side * (W / 2 - T), y, z])));   // 4 left, 4 right
const NAILS = [-26, 26].flatMap(x => [6, 42, H - 2].map(y => [x, y, -D / 2 - .1]));

// where each part lies in the parts list (absolute cm), turned into offsets from where it's built
const TRAY_AT = {
  'side-a': [-85, H / 2, 30], 'side-b': [-78, H / 2, 30], 'shelf-1': [-15, .9, 40], 'shelf-2': [-15, 2.7, 40],
  top: [-15, 4.5, 40], back: [45, H / 2, 30],
};
const tray = Object.fromEntries([
  ...Object.entries(TRAY_AT).map(([id, at]) => [id, sub(at, HOME[id])]),
  ...DOWELS.map((at, i) => [`dowel-${i + 1}`, sub([-32 + i * 2.6, .4, 68], at)]),
  ...NAILS.map((at, i) => [`nail-${i + 1}`, sub([-8 + i * 2, .3, 68], at)]),
]);
const from = {
  'side-a': [0, 40, 0], 'side-b': [30, 0, 0], 'shelf-1': [0, 0, 40], 'shelf-2': [0, 0, 40], top: [0, 30, 0], back: [0, 0, -40],
  ...Object.fromEntries(DOWELS.map((_, i) => [`dowel-${i + 1}`, [12, 0, 0]])),            // in from the right: through the gap, or into the shelf ends
  ...Object.fromEntries(NAILS.map((_, i) => [`nail-${i + 1}`, [0, 0, -12]])),
};
const dowelIds = DOWELS.map((_, i) => `dowel-${i + 1}`), nailIds = NAILS.map((_, i) => `nail-${i + 1}`);

const board = (id, name, size, color, info) => ({ id, name, at: HOME[id], shape: { box: { size } }, color, info });

mountModel({
  fig: '4', title: 'Bookcase assembly',
  style: { paper: '#ffffff', ink: '#111111', muted: '#555555', accent: '#2b6cb0', font: 'sans', labels: 'boxed' },
  caption: 'The finished bookcase. Press Walk through to build it from the parts, one manual step at a time.',
  view: { az: 28, el: 18 },
  views: { Front: { az: 0, el: 10 }, Angle: { az: 30, el: 22 }, Back: { az: 180, el: 12 }, Top: { az: 0, el: 80 } },
  parts: [
    board('side-a', 'Side panel (A)', [T, H, D], PANEL, 'One of two sides. The holes on its inside face take the dowels.'),
    board('side-b', 'Side panel (A)', [T, H, D], PANEL, 'The second side. It presses onto the dowels at the other end of the shelves.'),
    board('shelf-1', 'Shelf (B)', [W - 2 * T, T, D - 1], PANEL, 'The bottom shelf. Dowels in each end hold it between the sides.'),
    board('shelf-2', 'Shelf (B)', [W - 2 * T, T, D - 1], PANEL, 'The middle shelf, the same part as the bottom one.'),
    board('top', 'Top (C)', [W, T, D], PANEL, 'Rests on both side panels.'),
    board('back', 'Back panel (D)', [W - 2 * T + 1, H - 2, .4], BACK, 'A thin board nailed across the back. It stops the frame leaning into a slant.'),
    ...DOWELS.map((at, i) => ({ id: `dowel-${i + 1}`, name: 'Wooden dowel (E)', label: i === 0 || i === 4 ? undefined : false,
      at, rot: [0, 0, Math.PI / 2], shape: { cylinder: { r: .4, h: 3, seg: 16 } }, color: DOWEL,
      info: 'A wooden peg, half in the side and half in the shelf, that lines them up.' })),
    ...NAILS.map((at, i) => ({ id: `nail-${i + 1}`, name: 'Nail (F)', label: i === 0 ? undefined : false,
      at, rot: [Math.PI / 2, 0, 0], shape: { cylinder: { r: .25, h: .5, seg: 12 } }, color: NAIL,
      info: 'Holds the back panel to the frame.' })),
  ],
  assembly: { tray, from },
  apart: {
    flow: 'how it goes together',
    order: ['side-a', 'shelf-1', 'shelf-2', 'side-b', 'top', 'back'],
    offsets: {
      'side-a': [-25, 0, 0], 'side-b': [25, 0, 0], 'shelf-1': [0, 0, 18], 'shelf-2': [0, 0, 18], top: [0, 22, 0], back: [0, 0, -25],
      ...Object.fromEntries(DOWELS.map((at, i) => [`dowel-${i + 1}`, [at[0] < 0 ? -12 : 12, 0, 9]])),
      ...Object.fromEntries(NAILS.map((_, i) => [`nail-${i + 1}`, [0, 0, -34]])),
    },
    caption: 'Sides A, shelves B, the other side, top C and back D, held by dowels E and nails F.',
  },
  steps: [
    { label: 'Parts', manual: 'Parts', tray: true, view: { az: 15, el: 28 },
      caption: 'Check you have every part: 2 sides A, 2 shelves B, top C, back D, 8 dowels E, 6 nails F.' },
    { label: 'Side and dowels', manual: '1', adds: ['side-a', ...dowelIds.slice(0, 4)], view: { az: 40, el: 18 },
      caption: 'Stand side A up and push 4 wooden dowels E into the holes on its inside.' },
    { label: 'Shelves', manual: '2', adds: ['shelf-1', 'shelf-2'], view: { az: 35, el: 18 },
      predict: 'Why do the dowels go in before the shelves?',
      caption: 'Slide both shelves B onto the dowels. The dowels line them up and hold them in place.' },
    { label: 'Other side', manual: '3', adds: [...dowelIds.slice(4), 'side-b'], view: { az: 30, el: 18 },
      caption: 'Push 4 more dowels into the shelf ends, then press side B onto them.' },
    { label: 'Top', manual: '4', adds: ['top'], view: { az: 25, el: 24 },
      caption: 'Put top C on so it rests on both side panels.' },
    { label: 'Back', manual: '5', adds: ['back'], view: { az: 205, el: 15 },
      caption: 'Turn it round. Lay back panel D against the back edges of the sides and shelves.' },
    { label: 'Nails', manual: '6', adds: nailIds, view: { az: 195, el: 12 },
      predict: 'Without the back, the bookcase can lean over sideways. How can one thin board stop that?',
      caption: 'Nail D to the frame. A box can lean into a slant, but the flat back can’t, so it stays square.' },
    { label: 'Done', manual: 'Done', view: { az: 28, el: 16 },
      caption: 'Done. Stand it up and push it back against a wall.' },
  ],
});

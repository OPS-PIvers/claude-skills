/* A solid of revolution: the reference example for a math figure (sliders that rebuild the shape, live
   measurements, a see-through comparison solid).

   Read-back it was built from (a typical geometry figure: a right triangle against an axis, a curved arrow showing
   it spun round, the cone it makes, and a cylinder with the same base and height drawn dashed beside it):
   - Topic: a cone as the solid made by spinning a right triangle; its volume is a third of the cylinder's.
     Type: math.
   - Labels as printed: axis of rotation, r, h, cone, cylinder.
   - Colours: the triangle in the book's accent colour, the solid shaded, the cylinder as a ghost.
     Page: white paper, sans type, leader lines.
   - From the book: V = π r² h ÷ 3. Supplied by Claude: the doubling steps (r squared, h not), the partial-sweep
     volume (the part of a full turn swept so far), and the cut down the axis.
   - Geometry: exact, rebuilt from the sliders. Units: centimetres.
   - Features: Cut (no Take apart: it's an idea, not an object). Extras: sliders r, h and sweep, live volumes. */
const D = Math.PI / 180;
const coneV = p => Math.PI * p.r * p.r * p.h / 3;
const cm3 = v => Math.round(v) + ' cm³';

mountModel({
  fig: '11.2', title: 'A cone from a triangle',
  style: { paper: '#ffffff', ink: '#23262b', muted: '#5f646d', accent: '#d1495b', font: 'sans', labels: 'leader' },
  caption: 'Spin a right triangle round an axis and it sweeps out a cone. Move the sliders, or press Walk through.',
  view: { az: 32, el: 18, dist: 1.1 },
  views: { Front: { az: 0, el: 8 }, Angle: { az: 35, el: 25 }, Top: { az: 0, el: 85 } },
  params: [
    { id: 'r', name: 'Radius r', min: 1, max: 6, step: .5, value: 4, unit: 'cm' },
    { id: 'h', name: 'Height h', min: 2, max: 12, step: .5, value: 9, unit: 'cm' },
    { id: 'sweep', name: 'Spin', min: 0, max: 360, step: 5, value: 300, unit: '°', time: 3 },
  ],
  layers: [{ id: 'compare', name: 'Cylinder with the same base and height', on: false }],
  parts: [
    { id: 'axis', name: 'Axis of rotation', color: '#23262b', tap: true,
      shape: p => ({ cylinder: { r: .1, h: p.h + 4, seg: 16 } }), at: p => [0, p.h / 2, 0],
      info: 'The line the triangle spins around. The cone is the same all the way round it.' },
    { id: 'triangle', name: 'Right triangle', color: '#d1495b', rot: [0, -Math.PI / 2, 0],
      shape: p => ({ plate: { points: [[0, 0], [p.r, 0], [0, p.h]], depth: .1 } }), spin: p => [0, p.sweep * D, 0],
      info: 'Its base along the floor is the radius r; its side against the axis is the height h.' },
    { id: 'cone', name: 'Cone', color: '#5b8fd4',
      shape: p => ({ lathe: { profile: [[.001, 0], [p.r, 0], [.001, p.h]], phi: p.sweep, seg: 96 } }),
      info: 'Every point of the triangle traced a circle round the axis. Volume = π r² h ÷ 3.' },
    { id: 'cylinder', name: 'Cylinder', color: '#8a8f99', opacity: .22, group: 'compare',
      shape: p => ({ cylinder: { r: p.r, h: p.h, seg: 96 } }), at: p => [0, p.h / 2, 0],
      info: 'Same base and height as the cone. Its volume is π r² h, three times the cone’s.' },
  ],
  stats: st => [
    { label: 'Volume swept', value: cm3(coneV(st.p) * st.p.sweep / 360) },
    { label: 'Full cone', value: cm3(coneV(st.p)) },
    { label: 'Cylinder', value: cm3(coneV(st.p) * 3) },
  ],
  section: { normal: [0, 0, 1], range: [-6.5, 6.5], caption: 'Cut down the axis: the cut face is two copies of the triangle.' },
  steps: [
    { label: 'The triangle', view: { az: 30, el: 15, dist: 1.1 }, params: { sweep: 0, r: 4, h: 9 }, layers: { compare: false },
      highlight: ['triangle', 'axis'],
      caption: 'A right triangle stands against an axis. Its base is the radius r, its height h.' },
    { label: 'Spin it', view: { az: 35, el: 20 }, params: { sweep: 360 }, highlight: ['triangle', 'cone', 'axis'],
      caption: 'Spin it once round the axis. The space it sweeps through is a cone.' },
    { label: 'One third', view: { az: 20, el: 14 }, params: { sweep: 360 }, layers: { compare: true },
      highlight: ['cone', 'cylinder'],
      predict: 'The cylinder has the same base and height. How many cones of water would it take to fill it?',
      caption: 'Exactly three. A cone’s volume is a third of the cylinder’s: π r² h ÷ 3.' },
    { label: 'Double the radius', view: { az: 25, el: 16 }, params: { r: 2.5, h: 9, sweep: 360 }, layers: { compare: false },
      predict: 'Make the radius twice as big. What happens to the volume?',
      caption: 'Watch the full cone’s volume as the radius doubles from 2.5 to 5 cm.',
      beats: [{ caption: 'It grows 4 times, because the radius is squared in π r² h ÷ 3.', params: { r: 5 } }] },
    { label: 'Double the height', view: { az: 25, el: 16 }, params: { r: 3, h: 5, sweep: 360 },
      caption: 'Now double the height instead, from 5 to 10 cm.',
      beats: [{ caption: 'This time the volume only doubles: the height isn’t squared.', params: { h: 10 } }] },
    { label: 'Inside', view: { az: 0, el: 8 }, params: { r: 4, h: 9, sweep: 360 }, cut: .5,
      caption: 'Cut it down the middle: the cut face is two copies of the triangle, back to back.' },
    { label: 'Try it', view: { az: 32, el: 18 }, cut: null,
      caption: 'Now use the sliders. Any flat shape spun round an axis makes a solid of revolution.' },
  ],
});

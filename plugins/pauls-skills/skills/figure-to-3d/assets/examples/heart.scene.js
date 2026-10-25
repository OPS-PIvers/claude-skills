/* The human heart: the reference example for figure-to-3d (science, segmented meshes, layers, Take apart, Cut,
   flows, a Walk through with beats and Predict).

   Read-back it was built from (a typical middle school textbook plate of the heart, front view):
   - Topic: the human heart and the path blood takes through it. Type: science and anatomy.
   - Labels as printed: right atrium, left atrium, right ventricle, left ventricle, tricuspid valve, mitral valve,
     pulmonary valve, aortic valve, superior vena cava, inferior vena cava, aorta, pulmonary artery, pulmonary veins.
   - Colours that carry meaning: oxygen-poor side blue, oxygen-rich side red, valves pale. Page: cream paper,
     serif type, labels in columns with leader lines.
   - Process (from the book's caption): body → venae cavae → right atrium → tricuspid → right ventricle → pulmonary
     artery → lungs → pulmonary veins → left atrium → mitral → left ventricle → aorta → body.
     Supplied by Claude: the left ventricle has the thickest wall; the coronary arteries feed the heart itself.
   - Geometry: BodyParts3D (CC BY 4.0), one mesh per structure. BodyParts3D models the ventricles as the
     blood-filled space inside them, not their muscle wall: said in the ventricles' info.
   - Features: all (separate parts). Extras: layers, blood-flow dots. */
const BLUE = '#4a72b8', BLUE_D = '#3a5c9c', RED = '#c84a3e', RED_D = '#a8382f', VALVE = '#efe0b4', MUSCLE = '#d9998a';

// Paths for the blood, in the model's centimetres (front view: +x is the body's left, +y up, +z toward you)
const FROM_BODY_TOP = [[-2.5, 7.4, 0.2], [-2.6, 4.2, 0.4], [-2.6, 0.5, 1.5]];
const FROM_BODY_LOW = [[-2.6, -7.6, 0.2], [-2.6, -4.8, 0.4], [-2.6, -1.5, 1.4]];
const TO_LUNGS = [[-2.6, -0.5, 1.8], [-1.2, -2.6, 2.4], [0.4, -3.6, 3.6], [1.2, -1, 3.8], [1.5, 1.6, 3.1],
                  [1.1, 3.6, 1.6], [0.6, 4.4, -0.8], [3, 4.1, -1.8], [5, 3.8, -2.2]];
const FROM_LUNGS = [[4.3, 1, -4.6], [2.4, 0.2, -2.6], [1.6, -0.6, -1]];
const TO_BODY = [[1.6, -0.6, -1], [2.7, -2.4, 0.2], [3.2, -4, 1.2], [2.2, -1.4, 1.2], [0.9, 0.6, 0.6],
                 [0.4, 3.4, -0.2], [0.6, 6.6, -1.2], [1.2, 7.2, -3.6], [1.8, 5.4, -6]];

mountModel({
  fig: '7.3', title: 'The human heart',
  style: { paper: '#fbf7ee', ink: '#2a2622', muted: '#6e665a', accent: '#a8382f', font: 'serif', labels: 'leader' },
  caption: 'This is a human heart. Turn it, tap a part, or press Walk through.',
  view: { az: 0, el: 6 },
  layers: [
    { id: 'chambers', name: 'Chambers' }, { id: 'valves', name: 'Valves' },
    { id: 'vessels', name: 'Big blood vessels' }, { id: 'coronary', name: 'Heart’s own blood vessels' },
  ],
  parts: [
    { id: 'right-atrium', name: 'Right atrium', mesh: 'bp3d/heart/right-atrium', color: BLUE, group: 'chambers',
      info: 'Collects blood low on oxygen as it comes back from the body.' },
    { id: 'right-ventricle', name: 'Right ventricle', mesh: 'bp3d/heart/right-ventricle', color: BLUE, group: 'chambers',
      info: 'Pumps blood to the lungs. This model shows the blood-filled space inside it.' },
    { id: 'left-atrium', name: 'Left atrium', mesh: 'bp3d/heart/left-atrium', color: RED, group: 'chambers',
      info: 'Collects blood full of oxygen as it comes back from the lungs.' },
    { id: 'left-ventricle', name: 'Left ventricle', mesh: 'bp3d/heart/left-ventricle', color: RED, group: 'chambers',
      info: 'The strongest chamber: it pumps blood to the whole body. The model shows the space inside it.' },
    { id: 'tricuspid-valve', name: 'Tricuspid valve', mesh: 'bp3d/heart/tricuspid-valve', color: VALVE, group: 'valves',
      info: 'Three flaps between the right atrium and right ventricle. They only open one way.' },
    { id: 'pulmonary-valve', name: 'Pulmonary valve', mesh: 'bp3d/heart/pulmonary-valve', color: VALVE, group: 'valves',
      info: 'Lets blood out of the right ventricle into the pulmonary artery, and not back.' },
    { id: 'mitral-valve', name: 'Mitral valve', mesh: 'bp3d/heart/mitral-valve', color: VALVE, group: 'valves',
      info: 'Two flaps between the left atrium and left ventricle.' },
    { id: 'aortic-valve', name: 'Aortic valve', mesh: 'bp3d/heart/aortic-valve', color: VALVE, group: 'valves',
      info: 'Lets blood out of the left ventricle into the aorta, and not back.' },
    { id: 'papillary-muscles', name: 'Papillary muscles', mesh: 'bp3d/heart/papillary-muscles', color: MUSCLE,
      group: 'valves', label: false, info: 'Small muscles that hold the valve flaps shut while the ventricles squeeze.' },
    { id: 'superior-vena-cava', name: 'Superior vena cava', mesh: 'bp3d/heart/superior-vena-cava', color: BLUE_D,
      group: 'vessels', info: 'Brings blood back from the head and arms.' },
    { id: 'inferior-vena-cava', name: 'Inferior vena cava', mesh: 'bp3d/heart/inferior-vena-cava', color: BLUE_D,
      group: 'vessels', info: 'Brings blood back from the lower body.' },
    { id: 'pulmonary-trunk', name: 'Pulmonary artery', mesh: 'bp3d/heart/pulmonary-trunk', color: BLUE_D,
      group: 'vessels', info: 'Carries blood from the right ventricle to both lungs.' },
    { id: 'pulmonary-veins', name: 'Pulmonary veins', mesh: 'bp3d/heart/pulmonary-veins', color: RED_D,
      group: 'vessels', info: 'Bring blood full of oxygen back from the lungs.' },
    { id: 'aorta', name: 'Aorta', mesh: 'bp3d/heart/aorta', color: RED_D, group: 'vessels',
      info: 'The body’s biggest artery. It arches over the heart and carries blood to the whole body.' },
    { id: 'coronary-arteries', name: 'Coronary arteries', mesh: 'bp3d/heart/coronary-arteries', color: '#d8362a',
      group: 'coronary', info: 'Bring the heart muscle its own supply of blood full of oxygen.' },
    { id: 'cardiac-veins', name: 'Cardiac veins', mesh: 'bp3d/heart/cardiac-veins', color: '#35508f',
      group: 'coronary', label: false, info: 'Drain used blood from the heart muscle back into the right atrium.' },
  ],
  flows: {
    'in-top': { path: FROM_BODY_TOP, color: '#1f3f86', dots: 6 },
    'in-low': { path: FROM_BODY_LOW, color: '#1f3f86', dots: 6 },
    lungs: { path: TO_LUNGS, color: '#1f3f86', dots: 16 },
    back: { path: FROM_LUNGS, color: '#9e1f16', dots: 6 },
    body: { path: TO_BODY, color: '#9e1f16', dots: 16 },
  },
  apart: {
    flow: 'blood',
    order: ['superior-vena-cava', 'right-atrium', 'right-ventricle', 'pulmonary-trunk',
            'pulmonary-veins', 'left-atrium', 'left-ventricle', 'aorta'],
    offsets: {
      'superior-vena-cava': [-6, 5, 0], 'inferior-vena-cava': [-6, -4, 0], 'right-atrium': [-6.5, .5, 1],
      'tricuspid-valve': [-4, -3, 3], 'right-ventricle': [-2.5, -5, 5], 'pulmonary-valve': [-1, 2.5, 6],
      'pulmonary-trunk': [-.5, 6.5, 3], 'pulmonary-veins': [6, 3, -5], 'left-atrium': [6.5, 1, -2],
      'mitral-valve': [5.5, -2.5, -.5], 'left-ventricle': [6.5, -5, 1], 'aortic-valve': [3, 3, 2],
      'aorta': [3, 8.5, -1.5], 'papillary-muscles': [3, -7, 5], 'coronary-arteries': [0, 0, 10], 'cardiac-veins': [0, 0, 10],
    },
    caption: 'Blood goes vena cava, right atrium, right ventricle, lungs, left atrium, left ventricle, aorta.',
    predict: 'Blood passes through the heart twice on each trip round the body. Why twice?',
  },
  section: { normal: [0, 0, 1], range: [-6, 6], caption: 'Cut front to back, like most book drawings. Slide to look deeper.' },
  steps: [
    { label: 'Chambers', view: { az: 0, el: 6 }, highlight: ['right-atrium', 'right-ventricle', 'left-atrium', 'left-ventricle'],
      caption: 'The heart has four chambers: two atria on top and two ventricles below.' },
    { label: 'In from the body', view: { az: -25, el: 8 }, flows: ['in-top', 'in-low'],
      highlight: ['superior-vena-cava', 'inferior-vena-cava', 'right-atrium'],
      caption: 'Blood low on oxygen comes back from the body into the right atrium.' },
    { label: 'Through a valve', view: { az: -10, el: 4 }, flows: ['lungs'],
      highlight: ['right-atrium', 'tricuspid-valve', 'right-ventricle'],
      predict: 'The right atrium squeezes. What stops the blood splashing back the way it came?',
      caption: 'The atrium squeezes blood through the tricuspid valve into the right ventricle.',
      beats: [{ caption: 'The valve’s flaps only open one way, so the blood can’t flow back.' }] },
    { label: 'To the lungs', view: { az: 15, el: 10 }, flows: ['lungs'],
      highlight: ['right-ventricle', 'pulmonary-valve', 'pulmonary-trunk'],
      caption: 'The right ventricle pumps it up the pulmonary artery to the lungs to pick up oxygen.' },
    { label: 'Back from the lungs', view: { az: 150, el: 12 }, flows: ['back'],
      highlight: ['pulmonary-veins', 'left-atrium'],
      caption: 'Blood full of oxygen comes back from the lungs into the left atrium.',
      beats: [{ caption: 'It passes through the mitral valve into the left ventricle.',
                highlight: ['left-atrium', 'mitral-valve', 'left-ventricle'], flows: ['back', 'body'] }] },
    { label: 'Out to the body', view: { az: 20, el: 14 }, flows: ['body'],
      highlight: ['left-ventricle', 'aortic-valve', 'aorta'],
      predict: 'This blood has to reach your toes. Which chamber has to push hardest?',
      caption: 'The left ventricle pumps hardest, sending blood up the aorta to the whole body.' },
    { label: 'The heart’s own supply', view: { az: 35, el: 10 }, layers: { coronary: true },
      highlight: ['coronary-arteries', 'cardiac-veins'],
      caption: 'Coronary arteries on the outside bring the heart muscle its own blood.' },
    { label: 'Both sides at once', view: { az: 0, el: 6 }, flows: ['in-top', 'in-low', 'lungs', 'back', 'body'],
      caption: 'Both sides squeeze together, about 70 times a minute when you rest.' },
  ],
});

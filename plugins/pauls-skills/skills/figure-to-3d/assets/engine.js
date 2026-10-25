/* figure-to-3d engine. scripts/build.mjs bundles this file with Three.js into one page; the scene calls
   mountModel({...}). The engine owns the look (the textbook's style, soft toon shading, ink outlines), the controls
   (spin, zoom, tap a part) and the teaching layer (caption, labels, Predict, Walk through, Take apart, cross-section,
   layers, flows, Present, Credits). The scene owns the object: which parts, what they're called, how it works.

   mountModel({
     fig: '7.3', title: 'The human heart',     // shown as "Figure 7.3  The human heart"
     source?: 'Biology, ch. 7',                // the book, only if the person names it; shown in Credits
     style?: { paper, ink, muted, accent, cut, font: 'serif'|'sans', labels: 'leader'|'boxed'|'numbered' },
              //   sampled from the photo in the read-back. cut = the colour of cut faces (default: each part darker)
     parts: [{ id, name, info?,                // info: one plain sentence, shown when the part is tapped
               mesh?: 'bp3d/heart/aorta',      // a mesh-library id (build.mjs inlines it), or
               shape?: { box|cylinder|sphere|cone|torus|lathe|tube|gear: {…} },   // a procedural part (see SHAPES)
               at?: [x,y,z], rot?: [x,y,z],    // where a procedural part sits (cm, radians); it turns about `at`
               offset?: [x,y,z],               // moves the shape off its own origin (a crank handle on an axle)
               opacity?: 1,                    // below 1: see-through (a ghost cylinder to compare against)
               spin?: p => [x,y,z],            // a turn that follows the sliders (radians)
               // shape and at may also be functions of the slider values: p => ({ lathe: {…} }), p => [x,y,z]
               color: '#c0392b', group?: 'chambers',   // group = a layer id
               label?: false | [x,y,z],        // false: never labelled; a point: the label's anchor (default: auto)
               tap?: false }],                 // false: tapping it does nothing (a case, a stand)
     layers?: [{ id, name, on?: true }],       // switches that show and hide groups of parts
     view?: { az: 0, el: 10, dist?: 1 },       // the opening camera: degrees round and up from the front
     views?: { name: { az, el, dist? } },      // the view buttons (default: Front, Back, Left, Top)
     flows?: { id: { path: [partId | [x,y,z]], color, dots?: 14, speed?: 1, loop?: true } },
              //   dots that travel a path (blood, water, current), drawn over the model like a book's arrows
     apart?: { flow: 'blood', order: [partId…], offsets?: { partId: [x,y,z] }, spread?: 1,
               caption: 'sentence', predict?: 'question', path?: [partId | [x,y,z]] },
              //   Take apart: parts slide out (offsets, or away from the centre ×spread); a dashed line runs
              //   through `order` (or `path`). Parts not in order or offsets move outward too.
     section?: { normal: [1,0,0], range?: [min,max], caption?: 'sentence' },   // the Cut slider
     steps: [{ label, caption, predict?, view?: name | {az,el,dist}, highlight?: [ids], layers?: {id: bool},
               flows?: [flowIds], apart?: 0|1, cut?: null | 0..1, move?: { partId: [dx,dy,dz] },
               run?: bool, speed?: n, reset?: true,    // motion: start or stop it, set the speed, zero the count
               params?: { id: value },         // sliders: where this step slides them to (beats take params too)
               adds?: [partIds], tray?: true, manual?: '3',   // assembly: parts this step puts in, show the parts
                                               //   list, the manual's own step number (default: the step's)
               beats?: [{ caption, highlight?, flows?, move?, params? }] }],
              //   move: where parts sit in this step, as offsets from where they're built (a piston pressed
              //   down, a lever thrown). Parts a step doesn't move go back home.
              //   Walk through. A step with beats plays them in order, each held READ_S(caption) seconds.
     motion?: { drive: (turns) => ({ partId: { rot?: [x,y,z], at?: [dx,dy,dz] } }), speed?: { value: .5, min: .1, max: 2,
                name: 'Speed', unit: 'turns a second' }, running?: false },
              //   a machine that runs: `turns` counts up while it runs (speed × seconds); drive says where each
              //   moving part is at that point. Adds Run/Stop and a speed slider. Steps take run, speed, reset.
     params?: [{ id, name, min, max, step?, value, unit?, time? }],
              //   sliders (math): shapes, positions and spins that are functions of them rebuild as they move.
              //   time = seconds a step takes to slide it (default 1.2)
     assembly?: { tray?: { partId: [dx,dy,dz] }, from?: { partId: [dx,dy,dz] } },
              //   an instruction manual: in Walk through only the parts added so far are there; a step's `adds`
              //   fly in from `from` (default: from above) or slide over from the tray. tray: where each part lies
              //   in the parts list (offsets from where it's built). Before Walk through the piece is finished.
     stats?: st => [{ label, value }],          // live readouts, top right. st: { turns, speed, running, step, p }
     caption: 'sentence',                      // the caption before Walk through starts
   })
   Testing hooks: window.F3D (ready, go, apart, cut, view, labels, info) and ?step= ?apart=1 ?cut=0.4 ?view=
   ?az= ?el= ?labels=0 ?predict=1 ?present=1. Errors and early captions are recorded on <html data-errors>. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const html = document.documentElement;
const err = m => { html.dataset.errors = (html.dataset.errors || '') + ' ' + m + ';'; };
addEventListener('error', e => err(e.message));
addEventListener('unhandledrejection', e => err(String(e.reason && e.reason.message || e.reason)));

// A caption must stay up about 3 words a second plus one, never under 3 s (the ops-figures rule).
export const READ_S = s => Math.max(3, String(s).trim().split(/\s+/).length / 3 + 1);
const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const $ = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const param = new URLSearchParams(location.search);

const FONTS = {
  serif: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, 'Times New Roman', serif",
  sans: "'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
};

const CSS = `
:root{--paper:#f7f3ea;--ink:#222;--muted:#6b6458;--accent:#8c2f28;--line:#cfc6b4;--font:${FONTS.serif};--scale:1}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:var(--paper);color:var(--ink);font-family:var(--font)}
button,input{font:inherit;color:inherit}
.f3d{display:grid;grid-template-rows:auto 1fr auto auto auto;height:100%;max-width:1400px;margin:0 auto;padding-block:12px 14px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));gap:8px}
.f3d-head{display:flex;align-items:baseline;gap:.7em;flex-wrap:wrap;border-bottom:1.5px solid var(--ink);padding-bottom:6px}
.f3d-fig{font-weight:700;letter-spacing:.02em;font-size:calc(15px*var(--scale))}
.f3d-title{font-size:calc(19px*var(--scale));font-weight:600}
.f3d-tools{margin-left:auto;display:flex;gap:6px;flex-wrap:wrap}
.f3d-stage{position:relative;min-height:240px;overflow:hidden;touch-action:none}
.f3d-stage canvas{display:block;width:100%;height:100%;outline:none}
.f3d-over{position:absolute;inset:0;pointer-events:none}
.f3d-over svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.f3d-lab{position:absolute;white-space:nowrap;font-size:calc(14px*var(--scale));line-height:1.2;padding:1px 4px;transform:translateY(-50%);transition:opacity .2s;color:var(--ink);background:color-mix(in srgb,var(--paper) 82%,transparent);border-radius:3px}
.f3d-lab.r{text-align:left}.f3d-lab.l{text-align:right}
.f3d-boxed .f3d-lab{border:1px solid var(--ink);background:var(--paper);border-radius:0}
.f3d-lab.on{color:var(--accent);font-weight:700}
.f3d-lab.dim{opacity:.38}
.f3d-num{position:absolute;width:calc(20px*var(--scale));height:calc(20px*var(--scale));margin:calc(-10px*var(--scale)) 0 0 calc(-10px*var(--scale));border-radius:50%;background:var(--paper);border:1.5px solid var(--ink);font-size:calc(11px*var(--scale));font-weight:700;display:grid;place-items:center}
.f3d-legend{position:absolute;right:0;top:0;font-size:calc(13px*var(--scale));background:color-mix(in srgb,var(--paper) 90%,transparent);padding:6px 8px;line-height:1.5;margin:0;list-style:none}
.f3d-card{position:absolute;left:10px;bottom:10px;max-width:min(340px,70%);background:var(--paper);border:1.5px solid var(--ink);padding:8px 10px;font-size:calc(14px*var(--scale));box-shadow:3px 3px 0 color-mix(in srgb,var(--ink) 18%,transparent)}
.f3d-card b{display:block;font-size:calc(16px*var(--scale));margin-bottom:2px}
.f3d-card[hidden]{display:none}
.f3d-cap{height:calc(4.6em*var(--scale));overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;font-size:calc(17px*var(--scale));line-height:1.35;border-top:1px solid var(--line);padding-top:6px}
.f3d-cap p{margin:0}
.f3d-cap .old{color:var(--muted);font-size:.86em;opacity:.7}
.f3d-cap .pred b{color:var(--accent)}
.f3d-cap .pred button{margin-left:.5em}
.f3d-bar{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.f3d-bar .sep{flex:1}
.f3d button{background:var(--paper);border:1.5px solid var(--ink);border-radius:4px;padding:5px 11px;cursor:pointer;font-size:calc(14px*var(--scale));line-height:1.2}
.f3d button:hover{background:color-mix(in srgb,var(--accent) 10%,var(--paper))}
.f3d button.primary{background:var(--accent);border-color:var(--accent);color:var(--paper)}
.f3d button[aria-pressed=true]{background:var(--ink);color:var(--paper)}
.f3d button:disabled{opacity:.4;cursor:default}
.f3d button:focus-visible,.f3d input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.f3d-step{font-size:calc(13px*var(--scale));color:var(--muted);min-width:5.5em;text-align:center}
.f3d-sw{display:inline-flex;align-items:center;gap:4px;font-size:calc(13px*var(--scale));color:var(--muted);cursor:pointer}
.f3d-cut{display:inline-flex;align-items:center;gap:6px;font-size:calc(13px*var(--scale))}
.f3d-cut[hidden]{display:none}
.f3d-badge{position:absolute;left:0;top:0;min-width:1.6em;padding:2px 10px;border:2.5px solid var(--ink);background:var(--paper);font-size:calc(34px*var(--scale));font-weight:800;line-height:1.15;text-align:center;font-variant-numeric:tabular-nums}
.f3d-badge[hidden]{display:none}
.f3d-params{display:flex;flex-wrap:wrap;gap:6px 18px;align-items:center}
.f3d-params label{display:inline-flex;align-items:center;gap:6px;font-size:calc(14px*var(--scale))}
.f3d-params input{width:150px;accent-color:var(--accent)}
.f3d-params output{min-width:4.5em;font-variant-numeric:tabular-nums;font-weight:700}
.f3d-stats{position:absolute;right:0;top:0;display:flex;gap:14px;margin:0;padding:4px 6px;background:color-mix(in srgb,var(--paper) 88%,transparent);font-variant-numeric:tabular-nums}
.f3d-stats div{display:flex;flex-direction:column;align-items:flex-end}
.f3d-stats dt{font-size:calc(12px*var(--scale));color:var(--muted);order:2}
.f3d-stats dd{margin:0;font-size:calc(20px*var(--scale));font-weight:700;order:1}
.f3d-cut input{width:140px;accent-color:var(--accent)}
.f3d-pop{position:absolute;right:16px;top:52px;z-index:5;background:var(--paper);border:1.5px solid var(--ink);padding:10px 12px;max-width:min(420px,90vw);font-size:13px;line-height:1.45;box-shadow:3px 3px 0 color-mix(in srgb,var(--ink) 18%,transparent)}
.f3d-pop[hidden]{display:none}
.f3d-pop h2{font-size:14px;margin:0 0 4px}
.f3d-pop p{margin:0 0 6px}
.f3d-pop label{display:flex;gap:6px;align-items:center;padding:2px 0;cursor:pointer}
.present .f3d{max-width:none;--scale:1.35}
.present .f3d-tools .np{display:none}
@media (max-width:640px){.f3d-cut input{width:100px}.f3d-title{font-size:calc(17px*var(--scale))}}
`;

// ---- procedural shapes (cm). Each returns a BufferGeometry. ----
const SHAPES = {
  box: ({ size = [1,1,1] }) => new THREE.BoxGeometry(...size),
  cylinder: ({ r = .5, r2, h = 1, seg = 48 }) => new THREE.CylinderGeometry(r2 ?? r, r, h, seg),
  sphere: ({ r = .5, seg = 48 }) => new THREE.SphereGeometry(r, seg, Math.round(seg * .6)),
  cone: ({ r = .5, h = 1, seg = 48 }) => new THREE.ConeGeometry(r, h, seg),
  torus: ({ r = 1, tube = .2, seg = 64 }) => new THREE.TorusGeometry(r, tube, 16, seg),
  // phi: how far round it goes, in degrees (a partly swept solid); it starts facing +Z
  lathe: ({ profile, seg = 64, phi = 360 }) => new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)),
    Math.max(2, Math.round(seg * Math.max(phi, .5) / 360)), 0, THREE.MathUtils.degToRad(Math.max(phi, .5))),
  // a flat shape in the XY plane (a triangle, a net), depth thick along Z
  plate: ({ points, depth = .1 }) => new THREE.ExtrudeGeometry(new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y))),
    { depth, bevelEnabled: false }).translate(0, 0, -depth / 2),
  tube: ({ points, r = .2, seg = 64, closed = false }) =>
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), closed), seg, r, 12, closed),
  // a spur gear in the XY plane, w thick along Z: pitch radius = m × teeth / 2, a tooth centred on +X at angle 0
  gear: ({ teeth = 12, m = .5, w = 1, hole = 0 }) => {
    const r = m * teeth / 2, tip = r + m, root = r - 1.25 * m, p = 2 * Math.PI / teeth, sh = new THREE.Shape();
    const pts = [];                                  // each tooth: up a flank, across the tip, down the other flank
    for (let i = 0; i < teeth; i++)
      for (const [rad, da] of [[root, -.3], [tip, -.13], [tip, .13], [root, .3]]) pts.push([rad * Math.cos((i + da) * p), rad * Math.sin((i + da) * p)]);
    sh.moveTo(...pts[0]); for (const q of pts.slice(1)) sh.lineTo(...q);
    if (hole) { const h = new THREE.Path(); h.absarc(0, 0, hole, 0, Math.PI * 2, true); sh.holes.push(h); }
    return new THREE.ExtrudeGeometry(sh, { depth: w, bevelEnabled: false, curveSegments: 24 }).translate(0, 0, -w / 2);
  },
};

function toonRamp() {
  const t = new THREE.DataTexture(new Uint8Array([120, 170, 215, 255]), 4, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
}

function decodeB64(s) { const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u.buffer; }
function readJSON(id) { const e = document.getElementById(id); return e ? JSON.parse(e.textContent) : null; }

export async function mountModel(cfg) {
  let doneReady; const ready = new Promise(r => doneReady = r);
  window.F3D = { ready, cfg };
  document.title = cfg.title;
  const style = { paper: '#f7f3ea', ink: '#222222', muted: '#6b6458', accent: '#8c2f28', font: 'serif', labels: 'leader', ...cfg.style };
  const st0 = document.createElement('style'); st0.textContent = CSS; document.head.appendChild(st0);
  const rs = html.style;
  rs.setProperty('--paper', style.paper); rs.setProperty('--ink', style.ink); rs.setProperty('--muted', style.muted);
  rs.setProperty('--accent', style.accent); rs.setProperty('--font', FONTS[style.font] || style.font);
  rs.setProperty('--line', `color-mix(in srgb, ${style.ink} 25%, ${style.paper})`);

  // ---- page skeleton ----
  const root = $('div', 'f3d' + (style.labels === 'boxed' ? ' f3d-boxed' : ''));
  const head = $('header', 'f3d-head');
  if (cfg.fig) head.append($('span', 'f3d-fig', 'Figure ' + cfg.fig));
  head.append($('h1', 'f3d-title', cfg.title)); head.querySelector('h1').style.margin = '0';
  const tools = $('div', 'f3d-tools'); head.append(tools);
  const stage = $('div', 'f3d-stage'); const over = $('div', 'f3d-over');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); over.append(svg);
  const card = $('div', 'f3d-card'); card.hidden = true; card.setAttribute('role', 'status');
  const cap = $('div', 'f3d-cap'); cap.setAttribute('aria-live', 'polite');
  const bar = $('div', 'f3d-bar');
  root.append(head, stage, cap, bar);
  document.body.append(root);
  stage.append(over, card);

  // ---- three ----
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(new THREE.Color(style.paper), 1);
  renderer.localClippingEnabled = true;
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('aria-label', cfg.title + ', a 3D model. Drag to turn it, scroll or pinch to zoom, tap a part to name it.');
  stage.prepend(renderer.domElement);
  const effect = new OutlineEffect(renderer, { defaultThickness: .0035, defaultColor: new THREE.Color(style.ink).toArray(), defaultAlpha: .9 });
  effect.autoClear = true;           // OutlineEffect leaves this undefined, which skips the clear and ghosts old frames
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 2000);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9a9080, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-.6, .9, 1); camera.add(key); scene.add(camera);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = .12; controls.enablePan = false;

  // ---- parts ----
  const meshes = readJSON('f3d-meshes') || {};
  const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
  await MeshoptDecoder.ready;
  const ramp = toonRamp();
  const clip = new THREE.Plane(new THREE.Vector3(1, 0, 0), 1e6);
  const model = new THREE.Group(); scene.add(model);
  const parts = new Map();          // id -> { cfg, obj, mat, home, center, radius, cands, anchor }
  const P0 = Object.fromEntries((cfg.params || []).map(q => [q.id, q.value]));   // slider values at the start
  // a procedural part's geometry, with its rot and offset baked in (so bounds and anchors are in model space)
  function shapeGeo(p, pv = P0) {
    const spec = typeof p.shape === 'function' ? p.shape(pv) : p.shape;
    const [kind, opts] = Object.entries(spec)[0];
    if (!SHAPES[kind]) { err('unknown shape ' + kind); return null; }
    const geo = SHAPES[kind](opts);
    if (p.rot) geo.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...p.rot)));
    if (p.offset) geo.translate(...p.offset);
    return geo;
  }
  const darken = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>',
      '#include <dithering_fragment>\n if (!gl_FrontFacing) gl_FragColor.rgb *= 0.6;');
  };
  for (const p of cfg.parts) {
    let geo;
    if (p.mesh) {
      if (!meshes[p.mesh]) { err('mesh not inlined: ' + p.mesh); continue; }
      const g = await loader.parseAsync(decodeB64(meshes[p.mesh]), '');
      // meshopt quantization keeps each mesh's real scale and offset on its node: bake it into float geometry
      g.scene.updateMatrixWorld(true);
      let found; g.scene.traverse(o => { if (o.isMesh && !found) found = o; });
      geo = new THREE.BufferGeometry();
      for (const [name, a] of Object.entries(found.geometry.attributes)) {
        const f = new Float32Array(a.count * a.itemSize);
        for (let i = 0; i < a.count; i++) for (let k = 0; k < a.itemSize; k++) f[i * a.itemSize + k] = a.getComponent(i, k);
        geo.setAttribute(name, new THREE.BufferAttribute(f, a.itemSize));
      }
      geo.setIndex(found.geometry.index);
      geo.applyMatrix4(found.matrixWorld);
    } else if (p.shape) {
      geo = shapeGeo(p); if (!geo) continue;
    } else { err('part ' + p.id + ' has no mesh or shape'); continue; }
    // a see-through part draws only its outside, or its inside would show through as the darker cut colour
    const mat = new THREE.MeshToonMaterial({ color: new THREE.Color(p.color || '#bbbbbb'), gradientMap: ramp,
      side: (p.opacity ?? 1) < 1 ? THREE.FrontSide : THREE.DoubleSide, clippingPlanes: [clip], transparent: false });
    mat.onBeforeCompile = darken;
    mat.userData.outlineParameters = { thickness: .0035, color: new THREE.Color(style.ink).toArray(), alpha: .9, visible: true };
    const obj = new THREE.Mesh(geo, mat); obj.name = p.id; obj.userData.part = p.id;
    const at = typeof p.at === 'function' ? p.at(P0) : p.at;
    if (at) obj.position.set(...at);
    if (p.mesh && p.rot) geo.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...p.rot)));
    if (p.spin) obj.rotation.set(...p.spin(P0));
    model.add(obj);
    geo.computeBoundingBox(); geo.computeBoundingSphere();
    parts.set(p.id, { cfg: p, obj, mat, home: obj.position.clone() });
  }
  // the model's centre and size, then each part's centre and label anchor
  const box = new THREE.Box3().setFromObject(model), mid = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()), radius = size.length() / 2;
  for (const P of parts.values()) measure(P);
  // a part's centre, size and label anchor candidates (again whenever a slider rebuilds it)
  function measure(P) {
    const g = P.obj.geometry; g.computeBoundingBox(); g.computeBoundingSphere();
    const c = g.boundingBox.getCenter(new THREE.Vector3()).add(P.home);
    P.center = c; P.radius = g.boundingSphere.radius;
    // label anchors: a point given by the scene, or candidates on the part's surface facing six ways plus
    // outward; checkOcclusion() picks the one that faces the camera, isn't hidden and isn't cut away
    if (Array.isArray(P.cfg.label)) { P.cands = [{ p: new THREE.Vector3(...P.cfg.label), d: null }]; P.anchor = P.cands[0].p; return; }
    const out = c.clone().sub(mid); if (out.lengthSq() < 1e-6) out.set(0, 0, 1); out.normalize();
    const dirs = [out, ...[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].map(a => new THREE.Vector3(...a))];
    const pos = g.attributes.position, v = new THREE.Vector3(), step = Math.max(1, Math.floor(pos.count / 2500));
    P.cands = dirs.map(d => {
      let best = -Infinity; const bv = c.clone();
      for (let i = 0; i < pos.count; i += step) {
        v.fromBufferAttribute(pos, i).add(P.home).sub(c);
        const along = v.dot(d), off = Math.sqrt(Math.max(0, v.lengthSq() - along * along));
        const sc = along - .8 * off;                    // far out along d, but near the line through the centre
        if (sc > best) { best = sc; bv.copy(v).add(c); }
      }
      return { p: bv.lerp(c, .06), d };
    });
    P.anchor = P.cands[0].p;
  }
  // how far out the parts go when taken apart (for framing)
  let apartRadius = radius;
  if (cfg.apart) {
    const b2 = new THREE.Box3();
    for (const [id, P] of parts) {
      const o = cfg.apart.offsets?.[id] ? new THREE.Vector3(...cfg.apart.offsets[id]) : P.center.clone().sub(mid).multiplyScalar(.9 * (cfg.apart.spread ?? 1));
      const bb = P.obj.geometry.boundingBox.clone().translate(P.home).translate(o); b2.union(bb);
    }
    const far = Math.max(...[...Array(8)].map((_, i) => new THREE.Vector3(i & 1 ? b2.max.x : b2.min.x, i & 2 ? b2.max.y : b2.min.y, i & 4 ? b2.max.z : b2.min.z).distanceTo(mid)));
    apartRadius = Math.max(radius, far * .9);
  }

  // how far out the parts list goes (for framing)
  let trayRadius = radius;
  if (cfg.assembly?.tray) {
    const b3 = new THREE.Box3();
    for (const [id, P] of parts) b3.union(P.obj.geometry.boundingBox.clone().translate(P.home).translate(new THREE.Vector3(...(cfg.assembly.tray[id] || [0, 0, 0]))));
    trayRadius = Math.max(radius, ...[...Array(8)].map((_, i) => new THREE.Vector3(i & 1 ? b3.max.x : b3.min.x, i & 2 ? b3.max.y : b3.min.y, i & 4 ? b3.max.z : b3.min.z).distanceTo(mid)) .map(d => d * .85));
  }

  // ---- state ----
  const S = { step: -1, pending: null, beat: 0, highlight: null, flows: new Set(), ex: 0, exTo: 0, cut: null,
    labels: param.get('labels') !== '0', predict: param.get('predict') === '1', asked: new Set(),
    layers: Object.fromEntries((cfg.layers || []).map(l => [l.id, l.on !== false])), picked: null,
    turns: 0, speed: cfg.motion?.speed?.value ?? .5, running: !!cfg.motion?.running, p: { ...P0 },
    hidden: new Set(), tray: false };
  let dirty = true; const anims = new Set();
  const invalidate = () => { dirty = true; };
  controls.addEventListener('change', invalidate);

  // ---- camera views ----
  const views = cfg.views || { Front: { az: 0, el: 8 }, Back: { az: 180, el: 8 }, Left: { az: -90, el: 8 }, Top: { az: 0, el: 80 } };
  // the distance that fits the model (or, as it comes apart, the apart pose) in the view
  const baseDist = (ex = S.ex) => {
    const vf = THREE.MathUtils.degToRad(camera.fov) / 2, hf = Math.atan(Math.tan(vf) * camera.aspect);
    const grow = (S.tray ? trayRadius : radius + (apartRadius - radius) * ease(ex)) / radius;
    // fit the height and the widest side as well as the bounding sphere, so a tall bookcase or a long trumpet fits
    const rV = Math.max(radius * .76, size.y / 2 * 1.22), rH = Math.max(radius * .76, Math.max(size.x, size.z) / 2 * 1.08);
    return grow * Math.max(rV / Math.sin(vf), rH / Math.sin(hf));
  };
  const D2R = THREE.MathUtils.degToRad;
  const sph = () => { const o = camera.position.clone().sub(mid), d = o.length();
    return { az: Math.atan2(o.x, o.z), el: Math.asin(THREE.MathUtils.clamp(o.y / d, -1, 1)), d }; };
  const place = (az, el, d) => { camera.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(d).add(mid); camera.lookAt(mid); };
  controls.target.copy(mid);
  function setView(v, instant) {
    if (typeof v === 'string') v = views[v] || cfg.views?.[v];
    if (!v) return;
    const to = { az: D2R(v.az || 0), el: D2R(v.el || 0), d: baseDist() * (v.dist || 1) };
    if (instant) { place(to.az, to.el, to.d); controls.update(); invalidate(); return; }
    const from = sph(); let daz = to.az - from.az; daz = Math.atan2(Math.sin(daz), Math.cos(daz));   // the short way round
    tween(.9, k => place(from.az + daz * k, from.el + (to.el - from.el) * k, from.d + (to.d - from.d) * k));
  }
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;   // camera moves and take apart jump instead
  function tween(sec, fn, done) {
    const a = { t: 0, sec: still ? .001 : sec, fn, done }; anims.add(a); invalidate(); return a;
  }

  // ---- take apart ----
  const exOffset = id => {
    const o = cfg.apart?.offsets?.[id]; if (o) return new THREE.Vector3(...o);
    const P = parts.get(id); const d = P.center.clone().sub(mid);
    return d.multiplyScalar(.9 * (cfg.apart?.spread ?? 1));
  };
  // a part sits at home + its step offset (move) + its take-apart offset
  const mv = new Map([...parts.keys()].map(id => [id, new THREE.Vector3()]));
  function setMove(move = {}, sec = .45) {
    const from = new Map([...mv].map(([id, v]) => [id, v.clone()]));
    const to = new Map([...mv.keys()].map(id => [id, new THREE.Vector3(...(move[id] || [0, 0, 0]))]));
    if ([...mv].every(([id, v]) => v.distanceTo(to.get(id)) < 1e-6)) return;
    tween(sec, k => { for (const [id, v] of mv) v.lerpVectors(from.get(id), to.get(id), k); applyApart(); });
  }
  // motion: where the drive puts each moving part at S.turns
  let drv = {};
  function applyDrive() {
    if (!cfg.motion) return;
    drv = cfg.motion.drive(S.turns) || {};
    for (const [id, P] of parts) { const d = drv[id]; if (d?.rot) P.obj.rotation.set(...d.rot); }
    applyApart();
  }
  function applyApart() {
    const k = ease(S.ex);
    for (const [id, P] of parts) {
      P.obj.position.copy(P.home).add(mv.get(id)).addScaledVector(exOffset(id), k);
      if (drv[id]?.at) P.obj.position.add(new THREE.Vector3(...drv[id].at));
    }
    drawPath(S.ex > .02 ? pathPoints(cfg.apart?.path || cfg.apart?.order || [], true) : null, Math.min(1, S.ex * 1.4));
  }
  // the path through the parts: thick dashes with an arrowhead on each leg, drawn over the model
  const MAXD = 400, dashR = radius * .007, dashL = radius * .035, gapL = radius * .025;
  const dashMat = new THREE.MeshBasicMaterial({ color: style.accent, depthTest: false, transparent: true });
  const dashes = new THREE.InstancedMesh(new THREE.CylinderGeometry(dashR, dashR, 1, 6).translate(0, .5, 0), dashMat, MAXD);
  const heads = new THREE.InstancedMesh(new THREE.ConeGeometry(dashR * 3.2, dashR * 8, 12).translate(0, dashR * 4, 0), dashMat, 32);
  for (const m of [dashes, heads]) { m.renderOrder = 10; m.visible = false; m.frustumCulled = false; scene.add(m); }
  const Y = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1);
  function drawPath(pts, alpha) {
    dashes.visible = heads.visible = !!pts; if (!pts) return;
    dashMat.opacity = alpha;
    let n = 0, h = 0;
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = pts[i], b = pts[i + 1], dir = b.clone().sub(a), len = dir.length(); if (len < 1e-6) continue; dir.normalize();
      q.setFromUnitVectors(Y, dir);
      for (let t = 0; t < len - dashR * 8 && n < MAXD; t += dashL + gapL) {
        const l = Math.min(dashL, len - dashR * 8 - t);
        dashes.setMatrixAt(n++, new THREE.Matrix4().compose(a.clone().addScaledVector(dir, t), q, new THREE.Vector3(1, l, 1)));
      }
      if (h < 32) heads.setMatrixAt(h++, new THREE.Matrix4().compose(b.clone().addScaledVector(dir, -dashR * 8), q, one));
    }
    dashes.count = n; heads.count = h;
    dashes.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true;
  }
  function pathPoints(list, moved) {
    return list.map(e => {
      if (Array.isArray(e)) return new THREE.Vector3(...e);
      const P = parts.get(e); if (!P) { err('path names unknown part ' + e); return mid.clone(); }
      return P.center.clone().add(moved ? P.obj.position.clone().sub(P.home) : new THREE.Vector3());
    });
  }
  function setApart(v, instant) {
    S.exTo = v ? 1 : 0;
    if (instant) { const zoom = sph().d / baseDist(S.ex); S.ex = S.exTo; applyApart(); const c = sph(); place(c.az, c.el, zoom * baseDist(S.ex)); invalidate(); return; }
    const from = S.ex, to = S.exTo, zoom = sph().d / baseDist(from);     // keep the person's zoom as it comes apart
    tween(1.3, k => { S.ex = from + (to - from) * k; applyApart(); const c = sph(); place(c.az, c.el, zoom * baseDist(S.ex)); });
  }

  // ---- cross-section ----
  const sec = cfg.section;
  const secN = new THREE.Vector3(...(sec?.normal || [1, 0, 0])).normalize();
  const secRange = sec?.range || (() => { const c = mid.dot(secN), h = radius; return [c - h, c + h]; })();
  function setCut(v) {
    S.cut = v;
    if (v == null) clip.set(secN, 1e6);
    else clip.set(secN.clone().negate(), secRange[0] + (secRange[1] - secRange[0]) * v);
    invalidate();
  }

  // ---- flows: dots travelling a path, drawn over the model ----
  const flowObjs = {};
  for (const [id, f] of Object.entries(cfg.flows || {})) {
    const pts = pathPoints(f.path, false);
    const curve = new THREE.CatmullRomCurve3(pts, !!f.closed, 'centripetal');
    const n = f.dots || 14;
    const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(radius * .018, 12, 8),
      new THREE.MeshBasicMaterial({ color: f.color || style.accent, depthTest: false, transparent: true }), n);
    dots.renderOrder = 11; dots.visible = false; dots.frustumCulled = false; scene.add(dots);
    flowObjs[id] = { f, curve, dots, n, t: 0 };
  }
  const m4 = new THREE.Matrix4();
  function stepFlows(dt) {
    let any = false;
    for (const [id, F] of Object.entries(flowObjs)) {
      F.dots.visible = S.flows.has(id); if (!F.dots.visible) continue; any = true;
      F.t = (F.t + dt * .09 * (F.f.speed || 1)) % 1;
      for (let i = 0; i < F.n; i++) {
        const u = Math.min(.9999, (F.t + i / F.n) % 1), p = F.curve.getPointAt(u);
        m4.makeTranslation(p.x, p.y, p.z); F.dots.setMatrixAt(i, m4);
      }
      F.dots.instanceMatrix.needsUpdate = true;
    }
    return any;
  }

  // ---- labels ----
  const labEls = new Map();
  for (const [id, P] of parts) {
    if (P.cfg.label === false) continue;
    const el = $('div', 'f3d-lab', P.cfg.name); el.dataset.part = id; over.append(el);
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    ln.setAttribute('fill', 'none'); ln.setAttribute('stroke', style.ink); ln.setAttribute('stroke-width', '1');
    svg.append(ln);
    labEls.set(id, { el, ln, occluded: false });
  }
  const legend = $('ol', 'f3d-legend'); if (style.labels === 'numbered') over.append(legend);
  const ray = new THREE.Raycaster();
  let occT = 0;
  function visibleParts() { return [...parts.values()].filter(P => P.obj.visible).map(P => P.obj); }
  function checkOcclusion() {
    camera.updateMatrixWorld(); model.updateMatrixWorld(true);
    const objs = visibleParts();
    for (const [id, L] of labEls) {
      const P = parts.get(id), shift = P.obj.position.clone().sub(P.home);
      const toCam = camera.position.clone().sub(P.center).sub(shift).normalize();
      const cands = P.cands.filter(c => clipOK(c.p.clone().add(shift)))
        .sort((a, b) => (b.d ? b.d.dot(toCam) : 1) - (a.d ? a.d.dot(toCam) : 1));
      L.gone = !cands.length;                           // cut away entirely
      if (L.gone) continue;
      L.occluded = true; P.anchor = cands[0].p;
      for (const c of cands.slice(0, 4)) {
        if (c.d && c.d.dot(toCam) < -.2) break;
        const a = c.p.clone().add(shift), dir = a.clone().sub(camera.position), dist = dir.length(); dir.normalize();
        ray.set(camera.position, dir); ray.far = dist - P.radius * .04;
        const hit = ray.intersectObjects(objs, false).find(h => h.object.userData.part !== id && clipOK(h.point) && !parts.get(h.object.userData.part).mat.transparent);
        if (!hit) { L.occluded = false; P.anchor = c.p; break; }
      }
    }
    layoutLabels();
  }
  const clipOK = p => S.cut == null || clip.distanceToPoint(p) >= 0;
  function shownLabelIds() {
    const apartOn = S.ex > .5 && cfg.apart;
    const ids = [];
    for (const [id] of labEls) {
      const P = parts.get(id); if (!P.obj.visible) continue;
      if (labEls.get(id).gone) continue;
      if (apartOn) { if (cfg.apart.order.includes(id)) ids.push(id); continue; }
      if (!S.labels) continue;
      if (S.highlight && !S.highlight.includes(id) && S.picked !== id) continue;   // a step labels only what it's about
      const adds = cfg.assembly && S.step >= 0 && !S.tray && steps[S.step].adds;
      if (adds && !adds.includes(id) && S.picked !== id) continue;                // a manual step labels its new parts
      ids.push(id);
    }
    return ids;
  }
  function layoutLabels() {
    const w = stage.clientWidth, h = stage.clientHeight, ids = new Set(shownLabelIds());
    const items = [];
    for (const [id, L] of labEls) {
      const on = ids.has(id); L.el.style.display = on ? '' : 'none'; L.ln.style.display = on ? '' : 'none';
      if (!on) continue;
      const P = parts.get(id), a = P.anchor.clone().add(P.obj.position).sub(P.home).project(camera);
      if (a.z > 1) { L.el.style.display = 'none'; L.ln.style.display = 'none'; continue; }
      items.push({ id, L, x: (a.x + 1) / 2 * w, y: (1 - a.y) / 2 * h });
    }
    legend.replaceChildren();
    if (style.labels === 'numbered') {
      items.sort((p, q) => p.y - q.y).forEach((it, i) => {
        const { L } = it; L.ln.style.display = 'none';
        L.el.className = 'f3d-num' + (S.highlight?.includes(it.id) ? ' on' : '') + (L.occluded ? ' dim' : '');
        L.el.textContent = i + 1; L.el.style.left = it.x + 'px'; L.el.style.top = it.y + 'px';
        legend.append($('li', '', `${i + 1}. ${parts.get(it.id).cfg.name}`));
      });
      return;
    }
    // leader lines: labels in a column on each side, spread so they never overlap, lines to the anchors
    // rows at least one label apart (boxed and Present labels are taller)
    const tallest = Math.max(0, ...items.map(it => it.L.el.offsetHeight));
    const cx = w / 2, gap = Math.max(22 * (root.classList.contains('present-on') ? 1.35 : 1), tallest + 4), pad = 8;
    // the model's outline on screen: the projected corners of every visible part's box
    let sx0 = Infinity, sx1 = -Infinity; const cv = new THREE.Vector3();
    for (const P of parts.values()) {
      if (!P.obj.visible) continue;
      const bb = P.obj.geometry.boundingBox;
      for (let i = 0; i < 8; i++) {
        cv.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).add(P.obj.position).project(camera);
        const x = (cv.x + 1) / 2 * w; sx0 = Math.min(sx0, x); sx1 = Math.max(sx1, x);
      }
    }
    if (!isFinite(sx0)) { sx0 = cx; sx1 = cx; }
    const cols = { l: items.filter(i => i.x < cx), r: items.filter(i => i.x >= cx) };
    for (const side of ['l', 'r']) {
      const col = cols[side].sort((p, q) => p.y - q.y);
      const top = (side === 'r' && cfg.stats ? statsEl.offsetHeight                      // clear of the readouts
        : side === 'l' && !badge.hidden ? badge.offsetHeight : 0) + gap / 2;             // and of the step number
      // spread: push down from the top margin, pull back up from the bottom, then push down once more so no two
      // rows ever overlap (a crowded column may then run a little low rather than stack)
      let y = top - gap; for (const it of col) { it.ly = Math.max(it.y, y + gap); y = it.ly; }
      let bottom = h - gap / 2; for (let i = col.length - 1; i >= 0; i--) { col[i].ly = Math.min(col[i].ly, bottom); bottom = col[i].ly - gap; }
      y = top - gap; for (const it of col) { it.ly = Math.max(it.ly, y + gap); y = it.ly; }
      for (const it of col) {
        const { L } = it; const hl = S.highlight?.includes(it.id) || S.picked === it.id;
        L.el.className = 'f3d-lab ' + side + (hl ? ' on' : '') + (L.occluded && !hl ? ' dim' : '');
        L.el.textContent = parts.get(it.id).cfg.name;
        const lw = L.el.offsetWidth;
        const colX = side === 'l' ? Math.max(pad, sx0 - 18 - lw) : Math.min(w - pad - lw, sx1 + 18);
        L.el.style.left = colX + 'px'; L.el.style.top = it.ly + 'px';
        const ex = side === 'l' ? colX + lw + 3 : colX - 3;
        const elbow = side === 'l' ? ex + 12 : ex - 12;
        L.ln.setAttribute('points', `${ex},${it.ly} ${elbow},${it.ly} ${it.x},${it.y}`);
        L.ln.setAttribute('stroke', hl ? style.accent : style.ink);
        L.ln.setAttribute('opacity', L.occluded && !hl ? .35 : 1);
        it.box = { l: colX, t: it.ly - L.el.offsetHeight / 2, r: colX + lw, b: it.ly + L.el.offsetHeight / 2 };
      }
    }
  }

  // ---- highlight, layers ----
  function applyLook() {
    for (const [id, P] of parts) {
      const g = P.cfg.group;
      P.obj.visible = (!g || S.layers[g] !== false) && !S.hidden.has(id);
      const hl = S.highlight, picked = S.picked;
      const faded = (hl && !hl.includes(id)) || (picked && picked !== id && !(hl && hl.includes(id)));
      const base = P.cfg.opacity ?? 1, op = faded ? Math.min(.22, base) : base;
      P.mat.transparent = op < 1; P.mat.opacity = op; P.mat.depthWrite = op >= 1;
      P.mat.userData.outlineParameters.visible = op >= 1;   // an outline hull shows through anything see-through
      P.mat.needsUpdate = true;
    }
    invalidate();
  }

  // ---- caption box ----
  let capHistory = [], capShownAt = 0, capAuto = false;
  function setCaption(text, auto) {
    const now = performance.now() / 1000;
    if (auto && capHistory.length && now - capShownAt < READ_S(capHistory[capHistory.length - 1]) - .05)
      err('caption replaced after ' + (now - capShownAt).toFixed(1) + 's: ' + capHistory[capHistory.length - 1]);
    capHistory.push(text); capShownAt = now; capAuto = auto;
    renderCaption();
  }
  function renderCaption(extra) {
    cap.replaceChildren();
    capHistory.slice(-3, -1).forEach(t => cap.append($('p', 'old', t)));
    if (extra) cap.append(extra); else if (capHistory.length) cap.append($('p', '', capHistory[capHistory.length - 1]));
  }
  const newStepCaption = text => { capHistory = []; setCaption(text, false); };

  // ---- Walk through ----
  const steps = cfg.steps || [];
  let beatTimer = null;
  function clearBeats() { if (beatTimer) clearTimeout(beatTimer); beatTimer = null; }
  function applyStep(i) {
    clearBeats(); S.step = i; S.pending = null; S.picked = null; card.hidden = true;
    const s = steps[i];
    if (s.layers) Object.assign(S.layers, s.layers);
    S.highlight = s.highlight || null;
    S.flows = new Set(s.flows || []);
    if (cfg.assembly) setMove(assemble(i), 1.1); else setMove(s.move);
    if (s.reset) { S.turns = 0; applyDrive(); }
    if (s.params) slideParams(s.params);
    if (s.speed != null) setSpeed(s.speed);
    if (s.run != null) setRun(s.run);
    if ((s.apart ? 1 : 0) !== S.exTo) setApart(s.apart ? 1 : 0);     // steps put it back together unless they say apart
    if (s.cut !== undefined) { setCut(s.cut); cutIn.value = s.cut == null ? 50 : Math.round(s.cut * 100); cutWrap.hidden = s.cut == null; cutBtn.setAttribute('aria-pressed', s.cut != null); }
    if (s.view) setView(s.view);
    applyLook();
    newStepCaption(s.caption);
    if (s.beats) playBeat(0);
    syncBar();
  }
  // assembly: parts added by step i or earlier are in place; the rest lie in the tray (a tray step) or are hidden.
  // A part added now flies in from `from`, or slides over from the tray if it was lying there.
  function assemble(i) {
    const s = steps[i], placed = new Set(steps.slice(0, i + 1).flatMap(t => t.adds || []));
    const move = { ...s.move }, wasHidden = new Set(S.hidden);
    S.tray = !!s.tray; S.hidden = new Set();
    for (const id of parts.keys()) {
      if (placed.has(id)) continue;
      if (S.tray) move[id] = cfg.assembly.tray?.[id] || [0, 0, 0]; else S.hidden.add(id);
    }
    for (const id of s.adds || []) if (wasHidden.has(id) || !parts.get(id).obj.visible)
      mv.get(id).set(...(cfg.assembly.from?.[id] || [0, radius * .9, 0]));
    badge.hidden = false; badge.textContent = s.manual ?? String(i + 1);
    return move;
  }
  function playBeat(b) {
    const s = steps[S.step]; S.beat = b;
    const prev = b === 0 ? s.caption : s.beats[b - 1].caption;
    beatTimer = setTimeout(() => {
      const bt = s.beats[b];
      if (bt.highlight) S.highlight = bt.highlight;
      if (bt.flows) S.flows = new Set(bt.flows);
      if (bt.move) setMove(bt.move);
      if (bt.params) slideParams(bt.params);
      applyLook(); setCaption(bt.caption, true);
      if (b + 1 < s.beats.length) playBeat(b + 1);
    }, READ_S(prev) * 1000);
  }
  function go(i) {
    if (i < 0 || i >= steps.length) return;
    const s = steps[i];
    if (S.predict && s.predict && !S.asked.has(i)) {
      S.asked.add(i);
      const p = $('p', 'pred'); p.append($('b', '', 'Predict: '), document.createTextNode(s.predict + ' '));
      const show = $('button', 'primary', 'Show me'); show.onclick = () => applyStep(i); p.append(show);
      clearBeats(); S.pending = i; renderCaption(p); syncBar(); show.focus();
      return;
    }
    applyStep(i);
  }

  // ---- controls ----
  const back = $('button', '', 'Back'), next = $('button', 'primary', 'Walk through'), stepN = $('span', 'f3d-step');
  back.onclick = () => {                         // during a Predict question, Back just withdraws the question
    if (S.pending == null) return go(S.step - 1);
    S.pending = null; S.asked.delete(S.step + 1); renderCaption(); syncBar();
  };
  next.onclick = () => { if (S.pending == null) go(S.step + 1); };
  const apartBtn = $('button', '', 'Take apart');
  apartBtn.onclick = () => {
    const v = S.exTo ? 0 : 1; S.highlight = null; S.flows = new Set(); applyLook();
    if (v && S.predict && cfg.apart?.predict && !S.asked.has('apart')) {
      S.asked.add('apart');
      const p = $('p', 'pred'); p.append($('b', '', 'Predict: '), document.createTextNode(cfg.apart.predict + ' '));
      const show = $('button', 'primary', 'Show me'); show.onclick = () => apartBtn.onclick(); p.append(show);
      renderCaption(p); return;
    }
    setApart(v); newStepCaption(v ? cfg.apart.caption : (S.step >= 0 ? steps[S.step].caption : cfg.caption)); syncBar();
  };
  const cutBtn = $('button', '', 'Cut'), cutWrap = $('label', 'f3d-cut'), cutIn = $('input');
  cutIn.type = 'range'; cutIn.min = 0; cutIn.max = 100; cutIn.value = 50; cutIn.setAttribute('aria-label', 'Where to cut');
  cutWrap.append(cutIn); cutWrap.hidden = true;
  cutBtn.onclick = () => {
    const on = S.cut == null; setCut(on ? cutIn.value / 100 : null); cutWrap.hidden = !on;
    cutBtn.setAttribute('aria-pressed', on); if (on && sec?.caption) newStepCaption(sec.caption); scheduleOcc();
  };
  cutIn.oninput = () => { setCut(cutIn.value / 100); scheduleOcc(); };
  const runBtn = $('button', '', 'Run'), spWrap = $('label', 'f3d-cut'), spIn = $('input');
  const sp = { min: .1, max: 2, name: 'Speed', unit: 'turns a second', ...cfg.motion?.speed };
  spIn.type = 'range'; spIn.min = sp.min; spIn.max = sp.max; spIn.step = (sp.max - sp.min) / 100; spIn.value = S.speed;
  spIn.setAttribute('aria-label', `${sp.name} (${sp.unit})`); spWrap.append(document.createTextNode(sp.name), spIn);
  runBtn.onclick = () => setRun(!S.running);
  spIn.oninput = () => setSpeed(+spIn.value);
  function setRun(on) { S.running = on && !still; runBtn.textContent = S.running ? 'Stop' : 'Run'; runBtn.setAttribute('aria-pressed', S.running); invalidate(); }
  function setSpeed(v) { S.speed = v; spIn.value = v; showStats(); }
  bar.append(back, next, stepN);
  if (cfg.motion) bar.append(runBtn, spWrap);
  if (cfg.apart) bar.append(apartBtn);
  if (sec) bar.append(cutBtn, cutWrap);
  bar.append($('span', 'sep'));
  for (const name of Object.keys(views)) { const b = $('button', '', name); b.onclick = () => setView(name); bar.append(b); }
  function syncBar() {
    const p = S.pending != null, i = p ? S.pending : S.step;
    back.disabled = S.step <= 0 && !p;
    next.textContent = S.step < 0 && !p ? 'Walk through' : 'Next';
    next.disabled = p || i >= steps.length - 1;
    stepN.textContent = i >= 0 ? `Step ${i + 1} of ${steps.length}` : '';
    apartBtn.textContent = S.exTo ? 'Put together' : 'Take apart';
    apartBtn.setAttribute('aria-pressed', !!S.exTo);
  }

  // tools: switches and popovers
  const sw = (name, get, set) => {
    const l = $('label', 'f3d-sw np'), c = $('input'); c.type = 'checkbox'; c.checked = get();
    c.onchange = () => set(c.checked); l.append(c, document.createTextNode(name)); return l;
  };
  if (labEls.size) tools.append(sw('Labels', () => S.labels, v => { S.labels = v; layoutLabels(); }));
  if (steps.some(s => s.predict) || cfg.apart?.predict) tools.append(sw('Predict first', () => S.predict, v => { S.predict = v; }));
  const pop = (title, fill) => {
    const b = $('button', 'np', title), p = $('div', 'f3d-pop'); p.hidden = true; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', title);
    b.onclick = e => { e.stopPropagation(); const o = p.hidden; document.querySelectorAll('.f3d-pop').forEach(x => x.hidden = true); if (o) { fill(p); p.hidden = false; } };
    p.onclick = e => e.stopPropagation(); root.append(p); tools.append(b); return b;
  };
  addEventListener('click', () => document.querySelectorAll('.f3d-pop').forEach(x => x.hidden = true));
  if (cfg.layers?.length) pop('Layers', p => {
    p.replaceChildren($('h2', '', 'Show'));
    for (const l of cfg.layers) {
      const lab = $('label'), c = $('input'); c.type = 'checkbox'; c.checked = S.layers[l.id] !== false;
      c.onchange = () => { S.layers[l.id] = c.checked; applyLook(); scheduleOcc(); }; lab.append(c, document.createTextNode(l.name)); p.append(lab);
    }
  });
  const credits = readJSON('f3d-credits') || [];
  pop('Credits', p => {
    p.replaceChildren($('h2', '', 'Credits'));
    if (cfg.source) p.append($('p', '', 'Based on a figure in ' + cfg.source + '.'));
    for (const c of credits) {
      const q = $('p'); q.append(document.createTextNode(c.credit + '. '));
      if (c.url) { const a = $('a', '', c.name); a.href = c.url; a.target = '_blank'; a.rel = 'noopener'; q.append(a, document.createTextNode('. ')); }
      q.append(document.createTextNode('Parts: ' + c.parts.join(', ') + '.'));
      p.append(q);
    }
    p.append($('p', '', 'Rendered with three.js (MIT).'));
  });
  const presentBtn = $('button', '', 'Present');
  presentBtn.onclick = () => setPresent(!html.classList.contains('present'));
  tools.append(presentBtn);
  function setPresent(on) {
    html.classList.toggle('present', on); root.classList.toggle('present-on', on);
    presentBtn.setAttribute('aria-pressed', on);
    if (on && !param.has('present') && document.fullscreenEnabled && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setTimeout(resize, 50);
  }
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && html.classList.contains('present')) setPresent(false); });
  addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && html.classList.contains('present'))) { e.preventDefault(); if (!next.disabled) next.onclick(); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); if (!back.disabled) back.onclick(); }
  });

  // ---- sliders: parts that are functions of the values rebuild as they move ----
  const live = [...parts.values()].filter(P => typeof P.cfg.shape === 'function' || typeof P.cfg.at === 'function' || P.cfg.spin);
  const paramRow = $('div', 'f3d-params'), outs = {}, ins = {};
  for (const q of cfg.params || []) {
    const l = $('label'), i = $('input'), o = $('output');
    i.type = 'range'; i.min = q.min; i.max = q.max; i.step = q.step ?? (q.max - q.min) / 100; i.value = q.value; i.id = 'f3d-' + q.id;
    i.oninput = () => setParams({ [q.id]: +i.value });
    l.append(document.createTextNode(q.name), i, o); paramRow.append(l); outs[q.id] = o; ins[q.id] = i;
  }
  if (cfg.params?.length) root.insertBefore(paramRow, bar);
  const fmt = (q, v) => (Math.round(v * 100) / 100) + (q.unit ? ' ' + q.unit : '');
  function setParams(vals) {
    Object.assign(S.p, vals);
    for (const q of cfg.params || []) { ins[q.id].value = S.p[q.id]; outs[q.id].textContent = fmt(q, S.p[q.id]); }
    for (const P of live) {
      const c = P.cfg;
      if (typeof c.shape === 'function') { const g = shapeGeo(c, S.p); if (g) { P.obj.geometry.dispose(); P.obj.geometry = g; } }
      if (typeof c.at === 'function') P.home.set(...c.at(S.p));
      if (c.spin) P.obj.rotation.set(...c.spin(S.p));
      measure(P);
    }
    applyApart(); showStats(); invalidate(); scheduleOcc();
  }
  function slideParams(to) {
    const from = { ...S.p }, keys = Object.keys(to);
    const sec = Math.max(...keys.map(k => (cfg.params.find(q => q.id === k)?.time ?? 1.2)));
    tween(sec, k => setParams(Object.fromEntries(keys.map(id => [id, from[id] + (to[id] - from[id]) * k]))));
  }

  // ---- stats: live readouts, top right of the stage ----
  const statsEl = $('dl', 'f3d-stats'); if (cfg.stats) stage.append(statsEl);
  const badge = $('div', 'f3d-badge'); badge.hidden = true; if (cfg.assembly) stage.append(badge);
  let statsText = '';
  function showStats() {
    if (!cfg.stats) return;
    const rows = cfg.stats({ turns: S.turns, speed: S.speed, running: S.running, step: S.step, p: { ...S.p } }) || [];
    const t = JSON.stringify(rows); if (t === statsText) return; statsText = t;
    statsEl.replaceChildren(...rows.map(r => { const d = $('div'); d.append($('dt', '', r.label), $('dd', '', r.value)); return d; }));
  }

  // ---- tap a part ----
  let down = null;
  renderer.domElement.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const r = renderer.domElement.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera);
    ray.far = Infinity;
    const hit = ray.intersectObjects(visibleParts(), false).find(h => clipOK(h.point) && parts.get(h.object.userData.part).cfg.tap !== false
      && !(parts.get(h.object.userData.part).mat.transparent));
    pick(hit ? hit.object.userData.part : null);
  });
  function pick(id) {
    S.picked = id === S.picked ? null : id;
    if (S.picked) {
      const P = parts.get(S.picked); card.replaceChildren($('b', '', P.cfg.name)); if (P.cfg.info) card.append(document.createTextNode(P.cfg.info));
      card.hidden = false;
    } else card.hidden = true;
    applyLook(); layoutLabels();
  }

  // ---- loop: render only when something changed ----
  let last = performance.now(), occTimer = null;
  function scheduleOcc() { clearTimeout(occTimer); occTimer = setTimeout(checkOcclusion, 120); }
  controls.addEventListener('end', scheduleOcc);
  function frame(now) {
    const dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now;   // rAF's clock can start behind performance.now()
    for (const a of [...anims]) {
      a.t = Math.min(1, a.t + dt / a.sec); a.fn(ease(a.t));
      if (a.t >= 1) { anims.delete(a); a.done?.(); scheduleOcc(); }
    }
    const moving = controls.update();
    if (S.running && cfg.motion) { S.turns += dt * S.speed; applyDrive(); showStats(); }
    const flowing = S.ex < .02 && stepFlows(dt);
    if (S.ex >= .02) for (const F of Object.values(flowObjs)) F.dots.visible = false;
    if (dirty || anims.size || moving || flowing || S.running) {
      effect.render(scene, camera); dirty = false; layoutLabels();
    }
    requestAnimationFrame(frame);
  }
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    controls.minDistance = radius * 1.2; controls.maxDistance = radius * 8;
    invalidate(); scheduleOcc();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // ---- start ----
  setView(cfg.view || { az: 0, el: 8 }, true);
  if (param.has('az') || param.has('el')) setView({ az: +param.get('az') || 0, el: +param.get('el') || 0 }, true);
  if (param.get('view')) setView(param.get('view'), true);
  newStepCaption(cfg.caption || steps[0]?.caption || '');
  applyLook(); syncBar(); setRun(S.running); applyDrive(); if (cfg.params) setParams({}); showStats();
  if (param.get('present') === '1') setPresent(true);
  if (param.has('step')) { const i = +param.get('step'); S.predict = false; applyStep(i); finishAnims(); }
  if (param.get('apart') === '1') { setApart(1, true); newStepCaption(cfg.apart.caption); syncBar(); }
  if (param.has('cut')) { cutIn.value = +param.get('cut') * 100; setCut(+param.get('cut')); cutWrap.hidden = false; cutBtn.setAttribute('aria-pressed', true); }
  function finishAnims() { for (const a of [...anims]) { a.fn(1); anims.delete(a); } }
  requestAnimationFrame(frame);
  checkOcclusion();

  // ---- testing hooks (scripts/verify.mjs) ----
  Object.assign(window.F3D, {
    go: i => { S.predict = false; applyStep(i); finishAnims(); clearBeats(); effect.render(scene, camera); checkOcclusion(); },
    apart: v => { setApart(v, true); effect.render(scene, camera); checkOcclusion(); },
    cut: v => { setCut(v); effect.render(scene, camera); checkOcclusion(); },
    view: v => { setView(v, true); effect.render(scene, camera); checkOcclusion(); },
    present: on => { setPresent(on); },
    params: v => { setParams(v); effect.render(scene, camera); checkOcclusion(); },
    turns: n => { S.turns = n; applyDrive(); showStats(); effect.render(scene, camera); checkOcclusion(); },
    camera: () => ({ position: camera.position.toArray().map(v => +v.toFixed(2)), target: controls.target.toArray().map(v => +v.toFixed(2)) }),
    labels: () => [...labEls.values()].filter(L => L.el.style.display !== 'none' && L.el.className.startsWith('f3d-lab'))
      .map(L => { const r = L.el.getBoundingClientRect(); return { part: L.el.dataset.part, text: L.el.textContent, l: r.left, t: r.top, r: r.right, b: r.bottom }; }),
    info: () => { effect.render(scene, camera); return { triangles: renderer.info.render.triangles, calls: renderer.info.render.calls,
      parts: parts.size, steps: steps.length, views: Object.keys(views), apart: !!cfg.apart, section: !!sec, motion: !!cfg.motion }; },
  });
  html.dataset.ready = '1';
  doneReady();
}
window.mountModel = mountModel;
window.READ_S = READ_S;

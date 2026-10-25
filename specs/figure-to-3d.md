# figure-to-3d: design spec

Status: rollout step 2 built (engine + heart); see "As built" at the end. Settled in a grill-me session on
2026-10-25; the decision numbers (D1–D28) match the questions asked there.

## What it is

A new skill in `pauls-skills`, a sibling of `ops-figures` (D1). Someone takes a photo of a figure in a textbook, a lab
manual or an instruction manual, and the skill turns it into an interactive 3D model on one self-contained HTML page:
you can spin it, tap a part to name it, take it apart, slice through it, and step through how it works.

It borrows from ops-figures what makes that skill good: a shipped engine and build script that own the look and the
teaching layer, so Claude only writes the object, and every output comes out consistent. It does not change
ops-figures, which keeps its fixed isometric view.

| | ops-figures | figure-to-3d |
|---|---|---|
| Input | a request ("make a toaster") | a photo of a printed figure |
| 3D | drawn isometric, one fixed view | real WebGL (Three.js), spin and zoom (D2) |
| Look | OPS brand | the textbook's own look (D7, D9, D18) |
| Shapes | hand-drawn in code | imported meshes for organic forms, procedural for machines and math (D11, D13) |
| Engine | `core.js`, ~80 KB | Three.js + `engine.js`, a few MB with meshes (D15) |
| Runs on | file, artifact, SpartBoard | file, artifact; SpartBoard later (D5, D28) |

## Scope

**Figure types (D3), all four in v1:** science and anatomy (a heart, a cell, the eye, the layers of the Earth),
machines and mechanisms (gears, levers, engines, circuits), math and geometry (solids, cross-sections, nets),
assembly and instruction manuals (furniture steps, exploded parts).

**Audience (D12):** mainly teacher-projected on a laptop and projector. Tone follows ops-figures: students,
teacher-led, by default; adult and precise for staff or PD when the request says so. Student devices are a bonus,
not a target.

**Out of v1:** a "Quiz me / find the part" mode (D8), the original photo on the page (D19), a SpartBoard build (D5),
AI image-to-3D generation (D13), Claude splitting whole meshes into parts itself (D14).

## Workflow

1. **Photo in.** The person attaches a photo and says what it's for.
2. **Read-back (D10).** Before building anything, Claude replies with one short structured read-back and waits:
   - Topic and figure type.
   - Parts and labels exactly as printed, in reading order; unreadable ones marked `[?]`.
   - Colors that carry meaning, and the page style it will sample (palette, label style, type feel) (D18).
   - How parts connect or move; the process or steps, marking which came from the photo's text and which Claude
     is supplying (D22).
   - What it must guess (back sides, depth, hidden parts).
   - Where each part's geometry comes from (a named mesh and its license, or procedural) and which features this
     model will therefore get: Take apart and per-part tap only with separate parts (D14).
   - The extras it plans for this type (sliders, assembly steps, motion, layer toggles) (D20).
3. **Source meshes.** Look in the mesh library first, then the open sources (below). Cache anything new.
4. **Write the scene** (`<name>.scene.js`, see Scene spec).
5. **Build** with `scripts/build.mjs`: one HTML file.
6. **Verify** with `scripts/verify.mjs`; fix, at most 2 rounds (D26).
7. **Hand over (D16):** publish it as a Claude artifact and give the link, plus one or two lines on what the controls
   do and the assumptions it made. When working in this repo, also add it to the gallery (via a PR, with any new
   meshes).

## Scene spec (D6, D28)

The figure is described as data, not as rendering code. Claude writes one plain object; the engine turns it into a
Three.js scene, controls and the teaching layer. The spec must stay **renderer-neutral**: no Three.js types or calls
in it, only numbers, strings, arrays and small pure functions of state. That is what keeps a later SpartBoard
renderer possible without rewriting any model.

A first sketch of the shape, to be refined while building the heart:

```js
mountModel({
  title: 'The human heart', fig: '7.3', source: 'Biology, ch. 7',     // source is optional; shown in Credits
  units: 'cm', up: 'y',
  style: { paper: '#f7f3ea', ink: '#222', accent: '#b5332e', font: 'serif', labels: 'leader' },  // from the photo
  parts: [
    { id: 'lv', name: 'Left ventricle', info: 'Pumps oxygen-rich blood to the whole body.',
      mesh: 'bp3d/heart/left-ventricle', color: '#c0392b', group: 'chambers' },
    { id: 'aorta', name: 'Aorta', mesh: 'bp3d/heart/aorta', color: '#c0392b', group: 'vessels' },
    { id: 'gear-a', name: 'Driver gear', shape: { gear: { teeth: 12, r: 2, w: .5 } }, at: [0, 0, 0] },
  ],
  layers: [{ id: 'chambers', name: 'Chambers' }, { id: 'vessels', name: 'Vessels' }],     // science: show and hide
  apart: { flow: 'blood', order: ['ra', 'tricuspid', 'rv', 'pulmonary', 'la', 'mitral', 'lv', 'aorta'],
           offsets: { lv: [2, -1, 0] }, caption: st => '…' },
  section: { normal: [1, 0, 0], range: [-4, 4] },          // the cutting plane and how far it slides
  params: [{ id: 'r', name: 'Radius', min: 1, max: 5, step: .5, value: 3 }],             // math: sliders
  motion: { speed: [0, 2, 1], drive: (st, t) => ({ 'gear-a': { rot: [0, 0, t] } }) },   // machines
  steps: [                                   // Walk through; assembly manuals use the same list, one per manual step
    { label: 'Fill', caption: 'Blood from the body fills the right atrium.', predict: '…',
      camera: 'front', highlight: ['ra'], show: {}, set: {} },
  ],
  cameras: { front: { at: [0, 0, 12] }, side: { at: [12, 0, 0] } },
  credits: 'auto',                            // built from the mesh manifest
});
```

**Shape helpers** for procedural parts (machines and math, D11): box, cylinder, sphere, cone, torus, lathe, extrude,
tube along a curve, helix, gear, and solid-of-revolution from a function. Exact geometry beats an imported mesh here.

## Teaching layer

The ops-figures rules come over unchanged (D22). The engine enforces them and the SKILL.md teaches them:

- **Caption, always.** One plain sentence for what is happening now. About 90 characters, never past 130. A caption
  the model replaces by itself stays up at least `READ_S(caption)` (about 3 words a second plus 1, never under 3 s);
  violations are recorded on `<html data-errors>`. Earlier captions of a step stay readable in the caption box.
- **Labels** on parts: the book's names, drawn the book's way (leader lines, numbered callouts or boxed names, D18).
  Tap a part: it highlights and shows its name and one-line `info`.
- **Predict:** one question per key step about the mechanism, never the answer; off by default, a switch turns it on.
- **Walk through:** the steps in order, each with a camera move, highlights and a caption; Back works.
- **Take apart:** an exploded view along the flow path (`apart.flow`), with a dashed path line through the parts in
  order, labels on every part. Only for real objects with separate parts.
- **Cross-section:** a clipping plane on a slider, with capped cut faces so the inside reads as solid.
- **Present:** full screen, bigger type and labels, keyboard Next/Back, for a projector.

**Type extras (D20), all in v1:** math sliders with live measurements (volume, area, angle); assembly steps where
parts fly in in the manual's order with the manual's step numbers; running motion with a speed control for
machines; layer and system toggles plus an animated process for science.

## Look (D7, D9, D18)

The page matches the textbook, not the OPS brand. The read-back samples the figure's palette, how it draws labels,
and its type feel (serif or sans), and the scene's `style` carries them. A fixed layout skeleton (model, caption box,
controls row, Labels / Predict / Layers switches, Credits) keeps every page consistent while the surface matches each
book. The model gets the figure's colors with soft toon shading and thin outlines so it reads like a printed
illustration and holds up on a projector. Colors that carry meaning in the subject (oxygen-rich red, oxygen-poor
blue) are always kept.

## Meshes (D11, D13, D14, D17, D25)

**Rule:** if it's a heart, it looks like a heart. Organic forms always use a real mesh, never primitives standing in
for one. Machines and math are procedural.

**Sources, in order of preference:**

| Source | What | License | Key |
|---|---|---|---|
| BodyParts3D | human anatomy, one file per structure | CC BY 4.0 | none |
| NIH 3D | biology, anatomy, molecules | per model (often CC BY or public domain) | none |
| Smithsonian Open Access 3D | specimens, artifacts, fossils | CC0 | none |
| Sketchfab | everything | CC BY or CC0 only | token, only if one is saved on the environment |

All four hosts answer from the cloud environment today. Z-Anatomy (GitHub) is blocked here; leave it out unless
mirrored. The skill never asks for a Sketchfab token in chat: if none is set, it skips Sketchfab silently.

**Segmentation (D14):** prefer sources with separate parts. With only a whole mesh, labels pin to points on the
surface, the cross-section still works, and Take apart and per-part highlight are off. The read-back says so.

**Mesh library (D17):** `mesh-library/` at the repo root, outside the plugin, so the synced plugin stays small.

```
mesh-library/
  manifest.json            # one entry per mesh: id, source URL, license, credit, parts, units, scale, triangles, sha256
  bp3d/heart/left-ventricle.glb
  …
```

Meshes are stored already cleaned (centred, scaled to real units, decimated to a triangle budget, meshopt-compressed).
In a session on this repo the skill reads the library directly; elsewhere it fetches from the source and keeps a
local copy for the session. New meshes are added to the library in the same PR as the gallery entry.

**Licenses:** every mesh's license and credit go in the manifest and on the page's Credits panel. BodyParts3D is
CC BY 4.0 (its 2013 OBJ headers still name CC BY-SA 2.1 JP; the database's license page, updated 2025, is CC BY 4.0,
and the recipe records both). The original
textbook photo never goes on the page (D19); labels are retyped, and the book is named only if the person names it.

## Packaging and scripts (D15, D23)

One self-contained HTML file: a pinned Three.js (bundled with the engine by esbuild at build time), the engine, the scene, and the meshes inlined as base64
GLB. Target under 10 MB, hard limit 16 MB (the artifact limit). It opens from disk, works offline on a projector
laptop, and can be emailed or put on Drive.

Use **meshopt** compression with quantization rather than Draco: its decoder is about 20 KB of JS against Draco's
roughly 300 KB of wasm that would also need inlining.

All scripts are Node (D23), using `@gltf-transform` for mesh work:

| Script | Does |
|---|---|
| `scripts/fetch-mesh.mjs` | search the sources, download, record license and credit in the manifest |
| `scripts/prep-mesh.mjs` | centre, scale, decimate to budget, split or merge parts, compress |
| `scripts/build.mjs` | inline Three.js, engine, scene and meshes into one HTML; report size and whether it would fit SpartBoard (120k characters, no outside scripts) |
| `scripts/verify.mjs` | the self-check below |

## Verification (D26)

`verify.mjs` opens the built page in the pre-installed headless Chromium and:

- screenshots 6 camera angles, every Walk through step, apart, the cross-section at three depths, and Present;
- checks that labels don't overlap each other or cover moving parts, in every shot;
- reads `<html data-errors>` (caption timing, script errors);
- checks file size, triangle count and draw calls against a budget.

Headless Chromium renders WebGL in software, so its frame rate says nothing about a real laptop. Use triangle count
and draw calls as the performance check and leave frame rate out of it. At most 2 fix rounds, then hand over.

## Skill layout

```
plugins/pauls-skills/skills/figure-to-3d/
  SKILL.md                 # read-back template, scene spec reference, teaching rules, mesh rules, hand-over
  README.md                # credits
  assets/
    engine.js              # mountModel(): scene, controls, teaching layer, style
    examples/              # heart, gears, solid of revolution, furniture step (scene files)
  scripts/                 # fetch-mesh, prep-mesh, build, verify (.mjs)
  package.json             # pinned three, esbuild, @gltf-transform, meshoptimizer, draco3dgltf (Playwright is the
                           # environment's own)
mesh-library/              # repo root, see above
```

`gallery/build.py` and `.github/workflows/gallery.yml` need extending so figure-to-3d pages (and their meshes) are
built and listed alongside the ops-figures ones.

## Reference examples (D24)

Each one tests a different path and becomes a SKILL.md reference and a gallery entry:

1. **Human heart:** science; segmented BodyParts3D meshes; layers, take apart along the blood path, cross-section,
   a blood-flow Walk through. The hardest path, so it shapes the engine.
2. **Gear train or bike drivetrain:** machine; procedural; running motion, speed control, a gear-ratio Predict.
3. **Solid of revolution or cone sections:** math; procedural; parameter sliders, a slicing plane, live measures.
4. **Furniture assembly step:** manual; parts fly in in the manual's order with its step numbers.

## Rollout (D27)

1. **This spec**, reviewed and merged.
2. **PR: engine + heart.** Skill skeleton, scene spec, engine, the four scripts, `mesh-library/` and manifest, the
   heart end to end, the gallery extension. Bump `pauls-skills`.
3. **PRs: gears, solid, furniture**, one each, each proving one type extra. Bump each time.
4. **Later: SpartBoard.** A small renderer for the same scene spec, for models that fit (likely procedural ones
   first). `build.mjs` already reports which would fit.

## Risks and open points

- **Mesh quality varies.** Some anatomy will only exist as one solid piece, or too dense to inline. The triangle
  budget and the read-back's feature list deal with it; when no good mesh exists, the read-back says so instead of
  building a weak model.
- **Matching the textbook's look automatically** depends on reading the photo well. If sampled styles turn out
  unreliable, fall back to a small set of named page styles and pick the nearest.
- **Size.** Three.js plus several detailed meshes can approach 10 MB, so the budget per part needs tuning on the
  heart.
- **Scene spec shape** is a sketch. Expect it to change while the heart is built; keep it renderer-neutral when it
  does.

## As built (rollout step 2)

What changed from the plan above while the engine and heart were built:

- **The heart is 16 parts and about 77k triangles; the built page is 1.4 MB** (Three.js and engine about 700 KB,
  meshes about 700 KB). Far under the 10 MB target.
- **BodyParts3D has no ventricle walls** in its part-of tree: the ventricles are the blood-filled cavities. The
  model says so in those parts' info. Vessels that run on into the body are cut to stubs with a recipe `keep` range.
- **Three.js is pinned in `package.json` and bundled by esbuild** rather than vendored as a file.
- **Labels** are laid out in columns either side of the model with leader lines (the textbook way), each part
  choosing among seven anchor points the one facing the camera that isn't hidden or cut away. A step labels only
  the parts it highlights.
- **Gallery cards** for 3D pages need WebGL in headless Chrome; the workflow passes the SwiftShader flags, but this
  was not testable in the cloud container (headless `--screenshot` hangs there for every page, ops-figures too).
- **Not built yet:** math sliders, assembly steps (rollout step 3), and the NIH 3D search (no public
  API answered; `fetch-mesh.mjs get url` takes a GLB downloaded from the site).
- **A trumpet** joined the heart as the machine reference, ahead of the gears: all procedural parts, and a small
  engine addition, per-step `move`, for the pistons. Parts given a rotation have it baked into their geometry so
  bounds and label anchors are in model space.
- **Gear train** (rollout step 3, machines): `shape: { gear }` (spur gears by teeth and module), `motion` (a drive
  function of turns, Run/Stop, a speed slider), `stats` (live readouts), a part `offset`, and steps that `run`,
  set `speed` and `reset`.

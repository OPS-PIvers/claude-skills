---
name: figure-to-3d
description: Turn a photo of a figure from a textbook, lab manual or instruction manual (a heart, a cell, the eye, a skull, an engine, a gear train, a cone cut by a plane, a furniture assembly step) into an interactive 3D model on one self-contained HTML page for teaching. Real anatomical meshes where the subject is organic, exact geometry where it is a machine or a shape; the page keeps the book's own colors, labels and look, and adds spin and zoom, tap a part to name it, Take apart, a Cut slider to look inside, layers, moving flow dots, a step-by-step Walk through with Predict questions, and Present mode for projecting. Use whenever someone shares a picture of a diagram or figure and wants it in 3D, interactive, "brought to life", or "something students can turn around", or asks for a 3D model of a body part, organ, specimen, mechanism or solid for a class or a training, even if they don't name the skill. Not for drawn OPS-style figures of everyday machines: that is ops-figures.
---

# Figure to 3D

Someone photographs a figure in a book and gets back a 3D model they can teach with. Each model is one HTML page:
the engine (`assets/engine.js`, bundled with a pinned Three.js) plus your **scene**, a plain description of the parts
and how the thing works. The engine owns the look, the controls and the teaching layer. You own reading the figure
correctly, getting good geometry, and writing the teaching copy.

The spec this skill was built from, with the reasons behind each choice: `specs/figure-to-3d.md` in the
claude-skills repo.

## Who it's for, and the tone

Mainly a teacher projecting it in front of a class, sometimes students on their own devices.

- **Students, teacher-led (the default).** Short sentences, everyday words a middle schooler knows; name a technical
  term once, in passing, when a label shows it ("blood passes through the **tricuspid valve**").
- **Staff and PD** ("for PD", "for staff", "for a training"): adult, precise language, calmer tone. Same features.

Never write "students will…" or "teachers can…" on the page.

## Workflow

1. **Set up once:** `npm ci` in this skill folder (Node 20+). Verification uses Playwright's Chromium.
2. **Read-back.** Read the photo, then reply with the read-back below and **wait** for a fix or a go. Nothing is
   built before that. A misread label costs a minute here and a rebuild later.
3. **Meshes.** Use the mesh library, or fetch and prep new ones (see Meshes).
4. **Write `<name>.scene.js`**: one `mountModel({...})` call. Read first:
   - `assets/examples/heart.scene.js`, **the reference**: segmented meshes, layers, flows, Take apart along the blood
     path, a Cut, a Walk through with beats and Predict, and its read-back written out at the top.
   - `assets/examples/trumpet.scene.js`, **the machine reference**: every part procedural (tube, lathe, cylinder) at
     real size, pistons that move per step (`move`), and an air path that changes with the valves pressed.
   - `assets/examples/gears.scene.js`, **the running-machine reference**: real meshing spur gears (`shape: { gear }`),
     `motion` with Run/Stop and a speed slider, live `stats` (turn counters), and steps that `run`, set `speed` and
     `reset`.
   - `assets/examples/solid.scene.js`, **the math reference**: `params` sliders, parts whose `shape`, `at` and
     `spin` are functions of them (a triangle spun into a cone), a see-through comparison solid (`opacity`), live
     volumes in `stats`, and steps and beats that slide the values.
   - `assets/examples/bookcase.scene.js`, **the instruction-manual reference**: a parts list (`tray: true`), parts
     added step by step (`adds`) that fly in or slide over from the tray, the manual's step numbers (`manual`), and
     the manual's exploded drawing as Take apart.
   - The comment at the top of `assets/engine.js`, which lists every option `mountModel` takes.
5. **Build:** `node scripts/build.mjs <name>.scene.js OUT.html`. It inlines Three.js, the engine, the scene and the
   meshes into one file and prints the size.
6. **Verify:** `node scripts/verify.mjs OUT.html`. It screenshots 6 angles, every step, Take apart, three cut
   depths and Present, and checks for label overlaps, script errors, captions replaced too early, size and triangle
   budget. Then **look at the shots** (`OUT.shots/`): a page can pass every check and still read badly (a label
   pointing at the wrong part, a flow dot path outside the vessel, a step that frames the wrong side). Fix and
   re-run, at most 2 rounds.
7. **Hand over.** Build again with `--artifact` (the artifact host adds its own page skeleton) and publish that as an
   artifact (private; the person shares it if they want). Give the link and the plain OUT.html (for offline use),
   plus two or three lines: what the buttons do, which switches it has, and the assumptions you made (what you
   guessed, what the mesh shows differently from the book). If the work is in the claude-skills repo, offer to add it
   to the gallery: the built page in `gallery/figures/` (or the scene in `assets/examples/`, if it should become a
   reference), with any new meshes and their recipe in `mesh-library/`, in one PR.

### The read-back

Short, in this order:

- **Topic and type:** science and anatomy, machine, math, or assembly.
- **Labels exactly as printed**, in reading order; unreadable ones marked `[?]`.
- **Colors that carry meaning** (oxygen-poor blue, the layers of the Earth), and **the page style** you'll use: paper
  color, ink, accent, serif or sans, and how the book draws labels (leader lines, numbered callouts, boxed names).
- **How it works:** the process or steps, marking what came from the photo's text and what you are supplying.
- **What you must guess:** back sides, depth, hidden parts.
- **Geometry per part:** which mesh (source and license) or procedural. Then **the features this model gets**: Take
  apart and tapping single parts need separate parts; with only one solid mesh, labels pin to points on it, Cut still
  works, Take apart is off.
- **Extras** you plan: layers, flows. Say plainly if the figure needs something the engine can't do.

## Meshes

**If it's a heart, it looks like a heart.** Organic forms always use a real mesh. Never build a heart, brain or cell
from spheres and blobs. When no good mesh exists, say so in the read-back instead of building a weak model. Machines
and math are procedural (`shape:`), because exact geometry beats a scanned mesh there.

**The library** is `mesh-library/` at the root of the claude-skills repo (outside the plugin, so installs stay small):
one folder per group (`bp3d/heart/`), a `recipe.json` in each that rebuilds it, and `manifest.json` listing every
mesh with its source, license, credit, triangles, bounds and centre. `build.mjs` finds it on its own inside the repo;
elsewhere pass `--lib`. Look there first.

**Sources, in this order** (`scripts/fetch-mesh.mjs` does each; run it with no arguments for usage):

| Source | Good for | License | |
|---|---|---|---|
| BodyParts3D | human anatomy, one file per structure | CC BY 4.0 | `search bp3d`, `parts bp3d <FMA id>`, `get bp3d <recipe>` |
| NIH 3D | biology, anatomy, molecules | per model, check it | download the GLB from 3d.nih.gov, then `get url` |
| Smithsonian Open Access | specimens, fossils, objects | CC0 | `search si`, `get url` |
| Sketchfab | anything | CC BY or CC0 only | `search sketchfab`; `get sketchfab <uid>` only with a token set |

Never ask for a Sketchfab token in chat. If downloading says no token is set, skip Sketchfab.

**Prep** with `node scripts/prep-mesh.mjs <recipe.json> --src <raw folder>`: it merges each part's files, turns them
Y-up with the front toward +Z, scales to centimetres, centres the group (parts keep their places relative to each
other), simplifies to each part's triangle target, compresses (meshopt), and updates the manifest. Write the recipe
first (`mesh-library/bp3d/heart/recipe.json` is the model):
- One part per thing a student should name. Merge the small pieces of one structure (every branch of the coronary
  arteries is one part).
- `keep` trims a part to a range (`{ "z": [1160, null] }`): a vessel cut to a short stub, so it doesn't run off
  toward the feet and push the model off centre.
- Budget: about 80–150k triangles for the whole model, and 1–15k per part.
- Record what the mesh really shows when it differs from the book: BodyParts3D's ventricles are the blood-filled
  space inside them, not the muscle wall. Say it in that part's `info` and in the hand-over.

**Credits:** the build writes a Credits panel from the manifest for every mesh the scene uses. The book is named
there only if the person names it (`source:`). **Never put the photo itself on the page**: it is the publisher's.
Retype the labels.

## The teaching layer

The ops-figures rules, unchanged.

- **Caption, always.** One plain sentence about what is happening now: about 90 characters, never past 130,
  sentence case, no emoji. `caption:` is the opening one; each step has its own.
- **Beats** are captions that replace each other on their own within a step (`beats: [{ caption, highlight?,
  flows? }]`). The engine holds each one `READ_S(caption)` seconds (about 3 words a second plus 1, never under 3 s).
  Shorter sentences make a faster step: cut words before you cut time.
- **Labels** use the book's names and the book's style (`style.labels`: `leader`, `boxed` or `numbered`). Every part
  is labelled unless `label: false` (small parts that crowd the rest). Labels go in columns either side of the model
  with leader lines, follow the side that faces the camera, dim when the part is hidden behind another, and drop
  when the Cut removes the part. While a step highlights parts, only those are labelled.
- **Tap a part** to name it: give every part one plain `info:` sentence about what it does, not what it looks like.
- **Walk through:** 5–9 steps in the real order of the process. Each sets a `view` that shows its parts (check the
  shots: a step about the back of the heart needs a back view), `highlight`s what it's about (the rest fades), and
  can turn `layers` and `flows` on, and `move` parts (a piston pressed down: offsets from where the part is built;
  parts the step doesn't move go back).
- **Predict:** one question on each of 2–4 key steps, about the mechanism and not a fact to recall ("This blood has
  to reach your toes. Which chamber has to push hardest?"). Never put the answer in the question; the caption that
  follows is the answer. Off by default, the Predict first switch turns it on.
- **Take apart** (every real object with separate parts): `apart.order` is the path the flow takes (blood, light,
  water, current), 3–8 parts; those are labelled and joined by a dashed red arrow line. Give `offsets` that slide
  each part out along that path, far enough to separate and no farther; the engine zooms out to fit.
- **Cut:** `section.normal` is the direction that gets cut away (`[0,0,1]` removes the front half: the frontal
  section most books draw). Cut faces show darker, so the inside reads as solid.
- **Flows:** dots that travel a path (`flows: { id: { path, color } }`), drawn over the model the way a book draws
  arrows. A path is a list of points in the model's centimetres (front view: +x is the body's left, +y up, +z toward
  you) or part ids. Keep every point inside the vessel or chamber it means: the shots show strays.
- **Layers:** a switch per system (chambers, valves, vessels). Group parts with `group:`.
- **Motion** (machines that run): `motion.drive(turns)` returns each moving part's `rot` (and `at`) for a count of
  turns that climbs while it runs. A part turns about its `at`; use `offset` to put a shape off that axis (a crank
  arm). Mesh real gears with one module and centre distances that add up to the pitch radii; check in the front
  shot that teeth meet gaps. `stats` shows live numbers (turns, rpm): count something a student can predict.
- **Sliders** (math): `params` are the figure's variables (r, h, an angle), with real units and ranges a student
  can reason about. Make the shapes functions of them, so the solid rebuilds as they move, and show the formula's
  result live in `stats`. A Predict step slides one value (in a beat) so the change happens after the question.
  A ghost solid to compare against takes `opacity: .2`. A math idea gets no Take apart.
- **Assembly** (manuals): `assembly: { tray, from }` and steps with `adds`. Step 1 is the parts list (`tray: true`,
  `manual: 'Parts'`) with every part laid out and the counts in its caption; then one step per manual step, in the
  manual's order and with its numbers (`manual: '3'`), adding only what that step adds; then a last `Done` step.
  Parts fly in from `from` (the direction you'd push them: a shelf from the front, a back panel from behind).
  Name parts with the manual's letters ("Shelf (B)"), use `style.labels: 'boxed'`, and label one of each repeated
  part. Before Walk through the piece is shown finished.
- **Present:** full screen, bigger type, → and ← keys. Nothing to configure.

## Look

The page matches the book, not the OPS brand: `style` takes `paper`, `ink`, `muted`, `accent`, `font` (`serif` or
`sans`, system fonts only so it works offline) and `labels`. Sample them from the photo in the read-back. The model
gets the figure's own colors with soft toon shading and thin ink outlines, which reads like a printed illustration
and holds up on a projector. Colors that carry meaning are never changed for looks. Build machines, solids and
furniture at real size in centimetres, and route tubes so they don't pass through each other: the shots show it.

## Not supported

There is no SpartBoard version: a Three.js page is far over the mini-app limit, and `build.mjs` says so.

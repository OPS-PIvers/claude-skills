---
name: ops-figures
description: Build an on-brand Orono (OPS) interactive figure of an everyday object or machine (3D printer, washing machine, vending machine, toaster, kettle, projector, pump, lock, bike gear…) as one self-contained HTML page for teaching. Hand-inked isometric 3D drawing in OPS blue, red and gray, with buttons that really work, a plain-language caption for every step, part labels, Predict questions, a step-by-step Walk through, and a Present mode for projecting. Use whenever someone wants a "how does X work" figure, an interactive diagram or model of a machine or process for a class, a PD session or staff training, a clickable object illustration, or an "OPS figure" or "Colorfigure", even if they don't name the skill. Can also be saved to SpartBoard as a mini-app.
---

# OPS Figures

Hand-inked isometric objects you can play with, in the Orono Technology brand and built for teaching. Each figure is
one HTML page: a small engine (`assets/core.js`) plus your figure script, which models the object in 3D and draws it
with the engine's shapes. The engine owns the look (OPS Blue Dark ink, flat light/mid/dark shading, a pale blue cast
shadow, Lexend and Roboto) and the teaching layer (caption, labels, Predict, Walk through, Present mode). You own the
object and its real process.

Based on Colorfigures by April Zhu (MIT); see `README.md`.

One fixed view (front, left side and top toward the viewer) and one fixed light. There is no turning and no light
control. Don't add them.

## Who it's for, and the tone

The same figure serves two audiences. Read the request:

- **Students, teacher-led (the default).** The teacher projects it or shares a link, and students press things.
  Captions, labels and predictions use short sentences and everyday words a middle schooler knows; name a technical
  term once, in passing, when the label shows it ("the **extruder** motor pushes the plastic").
- **Staff and PD** ("for PD", "for staff", "for teachers", "for the tech team", "for a training"). Adult, precise
  language and a calmer tone (Mode 1 in ops-brand-guidelines). Same features.

Ask only when the request truly could be either. Never write "students will…" or "teachers can…" on the page itself.

## Workflow

1. **Set up:** copy `assets/core.js` into the working folder next to your figure (the page loads it with
   `<script src="core.js">` while you work).
2. **Read the references** before writing:
   - `assets/examples/printer.html`: **the how-it-works reference.** Labels, Predict questions, caption per phase,
     stats, a desk board, a feed tube, a part that grows layer by layer, and the real process written out at the top.
   - `assets/examples/headphones.html`: **the pacing reference.** Captions kept in one `CAP` object, every phase
     timed from `READ_S` of its caption, a see-through cover onto the parts inside, radio waves and sound drawn as
     motion, a phone screen with text lying flat (`txZ`).
   - `assets/examples/washer.html`: a rounded body made with `extrude`, a door, a drawer, a drum seen through glass,
     timed animation, a picker in the walk-through.
   - `assets/examples/vending.html`: products behind glass, clipping, a picker with disabled choices, stats.
   - `core.js`: its helpers are short and commented, and the `mountFigure({...})` options are listed just above that
     function.
   The washer and vending examples also contain code for drawing the back and the other side (`facing`, `boxV`,
   `txBack`): that was for turning, which this skill doesn't do. You only need what is visible from the front view.
3. **Write `figure.html`** (name it after the object): a doctype/head shell, `<script src="core.js"></script>`, then
   one inline `<script>` that defines the geometry and calls `mountFigure({...})`.
4. **Look at it** with headless Chrome (below), fix: at most 2 rounds.
5. **Build one file:** `python "<skill folder>/scripts/build.py" figure.html OUT.html` inlines the engine, so
   `OUT.html` runs on its own (`python3` on Mac/Linux).
6. **Hand it over:** give the path to OUT.html and say in a line or two what the buttons do and which switches it has
   (the page shows no instructions). Then offer to save it to SpartBoard (below).

## Saving to SpartBoard

A built figure is one self-contained HTML file of roughly 60–80k characters, which fits a SpartBoard mini-app
(limit 120k). After handing over the file, offer once: "Want it on SpartBoard as a mini-app?" On a yes, follow the
**spartboard** skill's mini-app flow: call `get_mini_app_spec` first and do what it says, show the figure as an
artifact for the teacher to try, and save that exact HTML with `create_mini_app` when they say to. A figure doesn't
collect results, so don't set `collects_results`. If the build is over 120k characters, say so and leave it as a file.

## The teaching layer

Every figure gets a **caption**. Labels, Predict and Walk through depend on the request.

### Caption (always)
`caption: st => 'one plain sentence'` is shown under the figure and read out to screen readers. It says what is
happening *right now* and, when the figure is waiting, what to do next: "Water flows in through the soap drawer and
fills the drum." / "The plastic is hard now. Take the cup off the bed." Write it from state, one sentence per phase of
the real process. Sentence case, full sentences, no ALL CAPS, no emoji. Two short sentences at most.

**Give every caption time to be read.** A caption the figure replaces on its own (the next phase of an animation)
must stay up at least `READ_S(caption)` seconds: about 3 words a second plus one, never under 3 s. A 12-word caption
needs 5 s. Pace the animation to the captions, not the other way round: the motion itself can be quick, and the
phase then holds until its caption has been read. Keep the caption strings in one `CAP` object and work out when each
phase ends from them (`headphones.html` does this with a small `ends([...])` helper), so a caption you reword
re-times its own phase. Shorter sentences make a faster figure; cut words before you cut time. The engine records any
caption replaced too early on `<html data-errors>`, so the verification run catches it.

Earlier captions are never lost: the engine lists the current step's earlier captions above the current one, in a
caption box of fixed height that scrolls to the newest line (a press that changes the state starts a new step and
clears the list). A caption that only differs by a number ("Layer 3 of
24" → "Layer 4 of 24") updates in place and counts as the same caption.

### Labels on parts
- If the request is about **how something works** ("show how it works", "explain", "for my class", "what happens
  inside"), label the working parts with `tag([x,y,z], dx, dy, 'TEXT', on)`: a white pill with a leader line to that
  3D point. Pass `on = true` while that part is doing its job (it turns OPS Red Light): HEATER while heating, FLOAT
  while the tank fills. 3–6 short labels (one or two words, capitals).
- If it's just "make a toaster", **don't** label unless the person asks. "No labels" or "label it" always wins.
- Labels must not cover each other, the object's printed text or anything moving: check every stage in the shots.
  `dx, dy` (where the pill sits) are in screen units at the reference zoom; aim the pills outward into empty space.
  Present mode draws them 1.35× larger, so leave room.
- The page gets a Labels switch automatically when a figure has tags; `?labels=0` starts with them off.

### Predict (how-it-works figures)
On the same trigger as labels, give each key step's button a `predict` question. Before that button's first press the
page shows **Predict** with the question and a **Show me** button in the caption box; the step runs on Show me. Write questions that make
someone think about the *mechanism*, not recall a fact: "The nozzle only ever moves in a flat circle. How will the cup
get taller?" One question per key step (3–5 in a figure), none on trivial steps (closing a door, collecting a can).
Don't put the answer in the question; the caption that follows is the answer. A Predict first switch appears
automatically; `?predict=0` starts with it off. A press that changes nothing (an out-of-order press that only flashes
why) doesn't use up its question.

### Walk through (every figure with 2+ steps)
A switch (and `?steps=1`) shows **Back / Step 2 of 5 / Next: Add soap**. Next runs the real button for the next step
(asking its Predict question first if that's on) and waits until its animation finishes; Back restores the state saved
before that step; the last Next becomes Start over. The free buttons keep working alongside. By default the steps are
every button without a picker, in order. Pass `walk: ['Load', 'Program>Quick', 'Start']` (the `?press=` syntax) when
the real sequence needs a picker choice, a repeated press (three coins) or skips a button. For Walk through to work:
- keep the figure's `state` plain JSON (numbers, strings, booleans, arrays, plain objects; no Maps, functions or DOM),
- run every animation through `ui.animate`, and every delayed change through `ui.after(sec, fn)`, never `setTimeout`,
  so Next can wait for a step and Back can cancel it. A `setTimeout` is fine only for something purely cosmetic (a key
  flashing for 160 ms).

### Present mode (automatic)
A Present switch (and `?present=1`) enlarges buttons, caption, Predict, stats and labels so it reads from the back of
a classroom. Nothing to do in the figure except leave room around labels.

### The page fits the window (automatic)
The page always fits the window or the SpartBoard frame without scrolling. The header, buttons, caption box and
switches stay on screen, and the figure scales to the height that's left (up to 1280px wide). The caption box has a
fixed height, so the figure doesn't jump when the caption changes or a Predict question shows. Only a window too short
to leave the figure 240px scrolls. Nothing to do in the figure, but don't add page elements of your own around
`mountFigure`: they would push the figure down.

## Coordinates and projection
- `x` = depth (the front face is at `x = W`, facing viewer-right), `y` = width (+y goes viewer-left), `z` = up.
  Ground at `z = 0`. The viewer looks from (+1,+1,+1).
- Visible faces: `+x` (front, lit), `+y` (left side, in shade), `+z` (top).
- Scale ≈ 1 unit per cm: vending machine 90 × 130 × 232; washer 62 × 65 × 88. Pick realistic proportions; small objects
  (a kettle, a printer) can be modelled bigger (60–100 units) so detail reads. Framing and line weight adapt
  automatically.

## Look (OPS brand, built into the engine)
- **Body colour:** one palette `m = {l, m, d}` (light / mid / dark), shaded with `tone(normal, m)`. The swatches are the
  OPS families: `blue` (the default), `red`, `gray` (charcoal) and `white`. Pick the default that suits the real
  object (a washer is `white`, a vending machine `red`, most school tech `blue` or `gray`). Small props and interiors
  use `toneI`. Other materials stay realistic: `METAL`, `CLEAR`, `CERAMIC`, `DARK`, or `matOf('#hex')`.
- **Contents keep their real colours.** Cans, laundry, filament, food, liquids: whatever the object holds or makes can
  be any colour that is true to it. Prefer brand reds and blues where nothing real decides it (the printer's PLA is
  OPS red). The body, ink, page and UI stay on-brand.
- **Ink** is OPS Blue Dark (`INK`). The cast shadow (`SHADOW`) is a pale Blue Light tint. `ACCENT` (Red Light) is for
  a label on a working part; don't use it for anything else.
- **Text on the object:** `tx(...)` / `txY(...)` print in Lexend. Pass `FONT_MONO` as the last argument for things
  that really are screens or LCDs (`#1d2a26` panel with `#8af0ae` text). On a white or light body print in `INK`.
  Plain letters and digits only; emoji and symbols render as blobs. Don't print the Orono logo or recreate it in shapes.
- **Status colours** keep their meaning: green `#43c25c` = on/ready, red `#e2483d` = stop/locked. Glass: `#cfe9f0` at
  low opacity + 1–2 white streaks at ~.38 opacity.
- **Rounded bodies** (most machines): an `rrUV(...)` profile in the (y, z) plane swept along x with
  `extrude(profile, x0, x1, m)`. That gives the banded rounded edges. `extrude` draws only the swept sides: draw the
  front cap (`shape(on(PX(x1), profile), m.l, 2.2)`) and the silhouette ink yourself, as `washer.html` does.
  `extrude`/`loft` decide which way a strip faces from the shape's centre, so they only work for **convex** profiles:
  split a C- or L-shaped part (a handle, a bracket) into convex pieces. Round things: `cyl` (upright), `cylX`
  (pointing out of the front), `rod(a, b, r, m)` (between any two points, at any angle: arms, rods, handles, an axle;
  pass a second radius for a cone), `loft` between rings (`on(PZ(z), ellUV(...))`) for cones, cups, bottles, domes.
- **Ink weights:** silhouette `hullInk(points, ~2.8)` drawn after the body; front-panel outline ~2.2; openings
  1.6–1.8; details 0.8–1.4. Always draw through `pd()` on 3D points (screen-space strokes), no SVG transforms except
  text. `pd(pts)` closes the path; use `pd(pts, false)` (or `line(...)`) for an open line such as a rim arc. Every
  `stroke-width="N"` in the scene is rescaled with the zoom; for a stroke that is really a shape (a cable, a tube) use
  `style="stroke-width:…"` as `printer.html` does.
- **Stand it on a board** (the default for anything that sits on a table or desk: a printer, lamp, kettle, radio, a
  coffee set): `board(x0, y0, x1, y1, h, r, BOARD | WOOD | m)` drawn first, a little bigger than the object's
  footprint plus anything that ends up beside it. Either stand everything on `z = h`, or (as `printer.html` does) keep
  the object at `z = 0` and draw the board with `OY += h` around it. Big floor-standing machines (a washer, a vending
  machine) stand on the paper instead.
- **Cast shadow next:** `castShadow(points, z0, clip)` with the object's outline points at the bottom and the top,
  `z0` = the surface it falls on, and on a board clip it to the board top. Shadows are short and must stay connected
  to the object: see *Tall things* below.
- Do not add dark edge strips along silhouettes: they read as a heavy outline. Only ink strokes are dark.

## Scenes with several objects
- Give each object its own cast shadow, its own silhouette ink, and sort the objects with `byDepth`.
- Jointed or thin things (lamp arms, rods): one shadow per part, and cap rods at the mid tone; the darkest tone on a
  thin rod reads as an ink line.
- **Tall things on a thin support** (a printer's top bar on its posts, a fan head on a stem, a sign on a pole): the
  shadow of the high part lands away from the base. Cast the base, the supports and the high part so the shadows
  touch. Look at the shadow in the screenshot as carefully as the object. See-through parts (a wire cage, a glass
  dome) cast a lighter shadow: wrap it in `<g opacity=".45">`.
- **Glass containers:** draw the far wall's shading, then the contents, then a light tint and one or two streaks on
  top. Heavy glass layers over a liquid turn it grey.
- **A stream falling into an opening:** split it at the rim. The part above the rim is drawn on top, the part inside
  goes in the receiving container's clip.
- **Things lifted into the air:** their shadow is unavoidably apart from them; draw it at half opacity.
- **Cones that narrow downward** (a funnel, a lampshade): shade the wall as if it were upright (use the horizontal part
  of the normal).
- **Cords, hoses, feed tubes:** `smooth3` and a stroked path (`washer.html` `tube`, `printer.html` `feedTube`). To show
  something travelling along a tube, stroke the same path with `pathLength="1"` and `stroke-dasharray="t 2"`.
- **Light the object gives off:** a pale polygon from the opening to where it lands and a soft ellipse pool, both
  before the parts in front of them; keep them pale so the object stays the subject.
- `size` must cover the largest pose (an arm stretched up, a gantry at its highest, the finished part beside the
  machine).

## Painter's order (draw back to front: there is no depth buffer)
1. board, then cast shadows (clipped to the board)
2. anything seen *through* an opening, wrapped in `clipTo(openingPoints3D, ...)`: back wall → side/floor surfaces →
   contents, sorted so items with larger `x+y+z` draw later (`byDepth([{at:[x,y,z], svg}, ...])`)
3. reveals/jambs of the opening (the thin surfaces from the glass plane to the front face)
4. glass tint + streaks (`pointer-events="none"` so clicks reach the contents)
5. front face as ONE path with holes: `<path d="${outer}${hole1}${hole2}" fill-rule="evenodd">`
6. things mounted on the front (buttons, dials, labels, doors that open outward)
7. outer body (`extrude(...)`), then side-face details (vents, decals)
8. silhouette ink (in a set: each object's own, right after that object), then labels (`tag`) last

An open frame (a printer, a shelf, scaffolding) has no single body: order its members by hand. Far post, then what
sits between the posts low down (the bed), then the near post, then what is higher or nearer (top bar, gantry, head),
then anything drawn over everything (a tube). Write the order as numbered comments, as `printer.html` does.

## Interaction (the point of the figure)
- **Follow the real process.** Before drawing, write the real sequence at the top of the script as a short list: each
  step, and where every material is after it (`printer.html` starts this way). Each button is one real step, and
  things only move along their real path: nothing appears somewhere it couldn't get to, and no container is skipped.
  Check the real order (a printer heats *before* loading filament, because cold plastic won't go through the nozzle).
  Check every stage's screenshot against that list, not just that the button "did something".
- **Every supply comes from something in the scene.** A refill needs its source drawn and used: water from a tap,
  plastic from a spool, coins from a slot. If a button adds something, show where it comes from and let it travel.
- 2–5 meaningful actions with real outcomes. **`buttons` are the interface**: every important action has one, in the
  order a person would use them (`{label, onClick(st, ui), predict?}`, or `{label, choices: st => [...]}` for a
  picker). Parts wrapped in `act('name', svg)` respond on *press* and are handled in `acts` (the scene is redrawn every
  animation frame, which would swallow a normal click). Don't add your own `click` listeners to drawn parts; if you
  need one, use `pointerdown`. In a picker, mark the option in use with `current: true` and an option that can't be
  chosen right now with `disabled: true, why: 'the program is locked while it runs'`. Never leave a control that
  silently ignores a press.
- **Out-of-order presses** must do something sensible: run the missing step first, or say why not with
  `ui.flash('Heat up first: the plastic has to melt')` (a short note under the buttons, sentence case) or on the object
  itself (a display, a light). `stats` (big numbers top right) suit a measured quantity: credit, temperature, litres,
  layer.
- **Animations:** `ui.animate(dt => { ...; return stillRunning; })`, eased. Movement can be quick, but each phase lasts
  at least `READ_S` of its caption (see *Caption*), so a step with three captions runs ~15 s and a whole print or wash
  ~25–30 s. One state object is the one source of truth, and a
  press during an animation either waits ("Wait for the printer to finish this step") or is safe.
- `params(st, q)`: read URL params for every interesting state (`?hot=1&prog=0.5`) so a screenshot can show it.

## Lessons from earlier figures
- Framing is automatic from `size` ([W, D, H] = the true bounding box, including things that stick out, a lifted part
  at its highest, and anything set down beside the object). The cast shadow may spill outside.
- If you redraw part of the scene yourself via innerHTML, wrap the string in `inkScale(...)`.
- Hinged doors: hinge on the viewer-RIGHT edge (y = 0) so the inside swings into view. Flaps hinged at the top that
  swing up/out cover the opening: hinge at the bottom or slide.
- Seeing inside: a point `(x,y,z)` inside appears on the front plane `x = W` at `y' = y + (W − x)`,
  `z' = z + (W − x)`. Only things whose `(y', z')` land inside the opening are visible.
- Liquids inside a container are only visible near the rim. A tilted container's liquid stays level.
- **Silhouette ink on round and tapered things:** one `hullInk` over several parts draws false straight lines across
  gaps. Ink each part's hull separately, before whatever covers its far side.
- **Motion straight toward the viewer** reads as falling. Angle the object 15–20° so "forward" is a diagonal.
- **Motion that follows a path** (a nozzle tracing a ring, a needle on a record): compute it from the real geometry
  each frame (the printer moves the bed by `-r·cos a` and the head by `r·sin a`), so the parts meet where they should.
- Spheres: a circle of radius r·1.2247 at `P(...centre)`; shade with a light offset circle and a small highlight.
- Text: `tx(...)` on the front, `txY(...)` on the side (≥ ~2 units or it smears under the wobble). On a curved surface
  only put text where the surface faces the viewer, with `txM(P(...), Dv(tangent), Dv(0,0,-1))`. `hint` shows in the
  header: keep it to one short line, lower case, comma-separated actions.
- `core.js` owns these global names. **Never declare them in a figure** (a clash blanks the page; short names like
  `S`, `C`, `L`, `SH`, `f` are the usual trap): `PALS METAL CLEAR CERAMIC DARK INK SHADOW ACCENT FONT_HEAD FONT_BODY
  FONT_MONO FONTS_URL C S OX OY VIEW RC VIEW_NAMES TURNS rotV rotXY P0 P Dv depthOf byDepth f pd sp arcUV rrUV rectUV
  ellUV PX PY PZ on sub dot cross norm avg vis facing SHADOW_K AZ_MIN AZ_MAX SHADOW_LEN L SH setLight LIN tone toneI mix
  matOf ease ink fill face shape line loft hull hullInk box extrude cyl cylX rod txM tx txY castShadow BOARD WOOD
  boardTop board act TAG_K tag clipTo READ_S INK_REF_VB INK_K inkScale CORE_CSS filterFor mountFigure`. Prefix your own short
  names (`lampS`, `armL`).

## Shapes that look right
- **Real proportions.** Before modelling, picture the real object and note its key proportions and where parts attach.
  Model to those notes.
- **Fill the frame.** `size` is the envelope the frame is fitted to: the object plus what really moves, no more.
- **Neat over busy.** Keep repeated hairlines (grilles, vents, layer lines) to about 8–18, draw details as a few clear
  shapes, line parts up with each other and with the axes, and keep inner lines lighter than the outline. Every detail
  must be big enough to read at normal size, and in Present mode from across a room.
- **Slender and airy, like the real thing.** Thin parts stay thin, long parts stay long, nothing is chunkier than the
  real object. In a scene with several objects, leave clear board between them.
- **Attached parts must visibly join their body:** both ends touch, nothing floats beside it.
- **One object's ink never crosses another object.** Draw each object completely before anything in front of it.
- **One shadow per object, one shape.** Never stack a translucent and a solid shadow for the same thing.

## Verify before you finish (keep it light: at most 2 rounds)
Render with headless Chrome over `file://`; each run needs its own `--user-data-dir` if you run several at once.
Windows (Git Bash):
```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --hide-scrollbars \
  --user-data-dir="$TEMP/shot-profile" --force-device-scale-factor=1.5 --window-size=820,900 \
  --virtual-time-budget=3000 --screenshot="$PWD/out.png" "file:///$PWD/figure.html"
```
Mac: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`; Linux: `google-chrome` or `chromium`.

Each round is just:
1. **The idle shot**, looked at full size.
2. **One `?press=` run of the main sequence** (the buttons in the order a person would use them), shot at two or three
   budgets, e.g. `figure.html?press=Heat@200,Load@3600,Print@6400` at 2000, 7000, 12000 ms. `?press=` clicks buttons
   by the start of their label; `Label>Choice` picks from a picker; a Predict question that comes up is answered with
   Show me. Add **one out-of-order press** (a later step first) to see it answers sensibly.
3. **One Walk through run of every step:** `?steps=1&predict=0&press=Next@300,Next@30300,Next@60300,…` (space the
   Nexts wider than the longest step; Next waits while a step runs). The caption should match each step, and a
   `Back` press should return to the state before the last step.
4. **One `?present=1` shot** of the busiest stage at a short, wide window (`--window-size=1366,650`, a Chromebook):
   labels must still clear each other and the moving parts, and nothing should need scrolling.
5. **One 3× crop of the part most likely to go wrong** (a row of keys, a glass container, a joint): nearer parts must
   cover farther ones. Rows of identical parts are where order bugs hide: draw them far to near.
6. **Errors:** run the press URL once with `--dump-dom` and check `<html data-errors="…">` (script errors, unknown
   labels, unknown walk steps and captions replaced before `READ_S` land there; the full Walk through run above is the
   one to check), grep for `NaN`, and read the caption text.
7. **A quick look as a stranger would:** anything physically wrong or odd, a caption that doesn't match the picture,
   a Predict question that gives away its answer.

Fix what you find, do the second round only if the first found something, then build and hand over. The figure's
state is `window.__st` if you need to read it.

## When to use something else
- A figure you can turn around, or a light you can move, is out of scope: this skill draws one fixed view.
- A quiz, flashcards or an Activity Wall about the object: the **spartboard** skill (a figure can sit beside them).
- Slides about the object: build the deck with ops-brand-guidelines and link or screenshot the figure.

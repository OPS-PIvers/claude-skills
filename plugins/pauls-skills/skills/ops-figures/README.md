# OPS Figures

A Claude skill for Orono. Describe an everyday object or machine in one line and Claude draws it hand-inked and
isometric in the OPS brand, as one self-contained HTML file with buttons that actually work. Ask how something works
and it labels the parts, lights each one up as it works, asks a Predict question before each key step, and narrates
every step in a plain caption under the figure.

Built for two audiences: students (teacher-led, projected or on Chromebooks) and staff PD.

## What every figure has

- Buttons for each real step of the process, in order, with sensible answers to out-of-order presses
- A caption under the figure: one plain sentence about what is happening right now, held long enough to read, with
  the step's earlier captions on a wheel above it, tilting back and fading, so nothing is lost
- **Walk through**: Back / Step 2 of 5 / Next, which runs the real steps in order. Next (or →) never waits: pressed
  mid-step, it finishes that step and goes on, and ← goes back
- **Present**, which every figure opens in: laid out for projecting. The caption has the top to itself, where the back of a classroom reads best,
  with the newest caption on top. The title stands in a column left of the figure and the stats in one on its right. The buttons sit in one row under the
  figure, with Back and Next at its ends, and a clicker's Page Up / Page Down work them.
- **A phone layout** for phones and narrow windows (and a phone turned sideways, figure left, controls right): a small
  FIG tag at the top, the figure as big as the space allows with its stats in the corner, the caption under it right above the buttons, the buttons in one row
  you swipe sideways with the next one always centred, ← 3 / 5 Next →, a swipe on the figure for Next or Back, and the
  settings in a sheet behind a gear
- **Settings** fold away into one small button (Present does this itself), leaving more room for the figure
- The page fits the window or the SpartBoard frame: the figure scales to the space left, so there's no scrolling
  between the buttons, the picture and the caption
- Colour swatches in the OPS families (every figure starts blue), a hand-drawn wobble slider (starting low) and a
  Speed slider (¼× to 3×) for every animation

How-it-works figures also get part labels and **Predict first** questions (off until a teacher turns them on). URL
switches: `?present=0`, `?steps=0`, `?labels=0`, `?predict=1`, `?speed=2`, `?settings=0`, `?pal=red`, and `?touch=1`
to test the phone layout's touch controls with a mouse.

## Try

- a 3D printer: heat it, load the filament, print something, take it off
- how does a toaster know when to pop? for my 6th graders
- a projector, showing how the image gets from the lamp to the screen, for staff PD
- a vending machine where I can put in coins and buy a drink
- create the interactive walkthrough for bluetooth headphones

Claude saves an `.html` file and offers to save it to SpartBoard as a mini-app.

## What's inside

- `SKILL.md`: the instructions Claude follows
- `assets/core.js`: the engine (projection, 3D shapes and shading, ink, labels, the OPS page shell, caption,
  Predict, Walk through, Present mode)
- `assets/examples/`: complete figures to learn from (3D printer, Bluetooth headphones, washing machine, vending machine)
- `scripts/build.py`: makes one self-contained file: `python scripts/build.py figure.html OUT.html`. Add
  `--strip-comments` to drop the scripts' comments and blank lines (about a fifth smaller, for a SpartBoard mini-app)

Figures load Lexend and Roboto from Google Fonts and fall back to system fonts offline. Nothing else is fetched.

## Credits

- Based on [Colorfigures](https://april-zhu.com/colorfigures) by April Zhu (MIT), which is built on
  [ISO-GLOW](https://isoglow.dev) by April Zhu (MIT), which is built on
  [iso-figure](https://github.com/MrBongoC/ai-iso-skill) by Tolga Cohce (MIT).
- OPS brand, teaching layer, and the 3D printer and headphones examples: Paul Ivers, Orono Public Schools.

## License

MIT. See [LICENSE](LICENSE).

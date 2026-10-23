# OPS Figures gallery

A GitHub Pages site with every OPS figure on it: https://ops-pivers.github.io/claude-skills/

It is built by `.github/workflows/gallery.yml` on every push to `main` that touches the ops-figures skill or this
folder, so it never needs editing by hand and the plugin doesn't change.

- The skill's examples (`plugins/pauls-skills/skills/ops-figures/assets/examples/`) are always on it.
- To add another figure, put its `.html` in `gallery/figures/`. A working figure that loads `<script src="core.js">` is
  built with the skill's `build.py`; a built, self-contained one (an `OUT.html`, or a figure saved from SpartBoard) is
  copied as is. The card's Fig. number, title and hint come from the figure's `mountFigure({...})`.

Build it locally: `python gallery/build.py _site --shots` (needs Chrome for the card pictures, and Pillow to crop them).

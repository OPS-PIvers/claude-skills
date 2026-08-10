---
name: ops-brand-guidelines
description: "Apply the Orono Technology (OPS Tech) brand identity — colors, typography, and logos — to slide decks, PD presentations, documents, newsletters, dashboards, and web apps built for the Orono district. Use this skill whenever the user asks for slides, a deck, a PD presentation, a teacher handout, a newsletter, a report, an HTML tool, a dashboard, or any school-facing material, even if they don't explicitly say 'on-brand' or 'OPS style' — the default for Paul's work is Orono Middle School, and the default should be on-brand. Also use when the user mentions Orono, OPS, OMS, Spartan, brand colors, the torch logo, Lexend, or Roboto. Primary focus: professional development slide decks. Also covers docx, HTML, CSS, React. Includes a portable DESIGN.md token spec for handing off to other agents."
license: MIT License
---

# Orono Technology (OPS Tech) Brand Guidelines

## How to think about this skill

This skill gives you the **ingredients** for the OPS Tech brand — not a rigid template. Your job is to build something clean and on-brand using those ingredients, while making good design choices for the specific piece in front of you.

**The two modes:**

1. **Official / district-facing work** (PD presentations, staff communications, reports for parents, district newsletters, teacher-facing tools) — default to the OPS palette. Blue is primary, red accents, Lexend + Roboto typography. This is the serious, trustworthy voice of Orono Technology.

2. **Playful / student-facing work** (classroom games, student-facing interactives, fun newsletters, holiday-themed stuff, silly internal tools) — you have latitude. Pick a palette that fits the topic. The OPS colors can still appear (often as accents), but don't force them. The **logos stay as-issued** in either mode — never recolor or redraw them.

If you're not sure which mode applies, ask — or just pick the mode that matches the tone Paul is using when he describes the piece. "Build me a PD deck for teachers" is Mode 1. "Make a fun little arcade game for 6th graders to practice fractions" is Mode 2.

### Deference to the pptx skill

The pptx skill has good general design advice — dominance, visual motif, variety of layouts, no boring text-only slides, etc. **Follow it.** This skill doesn't override that — it supplies the brand ingredients those principles should work with. For official decks, the pptx skill's "pick a bold content-informed palette" means *use OPS blue/red/white boldly*. For playful decks, it means what it normally means.

### DESIGN.md — the canonical token spec

This skill folder contains a `DESIGN.md` file alongside this SKILL.md. **DESIGN.md is the machine-readable source of truth for brand tokens** — colors, typography, spacing, rounded corners, and component styles — following the [DESIGN.md format](https://github.com/google-labs-code/design.md).

**When to read DESIGN.md:**

- **For Mode 1 work**, read DESIGN.md before building anything. It's fast — YAML frontmatter with every token you'll need, prose explaining the rationale. Use the `components` tokens when building UI (button variants, inputs, callouts, cards, tables, nav, badges) — they encode the *combinations* (background + text + radius + padding + type) that make a piece feel coherent instead of just color-correct.
- **When handing off to another agent** (Claude Code, Cursor, a Figma plugin, a different LLM), share `DESIGN.md` as a standalone artifact. It's portable by design and doesn't require this skill's context to be useful.
- **When generating a tokens.json, Tailwind config, or CSS custom properties file**, derive it from DESIGN.md rather than reparsing the tables in this file. DESIGN.md's token references (`{colors.blue}`, `{typography.body-md}`) map cleanly to any of those output formats.

**Relationship between the two files:**

- **DESIGN.md**: portable, declarative, tokenized. *What* the brand is.
- **SKILL.md (this file)**: contextual, judgment-driven, medium-specific. *How* to apply the brand — when to go dark vs light, how to handle logos on different backgrounds, which mode to default to, what the pptxgenjs starter looks like, why Primary Logo dies on Blue Dark.

The tables and CSS variables still appearing in this file are duplicates kept for in-context convenience. If they ever disagree with DESIGN.md, DESIGN.md wins.

---

## The color system

> The canonical token values live in `DESIGN.md`. What follows is the same palette presented for in-context reading, with role/usage guidance.

The official palette is red/white/blue — a district tradition. There are variations within each family, not just one blue and one red. Use the variations to build hierarchy without leaving the palette.

### Blues

| Name | Hex | Typical use |
|---|---|---|
| **Blue Dark** | `#1d2a5d` | Heading 1 text, strongest emphasis, full-bleed title backgrounds |
| **Primary Blue** | `#2d3f89` | **Default brand blue.** Headers, nav, primary buttons, first chart series |
| **Blue Light** | `#4356a0` | Supporting elements, hover states, third chart series |
| **Blue Lighter** | `#eaecf5` | Callout backgrounds, subtle tints, table row highlights |

### Reds

| Name | Hex | Typical use |
|---|---|---|
| **Red Dark** | `#7a1718` | Strong alert text, deepest red emphasis |
| **Primary Red** | `#ad2122` | **Default brand red.** Accents, warning callouts, second chart series |
| **Red Light** | `#c13435` | Secondary headings, hover states, fourth chart series |
| **Red Lighter** | `#e5c7c7` | Background for warning callouts and "action required" rows |

### Grays

| Name | Hex | Typical use |
|---|---|---|
| **Darkest** | `#1a1a1a` | Maximum-contrast body text when needed |
| **Dark** | `#333333` | **Default body text color.** Use over pure black. |
| **Primary Gray** | `#666666` | Muted labels, captions, subdued headings |
| **Light** | `#999999` | Disabled states, very muted text |
| **Lighter** | `#cccccc` | Borders, dividers, subtle rules |
| **Lightest** | `#f3f3f3` | Off-white backgrounds, disabled field backgrounds |

### Dominance

When using the OPS palette, aim for roughly **60% blue / 15% red / 25% gray and neutral**. Red accents; it doesn't compete with blue for attention. If a piece is reading "too red," pull it back.

### Charts and data viz

- **Multi-series color order:** Primary Blue → Primary Red → Blue Light → Red Light. Don't introduce outside colors unless the data genuinely needs categorical meaning the brand palette can't express (and even then, say so).
- **Sequential/heatmap gradient:** `#eaecf5` → `#1d2a5d` (Blue Lighter to Blue Dark).

### Going off-palette (Mode 2)

For playful or student-facing pieces, you don't have to stay in blue/red/white. Pick a palette that serves the topic. Some guardrails:
- Keep it intentional — pick 3-4 colors that work together, don't rainbow.
- If the piece also has Orono branding (logo, school name), let the OPS colors appear somewhere — even as a small accent or in the logo lockup — so it still feels connected.
- Pure black body text still usually loses to `#333333` — that principle carries over.

---

## Typography

> The canonical type scale — 14 levels from display (72px) down to label-sm (11px), with full font-family, size, weight, line-height, and letter-spacing — is defined in `DESIGN.md`. What follows is medium-specific starter guidance.

- **Headings: Lexend** — clean, slightly wide, readability-focused. Feels confident without being corporate.
- **Body: Roboto** — workhorse sans-serif.
- **Fallbacks** (PowerPoint without Lexend installed, offline contexts, etc.): **Calibri** then **Arial**. Never Times New Roman. Never Comic Sans. Never a decorative display font for body copy.

### Size hierarchy

The specific point sizes depend on the medium — slides run larger than documents. What matters is keeping the *relative* hierarchy consistent.

**Slides (16:9, standard viewing):**
- Hero title: 40-54pt Lexend Bold, Blue Dark
- Slide title: 28-36pt Lexend Bold, Blue Dark
- Body: 16-20pt Roboto, Dark Gray
- Caption / footer: 10-12pt Roboto, Primary Gray

**Documents:**
- Title: 26pt Lexend Bold, Primary Blue
- H1: 22pt Lexend Bold, Blue Dark
- H2: 18pt Lexend Bold, Red Light
- H3: 14pt Lexend Bold, Primary Gray
- Body: 11-12pt Roboto, Dark Gray

These are starting points — adjust for the piece.

### Web CSS

Drop this in to get the full system in any HTML/React project:

```css
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');

:root {
  /* Blues */
  --ops-blue-dark: #1d2a5d;
  --ops-blue: #2d3f89;
  --ops-blue-light: #4356a0;
  --ops-blue-lighter: #eaecf5;

  /* Reds */
  --ops-red-dark: #7a1718;
  --ops-red: #ad2122;
  --ops-red-light: #c13435;
  --ops-red-lighter: #e5c7c7;

  /* Grays */
  --ops-gray-darkest: #1a1a1a;
  --ops-gray-dark: #333333;
  --ops-gray: #666666;
  --ops-gray-light: #999999;
  --ops-gray-lighter: #cccccc;
  --ops-gray-lightest: #f3f3f3;

  /* Type */
  --ops-font-heading: "Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --ops-font-body: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
}

body { font-family: var(--ops-font-body); color: var(--ops-gray-dark); }
h1, h2, h3, h4, h5, h6 { font-family: var(--ops-font-heading); }
h1 { color: var(--ops-blue-dark); }
h2 { color: var(--ops-red-light); }
```

---

## Logos — how to pick and place them

This is the part to get right. There are four logo files in `Resources/`, each with a specific job.

### The four logos

| File | What it is | When to use it |
|---|---|---|
| `Primary Logo.png` | Horizontal lockup: red torch + "ORONO" (blue) + "TECHNOLOGY" (red), transparent background | **The default.** Title slides, document headers, email headers, web nav bars — anywhere you have horizontal room and the logo is the hero. |
| `Secondary Logo.png` | Square badge: stacked "ORONO" / torch / "TECHNOLOGY" with blue and red framing borders | Square/compact spaces: social profile images, footers, business cards, app icons. Works as a small corner mark on content slides when you want one. |
| `Torch Icon.png` | Torch alone with small "Orono Technology" wordmark below it | Decorative accent, watermark, favicon, "about" hero art. Friendlier than the full logos at medium sizes. |
| `OPS Tech Logo 2.png` | Alternate horizontal lockup with a stylized geometric torch | Use only when specifically requested, or on materials that want a slightly more modern/angular feel. Default to Primary when in doubt — don't silently swap to this one. |

### Placement guidance (not rigid rules)

**Slides:**
- Title slide: Primary Logo, centered or top-aligned, sized so it reads clearly but doesn't dominate the title. Leave breathing room.
- Content slides: Usually cleaner *without* a logo on every slide. If you want a presence, a small Torch Icon or Secondary Logo in a corner (≈0.7" wide) works. Don't put the full Primary Logo on every slide.
- Closing slide: Primary Logo again, same treatment as the title slide.

**Documents / newsletters:**
- Header: Primary Logo, left-aligned or centered, roughly 2-3" wide on letter size.
- Footer: Torch Icon or Secondary Logo, small, with page number in Primary Gray.

**Web:**
- Nav bar: Primary Logo, left side, ~40-48px tall.
- Favicon: Torch Icon, cropped tight to the torch.
- Footer: Primary or Secondary Logo.

### Logo don'ts

- **Don't recolor.** The blue/red in the wordmark and torch are fixed. No tints, no monochrome versions unless specifically requested.
- **Don't stretch.** Maintain aspect ratio always.
- **Don't crop** the Primary or Secondary logos. Torch Icon can be cropped tight for favicon use.
- **Don't place on busy photographic backgrounds** without a solid shape behind for legibility.
- **Don't recreate in code.** No CSS torches, no emoji swaps. Use the PNG files.
- **Don't shrink below ~80px wide on screen or ~0.75" in print** — the wordmark breaks down.
- **Don't apply a colored logo to a colored background** where the torch red or wordmark blue will clash. On dark blue backgrounds, prefer the Torch Icon alone, or ask whether a white-knockout version would be helpful.

### Bundling logos with output

When adding a logo to a deck or doc, **copy the file** from `Resources/` into the working directory alongside the output. Don't reference the skill's Resources path in the final deliverable — the user needs the asset bundled with the output.

---

## Slide decks — the primary use case

Most of what you'll build here is a PD deck for staff or a presentation to district audiences. Follow the pptx skill's design principles (dominance, variety, visual elements on every slide, no boring text-only slides). The job of *this* skill is to feed that good design the OPS ingredients.

### Dark mode is the default for slides

**Slides default to a Blue Dark (`#1d2a5d`) background** — not stark white. The Orono blue carries the brand, reads as confident and modern, and looks great projected in a classroom or conference room where harsh white backgrounds are fatiguing. Only switch to a light background if:
- The user explicitly asks for light/white
- The piece is a Mode-2 playful deck where a different palette suits the topic better
- The content genuinely needs it (e.g., a data-heavy slide where a pale sequential heatmap won't work on dark)

Mixed decks are fine too — a dark deck can have one or two lighter content slides for specific needs (a chart slide, a callout slide where Red Lighter / Blue Lighter need to show their tint). Just commit fully to dark *or* light on any given slide; don't half-and-half a single slide.

### The dark-mode color roles

Every color gets a new job on a dark background. Don't just drop light-mode body text onto a Blue Dark canvas — contrast breaks.

| Role | Color | Hex |
|---|---|---|
| Slide background (default) | Blue Dark | `#1d2a5d` |
| Alternate background (for variety) | Primary Blue | `#2d3f89` |
| Primary body text on dark | White | `#FFFFFF` |
| Secondary / muted text on dark | Blue Lighter | `#eaecf5` |
| Caption / footer / page number | `#8da0c7` (a softened Blue Light) or Blue Lighter at ~70% opacity |
| Accent / emphasis text | Red Light | `#c13435` — pops beautifully on Blue Dark |
| Stronger accent | Primary Red | `#ad2122` |
| Card / callout surface | Primary Blue (`#2d3f89`) — one step lighter than the background |
| Info callout background | A slightly tinted Blue Light — try `#3a4d9c` |
| Warning callout background | Darkened Primary Red — try `#6b1617` with Red Lighter text |
| Dividers / thin rules | Blue Light (`#4356a0`) at lower visual weight |

For charts on dark backgrounds, the color order still works (Primary Blue → Primary Red → Blue Light → Red Light) but consider adding white or Blue Lighter as axis/grid colors.

### What on-brand dark decks look like

- **Title slide**: Blue Dark background. Logo handling needs care here — **the Torch Icon's blue base blends into Blue Dark**, and the Primary Logo's blue wordmark disappears entirely. Use one of these three options:
  1. **Secondary Logo (recommended)** — the square badge has white interior space and blue/red framing borders that carry their own contrast. Works at 1.5-2.0" wide centered on the slide.
  2. **Primary Logo on a white plate** — put the Primary Logo inside a white rounded rectangle (roughly 7" wide × 1.9" tall, ~0.3" padding). The plate is deliberate framing, not a mistake.
  3. **Torch Icon, BUT sized large (1.5-2.5" tall) and without relying on the wordmark below it** — the torch itself reads fine at that scale because the red flames pop; the tiny "Orono Technology" text below it is unreadable on dark and should not be counted on. Pair with a large session title below and your branding is clear from the torch alone.
- **Session title** in White Lexend Bold (44-54pt), **subtitle** in Red Light (20-24pt), **date/presenter** in Blue Lighter (14pt).
- **Section dividers**: Still full-bleed but use **Primary Blue** (`#2d3f89`) instead of Blue Dark to create contrast from the surrounding content slides. White Lexend title, small Red accent line.
- **Content slides**: Blue Dark background. Title in white Lexend Bold. Body in white Roboto or Blue Lighter for muted text. Primary Red or Red Light for emphasis words and one key stat per slide. Vary the layout — two-column, icon-row, stat callout, image + text.
- **Cards / callouts**: Use Primary Blue as the card surface against the Blue Dark background — one step lighter. Add a thin Blue Light border or a Red left accent for definition.
- **Data slides**: If a chart needs a light surface to read well, put the chart itself in a white or `#f3f3f3` rounded rectangle on the dark slide — let the chart breathe in its own space. Don't force a bar chart onto Blue Dark if the bars won't read.
- **Closing**: Same treatment as the title slide — Secondary Logo, Primary Logo on a plate, or a large Torch Icon. "Questions?" in white Lexend Bold.

### When to go light instead

Light backgrounds (white / `#f3f3f3`) are the right call when:
- The user asks
- The piece is going to be printed (dark backgrounds waste toner and often print muddy)
- The deck is mostly dense data tables or multi-series charts where dark mode fights the content
- It's a Mode-2 piece with a palette that needs a light canvas

If you go light, the color roles from the main stylesheet apply — Blue Dark text for headings, Dark Gray body, blue/red callouts. Don't mix dark and light randomly across a deck — pick one and commit, or use light sparingly as the exception (like for a data-heavy slide inside an otherwise dark deck).

### Don'ts for Orono decks

- Don't default to generic blue-gray palettes — use the specific OPS hex values.
- Don't use more than 2 fonts. Lexend + Roboto. That's it.
- Don't center body text — left-align. Center titles only.
- Don't create plain text-only bullet slides. Add a visual element — an icon, a callout, a colored stat block, an image.
- Don't put the full Primary Logo on every content slide. A small Secondary or Torch corner mark is fine if you want a presence.
- Don't place the Primary Logo directly on Blue Dark without a plate behind it — the blue "ORONO" wordmark disappears into the background. Use the Torch Icon, the Secondary Logo, or put Primary Logo on a white plate.
- Don't use pure black (`#000000`) for body text on light slides — use Gray Dark (`#333333`). On dark slides, use white (`#FFFFFF`).
- Don't use `valign: "middle"` on body text boxes by default — it floats text in the vertical center of the container and leaves awkward gaps. Use `valign: "top"`.
- Don't mix dark and light slides inconsistently across a single deck. Commit to dark-with-occasional-light-exceptions, or commit to light — don't alternate arbitrarily.

### pptxgenjs starter

When building a deck from scratch, the basics:

```javascript
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches

// Brand colors (no leading # for pptxgenjs)
const OPS = {
  blueDark: "1d2a5d", blue: "2d3f89", blueLight: "4356a0", blueLighter: "eaecf5",
  redDark: "7a1718", red: "ad2122", redLight: "c13435", redLighter: "e5c7c7",
  grayDark: "333333", gray: "666666", grayLight: "999999",
  grayLighter: "cccccc", grayLightest: "f3f3f3", white: "FFFFFF",
};

// Example dark-mode content slide (the default for slides)
const s = pres.addSlide();
s.background = { color: OPS.blueDark };
s.addText("Slide Title", {
  x: 0.6, y: 0.5, w: 12.0, h: 0.8,
  fontSize: 32, fontFace: "Lexend", bold: true, color: OPS.white,
  valign: "top",
});
s.addText("Body content…", {
  x: 0.6, y: 1.5, w: 12.0, h: 5.5,
  fontSize: 18, fontFace: "Roboto", color: OPS.white,
  valign: "top",
});
```

No forced header bars, no mandatory sidebars — compose the slide that fits the content.

---

## Documents & newsletters (Word, Google Docs)

- **Header**: Primary Logo left-aligned, ~2.5" wide. Thin Blue Dark horizontal rule below it if you want a visual separator.
- **Body**: Roboto 11pt, Dark Gray (`#333333`).
- **Section headings**: Lexend Bold — H1 Blue Dark 22pt, H2 Red Light 18pt, H3 Primary Gray 14pt.
- **Callout boxes**: Same pattern as slides — blue-tinted for info, red-tinted for warnings.
- **Footer**: Page number in Primary Gray Roboto 9pt, small Torch Icon optional.
- **Tables**: Primary Blue header row with white text, alternating white and `#f3f3f3` body rows, Primary Red text for "action required" cells.

---

## Web apps, HTML tools, dashboards

> For web/HTML builds, `DESIGN.md`'s `components` section has full token specs for every button variant, input state, callout type, card style, table atom, nav component, and badge — with hover/focus/error/disabled states wired up. Prefer those tokens over improvising from the color tables below.

Drop in the CSS variables block from the Typography section. Then:

- **Top nav**: Primary Blue background, white Lexend links, Primary Logo on the left at ~40px tall.
- **Primary buttons**: Primary Blue bg, white Lexend Medium text, 6px radius.
- **Secondary buttons**: Primary Gray bg, white text, 6px radius.
- **Tertiary buttons**: White bg, 1.5px Primary Blue border, Primary Blue text.
- **Inputs**: 1.5px `#cccccc` border, 6px radius. Focus: Primary Blue border. Error: Primary Red border, Red Light error label above.
- **Info callout**: `#eaecf5` bg, 3px Primary Blue left border, Dark Gray text.
- **Warning callout**: `#e5c7c7` bg, 3px Primary Red left border, Red Dark text.
- **Tables**: Primary Blue header row (white text), alternating white / `#f3f3f3` rows, Red Lighter row bg for "action required" rows.
- **Charts**: Chart color order (`#2d3f89`, `#ad2122`, `#4356a0`, `#c13435`).
- **Favicon**: `Torch Icon.png`, cropped tight.

---

## Handoff to other agents / tools

When Paul wants to use this brand outside of Claude.ai — in Claude Code, Cursor, a Figma plugin, a Tailwind project, or a different LLM — **hand off `DESIGN.md`** as a standalone artifact. It's self-contained and follows a published open spec, so any tool that supports the format (or that you can prompt to read YAML + markdown) can consume it without needing SKILL.md.

Common handoff patterns:
- **Claude Code / Cursor**: drop `DESIGN.md` at the repo root. Point the agent at it with something like "read DESIGN.md and follow it for all styling decisions."
- **Tailwind config**: the `colors`, `typography`, `spacing`, and `rounded` token groups map directly to `tailwind.config.js` theme values.
- **CSS custom properties**: every token becomes a `--ops-*` variable. The CSS block in the Typography section above is a subset of what DESIGN.md can generate.
- **Figma variables**: `colors.*` and `typography.*` map one-to-one with Figma's variable system.

---

## Resources reference

Everything is in this skill folder:

| File | Use |
|---|---|
| `DESIGN.md` | **Portable token spec.** Canonical source for colors, typography, spacing, rounded, and component tokens. Hand off to other agents/tools, or read in-context when building UI. |
| `Resources/Primary Logo.png` | Default horizontal logo. Title slides, headers, nav bars. |
| `Resources/Secondary Logo.png` | Square badge. Corner marks, social profiles, footers. |
| `Resources/Torch Icon.png` | Torch graphic. Accents, watermarks, favicons. |
| `Resources/OPS Tech Logo 2.png` | Alternate horizontal lockup. Use only on request. |
| `Resources/OPS Tech Stylesheet.pdf` | The authoritative printed stylesheet. Rasterize and view if you need the visual source of truth behind DESIGN.md. |
| `Resources/OPS Tech Intro Video.mp4` | Intro video for PD sessions. Embeddable on title slides when appropriate. |
| `Resources/Orono Tech Intro Outro Animation.gif` | Animated intro/outro for digital materials. |

---

## Quick checklist before shipping

- [ ] Does this feel like Orono, or could it be from any school district?
- [ ] If Mode 1 (official): blue dominates, red accents, no stray off-palette colors
- [ ] For UI work: component token combos from DESIGN.md used (or matched) — not improvised color pairings
- [ ] Slides: Blue Dark background by default (not stark white) unless there's a reason
- [ ] Lexend for headings, Roboto for body — no Times, no Comic Sans, no script fonts
- [ ] Text contrast: white text on dark slides, `#333333` on light pieces, never pure black on white
- [ ] Primary Logo isn't disappearing into a dark background (use Torch Icon, Secondary Logo, or a white plate)
- [ ] The right logo is in the right spot, correctly sized, not recolored or stretched
- [ ] Logos are bundled with the output file, not referenced from the skill path
- [ ] No rigid template being forced where the content doesn't want it
- [ ] Slides are consistently dark or consistently light — not alternating arbitrarily

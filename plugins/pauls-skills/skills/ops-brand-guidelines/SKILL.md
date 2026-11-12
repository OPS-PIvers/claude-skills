---
name: ops-brand-guidelines
description: "Apply the Orono Technology (OPS Tech) brand identity (colors, typography, logos, layout, and the OPS voice for copy) to slide decks, PD presentations, documents, newsletters, dashboards, and web apps built for the Orono district. Use this skill whenever the user asks for slides, a deck, a PD presentation, a teacher handout, a newsletter, a report, an HTML tool, a dashboard, or any school-facing material, even if they don't explicitly say 'on-brand' or 'OPS style'. The default for Paul's work is Orono Middle School, and the default should be on-brand. Also use when the user mentions Orono, OPS, OMS, Spartan, brand colors, the torch logo, Lexend, or Roboto. Primary focus: professional development slide decks. Also covers docx, HTML, CSS, React. Includes a portable DESIGN.md token spec for handing off to other agents."
license: MIT License
---

# Orono Technology (OPS Tech) brand guidelines

## How to think about this skill

This skill gives you the ingredients for the OPS Tech brand: colors, type, logos, structure rules, and the OPS voice. It is not a rigid template. Build the piece the content needs, using these ingredients.

**The two modes:**

1. **Official / district-facing** (PD presentations, staff communications, parent reports, district newsletters, teacher-facing tools). Use the OPS palette. Blue is primary, red accents, Lexend and Roboto.
2. **Playful / student-facing** (classroom games, student interactives, fun newsletters, holiday pieces). You may pick a palette that fits the topic, with OPS colors present as accents. **The palette is the only thing that changes.** The logos stay as issued. The structure rules, the decoration bans, and the copy rules apply in both modes. Playful comes from color, illustration, and motion, not from added decoration.

If you're not sure which mode applies, match the tone Paul uses to describe the piece. "Build me a PD deck for teachers" is Mode 1. "Make a fun arcade game for 6th graders to practice fractions" is Mode 2.

### The three files

- **`DESIGN.md`** is the source of truth for tokens (colors, type, spacing, radius, components) and the portable spec to hand to other agents. Read it before building any Mode 1 piece. If this file and DESIGN.md disagree, DESIGN.md wins.
- **`references/voice-and-copy.md`** holds the OPS voice: sentence rules, headings, slide titles, and the words inside web tools. Read it before writing any copy.
- **`SKILL.md`** (this file) covers judgment by medium: dark vs. light slides, logo handling, the pptxgenjs starter, documents, and web.

### Relationship to other skills

- **pptx skill.** Follow its mechanics and its advice on variety and dominance. Where it says to add a visual element to every slide or avoid text-only slides, this skill overrides it: a slide shows what the content needs, and a short text slide is fine.
- **deslop skill.** It holds the full ban lists for machine-generated tells in prose and in UI. This skill states what to do instead. Run `deslop` as the final pass on anything you build here.

---

## Structure: what replaces boxes and decoration

These rules apply to every medium.

**Separate with hairlines and space.** Lists, settings, schedules, FAQs, link lists, and text sections sit on the page. A 1px hairline goes between items. A new section gets space and a heading. Most pieces need no boxes at all.

**Cards are the exception.** Use a card only for a discrete object a person picks, opens, drags, or compares side by side (a choice in a picker, an item on a board, a resource with a thumbnail). Never use a card to group text. Never nest cards. Never lay out three cards across just to fill a row.

**Banned decoration:**

- A colored stripe on one side of a box (left border, top strip, or a "red left accent").
- An accent rule under a title or before a section label.
- Uppercase letter-spaced labels as section markers ("COLOR PALETTE").
- Icons before every heading, or an icon in a colored rounded square at the top of a card. Keep an icon only when it helps tell items apart or names an action.
- Shadows and glows.
- Pills and badges for status. Status is a word ("Active," "Pending," "Action required"). The only pill is a filter chip a person taps.
- Zebra-striped tables and filled header rows.

**Callouts** are a tinted block with no border. Each one opens with a bold lead word that says what kind of note it is ("Heads up:", "Due Friday:", "Action required:"). Use one for a note the reader must not miss, not one per section.

**Tables** have a bold header row over a heavier rule, and hairlines between body rows. A row that needs action gets the Red Lighter tint and a word saying why.

---

## The color system

> Canonical values live in `DESIGN.md`. This is the same palette with usage notes.

The official palette is red, white, and blue, a district tradition. Each family has variations, so you can build hierarchy without leaving the palette.

### Blues

| Name | Hex | Typical use |
|---|---|---|
| **Blue Dark** | `#1d2a5d` | Heading 1 text, full-bleed slide backgrounds |
| **Primary Blue** | `#2d3f89` | **Default brand blue.** Headings, nav, primary buttons, first chart series |
| **Blue Light** | `#4356a0` | Hover states, hairlines on dark slides, third chart series |
| **Blue Lighter** | `#eaecf5` | Info callout tint, muted text on dark slides |

### Reds

| Name | Hex | Typical use |
|---|---|---|
| **Red Dark** | `#7a1718` | Warning callout text, deepest red emphasis |
| **Primary Red** | `#ad2122` | **Default brand red.** Accents, commit buttons, second chart series |
| **Red Light** | `#c13435` | H2 headings in documents, emphasis on dark slides, fourth chart series |
| **Red Lighter** | `#e5c7c7` | Warning callout tint, "action required" table rows |

### Grays

| Name | Hex | Typical use |
|---|---|---|
| **Darkest** | `#1a1a1a` | Maximum-contrast text when needed |
| **Dark** | `#333333` | **Default body text.** Use over pure black. |
| **Primary Gray** | `#666666` | Captions, muted labels, H3 headings |
| **Light** | `#999999` | Disabled text |
| **Lighter** | `#cccccc` | Input and card borders |
| **Lightest** | `#f3f3f3` | Disabled field backgrounds, chart plates |

Hairlines between list items use `#e0e0e0` (`gray-200` in DESIGN.md).

### Dominance

Official pieces land near **60% blue / 15% red / 25% neutral**. Red accents. If a piece reads too red, pull it back.

### Charts

- **Series order:** Primary Blue, Primary Red, Blue Light, Red Light. Add an outside color only when the data needs a category the palette can't express, and say so.
- **Sequential gradient:** `#eaecf5` to `#1d2a5d`.
- Label the data directly where you can. Every chart of real data gets a source line.

---

## Typography

> The full scale (display 72px down to label-sm 11px) is in `DESIGN.md`.

- **Headings: Lexend.** Wide and readable. Confident without being corporate.
- **Body, labels, and buttons: Roboto.**
- **Fallbacks:** Calibri, then Arial. Never Times New Roman, Comic Sans, or a decorative display font.
- **Sentence case** for every heading, title, button, and label. Capitalize only the first word and proper nouns.

### Sizes

The relative hierarchy matters more than exact sizes.

**Slides (16:9):**
- Title slide: 40–54pt Lexend Bold
- Slide title: 28–36pt Lexend Bold
- Body: 18–24pt Roboto
- Caption, footer, source line: 10–12pt Roboto

**Documents:**
- Title: 26pt Lexend Bold, Primary Blue
- H1: 22pt Lexend Bold, Blue Dark
- H2: 18pt Lexend Bold, Red Light
- H3: 14pt Lexend Bold, Primary Gray
- Body: 11–12pt Roboto, Dark Gray

### Web CSS

```css
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');

:root {
  --ops-blue-dark: #1d2a5d;
  --ops-blue: #2d3f89;
  --ops-blue-light: #4356a0;
  --ops-blue-lighter: #eaecf5;

  --ops-red-dark: #7a1718;
  --ops-red: #ad2122;
  --ops-red-light: #c13435;
  --ops-red-lighter: #e5c7c7;

  --ops-gray-darkest: #1a1a1a;
  --ops-gray-dark: #333333;
  --ops-gray: #666666;
  --ops-gray-light: #999999;
  --ops-gray-lighter: #cccccc;
  --ops-gray-lightest: #f3f3f3;

  --ops-divider: #e0e0e0;

  --ops-font-heading: "Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --ops-font-body: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
}

body { font-family: var(--ops-font-body); color: var(--ops-gray-dark); }
h1, h2, h3, h4, h5, h6 { font-family: var(--ops-font-heading); }
h1 { color: var(--ops-blue-dark); }
h2 { color: var(--ops-red-light); }
```

---

## Logos

There are four logo files in `Resources/`, each with a specific job.

| File | What it is | When to use it |
|---|---|---|
| `Primary Logo.png` | Horizontal lockup: red torch, "ORONO" in blue, "TECHNOLOGY" in red, transparent background | **The default.** Title slides, document headers, email headers, web nav bars. |
| `Secondary Logo.png` | Square badge: stacked "ORONO" / torch / "TECHNOLOGY" with blue and red framing | Square or compact spaces: footers, profile images, app icons, a small corner mark. |
| `Torch Icon.png` | Torch alone with a small "Orono Technology" wordmark | Favicon, watermark, small accent. |
| `OPS Tech Logo 2.png` | Alternate horizontal lockup with a geometric torch | Only when requested. Don't swap to it on your own. |

### Placement

**Slides:**
- Title slide: Primary Logo (or a dark-slide option below), sized to read clearly without competing with the title.
- Content slides: usually no logo. If you want a presence, a small Torch Icon or Secondary Logo in a corner (about 0.7" wide).
- Closing slide: same treatment as the title slide.

**Documents and newsletters:**
- Header: Primary Logo, about 2–3" wide on letter size.
- Footer: small Torch Icon or Secondary Logo, with the page number in Primary Gray.

**Web:**
- Nav bar: Primary Logo on the left, about 40–48px tall.
- Favicon: Torch Icon, cropped tight to the torch.

### Logo don'ts

- **Don't recolor.** No tints and no monochrome versions unless requested.
- **Don't stretch.** Keep the aspect ratio.
- **Don't crop** the Primary or Secondary logos. The Torch Icon can be cropped tight for a favicon.
- **Don't place on busy photos** without a solid shape behind it.
- **Don't recreate in code.** No CSS torches, no emoji swaps. Use the PNG files.
- **Don't shrink below about 80px wide on screen or 0.75" in print.**
- **Don't put the Primary Logo directly on Blue Dark.** The blue wordmark disappears. See the dark-slide options below.

### Bundling logos

Copy the logo file from `Resources/` into the working directory next to the output. Don't reference the skill's path in a deliverable.

---

## Slide decks (the primary use case)

Read `references/voice-and-copy.md` before writing slide copy. The short version: content slides get **claim titles** that state the point ("Exit tickets take 3 minutes"). Title, section, agenda, and closing slides keep short labels. Read the titles alone, in order. They should tell the story.

### Dark is the default

Slides default to a **Blue Dark (`#1d2a5d`) background**. It carries the brand and is easier on a room than projected white. Go light when:
- The user asks.
- The deck will be printed.
- The deck is mostly dense tables or multi-series charts.
- It's a Mode 2 deck whose palette needs a light canvas.

A dark deck can have a light slide for a chart or a table. Commit to dark or light on each slide. Don't alternate arbitrarily across a deck.

### Dark-slide color roles

| Role | Color |
|---|---|
| Background | Blue Dark `#1d2a5d` |
| Section divider background | Primary Blue `#2d3f89` |
| Body and title text | White |
| Muted text | Blue Lighter `#eaecf5` |
| Captions, footers, source lines | `#8da0c7` |
| Emphasis on one large number or title word (24pt and up) | `#d06f70` (`red-400`). Red Light `#c13435` measures 2.5:1 on Blue Dark and fails contrast. For emphasis in body text, use bold white. |
| Hairlines between groups | Blue Light `#4356a0` |
| Featured item surface (one per slide at most) | Primary Blue `#2d3f89` |

### How dark slides are built

- **Content sits directly on Blue Dark.** Columns and rows are separated by space and Blue Light hairlines, not by boxes.
- **One featured item may get a surface.** A Primary Blue block for a single key number, or a white or `#f3f3f3` plate behind a chart that won't read on dark. Never a grid of blocks.
- **Title slide.** The Primary Logo's blue wordmark disappears on Blue Dark. Use one of these:
  1. **Secondary Logo (recommended).** Its white interior carries its own contrast. 1.5–2" wide.
  2. **Primary Logo on a white plate.** A white rounded rectangle (about 7" × 1.9", 0.3" padding) behind the logo.
  3. **Torch Icon, large (1.5–2.5" tall).** The red flames read at that size. The small wordmark under it won't, so don't rely on it.
- **Session title** in white Lexend Bold (44–54pt). **Subtitle** in Blue Lighter. **Date and presenter** in Blue Lighter, smaller.
- **Section dividers** are full-bleed Primary Blue with a white Lexend title. No accent line.
- **Closing slide** matches the title slide.

### Slide don'ts

- Don't add an icon, a callout, or a stat block to fill a text slide. Add a chart when the point is a number, and a photo or screenshot when people need to see something.
- Don't use more than two fonts.
- Don't center body text. Center titles only.
- Don't put the full Primary Logo on every content slide.
- Don't use pure black for text. Use `#333333` on light slides and white on dark slides.
- Don't use `valign: "middle"` on body text boxes. Use `valign: "top"`.
- Don't use any of the banned decoration in the Structure section above.

### pptxgenjs starter

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
  caption: "8da0c7",
};

// Dark content slide with a claim title and a hairline between two columns
const s = pres.addSlide();
s.background = { color: OPS.blueDark };
s.addText("Exit tickets take 3 minutes and show who's lost", {
  x: 0.6, y: 0.5, w: 12.0, h: 0.9,
  fontSize: 32, fontFace: "Lexend", bold: true, color: OPS.white, valign: "top",
});
s.addText("Left column", {
  x: 0.6, y: 1.8, w: 5.6, h: 4.8,
  fontSize: 20, fontFace: "Roboto", color: OPS.white, valign: "top",
});
s.addShape(pres.shapes.LINE, {
  x: 6.65, y: 1.8, w: 0, h: 4.8, line: { color: OPS.blueLight, width: 0.75 },
});
s.addText("Right column", {
  x: 7.1, y: 1.8, w: 5.6, h: 4.8,
  fontSize: 20, fontFace: "Roboto", color: OPS.white, valign: "top",
});
s.addText("Source: OMS exit ticket pilot, Fall 2026", {
  x: 0.6, y: 6.9, w: 12.0, h: 0.3,
  fontSize: 10, fontFace: "Roboto", color: OPS.caption,
});
```

No header bars, no sidebars, no boxes by default. Compose the slide the content needs.

---

## Documents and newsletters (Word, Google Docs)

- **Header:** Primary Logo, about 2.5" wide. No rule needed under it; space does the work.
- **Body:** Roboto 11pt, Dark Gray.
- **Headings:** Lexend Bold, sentence case. H1 Blue Dark 22pt, H2 Red Light 18pt, H3 Primary Gray 14pt.
- **Sections** are separated by space and a heading. A hairline between newsletter stories is fine.
- **Callouts:** a tinted paragraph with a bold lead word, no border. Blue Lighter for info, Red Lighter for warnings.
- **Tables:** bold header row over a heavier rule, hairlines between rows. Red Lighter tint for "action required" rows.
- **Footer:** page number in Primary Gray Roboto 9pt. A small Torch Icon is optional.

---

## Web apps, HTML tools, dashboards

> `DESIGN.md`'s `components` section has the full token specs, with hover, focus, error, and disabled states. Use them.

Drop in the CSS block from the Typography section. Then:

- **Top nav:** Primary Blue background, white links, Primary Logo on the left at about 40px.
- **Buttons:** Primary Blue for the main action, gray for secondary, outlined for a lighter alternative, red for destructive or commit. 8px radius. Labels name what happens.
- **Inputs:** 1.5px `#cccccc` border, 8px radius. Focus: Blue Light border plus a soft focus ring. Error: Primary Red border and a message below that says how to fix it.
- **Lists and settings:** rows on the page, 1px `#e0e0e0` hairlines between them. No card wrappers.
- **Cards:** only for discrete objects (see Structure). 1px `#cccccc` border, 12px radius, no shadow.
- **Callouts:** Blue Lighter or Red Lighter tint, no border, bold lead word.
- **Tables:** no header fill, bold header over a 2px rule, hairline rows, no zebra stripes.
- **Status:** a word in color, not a pill.
- **Charts:** series order `#2d3f89`, `#ad2122`, `#4356a0`, `#c13435`.
- **Favicon:** `Torch Icon.png`, cropped tight.

---

## Handoff to other agents and tools

When Paul wants to use this brand elsewhere (Claude Code, Cursor, a Figma plugin, a Tailwind project, another LLM), hand off `DESIGN.md`. It is self-contained, includes the essentials of the OPS voice, and follows a published format. Include `references/voice-and-copy.md` too when the work involves much copy.

- **Claude Code / Cursor:** put `DESIGN.md` at the repo root and tell the agent to follow it for all styling decisions.
- **Tailwind:** the `colors`, `typography`, `spacing`, and `rounded` groups map to `tailwind.config.js` theme values.
- **CSS custom properties:** each token becomes a `--ops-*` variable.
- **Figma variables:** `colors.*` and `typography.*` map one to one.

---

## Resources

| File | Use |
|---|---|
| `DESIGN.md` | Portable token spec. Source of truth for colors, type, spacing, radius, and components. |
| `references/voice-and-copy.md` | The OPS voice. Read before writing copy. |
| `Resources/OPS Tech Stylesheet.pdf` | One-page visual reference of the system, generated from `Resources/stylesheet.html`. |
| `Resources/stylesheet.html` | Source for the Stylesheet. When DESIGN.md changes, edit this and run `node scripts/render-stylesheet.js`. |
| `Resources/Primary Logo.png` | Default horizontal logo. |
| `Resources/Secondary Logo.png` | Square badge. |
| `Resources/Torch Icon.png` | Torch graphic. Favicons, small accents. |
| `Resources/OPS Tech Logo 2.png` | Alternate horizontal lockup. Only on request. |
| `Resources/OPS Tech Intro Video.mp4` | Intro video for PD sessions. |
| `Resources/Orono Tech Intro Outro Animation.gif` | Animated intro and outro for digital materials. |

---

## Checklist before shipping

- [ ] Mode 1: blue dominates, red accents, no off-palette colors.
- [ ] Lexend headings, Roboto body. Sentence case on every heading, title, button, and label.
- [ ] Lists, rows, and sections are separated by hairlines and space. Cards appear only for discrete objects, and none are nested.
- [ ] No side stripes, accent rules, caps labels, decorative icons, shadows, status pills, or zebra tables.
- [ ] Callouts are tinted, borderless, and open with a bold lead word.
- [ ] Slides: dark by default. Content slides have claim titles. The titles read as a story on their own.
- [ ] Every statistic has a source line.
- [ ] Body text is `#333333` on light and white on dark. Never pure black.
- [ ] The Primary Logo isn't sitting directly on Blue Dark.
- [ ] Logos are bundled with the output, not recolored or stretched.
- [ ] Copy follows `references/voice-and-copy.md`.
- [ ] Ran `deslop` on the finished piece.

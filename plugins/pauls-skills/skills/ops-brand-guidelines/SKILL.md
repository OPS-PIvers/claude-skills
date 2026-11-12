---
name: ops-brand-guidelines
description: "Apply the Orono Technology (OPS Tech) brand identity (colors, typography, logos, layout, and the OPS voice for copy) to slide decks, PD presentations, documents, newsletters, dashboards, and web apps built for the Orono district. Use this skill whenever the user asks for slides, a deck, a PD presentation, a teacher handout, a newsletter, a report, an HTML tool, a dashboard, or any school-facing material, even if they don't explicitly say 'on-brand' or 'OPS style'. Paul's work is for Orono Middle School by default, so treat it as on-brand unless he says otherwise. Also use when the user mentions Orono, OPS, OMS, Spartan, brand colors, the torch logo, or Lexend. Primary focus: professional development slide decks. Also covers docx, HTML, CSS, React. Includes a portable DESIGN.md token spec for handing off to other agents."
license: MIT License
---

# Orono Technology (OPS Tech) brand guidelines

## Files

- **`DESIGN.md`** is the source of truth for colors, type, spacing, components, slides, and layout. Read it before building anything. If this file and DESIGN.md disagree, DESIGN.md wins.
- **`references/example-tool.html`** is a finished staff web tool built to the spec. Open it before building a web tool or dashboard, and match its density and detail.
- **`references/voice-and-copy.md`** holds the OPS voice. Read it before writing copy.
- **`Resources/OPS Tech Stylesheet.pdf`** shows every token and component as rendered. It is generated from DESIGN.md.

## Modes

1. **Official** (PD decks, staff and parent communications, reports, newsletters, staff tools). Follow DESIGN.md in full.
2. **Playful** (classroom games, student interactives, holiday pieces). You may pick a palette that fits the topic, with OPS colors as accents. The logos stay as issued. Every other rule still applies.

"Build me a PD deck for teachers" is Official. "Make a fun arcade game for 6th graders to practice fractions" is Playful.

## Other skills

- **pptx.** Follow its mechanics. Where it says to add a visual to every slide, this skill overrides it. A short text slide is fine.
- **deslop.** It holds the full lists of machine-generated tells in prose and in UI. Run it as the final pass on anything you build here.

---

## The system in brief

DESIGN.md has the values. This is the shape of it.

- **One typeface.** Lexend for everything. Large headings are weight 500 with tight letter-spacing.
- **Navy is the ink.** Headings, primary buttons, bars, mastheads, and slide backgrounds are Blue Dark (`#1d2a5d`).
- **Red means "this needs you."** Everything tied to the item that needs action is Primary Red (`#ad2122`). Red is never used on an ordinary heading, button, or link.
- **Layered flat surfaces.** A web tool has a navy top bar, a pale slate page, and one white panel. There are no shadows.
- **Dense tools.** Interface text is 13px, controls are 32px tall, and table rows are 44px.
- **Status is a dot and a word.** Nothing is pill-shaped.

### Never

- A colored stripe on one side of a box.
- An accent rule under a title.
- An uppercase letter-spaced label over a section.
- An icon before a heading.
- A shadow or a glow.
- A pill or badge.
- A filled table header or striped rows.
- A panel inside a panel, or a list wrapped in cards.
- A row of large numbers with small labels under them. State the total as a sentence with one bar.
- A selection marked by a line that touches another line or an edge.

---

## Logos

The logo files are in `Resources/`.

| File | What it is | Where it goes |
|---|---|---|
| `Primary Logo.png` | Horizontal lockup with a red torch, "ORONO" in blue, and "TECHNOLOGY" in red | The footer of a web tool, document, or newsletter. Always on white. |
| `Secondary Logo.png` | Square badge with a white interior | The top left of a title slide, and any compact or dark space. |
| `Torch Icon.png` | The torch with a small wordmark | Favicon, cropped tight to the torch. |
| `OPS Tech Logo 2.png` | Alternate lockup with a geometric torch | Only when requested. |

Rules:

- Use the PNG files as issued. Don't recolor, stretch, crop, or redraw them.
- Keep the Primary Logo off navy. Its blue wordmark disappears there.
- Keep the Torch Icon off navy too. Its blue base disappears.
- Minimum width is 80px on screen and 0.75in in print.
- Copy the logo file next to the output. Don't reference this skill's path in a deliverable.

A navy top bar or masthead carries the tool or publication name in white Lexend. The logo goes in the footer.

---

## Slide decks

Read `references/voice-and-copy.md` before writing slide copy. Content slides get claim titles that state the point, such as "Exit tickets take 3 minutes." Title, section, agenda, and closing slides keep short labels. The titles alone, read in order, should tell the story.

Slides are navy. Use a white slide only for a dense table or when the deck will be printed.

| Slide | Build |
|---|---|
| Title | Secondary Logo top left at 0.8in. Title at 78pt, weight 500, set low on the left. A Blue Light hairline under it. Audience on the left and date on the right at 16pt. |
| Content | Title at 30pt, weight 500, top left. Body at 20pt, weight 300, in `#c0c7e0`. Rows separated by Blue Light hairlines. |
| One number | The number at 180pt in white. A caption under it at 20pt. |
| Section divider | Solid Primary Red. White title at 72pt, set low on the left. |
| Chart | The series to look at is white. Other series are Blue Light (`#4356a0`). Label values directly. |
| Closing | Same layout as the title slide. |

Every statistic gets a source line at 10pt in `#8da0c7`, bottom left.

No red in the palette passes contrast as text on navy. Emphasis on navy is white and larger.

Content sits directly on the slide. Don't add boxes, icons, or a stat block to fill a text slide. Add a chart when the point is a number, and a photo or screenshot when people need to see something.

### pptxgenjs starter

```javascript
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches

// Brand colors (no leading # for pptxgenjs)
const OPS = {
  navy: "1d2a5d", blue: "2d3f89", blueLight: "4356a0", red: "ad2122",
  white: "FFFFFF", muted: "c0c7e0", caption: "8da0c7", redMuted: "f5e3e3",
};
const FONT = "Lexend";

// Title slide
const t = pres.addSlide();
t.background = { color: OPS.navy };
t.addImage({ path: "Secondary Logo.png", x: 0.75, y: 0.62, w: 0.8, h: 0.8 });
t.addText("Exit tickets", {
  x: 0.75, y: 4.2, w: 11.8, h: 1.5,
  fontSize: 78, fontFace: FONT, color: OPS.white, valign: "bottom", charSpacing: -3,
});
t.addShape(pres.shapes.LINE, { x: 0.75, y: 6.25, w: 11.83, h: 0, line: { color: OPS.blueLight, width: 0.75 } });
t.addText("OMS staff PD", { x: 0.75, y: 6.35, w: 6, h: 0.4, fontSize: 16, fontFace: FONT, color: OPS.muted });
t.addText("March 4, 2027", { x: 6.58, y: 6.35, w: 6, h: 0.4, fontSize: 16, fontFace: FONT, color: OPS.muted, align: "right" });

// Content slide with a claim title
const s = pres.addSlide();
s.background = { color: OPS.navy };
s.addText("Exit tickets take 3 minutes and show who's lost", {
  x: 0.75, y: 0.66, w: 9.4, h: 1.2,
  fontSize: 30, fontFace: FONT, color: OPS.white, valign: "top",
});
["Three questions at the door", "Sort the answers into piles after class"].forEach((line, i) => {
  const y = 2.5 + i * 0.75;
  s.addShape(pres.shapes.LINE, { x: 0.75, y, w: 11.83, h: 0, line: { color: OPS.blueLight, width: 0.75 } });
  s.addText(line, { x: 0.75, y: y + 0.12, w: 11.8, h: 0.5, fontSize: 20, fontFace: FONT, color: OPS.muted });
});
s.addText("Source: OMS exit ticket pilot, fall 2026", {
  x: 0.75, y: 6.75, w: 11.8, h: 0.3, fontSize: 10, fontFace: FONT, color: OPS.caption,
});

// Section divider
const d = pres.addSlide();
d.background = { color: OPS.red };
d.addText("Write your own", {
  x: 0.75, y: 4.6, w: 11.8, h: 1.9,
  fontSize: 72, fontFace: FONT, color: OPS.white, valign: "bottom", charSpacing: -3,
});
```

Use `valign: "top"` on body text boxes. Lexend's regular weight stands in for 500 in PowerPoint, and the Light style stands in for 300.

---

## Documents and newsletters

- **Masthead.** A navy band across the top of the first page. The publication name is white Lexend at 30pt. The issue line sits on the right in `#c0c7e0`.
- **Headline.** 31pt, weight 500, navy.
- **Lede.** 14pt, weight 300.
- **Body.** 10.5pt, `#2b2f3a`.
- **Section label.** 9.5pt, weight 500, `#5d6475`, with space above it.
- **Story titles.** 12pt, weight 500, navy, under a navy hairline.
- **Alert.** A tinted block with no border that opens with a bold lead word. Use `#eaecf5` for a note and `#f5e3e3` for something that needs action.
- **Figure.** A newsletter may set one headline number in Primary Red at 46pt.
- **Tables.** Small muted column headers over a hairline, with hairlines between rows.
- **Footer.** The Primary Logo at 19px tall on the left. The page number on the right.

In Word and Google Docs, the masthead is a full-width navy table cell or a header image.

---

## Web tools and dashboards

Start from `references/example-tool.html`. It shows the top bar, the alert, the summary line, the filter row, the table with expanded rows, the status dots, and the form rail.

- **Page.** A navy top bar, a `#f3f5f9` page, and one white panel with a 1px `#dde1ea` border and an 8px radius.
- **Top bar.** The tool's name, the navigation, a search field, and the user's initials. The selected item is white with a 2px underline under the word.
- **Buttons.** White with a border by default. One navy primary button per screen. Red only for delete.
- **Inputs.** A 1px `#8b91a3` border and a 6px radius. Focus adds a 2px Primary Blue outline.
- **Alert.** One per page, tinted, with a bold lead word.
- **Table.** 44px rows, hairlines, right-aligned numbers, a navy first column.
- **Status.** A dot and a word.
- **Filter row.** Plain words. The selected one sits on a `#eaecf5` block.
- **Icons.** 16px outlines with a 1.5px stroke, for actions, search, expanding rows, and warnings.
- **Footer.** The Primary Logo on the left.
- **Favicon.** `Torch Icon.png`, cropped tight.

### CSS variables

```css
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&display=swap');

:root {
  --ops-primary: #1d2a5d;
  --ops-primary-hover: #0e152f;
  --ops-accent: #2d3f89;
  --ops-selected-bg: #eaecf5;
  --ops-danger: #ad2122;
  --ops-danger-bg: #f5e3e3;
  --ops-danger-text: #7a1718;

  --ops-canvas: #f3f5f9;
  --ops-surface: #ffffff;
  --ops-surface-sunken: #fafbfc;

  --ops-text: #2b2f3a;
  --ops-text-muted: #5d6475;
  --ops-on-inverted-muted: #c0c7e0;

  --ops-divider: #eceef3;
  --ops-border: #dde1ea;
  --ops-border-strong: #c3c9d6;
  --ops-border-control: #8b91a3;

  --ops-font: "Lexend", Calibri, Arial, sans-serif;
}

body {
  font: 400 13px/1.45 var(--ops-font);
  color: var(--ops-text);
  background: var(--ops-canvas);
  font-variant-numeric: tabular-nums;
}
```

---

## Handoff to other agents and tools

Hand off `DESIGN.md` and `references/example-tool.html` together. Add `references/voice-and-copy.md` when the work involves much copy.

- **Claude Code or Cursor.** Put `DESIGN.md` at the repo root and tell the agent to follow it for all styling.
- **Tailwind.** The `colors`, `typography`, `spacing`, and `rounded` groups map to theme values.
- **Figma.** `colors.*` and `typography.*` map to variables one to one.

---

## Resources

| File | Use |
|---|---|
| `DESIGN.md` | Token spec and rules. Source of truth. |
| `references/example-tool.html` | A finished web tool built to the spec. |
| `references/voice-and-copy.md` | The OPS voice. |
| `Resources/OPS Tech Stylesheet.pdf` | Every token and component as rendered. |
| `Resources/stylesheet.html` | Generated source for the Stylesheet. Don't edit it by hand. |
| `scripts/render-stylesheet.js` | Rebuilds the Stylesheet from DESIGN.md. Run `node scripts/render-stylesheet.js` after any token change. |
| `Resources/Primary Logo.png` | Horizontal logo. |
| `Resources/Secondary Logo.png` | Square badge. |
| `Resources/Torch Icon.png` | Torch graphic. |
| `Resources/OPS Tech Logo 2.png` | Alternate lockup. Only on request. |
| `Resources/OPS Tech Intro Video.mp4` | Intro video for PD sessions. |
| `Resources/Orono Tech Intro Outro Animation.gif` | Animated intro and outro. |

---

## Checklist before shipping

- [ ] Lexend only. Sentence case on every heading, title, button, and label.
- [ ] Navy is the ink. Red appears only on what needs action, on section-divider slides, and on one newsletter figure.
- [ ] Web tools have a navy top bar, a slate page, and one white panel.
- [ ] Nothing on the "Never" list appears.
- [ ] Status is a dot and a word.
- [ ] Slides are navy. Content slides have claim titles.
- [ ] Every statistic has a source line.
- [ ] The Primary Logo sits on white, in the footer.
- [ ] Logos are bundled with the output and unaltered.
- [ ] Copy follows `references/voice-and-copy.md`.
- [ ] Ran `deslop` on the finished piece.

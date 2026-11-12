---
version: beta
name: OPS Technology Style
description: The Orono Technology (OPS Tech) design system for web tools, newsletters, documents, and slides. It uses navy ink, red for anything that needs action, Lexend throughout, and layered flat surfaces.

colors:
  # ========================================================================
  # BRAND COLORS: the canonical OPS Tech values. Do not alter.
  # ========================================================================
  blue-lighter: "#eaecf5"
  blue-light: "#4356a0"
  blue: "#2d3f89"
  blue-dark: "#1d2a5d"

  red-lighter: "#e5c7c7"
  red-light: "#c13435"
  red: "#ad2122"
  red-dark: "#7a1718"

  gray-lightest: "#f3f3f3"
  gray-lighter: "#cccccc"
  gray-light: "#999999"
  gray: "#666666"
  gray-dark: "#333333"
  gray-darkest: "#1a1a1a"

  white: "#ffffff"

  # ========================================================================
  # RAMPS: tints and shades of the brand colors.
  # ========================================================================
  blue-50:  "#f4f6fa"
  blue-100: "#eaecf5"       # canonical blue-lighter
  blue-200: "#c0c7e0"
  blue-300: "#97a1cb"
  blue-400: "#6d7cb5"
  blue-500: "#5869aa"
  blue-600: "#4356a0"       # canonical blue-light
  blue-700: "#2d3f89"       # canonical blue
  blue-800: "#253473"
  blue-900: "#1d2a5d"       # canonical blue-dark
  blue-950: "#0e152f"

  red-50:  "#f5e3e3"
  red-100: "#e5c7c7"        # canonical red-lighter
  red-200: "#deaaaa"
  red-300: "#d78c8d"
  red-400: "#d06f70"
  red-500: "#c85252"
  red-600: "#c13435"        # canonical red-light
  red-700: "#ad2122"        # canonical red
  red-800: "#941c1d"
  red-900: "#7a1718"        # canonical red-dark
  red-950: "#3d0c0c"

  # Slate is the working neutral ramp. Each step is gray tinted with brand blue.
  slate-50:  "#fafbfc"
  slate-100: "#f3f5f9"
  slate-200: "#eceef3"
  slate-300: "#dde1ea"
  slate-400: "#c3c9d6"
  slate-500: "#8b91a3"
  slate-600: "#5d6475"
  slate-700: "#444a5a"
  slate-900: "#2b2f3a"

  # ========================================================================
  # ROLES: use these when building.
  # ========================================================================

  # Ink and brand
  primary: "{colors.blue-900}"            # headings, primary buttons, bars, rules
  primary-hover: "{colors.blue-950}"
  accent: "{colors.blue-700}"             # links, focus
  selected-bg: "{colors.blue-100}"        # the selected item in a filter row
  danger: "{colors.red-700}"              # anything that needs action
  danger-hover: "{colors.red-800}"
  danger-bg: "{colors.red-50}"
  danger-text: "{colors.red-900}"         # text on danger-bg
  info-bg: "{colors.blue-100}"

  # Surfaces
  canvas: "{colors.slate-100}"            # page background in web tools
  surface: "{colors.white}"               # panels, documents, inputs
  surface-sunken: "{colors.slate-50}"     # expanded sub-rows
  surface-inverted: "{colors.blue-900}"   # top bars, mastheads, slides
  surface-inverted-raised: "{colors.blue-800}"   # a field on a navy bar
  surface-loud: "{colors.red-700}"        # section-divider slides only

  # Text
  on-surface: "{colors.slate-900}"
  on-surface-muted: "{colors.slate-600}"
  on-surface-disabled: "{colors.slate-500}"
  on-inverted: "{colors.white}"
  on-inverted-muted: "{colors.blue-200}"
  on-inverted-subtle: "#8da0c7"           # source lines on navy (between blue-300 and blue-400)
  on-loud-muted: "{colors.red-50}"

  # Lines
  divider: "{colors.slate-200}"           # between rows
  border: "{colors.slate-300}"            # panel edges, section rules
  border-strong: "{colors.slate-400}"     # secondary buttons
  border-control: "{colors.slate-500}"    # inputs (3:1 on white)
  divider-inverted: "{colors.blue-600}"   # hairlines on navy
  track: "{colors.slate-300}"             # the empty part of a progress bar

typography:
  display:
    fontFamily: Lexend
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Lexend
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.028em
  headline-md:
    fontFamily: Lexend
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Lexend
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  title:
    fontFamily: Lexend
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  lede:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.4
  body:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  ui:
    fontFamily: Lexend
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
  ui-strong:
    fontFamily: Lexend
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
  caption:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
  control-height: 32px
  row-height: 44px
  container-max: 1440px

rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 8px
  full: 9999px

components:
  # === Top bar ===
  top-bar:
    backgroundColor: "{colors.surface-inverted}"
    textColor: "{colors.on-inverted}"
    typography: "{typography.ui}"
    height: 52px
    paddingX: 24px
  top-bar-title:
    typography: "{typography.title}"
    textColor: "{colors.on-inverted}"
  nav-link:
    textColor: "{colors.on-inverted-muted}"
    typography: "{typography.ui}"
  nav-link-active:
    textColor: "{colors.on-inverted}"
    fontWeight: 500
    underlineWidth: 2px
    underlineOffset: 7px
  top-bar-search:
    backgroundColor: "{colors.surface-inverted-raised}"
    textColor: "{colors.on-inverted-muted}"
    rounded: "{rounded.md}"
    height: "{spacing.control-height}"
    paddingX: 10px

  # === Buttons ===
  button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    borderColor: "{colors.border-strong}"
    borderWidth: 1px
    typography: "{typography.ui-strong}"
    rounded: "{rounded.md}"
    height: "{spacing.control-height}"
    paddingX: 12px
  button-hover:
    backgroundColor: "{colors.slate-50}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-inverted}"
    borderColor: "{colors.primary}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    borderColor: "{colors.primary-hover}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-inverted}"
    borderColor: "{colors.danger}"
  button-danger-hover:
    backgroundColor: "{colors.danger-hover}"
    borderColor: "{colors.danger-hover}"
  button-disabled:
    backgroundColor: "{colors.slate-200}"
    textColor: "{colors.on-surface-disabled}"
    borderColor: "{colors.slate-200}"

  # === Inputs ===
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    borderColor: "{colors.border-control}"
    borderWidth: 1px
    typography: "{typography.ui}"
    rounded: "{rounded.md}"
    minHeight: "{spacing.control-height}"
    paddingX: 10px
    paddingY: 6px
  input-focus:
    borderColor: "{colors.primary}"
    outlineColor: "{colors.accent}"
    outlineWidth: 2px
    outlineOffset: 1px
  input-error:
    borderColor: "{colors.danger}"
  input-disabled:
    backgroundColor: "{colors.slate-100}"
    textColor: "{colors.on-surface-disabled}"
    borderColor: "{colors.border-strong}"
  input-label:
    typography: "{typography.label}"
    textColor: "{colors.on-surface}"
  input-helper:
    typography: "{typography.caption}"
    textColor: "{colors.on-surface-muted}"
  input-error-message:
    typography: "{typography.caption}"
    textColor: "{colors.danger}"

  # === Alerts ===
  # An alert is a tinted block with no border. It opens with a bold lead word.
  alert-danger:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger-text}"
    typography: "{typography.ui}"
    rounded: "{rounded.md}"
    paddingX: 14px
    paddingY: 10px
  alert-info:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.primary}"
    typography: "{typography.ui}"
    rounded: "{rounded.md}"
    paddingX: 14px
    paddingY: 10px

  # === Panel ===
  # A panel is the one white container on a canvas page. Don't nest panels.
  panel:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderWidth: 1px
    rounded: "{rounded.lg}"

  # === Tables ===
  table-header:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label}"
    borderBottomColor: "{colors.border}"
    borderBottomWidth: 1px
    paddingX: 12px
    paddingY: 9px
    edgePaddingX: 20px
  table-row:
    textColor: "{colors.on-surface}"
    typography: "{typography.ui}"
    borderBottomColor: "{colors.divider}"
    borderBottomWidth: 1px
    height: "{spacing.row-height}"
    paddingX: 12px
  table-row-name:
    textColor: "{colors.primary}"
    fontWeight: 500
  table-row-sub:
    backgroundColor: "{colors.surface-sunken}"

  # === Status ===
  # Status is a 7px dot and a word. The word alone must give the status.
  status:
    typography: "{typography.ui}"
    textColor: "{colors.on-surface}"
    dotColor: "{colors.blue-300}"
  status-done:
    dotColor: "{colors.primary}"
  status-action:
    textColor: "{colors.danger}"
    fontWeight: 500
    dotColor: "{colors.danger}"
  status-not-started:
    dotColor: "{colors.slate-500}"
    dotStyle: outline

  # === Progress ===
  progress:
    color: "{colors.primary}"
    trackColor: "{colors.track}"
    height: 4px
    rounded: 2px
  progress-danger:
    color: "{colors.danger}"
  summary-bar:
    color: "{colors.primary}"
    trackColor: "{colors.track}"
    height: 8px
    rounded: "{rounded.sm}"

  # === Filter row ===
  segment:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.ui}"
    rounded: "{rounded.sm}"
    paddingX: 10px
    paddingY: 5px
  segment-selected:
    backgroundColor: "{colors.selected-bg}"
    textColor: "{colors.primary}"
    fontWeight: 500

  # === Lists ===
  list-row:
    typography: "{typography.ui}"
    borderBottomColor: "{colors.divider}"
    borderBottomWidth: 1px
    paddingY: 8px

  # === Links ===
  link:
    textColor: "{colors.accent}"
    underlineWidth: 1px
    underlineOffset: 3px

  # === Charts ===
  chart-series-1:
    color: "{colors.blue-900}"
  chart-series-2:
    color: "{colors.blue-600}"
  chart-series-3:
    color: "{colors.blue-400}"
  chart-series-4:
    color: "{colors.slate-500}"
  chart-highlight:
    color: "{colors.red-700}"
  chart-series-on-inverted:
    color: "{colors.blue-400}"
  chart-highlight-on-inverted:
    color: "{colors.white}"
  chart-gradient-start:
    color: "{colors.blue-100}"
  chart-gradient-end:
    color: "{colors.blue-900}"
  chart-axis:
    color: "{colors.slate-600}"
  chart-grid:
    color: "{colors.slate-300}"
---

# OPS Technology Style

## Overview

This is the design system for Orono Technology. It covers web tools, newsletters, documents, and slides.

The system uses the district's red, white, and blue with one typeface, Lexend. Navy is the ink on flat, layered surfaces. Red marks anything that needs someone to act. A piece built with it should look like it came from a well-run product team.

`references/example-tool.html` is a finished staff tool built to this spec. Open it before building a web tool.

### Modes

- **Official** (staff and parent communications, PD decks, reports, tools). Everything in this file applies.
- **Playful** (classroom games, student interactives, holiday pieces). The palette may change to suit the topic. The palette keeps OPS colors as accents, and the logos stay as issued. Every other rule in this file still applies.

## Colors

The ramps are tints and shades of the fixed brand colors. Build with the roles.

- **Navy (`primary`, `blue-900`)** is the ink. Headings, primary buttons, progress bars, top bars, mastheads, and slide backgrounds use it.
- **Blue (`accent`, `blue-700`)** is for links and focus outlines.
- **Red (`danger`, `red-700`)** means "this needs you." Everything tied to the thing that needs action is red, including its status, its number, its progress bar, and the alert about it. A delete button is red too. Red is never used for an ordinary heading, button, or link.
- **Slate** is the neutral ramp for text, borders, and page backgrounds.
- **White** is the surface for panels, documents, and inputs.

### Red at large scale

Red is decorative only on a section-divider slide, which is solid `surface-loud`, and on one newsletter headline figure set in `danger`.

### Charts

Series run `blue-900`, `blue-600`, `blue-400`, `slate-500`. Sequential gradients run `blue-100` to `blue-900`. `chart-highlight` (red) is for the one series the reader should look at. On navy slides, that series is white and the rest are `blue-400`.

## Typography

Lexend is the only typeface. It was designed to improve reading fluency.

- Large headings are weight 500 with tight letter-spacing. They rank by size, so don't make them bolder.
- Small headings and titles are weight 600.
- Body and interface text is weight 400. A lede is weight 300.
- Numbers in tables use tabular figures and align right.

If Lexend is unavailable, use Calibri, then Arial.

Write every heading, title, button, label, and column header in sentence case.

A section is marked by its heading and the space above it. Don't add an uppercase label over it or a colored rule under it.

## Layout

Web tools are dense, with 13px interface text, 32px controls, and 44px table rows.

A tool page stacks a navy top bar, a `canvas` page, and one white `panel` for the main content. A side rail for a form sits directly on the canvas. The footer has the Primary Logo.

Separate rows with a `divider` hairline and sections with space. Never put a panel inside a panel.

## Elevation

Depth comes from the three layers and from 1px borders. Don't add shadows.

## Shapes

The radius is `sm` (4px) on a filter highlight, `md` (6px) on controls and alerts, `lg` (8px) on a panel, and `full` on status dots and avatars. Nothing is pill-shaped.

## Components

**Top bar.** Navy, 52px tall. It holds the tool's name, the navigation, a search field, and the user's initials. The selected navigation item is white with a 2px underline directly under the word. The others are `on-inverted-muted`.

**Buttons.** The default button is white with a border. A screen has one primary button, filled navy. A delete button is filled red. A button may have an icon before its label. Labels name what happens, such as "Send reminder."

**Inputs.** A 1px `border-control` edge. Focus adds a 2px `accent` outline. The label sits above in `label`. Helper text sits below in `caption`. An error replaces the helper text and says how to fix the problem.

**Alerts.** A tinted block with no border. It opens with a bold lead word, such as "Action required:" or "Due Friday:". A danger alert may have a warning icon and one link. Use one alert per page.

**Panel.** White, 1px border, 8px radius. A page has one main panel.

**Tables.** Column headers are `label` in muted text over a hairline. Rows are 44px with hairlines between them. The first and last cells have 20px of side padding. The first column of a top-level row is navy at weight 500. Expanded sub-rows sit on `surface-sunken` in regular text. Leave the header unfilled and the rows unstriped.

**Status.** A 7px dot and a word. The dot is navy for done, `blue-300` for in progress, outlined for not started, and red with red text for action required.

**Progress.** A 4px bar with the percentage beside it. The bar is red on a row that needs action.

**Filter row.** Plain words in muted text. The selected one sits on a `selected-bg` block in navy. Don't use an underline here, because it stacks against the table's rules.

**Summary.** State a total as one sentence with an 8px `summary-bar` under it, such as "1,560 of 2,080 devices re-enrolled." The part that needs action is a red segment. Don't build a row of large numbers with small labels.

**Icons.** Draw icons as outlines on a 16px grid with a 1.5px stroke, and show them at 12px to 16px. Use them for actions, search, expanding rows, and warnings. Don't put an icon before a heading.

## Slides

Slides are navy by default.

- **Title slide.** The Secondary Logo sits top left at 0.8in. The title is 78pt, weight 500, set low on the left. A hairline runs under it, with the audience on the left and the date on the right at 16pt. A closing slide uses the same layout.
- **Content slide.** The title is 30pt, weight 500, top left. It states the slide's point as a sentence. Body text is 20pt, weight 300, in `on-inverted-muted`. Emphasis is white and larger.
- **One number.** The number is 180pt in white with a 20pt caption under it.
- **Section divider.** Solid red with a white 72pt title set low on the left.
- **Source line.** 10pt in `on-inverted-subtle`, bottom left.

Groups on a slide are separated by `divider-inverted` hairlines. Brand red fails contrast as text on navy, so emphasis on navy is white. Use a white slide only for a dense table or a deck that will be printed.

## Documents and newsletters

A document is a white page. The first page has a navy masthead band with the publication name in white at 30pt. The Primary Logo goes in the footer at 19px tall, on white or on the canvas.

| Element | Spec |
|---|---|
| Headline | 31pt, weight 500, navy |
| Lede | 14pt, weight 300 |
| Body | 10.5pt, `on-surface` |
| Section label | 9.5pt, weight 500, `on-surface-muted` |
| Story title | 12pt, weight 500, navy, under a navy hairline |
| Figure | 46pt, `danger`, one per newsletter |
| Footer text | 8.5pt, `on-surface-muted` |

Notes use `alert-info`. Anything that needs action uses `alert-danger`.

## Logos

The minimum logo width is 80px on screen and 0.75in in print. Use the files as issued.

## Voice and copy

Copy follows the OPS voice in `references/voice-and-copy.md`. The essentials:

- Give each sentence one thought.
- Lead with the point.
- Use sentence case.
- Don't write colon subtitles.
- Give content slides a claim title that states the point.
- Name the action on a button. Say how to fix the problem in an error.

## Rules

- Use roles before raw ramp values.
- Use red only for what needs action, a delete button, a chart's highlight series, a section-divider slide, and one newsletter figure.
- State status in words, with a dot.
- Don't add shadows, pills, side stripes, accent rules, or uppercase letter-spaced labels.
- Don't nest panels or wrap a list in cards.
- Don't fill a table header or stripe its rows.
- Don't mark a selection with a line that touches another line or an edge.
- Don't place the Primary Logo or the Torch Icon on navy. Their blue parts disappear there.
- Don't center body text.

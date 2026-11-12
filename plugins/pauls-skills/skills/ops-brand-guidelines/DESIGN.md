---
version: alpha
name: OPS Technology Style
description: The Orono Technology (OPS Tech) design system. A red, white, and blue district palette with Lexend headings and Roboto body, flat surfaces, and hairline structure. Use it for slide decks, PD presentations, newsletters, handouts, parent-facing reports, websites, and web tools.

colors:
  # ========================================================================
  # BRAND COLORS: these are the canonical OPS Tech values.
  # Do not alter. Every other color token below is derived from these.
  # ========================================================================

  # Canonical blues (from the official OPS Tech stylesheet)
  blue-lighter: "#eaecf5"   # canonical: maps to blue-100 in the ramp
  blue-light: "#4356a0"     # canonical: maps to blue-600 in the ramp
  blue: "#2d3f89"           # canonical: maps to blue-700 (the brand blue)
  blue-dark: "#1d2a5d"      # canonical: maps to blue-900

  # Canonical reds
  red-lighter: "#e5c7c7"    # canonical: maps to red-100
  red-light: "#c13435"      # canonical: maps to red-600
  red: "#ad2122"            # canonical: maps to red-700 (the brand red)
  red-dark: "#7a1718"       # canonical: maps to red-900

  # Canonical grays
  gray-lightest: "#f3f3f3"  # canonical: maps to gray-100
  gray-lighter: "#cccccc"   # canonical: maps to gray-300
  gray-light: "#999999"     # canonical: maps to gray-500
  gray: "#666666"           # canonical: maps to gray-700
  gray-dark: "#333333"      # canonical: maps to gray-900
  gray-darkest: "#1a1a1a"   # canonical: maps to gray-950

  # Base neutrals
  white: "#ffffff"
  black: "#000000"

  # ========================================================================
  # TINT RAMPS: computed from canonical values for UI utility.
  # Use these for hover states, borders, disabled states, subtle backgrounds.
  # The canonical values above remain the brand-identity values.
  # ========================================================================

  # Blue ramp (11 steps)
  blue-50:  "#f4f6fa"       # computed: subtlest tint, barely-there surface
  blue-100: "#eaecf5"       # CANONICAL (blue-lighter)
  blue-200: "#c0c7e0"       # computed: disabled bg, subtle borders
  blue-300: "#97a1cb"       # computed: muted text on light, 3rd-tier elements
  blue-400: "#6d7cb5"       # computed: icons, muted actions
  blue-500: "#5869aa"       # computed: supporting elements
  blue-600: "#4356a0"       # CANONICAL (blue-light)
  blue-700: "#2d3f89"       # CANONICAL (blue, the brand blue)
  blue-800: "#253473"       # computed: active/pressed primary button
  blue-900: "#1d2a5d"       # CANONICAL (blue-dark)
  blue-950: "#0e152f"       # computed: deepest emphasis, near-black blue

  # Red ramp (11 steps)
  red-50:  "#f5e3e3"        # computed: subtlest pink tint
  red-100: "#e5c7c7"        # CANONICAL (red-lighter)
  red-200: "#deaaaa"        # computed: soft pink surface
  red-300: "#d78c8d"        # computed: muted warning text
  red-400: "#d06f70"        # computed: softer accent
  red-500: "#c85252"        # computed: mid red
  red-600: "#c13435"        # CANONICAL (red-light)
  red-700: "#ad2122"        # CANONICAL (red, the brand red)
  red-800: "#941c1d"        # computed: active/pressed destructive button
  red-900: "#7a1718"        # CANONICAL (red-dark)
  red-950: "#3d0c0c"        # computed: deepest red, near-black red

  # Gray ramp (11 steps)
  gray-50:  "#fafafa"       # computed: off-white, page background
  gray-100: "#f3f3f3"       # CANONICAL (gray-lightest)
  gray-200: "#e0e0e0"       # computed: light border, disabled surface
  gray-300: "#cccccc"       # CANONICAL (gray-lighter)
  gray-400: "#b3b3b3"       # computed: medium-light divider
  gray-500: "#999999"       # CANONICAL (gray-light)
  gray-600: "#808080"       # computed: placeholder text, muted label
  gray-700: "#666666"       # CANONICAL (gray)
  gray-800: "#4d4d4d"       # computed: strong secondary text
  gray-900: "#333333"       # CANONICAL (gray-dark, default body text)
  gray-950: "#1a1a1a"       # CANONICAL (gray-darkest)

  # ========================================================================
  # SEMANTIC ROLES: the agent-facing vocabulary.
  # Prefer these over raw ramp values when building.
  # ========================================================================

  # Brand identity
  primary: "{colors.blue-700}"
  primary-strong: "{colors.blue-900}"
  primary-muted: "{colors.blue-600}"
  primary-subtle: "{colors.blue-100}"

  secondary: "{colors.red-700}"
  secondary-strong: "{colors.red-900}"
  secondary-muted: "{colors.red-600}"
  secondary-subtle: "{colors.red-100}"

  # Surfaces
  surface: "{colors.white}"
  surface-subtle: "{colors.gray-50}"
  surface-alt: "{colors.gray-100}"
  surface-inverted: "{colors.blue-900}"
  surface-raised: "{colors.blue-700}"   # dark slides: one featured item only

  # Text on surfaces
  on-surface: "{colors.gray-900}"
  on-surface-muted: "{colors.gray-700}"
  on-surface-subtle: "{colors.gray-600}"
  on-surface-disabled: "{colors.gray-500}"
  on-surface-inverted: "{colors.white}"
  on-surface-inverted-muted: "{colors.blue-100}"
  accent-on-inverted: "{colors.red-400}"   # large text only (24pt+). red-600 fails on blue-900.

  # Borders
  border-subtle: "{colors.gray-200}"
  border: "{colors.gray-300}"
  border-strong: "{colors.gray-500}"
  border-accent: "{colors.blue-700}"
  border-focus: "{colors.blue-600}"
  divider: "{colors.gray-200}"            # hairline between list items and rows
  divider-strong: "{colors.gray-700}"     # rule under a table header
  divider-inverted: "{colors.blue-600}"   # hairline on blue-900 slides

  # Focus ring for accessibility. Applied as a 3px ring on focused inputs.
  focus-ring: "rgba(45,63,137,0.1)"   # blue-700 at 10% opacity

  # States
  info: "{colors.blue-700}"
  info-bg: "{colors.blue-100}"
  warning: "{colors.red-700}"
  warning-bg: "{colors.red-100}"
  error: "{colors.red-800}"
  success: "{colors.blue-600}"

  # Interactive state pairs
  primary-hover: "{colors.blue-800}"
  primary-active: "{colors.blue-900}"
  secondary-hover: "{colors.red-800}"
  secondary-active: "{colors.red-900}"

typography:
  display:
    fontFamily: Lexend
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Lexend
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Lexend
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
  title-lg:
    fontFamily: Lexend
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
  title-md:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
  title-sm:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: Roboto
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Roboto
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-lg:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.01em
  label-md:
    fontFamily: Roboto
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Roboto
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.03em
  caption:
    fontFamily: Roboto
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4

spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  gutter: 24px
  margin: 32px
  container-max: 1200px

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

components:
  # === Buttons ===
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 20px
    paddingY: 10px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-primary-disabled:
    backgroundColor: "{colors.gray-300}"
    textColor: "{colors.gray-600}"

  button-secondary:
    backgroundColor: "{colors.gray-700}"
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 20px
    paddingY: 10px
  button-secondary-hover:
    backgroundColor: "{colors.gray-800}"

  button-outlined:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    borderWidth: 1.5px
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 20px
    paddingY: 10px
  button-outlined-hover:
    backgroundColor: "{colors.blue-50}"

  button-inverted:
    backgroundColor: "{colors.white}"
    textColor: "{colors.blue-900}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 20px
    paddingY: 10px

  button-destructive:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 20px
    paddingY: 10px
  button-destructive-hover:
    backgroundColor: "{colors.secondary-hover}"

  # Commit action. Use for form submissions on web-based instructional
  # materials (sign-up forms, RSVPs, contact forms). Red signals finality,
  # not destruction. Distinct from button-destructive only in semantics;
  # visually they share the same red treatment.
  button-submit:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 20px
    paddingY: 10px
  button-submit-hover:
    backgroundColor: "{colors.secondary-hover}"

  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 12px
    paddingY: 8px
  button-ghost-hover:
    backgroundColor: "{colors.blue-50}"

  # === Inputs ===
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.on-surface}"
    borderColor: "{colors.border}"
    borderWidth: 1.5px
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    paddingX: 12px
    paddingY: 10px
  input-hover:
    borderColor: "{colors.border-strong}"
  input-focus:
    borderColor: "{colors.border-focus}"
    boxShadow: "0 0 0 3px {colors.focus-ring}"   # accessibility ring
  input-error:
    borderColor: "{colors.secondary}"
  input-disabled:
    backgroundColor: "{colors.gray-100}"
    textColor: "{colors.on-surface-disabled}"
  input-label:
    typography: "{typography.label-md}"
    textColor: "{colors.on-surface}"
  input-helper:
    typography: "{typography.caption}"
    textColor: "{colors.on-surface-subtle}"
  input-error-message:
    typography: "{typography.caption}"
    textColor: "{colors.red-600}"

  # === Callouts ===
  # A tinted block with no border. Content opens with a bold lead word
  # ("Heads up:", "Due Friday:") so the meaning does not depend on color.
  callout-info:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.on-surface}"
    leadTextColor: "{colors.blue-900}"
    rounded: "{rounded.md}"
    padding: 16px 20px
  callout-warning:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.red-900}"
    leadTextColor: "{colors.red-900}"
    rounded: "{rounded.md}"
    padding: 16px 20px

  # === Lists and sections ===
  # The default way to separate items. Use these before reaching for a card.
  list-row:
    borderBottomColor: "{colors.divider}"
    borderBottomWidth: 1px
    paddingY: 12px
  section-divider:
    borderTopColor: "{colors.divider}"
    borderTopWidth: 1px
    marginY: "{spacing.xl}"

  # === Card ===
  # Only for a discrete object a person picks, opens, drags, or compares.
  # Never for grouping text. Never nested. No shadow.
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderWidth: 1px
    rounded: "{rounded.lg}"
    padding: 20px
  card-selected:
    borderColor: "{colors.primary}"
    borderWidth: 2px

  # === Tables ===
  table-header:
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    fontWeight: 700
    borderBottomColor: "{colors.divider-strong}"
    borderBottomWidth: 2px
    paddingX: 12px
    paddingY: 10px
  table-row:
    backgroundColor: "{colors.white}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    borderBottomColor: "{colors.divider}"
    borderBottomWidth: 1px
    paddingX: 12px
    paddingY: 10px
  table-row-action-required:
    backgroundColor: "{colors.red-100}"
    textColor: "{colors.red-900}"

  # === Navigation ===
  nav-bar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
    paddingX: 24px
    paddingY: 16px
  nav-link:
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
  nav-link-active:
    textColor: "{colors.white}"
    borderBottomColor: "{colors.white}"
    borderBottomWidth: 2px

  # === Status ===
  # Status is plain text, not a pill. Color supports the word; the word
  # carries the meaning.
  status-text:
    typography: "{typography.label-lg}"
    textColor: "{colors.on-surface-muted}"
  status-text-active:
    textColor: "{colors.primary}"
  status-text-action:
    textColor: "{colors.red-700}"

  # === Filter chip ===
  # The only pill shape. For filters a person taps on and off.
  chip:
    backgroundColor: "{colors.white}"
    textColor: "{colors.on-surface}"
    borderColor: "{colors.border}"
    borderWidth: 1px
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    paddingX: 12px
    paddingY: 6px
  chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    borderColor: "{colors.primary}"

  # === Charts ===
  chart-series-1:
    color: "{colors.blue-700}"
  chart-series-2:
    color: "{colors.red-700}"
  chart-series-3:
    color: "{colors.blue-600}"
  chart-series-4:
    color: "{colors.red-600}"
  chart-series-5:
    color: "{colors.blue-400}"
  chart-series-6:
    color: "{colors.red-400}"
  chart-gradient-start:
    color: "{colors.blue-100}"
  chart-gradient-end:
    color: "{colors.blue-900}"
  chart-axis:
    color: "{colors.gray-700}"
  chart-grid:
    color: "{colors.gray-200}"
---

# OPS Technology Style

## Overview

Orono Technology's visual identity comes from the district's red, white, and blue tradition. It should read as **confident, plain, and legible** in every medium: a parent reading a report on a phone, a teacher glancing at a PD slide from the back of the room, a student tapping through a web tool.

The personality sits between institutional and human. Lexend's wide letterforms do the warming. Brand blue carries trust. Brand red marks emphasis, and only sparingly.

Structure comes from type, space, and hairline rules. Decoration that doesn't carry meaning is left out: no side stripes on boxes, no accent lines under titles, no letter-spaced caps labels, no decorative icons, no shadows. Most content sits directly on the page. Cards are the exception.

One system covers slides, documents, newsletters, websites, and web tools. Dense tools use the smaller type tokens (`body-sm`, `label-*`) rather than a different system.

Two modes:

- **Official / district-facing** (PD presentations, staff and parent communications, reports, newsletters, dashboards): the full palette and type system applies. Blue dominates and red accents. Lexend and Roboto only.
- **Playful / student-facing** (classroom games, fun interactives, holiday pieces): the palette may change to suit the topic, with Orono colors present as accents and the logos as issued. Nothing else changes. The structure rules, the decoration bans, and the copy rules apply in both modes.

## How this file is organized

1. **Canonical brand colors.** The 14 hex values from the OPS Tech Stylesheet (4 blues, 4 reds, 6 grays). Never alter them.
2. **Computed tint ramps.** 11-step ramps (50 to 950) for each family, derived from the canonical values for hover, disabled, border, and muted-text needs. Every canonical value sits in its ramp at a fixed position (`blue-100` is `blue-lighter`).
3. **Semantic roles** (`primary`, `surface`, `on-surface`, `divider`). Prefer these when building. Use raw ramp tokens only when no role fits.

## Colors

No new hues. The only additions are tints and shades of the official values.

- **Blue (primary).** Brand blue is `#2d3f89` at `blue-700`. It goes darker toward `blue-900` (`#1d2a5d`) for headings and full-bleed slide backgrounds, and lighter toward `blue-100` (`#eaecf5`) for tinted surfaces.
- **Red (secondary).** Brand red is `#ad2122` at `red-700`. Use it for accents, warnings, commit actions, and one key emphasis per view. It never leads.
- **Gray (neutral).** Body text is `gray-900` (`#333333`), not pure black. Hairlines are `gray-200`.
- **White.** The resting surface for documents and light interfaces.

### Ramp positions

- **50:** barely-there tint.
- **100:** tinted surfaces such as callouts and the action-required row. The canonical `-lighter` values live here.
- **200–400:** hairlines, borders, muted icons, disabled text.
- **500:** midtone. Canonical `gray-light`.
- **600:** supporting color, and hairlines on dark slides. Canonical `blue-light` and `red-light`.
- **700:** the brand values. Primary actions, nav bars, headings.
- **800:** pressed state for brand-colored controls.
- **900:** deepest brand color. Full-bleed slide backgrounds and high-contrast headings.
- **950:** near-black. Rarely needed.

### Dominance

Official pieces land near **60% blue, 15% red, 25% neutral**. If red reads as a co-lead, pull it back.

### Chart sequencing

Multi-series charts go `blue-700`, `red-700`, `blue-600`, `red-600`, `blue-400`, `red-400`. Sequential gradients run `blue-100` to `blue-900`. Add an off-palette hue only when the data needs a category the palette can't express.

## Typography

- **Lexend** for headings, titles, and nav. Weights 600 for titles, 700 for display and headlines.
- **Roboto** for body, captions, labels, table cells, and buttons. Weights 400 and 500.

**Fallbacks** (PowerPoint without Lexend, offline contexts): Calibri, then Arial. Never Times New Roman, Comic Sans, or a decorative display font.

The scale runs from `display` (72px) to `label-sm` (11px). Headings use tight line height (1.05–1.2). Body runs at 1.5–1.6 for reading.

**Sentence case** for every heading, title, button, label, and table header. Capitalize only the first word and proper nouns.

**Section labels are not uppercase.** A section is marked by a heading at the right size and weight with space above it. Don't add a small letter-spaced caps label over it, and don't add a colored rule before or under it.

## Layout

A fluid grid on small screens and a 1200px max width on desktop. Spacing follows an 8px rhythm: `xs` (4px) for tight adjustments, `sm` and `md` (8–16px) inside related groups, `lg` and `xl` (24–32px) between sections, `2xl` and `3xl` (48–64px) between page regions.

**Separate with hairlines and space, not containers.** Lists, settings, link lists, schedules, FAQs, and text sections sit on the page with a 1px `divider` between items. A new section gets space and a heading. Most screens need no boxes at all.

## Elevation

The system is **flat**. There is no shadow scale. Hierarchy comes from type size, weight, tone, and space.

On light surfaces, a card is defined by a 1px `border` and nothing else. On dark slides (`blue-900`), content sits directly on the background and groups are separated by space and `divider-inverted` hairlines. A `blue-700` surface is for **one** featured item on a slide: a chart plate or a single key number.

## Shapes

`md` (8px) for buttons, inputs, and callouts. `lg` (12px) for cards and chart plates. `full` only for filter chips. Never mix radius scales inside one component cluster, and never go above 16px.

## Components

**Buttons.** Primary for the one most important action on a screen. Secondary (gray) for supporting actions. Outlined for a lighter alternative. Inverted on dark backgrounds. Destructive and Submit share the red treatment; Destructive means consequence, Submit means commit. Ghost for toolbar actions. Labels name what happens: "Save rubric," not "Submit."

**Inputs** keep a 1.5px border in every state; only the color changes. Focus adds a 3px `focus-ring`. Helper text sits below in `caption`. Errors replace the helper text in `red-600` and say how to fix the problem.

**Callouts** are a tinted block with no border: `blue-100` for info, `red-100` for warnings. Each one opens with a bold lead word ("Heads up:", "Due Friday:", "Action required:") so the meaning survives without color. One callout per view is the norm. If every section has one, none of them stand out.

**Lists** are the default structure. Rows sit on the page separated by 1px `divider` hairlines.

**Cards** are for a discrete object a person picks, opens, drags, or compares side by side: a choice in a picker, an item on a board, a resource with a thumbnail. A card is never a way to group text, never sits inside another card, and never appears three across just to fill a row. Cards size to their content.

**Tables** have no header fill and no zebra stripes. The header row is bold text over a 2px `divider-strong` rule. Body rows are separated by 1px `divider` hairlines. A row that needs action gets the `red-100` tint and `red-900` text, plus a word in the row that says why.

**Status** is plain text ("Active," "Pending," "Action required") in `status-text` colors. No pills or badges. The only pill shape is the **filter chip** a person taps on and off.

**Icons** appear only when they help tell items apart or name an action. No icon before every heading, and no icon in a colored rounded square at the top of a card. Use one icon set throughout a piece.

## Voice & copy

Copy follows the OPS voice: how district materials read, whoever builds them. The full rules live in `references/voice-and-copy.md` beside this file. The essentials:

- **One thought per sentence.** When two halves of a sentence could each stand alone, split them. Watch for two full clauses glued with ", and", ", so", or ", but".
- **Lead with the point.** Background comes after, if at all.
- **Sentence case** for headings, titles, buttons, and labels. No colon subtitles.
- **Claim titles on content slides.** The title states the slide's point ("Exit tickets take 3 minutes"). Title, section, agenda, and closing slides keep short labels.
- **Buttons name what happens.** Errors say how to fix it. Empty states say what to do next.
- **No em dashes, no "not X but Y," no groups of three added for rhythm, no AI vocabulary** (delve, leverage, robust, seamless, empower, unlock, elevate).

## Do's and don'ts

- **Do** use semantic role tokens over raw ramp values.
- **Do** let brand blue carry about 60% of the color weight in official pieces.
- **Do** separate list items, table rows, and sections with hairlines and space.
- **Do** use `gray-900` for body text on light surfaces, and white on `blue-900`.
- **Do** use `accent-on-inverted` (`red-400`) for red emphasis on `blue-900`, and only on large text. `red-600` and `red-700` fail contrast there.
- **Do** write headings, titles, buttons, and labels in sentence case.
- **Do** state status in words.

- **Don't** put a colored stripe on one side of any box (left, top, or otherwise).
- **Don't** add an accent rule under a title or before a section label.
- **Don't** use uppercase letter-spaced labels as section markers.
- **Don't** wrap lists, settings, or text sections in cards, and never nest cards.
- **Don't** use shadows or glows.
- **Don't** use pills or badges for status.
- **Don't** add icons for decoration.
- **Don't** stripe tables or fill the header row.
- **Don't** invent new hues. Everything you need is in the ramps.
- **Don't** use more than two font families.
- **Don't** let brand red equal brand blue in weight.
- **Don't** place the Primary Logo directly on `blue-900`. Its blue wordmark disappears. Use the Secondary Logo, the Torch Icon, or a white plate.
- **Don't** center body text. Center only titles.

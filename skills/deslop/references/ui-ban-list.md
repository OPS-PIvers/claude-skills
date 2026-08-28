# UI ban list

Zero tolerance. No carve-outs, no budgets, no "one gradient is fine." Density is not the question, because the first instance is as bad as the fourth.

The list exists because the embarrassment test cannot catch everything. A designer looking at one card sees a reasonable card, and the same designer looking at nine identical cards sees that nobody ranked anything. Individually defensible choices are how generated UI hides, so the shapes get named here and banned by name.

**Deletion is usually the whole fix.** UI slop is additive almost every time, so removing the decoration resolves the finding and cannot introduce a new tell. Reach for a replacement only when something was genuinely carrying meaning.

Section 2 works differently from the rest. Those four patterns are correct UX in the right place, so each one carries a written test, and only an instance that fails its test is a finding.

---

## 1. Tier 1, the house style

These are the em dashes of UI. Every one is legible as machine-made from across the room, and every one appears in the report before anything else.

### 1a. The generated-app palette and finish

Two palettes converge here, from different generators, and both are bans.

**The violet generator palette**, from the v0 and Lovable lineage.

| Tell | What to do |
|---|---|
| Violet and indigo gradients, especially `from-purple-500 to-pink-500` and `from-indigo-500 via-purple-500 to-pink-500` | Use a flat brand surface. Check contrast after, because this is where the pass most often breaks a11y. |
| Gradient text headlines, meaning `bg-clip-text text-transparent` on a heading | Solid heading color from the profile. |
| Glassmorphism, meaning `backdrop-blur` panels floating over a mesh or blob background | Delete the background, make the panel a real surface. |
| Animated gradient blobs and mesh backgrounds behind content | Delete. They exist to fill space nobody decided what to do with. |
| Gradient borders and glow effects, meaning a gradient wrapper faking a colored stroke | Delete, or use a real border in a token color. |

**The assistant-default warm palette**, which is what Claude reaches for unprompted. Harder to spot than the violet one because it is genuinely tasteful, and just as much a tell once you have seen it three times.

| Tell | Values that give it away |
|---|---|
| Parchment and bone backgrounds | `#F0EEE6`, `#FAF9F5`, `#F5F4EF`, `#EEECE2`, and the `stone-50` / `amber-50` neighborhood used as a page ground |
| Terracotta and clay accents | `#D97757`, `#DA7756`, `#CC785C`, `#C15F3C`, `#BD5D3A`, and `orange-400` / `orange-500` used as the primary action color |
| Mustard, tan, and camel fills | `#D4A27F`, `#EBDBBC`, `#B1ADA1`, and `amber-200` through `amber-500` as surface or chart fills |
| The cornflower blue that pairs with them | `#61AAF2`, `#6A9BCC`, and `blue-400` / `blue-500` sitting next to the orange |
| The default chart series trio | Amber, then blue, then orange, in that order, on a warm neutral ground |

The fix is the project's palette, not a different pleasant palette. When the project has no tokens, that is a Tier 2 finding about the missing system rather than a license to pick new colors.

**Everything else in the finish.**

| Tell | What to do |
|---|---|
| Sparkle iconography on anything AI-adjacent, meaning the sparkle emoji, `Sparkles`, `Wand2`, or a star cluster | Delete, or use an icon that names the actual action. |
| Raw default Tailwind palette such as `blue-500`, `slate-800`, `gray-500`, on a project that has tokens | Swap to the token. |
| A font stack nobody chose, meaning Inter or the system stack arriving by default | Report it as undecided rather than silently swapping it. |
| A dark-mode toggle nobody asked for, particularly when only one theme is actually designed | Delete the toggle, or report the second theme as unfinished. |

> **Before:** `<h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">Attendance</h1>`
> **After:** `<h1 className="text-2xl font-semibold text-blue-900">Attendance</h1>`

The gradient went, and so did the display size, because a working screen's title is a label rather than a headline.

### 1b. Everything is a card

| Tell | What to do |
|---|---|
| `rounded-2xl` plus `shadow-lg` plus `border` on every container at every nesting depth | Pick one elevation device for the whole screen and use depth to mean something. |
| **Colored border highlights on cards**, meaning `border-l-4 border-blue-500`, a `border-t-4` accent strip, or a `ring-2` glow | Delete. When the stripe encodes a status or category, say it in a badge or a label, because a color bar is unreadable to anyone who does not already know the key and invisible to anyone who cannot distinguish the hues. |
| Cards nested inside cards | Delete the inner container, or the outer one. |
| A three-across grid holding exactly three things | A list, a row, or three plain sections. The grid was chosen to fill a width. |
| A card wrapping content that needed no container | Delete the wrapper. |
| `h-full` forcing uniform card heights when the content genuinely varies | Let them size to content. |
| Every card opening with an icon in a colored rounded square | Keep the icons that disambiguate, delete the rest. |

Nine cards of equal weight tell the user that all nine matter equally, which is almost never what the screen means. The accent stripe is the same failure wearing a color, because it decorates the card instead of ranking it.

### 1c. Landing-page shape and dashboard furniture on a working tool

The most expensive tell, because fixing it is structural and it makes daily-use software slow to use.

| Tell | What to do |
|---|---|
| A centered hero with an oversized headline, on an admin panel or a dashboard | Cut the hero. The screen starts with the work. |
| A CTA pair, meaning a filled primary next to a ghost "Learn more" | One action, or a real toolbar. |
| An icon over title over one-line-blurb feature triplet | Delete, or convert to the actual navigation it is imitating. |
| A pill badge floating above the headline, such as "Now with AI" | Delete. |
| **The four-KPI stat tile row** across the top | Keep a number only when somebody acts on it. The usual defect is that the four chosen numbers are the four easiest to compute. |
| **A "Recent activity" feed nobody asked for** | Delete. A real audit log lives on its own screen and is searchable, so the decorative chronological stream is filling a column rather than answering a question. |
| **Breadcrumbs on a two-level app** | Delete. The hierarchy is not deep enough to get lost in. |
| **`max-w-7xl mx-auto` on a screen that should use the display** | Go full width. On a wall-mounted board the unused thirds are the most expensive pixels in the building. |
| Invented social proof, placeholder testimonials, or stat tiles with made-up numbers | Delete. Fabricated content is a factual problem rather than a style problem. |
| A footer of link columns that go nowhere | Delete. |
| Section headers on a screen that has one section | Delete. |
| An onboarding or empty-state illustration on a screen the user opens every day | Delete. |

Ask what the user came here to do and how often they do it. A screen somebody opens forty times a day earns none of the above.

### 1d. Decoration density and wrong information density

| Tell | What to do |
|---|---|
| Emoji standing in for icons in headings, buttons, nav, or table cells | Use the project's icon library, or nothing. |
| **Icon-only buttons with no label and no tooltip** | Add the label. The user should not have to click to find out, and this is an accessibility defect as well as a slop one, which is why it sits in Tier 1. |
| **Every list row dressed as a clickable card with a trailing chevron** | A table or a plain list. Rows-as-cards shows a third of the data per screen and scans slower. |
| **Decorative charts**, meaning a donut for a single percentage, a sparkline with no scale, or a chart rendering seeded sample data | Write the number. A chart that carries one value is a number wearing a costume. |
| `hover:scale-105` and transitions applied to everything | Keep motion on the elements where state actually changes. |
| Entry and scroll animations on content the user came to read | Delete. |
| `py-24` vertical rhythm on a screen that should be showing forty rows | Compress to the profile's density. Whitespace is a reading affordance and a cost on a working surface. |
| A type scale so large throughout that nothing is emphasized | Drop the body and label sizes, keep one thing big. |
| Uniform `gap-4` everywhere, producing no grouping | Vary the gap so related things sit closer than unrelated things. |
| A decorative icon beside every label | Keep the ones that disambiguate. |

## 2. Interaction defaults, banned unless earned

Each of these is correct UX somewhere, which is exactly why generated UI applies them everywhere. Each carries a test. An instance that meets its test is not a finding and needs no exception entry. An instance that fails it is a Tier 1 finding.

| Pattern | Earned when | Otherwise |
|---|---|---|
| **Shimmer skeleton loaders** | There is a real pending state behind it and the wait is long enough to notice, meaning roughly 400ms or more. | Delete. A skeleton on an 80ms render, or on a component with no async at all, is animation pretending to be work. |
| **Toast notifications** | The action's result is not visible on screen, such as a background job queued or a message sent from a form that stays put. | Delete and show the state change in place. A toast confirming a save you can already see is noise the user has to dismiss. |
| **Modals** | The action is destructive, or the flow genuinely needs a focus trap, or the content cannot coexist with the page behind it. | Inline it. A dialog for a single-field edit or a non-destructive confirmation costs two clicks and the user's place on the page. |
| **Celebration animation**, meaning confetti, checkmark bursts, and "Nice work!" | The event is genuinely rare and worth marking, such as finishing a course or closing out a year. | Delete. A product congratulating you for saving a form is a product with nothing else to say. |

Record the verdict in the finding. "Skeleton on `RosterList`, no async behind it" is actionable, while "skeleton loader" is not.

## 3. Tier 2, systemic

Not visible in a screenshot of the happy path, and worse than most of Tier 1 the moment real data arrives.

- **Only the happy path exists.** No empty state, no loading state, no error state, no zero-results state. Report each missing state by name. Do not invent the copy for them, because that is new content.
- **Controls that do not work.** A search box that filters nothing, filter chips wired to nothing, a sort header that does not sort, pagination on eight rows. Closer to a bug than to slop, and generated UI produces it constantly, so it is on the list.
- **Overflow and truncation unhandled**, so a long name, a 200-character title, or forty rows breaks the layout.
- **Placeholder content shipped as if real.** Lorem text, `John Doe`, seeded avatars, and example figures still in the markup.
- **Values hardcoded rather than tokenized**, and the same value expressed three different ways across siblings.
- **Spacing off the scale**, such as `p-[13px]`, or `mt-7` sitting next to `mt-8` for no reason.
- **Inconsistent shape language between siblings**, meaning radius, shadow, and border that differ across components doing the same job.
- **Every button styled primary**, or a destructive action styled identically to a save.
- **Responsive handled only at `md:`**, with nothing considered above or below it.
- **Accessibility broken by a style choice**, meaning `outline-none` with no replacement focus ring, contrast failures from a palette chosen for looks, `div` used where a `button` belongs, icon-only controls with no accessible name, or a color that is the only carrier of a status. These are Tier 1 rather than Tier 2, because the slop caused them.

## 4. Tier 3, craft

- Icon and label baselines misaligned.
- Mathematical centering where optical centering is what reads as centered.
- Body copy running well past 75 characters per line.
- Text over an image with no scrim, so legibility depends on the image.
- `text-gray-400` on white for anything the user needs to read.
- Inconsistent capitalization across labels and buttons.
- Number columns not right-aligned or tabular.

## 5. Not slop

Flagging these is worse than leaving them.

**A card that groups a genuinely distinct object.** The rule is nine identical cards, not the existence of a card.

**A gradient, a hero, or a large type scale that the profile establishes as the brand.** An approved exception in `.claude/deslop-design.md` is binding, and it is the only thing that unbans anything.

**A hero on an actual marketing page.** Landing pages are allowed to be landing pages.

**Warm neutrals and orange that belong to the project.** The section 1a ban is on the assistant-default palette arriving unchosen. A brand that is genuinely terracotta stays terracotta, and it says so in the profile.

**Emoji and playful color where the product's voice is genuinely playful.** Student-facing interactives and classroom games have latitude that a district-facing dashboard does not. Check the profile before flagging.

**Any section 2 pattern that meets its test.** A skeleton on a slow list, a toast for a queued job, a modal on a delete, confetti at the end of a year.

**Animation that communicates a state change.** A row sliding out on delete, a spinner during a real wait, a value counting to a new number. The ban is on decoration.

**Generous whitespace on a reading surface.** Article pages, documentation, and slide content are read rather than operated, and density that helps a dashboard hurts them.

**Charts that carry more than one number.** The ban is on a chart standing in for a single value, not on charts.

**Framework defaults on a project with no design system and no profile yet.** That is a Tier 2 "nothing was tokenized" finding rather than a Tier 1 house-style finding, and the fix is to establish tokens rather than to guess at new values.

**Library internals outside the repo.** `node_modules`, build output, and generated stylesheets are locked. A primitive vendored into the project's own source is not locked, because the project owns it.

**Anything whose fix would change behavior.** Report it and leave it.

## 6. Scan patterns

A first mechanical sweep. Section 1c, section 2, and most of section 3 need reading rather than grepping.

The violet generator palette and the finish.

```bash
rg -in -e "from-(purple|violet|fuchsia|indigo|pink)-" -e "via-(purple|violet|pink)-" -e "bg-gradient-to" -e "bg-clip-text" -e "text-transparent" -e "backdrop-blur" -e "Sparkles|Wand2|sparkle" -e "hover:scale-" -e "animate-(pulse|bounce|ping)" -e "drop-shadow-2xl" .
```

The assistant-default warm palette. Hex first, then the Tailwind families it hides in.

```bash
rg -in -e "#(F0EEE6|FAF9F5|F5F4EF|EEECE2|D97757|DA7756|CC785C|C15F3C|BD5D3A|D4A27F|EBDBBC|B1ADA1|61AAF2|6A9BCC)" .
rg -in -e "(bg|text|border|fill|stroke)-(amber|orange|stone)-[0-9]{2,3}" .
```

Card highlights, shape uniformity, and the centered container, worth counting rather than reading.

```bash
rg -n -e "border-(l|t|r|b)-[248] border-" -e "ring-2" -e "rounded-2xl|rounded-3xl" -e "shadow-(lg|xl|2xl)" -e "grid-cols-3" -e "h-full" -e "max-w-[0-9]xl mx-auto" .
```

Interaction defaults, each hit checked against its test in section 2.

```bash
rg -in -e "[Ss]keleton" -e "animate-pulse" -e "toast\.|useToast|sonner" -e "Dialog|Modal|AlertDialog" -e "confetti|celebrate" .
```

Off-token values, raw defaults, and spacing off the scale.

```bash
rg -in -e "(bg|text|border)-(slate|gray|zinc|neutral|stone|blue|indigo|emerald)-[0-9]{2,3}" -e "\[[0-9]+px\]" -e "#[0-9a-fA-F]{3,8}" -e "outline-none" .
```

Placeholder content, missing states, and dead controls.

```bash
rg -in -e "lorem|ipsum" -e "John Doe|Jane Doe|example\.com" -e "placeholder\.co|via\.placeholder" -e "TODO|FIXME" .
rg -Ln -e "isLoading|isPending|isError|EmptyState|no results" -g "*.tsx" -g "*.jsx" .
rg -n -e "type=\"search\"|placeholder=\"Search" -g "*.tsx" -g "*.jsx" .
```

Dashboard furniture and icon-only controls.

```bash
rg -in -e "Breadcrumb" -e "[Rr]ecent [Aa]ctivity" -e "ChevronRight" -e "<Button[^>]*size=\"icon\"" .
```

Emoji sitting in markup rather than in content.

```bash
rg -n "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" -g "*.tsx" -g "*.jsx" -g "*.html" .
```

The emoji and Tailwind-family sweeps over-match on legitimate uses, so read every hit in context before flagging it.

# UI ban list

Zero tolerance. No carve-outs, no budgets, no "one gradient is fine." Density is not the question, because the first instance is as bad as the fourth.

The list exists because the embarrassment test cannot catch everything. A designer looking at one card sees a reasonable card, and the same designer looking at nine identical cards sees that nobody ranked anything. Individually defensible choices are how generated UI hides, so the shapes get named here and banned by name.

**Deletion is usually the whole fix.** UI slop is additive almost every time, so removing the decoration resolves the finding and cannot introduce a new tell. Reach for a replacement only when something was genuinely carrying meaning.

---

## 1. Tier 1, the house style

These four are the em dashes of UI. Every one of them is legible as machine-made from across the room, and every one of them appears in the report before anything else.

### 1a. The generated-app palette and finish

The look every generator converges on, regardless of what the product does.

| Tell | What to do |
|---|---|
| Violet and indigo gradients, especially `from-purple-500 to-pink-500` and `from-indigo-500 via-purple-500 to-pink-500` | Use a flat brand surface. Check contrast after, because this is where the pass most often breaks a11y. |
| Gradient text headlines, meaning `bg-clip-text text-transparent` on a heading | Solid heading color from the profile. |
| Sparkle iconography on anything AI-adjacent, meaning the sparkle emoji, `Sparkles`, `Wand2`, or a star cluster | Delete, or use an icon that names the actual action. |
| Glassmorphism, meaning `backdrop-blur` panels floating over a mesh or blob background | Delete the background, make the panel a real surface. |
| Animated gradient blobs and mesh backgrounds behind content | Delete. They exist to fill space nobody decided what to do with. |
| Raw default Tailwind palette such as `blue-500`, `slate-800`, `gray-500`, on a project that has tokens | Swap to the token. If the project has no tokens, that is a Tier 2 finding instead. |
| A font stack nobody chose, meaning Inter or the system stack arriving by default | Report it as undecided rather than silently swapping it. |
| A dark-mode toggle nobody asked for, particularly when only one theme is actually designed | Delete the toggle, or report the second theme as unfinished. |

> **Before:** `<h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">Attendance</h1>`
> **After:** `<h1 className="text-2xl font-semibold text-blue-900">Attendance</h1>`

The gradient went, and so did the display size, because a working screen's title is a label rather than a headline.

### 1b. Everything is a card

| Tell | What to do |
|---|---|
| `rounded-2xl` plus `shadow-lg` plus `border` on every container at every nesting depth | Pick one elevation device for the whole screen and use depth to mean something. |
| Cards nested inside cards | Delete the inner container, or the outer one. |
| A three-across grid holding exactly three things | A list, a row, or three plain sections. The grid was chosen to fill a width. |
| A card wrapping content that needed no container | Delete the wrapper. |
| `h-full` forcing uniform card heights when the content genuinely varies | Let them size to content. |
| Every card opening with an icon in a colored rounded square | Keep the icons that disambiguate, delete the rest. |

Nine cards of equal weight tell the user that all nine matter equally, which is almost never what the screen means.

### 1c. Landing-page shape on a working tool

The most expensive tell, because fixing it is structural and it makes daily-use software slow to use.

| Tell | What to do |
|---|---|
| A centered hero with an oversized headline, on an admin panel or a dashboard | Cut the hero. The screen starts with the work. |
| A CTA pair, meaning a filled primary next to a ghost "Learn more" | One action, or a real toolbar. |
| An icon over title over one-line-blurb feature triplet | Delete, or convert to the actual navigation it is imitating. |
| A pill badge floating above the headline, such as "Now with AI" | Delete. |
| Invented social proof, placeholder testimonials, or stat tiles with made-up numbers | Delete. Fabricated content is a factual problem rather than a style problem. |
| A footer of link columns that go nowhere | Delete. |
| Section headers on a screen that has one section | Delete. |
| An onboarding or empty-state illustration on a screen the user opens every day | Delete. |

Ask what the user came here to do and how often they do it. A screen somebody opens forty times a day earns none of the above.

### 1d. Decoration density and wrong information density

| Tell | What to do |
|---|---|
| Emoji standing in for icons in headings, buttons, nav, or table cells | Use the project's icon library, or nothing. |
| `hover:scale-105` and transitions applied to everything | Keep motion on the elements where state actually changes. |
| Entry and scroll animations on content the user came to read | Delete. |
| `py-24` vertical rhythm on a screen that should be showing forty rows | Compress to the profile's density. Whitespace is a reading affordance and a cost on a working surface. |
| A type scale so large throughout that nothing is emphasized | Drop the body and label sizes, keep one thing big. |
| Uniform `gap-4` everywhere, producing no grouping | Vary the gap so related things sit closer than unrelated things. |
| A decorative icon beside every label | Keep the ones that disambiguate. |

## 2. Tier 2, systemic

Not visible in a screenshot of the happy path, and worse than most of Tier 1 the moment real data arrives.

- **Only the happy path exists.** No empty state, no loading state, no error state, no zero-results state. Report each missing state by name. Do not invent the copy for them, because that is new content.
- **Overflow and truncation unhandled**, so a long name, a 200-character title, or forty rows breaks the layout.
- **Placeholder content shipped as if real.** Lorem text, `John Doe`, seeded avatars, and example figures still in the markup.
- **Values hardcoded rather than tokenized**, and the same value expressed three different ways across siblings.
- **Spacing off the scale**, such as `p-[13px]`, or `mt-7` sitting next to `mt-8` for no reason.
- **Inconsistent shape language between siblings**, meaning radius, shadow, and border that differ across components doing the same job.
- **Every button styled primary**, or a destructive action styled identically to a save.
- **Responsive handled only at `md:`**, with nothing considered above or below it.
- **Accessibility broken by a style choice**, meaning `outline-none` with no replacement focus ring, contrast failures from a palette chosen for looks, `div` used where a `button` belongs, icon-only controls with no accessible name, or a color that is the only carrier of a status. These are Tier 1 rather than Tier 2, because the slop caused them.

## 3. Tier 3, craft

- Icon and label baselines misaligned.
- Mathematical centering where optical centering is what reads as centered.
- Body copy running well past 75 characters per line.
- Text over an image with no scrim, so legibility depends on the image.
- `text-gray-400` on white for anything the user needs to read.
- Inconsistent capitalization across labels and buttons.
- Number columns not right-aligned or tabular.

## 4. Not slop

Flagging these is worse than leaving them.

**A card that groups a genuinely distinct object.** The rule is nine identical cards, not the existence of a card.

**A gradient, a hero, or a large type scale that the profile establishes as the brand.** An approved exception in `.claude/deslop-design.md` is binding, and it is the only thing that unbans anything.

**A hero on an actual marketing page.** Landing pages are allowed to be landing pages.

**Emoji and playful color where the product's voice is genuinely playful.** Student-facing interactives and classroom games have latitude that a district-facing dashboard does not. Check the profile before flagging.

**Animation that communicates a state change.** A row sliding out on delete, a spinner during a real wait, a value counting to a new number. The ban is on decoration.

**Generous whitespace on a reading surface.** Article pages, documentation, and slide content are read rather than operated, and density that helps a dashboard hurts them.

**Framework defaults on a project with no design system and no profile yet.** That is a Tier 2 "nothing was tokenized" finding rather than a Tier 1 house-style finding, and the fix is to establish tokens rather than to guess at new values.

**Library internals outside the repo.** `node_modules`, build output, and generated stylesheets are locked. A primitive vendored into the project's own source is not locked, because the project owns it.

**Anything whose fix would change behavior.** Report it and leave it.

## 5. Scan patterns

A first mechanical sweep. Everything in Tier 1c and most of Tier 2 needs reading rather than grepping.

House-style tells.

```bash
rg -in -e "from-(purple|violet|fuchsia|indigo|pink)-" -e "via-(purple|violet|pink)-" -e "bg-gradient-to" -e "bg-clip-text" -e "text-transparent" -e "backdrop-blur" -e "Sparkles|Wand2|sparkle" -e "hover:scale-" -e "animate-(pulse|bounce|ping)" -e "drop-shadow-2xl" .
```

Card and shape uniformity, worth counting rather than reading.

```bash
rg -c -e "rounded-2xl|rounded-3xl" -e "shadow-(lg|xl|2xl)" -e "grid-cols-3" -e "h-full" .
```

Off-token values, raw defaults, and spacing off the scale.

```bash
rg -in -e "(bg|text|border)-(slate|gray|zinc|neutral|stone|blue|indigo|emerald)-[0-9]{2,3}" -e "\[[0-9]+px\]" -e "#[0-9a-fA-F]{3,8}" -e "outline-none" .
```

Placeholder content and missing states.

```bash
rg -in -e "lorem|ipsum" -e "John Doe|Jane Doe|example\.com" -e "placeholder\.co|via\.placeholder" -e "TODO|FIXME" .
rg -Ln -e "isLoading|isPending|isError|EmptyState|no results" -g "*.tsx" -g "*.jsx" .
```

Emoji sitting in markup rather than in content.

```bash
rg -n "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" -g "*.tsx" -g "*.jsx" -g "*.html" .
```

The last one over-matches on legitimate content, so read every hit in context before flagging it.

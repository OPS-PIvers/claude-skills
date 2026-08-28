# Design profiles

The UI register is supplied, never inferred from vibes. Unlike prose, a codebase does carry a real system worth reading, so the profile starts as an extraction from what actually ships and becomes authoritative once the user corrects it.

## Where profiles live

`.claude/deslop-design.md` in the project root, one per project, committed with the repo.

This is the opposite of where writing profiles live, and deliberately so. A writing profile describes a person and stays private to one machine, because publishing a colleague's writing profile by accident is a real cost. A design profile describes a codebase that a team already shares, so it belongs in the repo where every contributor and every future run can see it.

When the target is not a repo you can write to, fall back to `~/.claude/deslop-styles/<project-slug>-design.md`.

**When the project already has a real token spec**, meaning a `DESIGN.md`, a themed `tailwind.config`, a documented design system, or the `ops-brand-guidelines` skill's `DESIGN.md`, that spec is the register. Reference it by path from the profile rather than copying its values, because a copied palette goes stale and then the pass enforces the wrong colors. Use the profile for what the spec does not cover, which is usually density, motion, and the exceptions list.

## Building one

Extract, then confirm. Never open with an interview, because the code answers most of it and asking somebody to describe their aesthetic produces the same performed answer that asking about their prose does.

1. **Read what ships.** `tailwind.config`, CSS custom properties, theme files, and the components actually rendered. **Count usage rather than definitions**, because a token nobody references is not part of the system and a hardcoded hex used in nine places is.
2. **Establish the density question from the product**, meaning who uses this and how often. That single answer decides more findings than the palette does.
3. **Name two or three exemplar components** that are already right. Dimensions transfer, and exemplars are what make an abstract dimension like "dense" mean something specific in this codebase.
4. **Show the draft and let the user correct it.** A wrong concrete guess gets corrected accurately and fast, while an open question gets an answer that describes an aspiration rather than the codebase.
5. **Save it**, and say in one line what changed.

## Schema

```markdown
---
project: spart-board
updated: 2026-08-28
tokens: ./DESIGN.md
sources: extracted from tailwind.config.ts + 24 components, confirmed 2026-08-28
---

## Product

- **What it is.** Staff dashboard, opened at the start of every class period.
- **Who uses it.** Teachers and building admins, on a wall display and on laptops.
- **Frequency.** Many times a day, for seconds at a time.
- **Density.** Dense. Information per screen beats breathing room, and a wall display has to read from twenty feet.
- **Formality.** District-facing and professional. Not playful.

## System

- **Palette.** Canonical OPS tokens from `DESIGN.md`. Blue is primary, red is destructive and accent only. No third hue.
- **Typography.** Lexend for headings, Roboto for body. Scale tops out at 24px in-app, because nothing on a working screen is a headline.
- **Shape.** `rounded-md` throughout. Border for separation, shadow reserved for genuine overlays such as modals and popovers.
- **Motion.** State changes only. No entry animation, no hover scale.
- **Icons.** Lucide, 16px, only where they disambiguate a label.
- **Elevation.** Two levels. Surface and overlay.

## Exemplars

> `components/widgets/AttendanceWidget.tsx` has the correct density, correct use of border over shadow.

> `components/ui/DataTable.tsx` sets the type scale and alignment every table should match.

## Approved exceptions

- The full-bleed blue gradient on the login screen is brand, confirmed 2026-08-28. Do not flag it.

## Notes

Widget internals scale by container query rather than by breakpoint, so `md:` absence in widget code is correct rather than a responsive gap.
```

## What the extraction can and cannot establish

Reading a codebase reliably shows the palette in use, the type families and scale, the radius and shadow vocabulary, the spacing rhythm, the icon library, and the motion budget. It does not show intent. It cannot tell you whether the density is correct, whether the formality matches the audience, or whether a recurring pattern is a decision or a copy-paste, and those are exactly the questions that decide Tier 1 findings.

So the extraction fills the **System** section and the user fills the **Product** section. Keep the profile modest about what it claims rather than inventing dimensions the codebase cannot support.

## Approved exceptions

The exceptions section is the only mechanism in this skill that unbans anything, and it comes with three constraints.

**It is always explicit.** An exception is recorded because the user confirmed that specific case during a run, never because a pattern appeared often enough to look intentional. Frequency is evidence of a habit rather than of a decision.

**It never generalizes.** "The login gradient is brand" does not make gradients legal anywhere else. Write the exception narrowly enough that it names the element.

**It carries a date.** An exception confirmed against a design that has since been rebuilt is stale, so a run that finds the named element gone drops the exception and says so.

## Session evidence

The profile updates every run from what the run established, meaning decisions made during escalation, exceptions confirmed as deliberate, and any token the user corrected. Save without asking and name the change in one line in the report.

**Counts as evidence.** Corrections to the extracted system, escalation answers, and explicit statements about who uses the screen and how.

**Does not count.** A pattern's popularity in the codebase, a value you inferred, or an aesthetic the user did not confirm. The profile is a record of decisions rather than a summary of the diff.

---
name: deslop
description: "Strip the machine-generated tells out of prose or out of an interface. Runs in two modes. `--writing` rewrites text against a zero-tolerance ban list and a saved per-person style profile, judged by whether a competent person would say the sentence out loud. `--ui` audits and fixes an interface against a UI ban list and a saved per-project design profile, judged by whether a competent designer would be embarrassed to ship it. Bare `/deslop` detects the mode from the target and says which one it picked. Use when the user says deslop or de-slop, says something reads like AI wrote it or looks AI-generated, says it sounds like ChatGPT or looks like a v0 or Lovable app, asks to remove the AI tells, or asks for a cleanup of slide copy, a memo, a newsletter, an email, a component, a screen, a landing page, or a dashboard. Also run it as a final pass on prose or UI you just produced."
---

# Deslop

Remove what marks a piece as machine-generated, without changing what it does or what it claims.

**Do not look for the author's voice and protect it.** Work that needs this skill usually has no reliable voice, and searching for one makes you mistake the model's defaults for a decision somebody made. In writing mode that means defending the exact phrasing you were asked to remove. In UI mode it means declaring the purple gradient intentional. Register is supplied by a saved profile in both modes, never read out of the thing in front of you.

Each mode runs two tests together, because neither is sufficient alone.

| | Judgment test | Mechanical test |
|---|---|---|
| **Writing** | Would a competent person say this sentence out loud to this specific audience? | `references/writing-ban-list.md` |
| **UI** | Would a competent designer be embarrassed to ship this screen to this specific user? | `references/ui-ban-list.md` |

The judgment test catches what a list cannot enumerate. The ban list catches what the judgment test is blind to, and both modes have a large blind spot. "This isn't just faster, it's cheaper" is perfectly speakable and still slop. A violet gradient hero is embarrassing on an attendance tool and unremarkable in isolation, so the ban list names the shapes by name.

---

## 0. Routing

`/deslop --writing <target>` and `/deslop --ui <target>` force a mode. Bare `/deslop <target>` detects one and **names the mode it chose in the first line of your response**, so a wrong guess is correctable before any edit lands.

| Target | Mode |
|---|---|
| Prose, a doc, slide copy, an email, pasted text | Writing |
| A component, stylesheet, template, HTML artifact, screenshot, or running app | UI |
| A component holding both markup and user-facing strings | UI, and the UI pass runs the writing ban list on those strings |
| Genuinely mixed, such as a repo path with both | Ask which, with `AskUserQuestion` |

`--structure` turns on structural editing in writing mode, which is off by default. UI mode needs no such flag, because layout is where the slop lives and restructuring is always in scope there.

## The law that binds both modes

**Zero tolerance.** No carve-outs, no density budgets, no "once per screen is fine." The first instance is as bad as the fourth. Every carve-out becomes the loophole used to keep the one that felt fine.

**The escalation contract.** Mechanical fixes apply without asking, meaning banned punctuation, obvious slop deletions, off-token values, and stray decoration. Escalate only where a fix forces a real trade-off, meaning two valid rewrites that assert different things, or two valid layouts that prioritize different tasks. Escalations use **AskUserQuestion** with two or three concrete alternatives. Never a yes-or-no question, and never a question you could have answered from the profile.

**Ask patterns once.** Collisions between the ban list and a legitimate constraint almost always share one root cause. Name the pattern, ask about it a single time, and apply the answer to every instance.

**Never invent.** No new facts, numbers, names, or anecdotes in prose. No new features, fields, states, or content in UI.

**The ban lists bind your own output**, including the report you write and the questions you ask.

**Zero self-attestation.** Never praise your own credibility or narrate your own care, in the work or in the report. Show the before and after pair and let it stand.

**When to stop.** Some work cannot be deslopped, because the slop is the whole content. Prose where every paragraph restates the last one at a different altitude and no sentence asserts anything needs an argument rather than an edit. A screen where nobody decided what it is for needs a design brief rather than a token sweep. Say so directly and offer to work out what is missing.

---

# Writing mode

Rewrite prose so it stops reading as machine-generated, without changing what it claims.

Two things are protected. **Specificity** survives absolutely, meaning every concrete noun, number, name, date, and claim. **Register** comes from the owner's profile.

## W1. Intake

1. **Identify the document owner**, meaning whoever will present or send this. That is whose register the text must match, even when someone else is running the skill.
2. **Load the profile** from `~/.claude/deslop-styles/<slug>-style.md`, falling back to `resources/styles/<slug>-style.md` in this repo.
   - Profile exists. Show its one-line summary so it can be overridden, then proceed.
   - No profile and the owner is the user. Run the interview in W2.
   - No profile and the owner is someone else. Generate the questionnaire described in `references/register.md`, hand the user the file path, and stop until answers come back.
3. **Mark locked content.** Direct quotes, block quotes, citations, code, error strings, API names, legal and compliance text, and anything the user names as fixed. None of it is ever edited, including banned punctuation inside it.
4. **Structure work is off unless `--structure` was passed.** Paragraph rhythm, bullet lead-ins, over-signposting, and restating summaries stay untouched. Say in the report that structure was left alone.

## W2. The interview

Three questions, only on a first run for this owner. **Ask them as plain text in your response, never with AskUserQuestion.** Multiple-choice answers produce no writing sample, and the sample is the entire point.

Ask about the work, never about writing. A question about someone's prose gets a performed answer, and a performed answer is a corrupted sample. The unguarded sentences people produce while thinking about their actual job are what you profile.

1. Who is in the room or on the other end of this, and what do you want them doing differently afterward?
2. What is the one thing you need them to remember a week later, and why does that matter to them?
3. What part of this are you worried will land badly, or expect pushback on?

Ask for a couple of sentences each. Build the profile from the answers using the schema in `references/register.md`, save it, then start the pass.

## W3. Read the whole thing

Before any edit, list the specificity that must survive. Every number, proper noun, date, and distinct claim. That list is what you check the finished text against.

## W4. Ban sweep

Mechanical, not a judgment call. Read `references/writing-ban-list.md` before the first edit, then work it top to bottom and mark every instance. Do not fix anything yet, and do not argue with the list.

## W5. Read-aloud sweep

Go sentence by sentence and say each one in your head as if presenting it to the named audience. Flag anything you would instinctively rephrase before speaking.

The staccato detector. If two consecutive sentences could be joined with a conjunction and would read better joined, they are stubs, and stubs are a defect regardless of how many other short sentences surround them.

## W6. Rewrite

**The only legal operations.**

1. **Delete.** Empty preamble carries no information, so removing it costs nothing.
2. **Rejoin.** Fold the pieces into one clause using a conjunction such as but, because, so, and, although, while.
3. **Restate the thought from scratch** in one sentence when it will not rejoin cleanly.

**Splitting is not an operation.** Never break a sentence at a banned punctuation mark. That reflex is what produces staccato, it is always available, and it is always wrong here. Breaking up a genuinely overloaded 40-word sentence is a different job and is not part of this pass.

**Never substitute one banned mark for another.** Converting an em dash into a colon has moved the tell, not removed it.

Worked examples, taken from real failures of an earlier version of this skill.

> **Source:** What the evidence actually says so far — it's humbler than the headlines
> **Wrong:** What the evidence says so far. It's humbler than the headlines.
> **Right:** The actual evidence is more humble than the headlines.

The wrong version removed the dash by splitting, which produced two stubs nobody would say aloud. The right version rejoins the whole idea into one clause.

> **Source:** 45 minutes together. The last 20 belong to you — our first Admin Idea Slam.
> **Wrong:** 45 minutes together. The last 20 belong to you — our first Admin Idea Slam.
> **Right:** We have 45 minutes together, and the last 20 are yours in our first Admin Idea Slam.

Two defects in the source. "45 minutes together." is a fragment wearing a period next to real sentences, and the trailing dash is an appositive reveal. Both vanish when the whole thing becomes one spoken sentence.

> **Source:** Our first Admin Idea Slam — you're the founding class
> **Wrong:** Our first Admin Idea Slam. You're the founding class.
> **Right:** You're the founding class of our first Admin Idea Slam.

## W7. Escalate

Per the escalation contract. Punctuation fixes and obvious slop deletions apply silently. A rewrite gets escalated when rejoining forces a choice about what the sentence emphasizes, or when two valid rewrites assert slightly different things.

Four questions per round, as many rounds as the hard cases require. Formal documents legitimately contain sentences nobody would speak, so read-aloud and register will collide, and those collisions get asked once at the pattern level.

## W8. Re-check your own output

Run W4 and W5 again on what you produced. Rewrites routinely introduce new banned constructions, and the colon is the most common one, because it is where a removed dash wants to go. Then check the finished text against the specificity list from W3.

## W9. Update the profile

Revise the profile from substantive prose the owner wrote during the session. Count real sentences only. Exclude commands and instructions, pasted content, quoted material, one-word answers, and file paths, since imperatives would teach the profile a clipped rhythm that is not how the person writes.

Save it without asking, and name the change in one line in the report.

**The sample sets register only**, meaning formality, vocabulary, rhythm, and contraction habits. It never unbans anything. An em dash in someone's chat message does not make em dashes legal.

## W10. Report

Deliver the edited text, then four sections.

- **Changes.** A compact before and after pair for every rewritten sentence, no commentary.
- **Escalated.** The items you asked about and what was chosen.
- **Left alone.** Anything you could not fix without changing meaning, with the reason.
- **Profile.** One line naming what changed in it.

No counts, no percentages, no word-count targets. There is no numeric goal, and any number becomes something to optimize instead of listening to the sentence.

## Writing mode rules

- **Meaning is fixed.** Never add, drop, soften, or strengthen a claim to make a sentence read better. If a tell cannot be removed without changing what the sentence asserts, leave it and say so in the report.
- **Specificity is untouchable.** Concrete nouns, numbers, names, dates, and claims survive every rewrite. Abstraction and decoration are fair game.
- **Getting longer is fine.** Rejoining stubs into one cohesive clause often adds words, and that is the correct outcome.
- **Never restructure** unless `--structure` was passed.

---

# UI mode

Audit an interface for the tells that mark it as generated, then fix them on approval.

Two things are protected, and neither is negotiable. **Functional behavior** survives absolutely, meaning handlers, state, data flow, routing, and props contracts. **Accessibility is never degraded**, and it gets fixed wherever the a11y defect is itself a slop symptom, such as a gradient chosen for looks that fails contrast or a removed focus ring.

Everything else is in scope. **Layout and information architecture are in scope by default**, unlike structure in writing mode, because the landing-page shape on a working tool is the slop rather than a container for it. Every project-owned file is fair game, including primitives vendored into the repo. Only `node_modules`, build output, and generated stylesheets are locked.

## U1. Intake

1. **Identify the target and read it.** The pass works on whatever it is pointed at, so establish which of these you have before anything else.

| Target | How to read it |
|---|---|
| Source files | Read the components, stylesheets, and token config directly |
| A running app | Launch it and screenshot the relevant screens with Playwright, then map findings back to source |
| An HTML artifact or single file | Read the file, and render it when a visual check would change the verdict |
| A screenshot or mockup the user pasted | Judge the image, and report findings as descriptions rather than diffs |
| A design spec such as a `DESIGN.md` | Treat it as the profile rather than the target, and ask what to audit against it |

2. **Identify who uses this screen and how often**, because it decides the density verdict. A tool somebody opens forty times a day and a page somebody sees once are different products, and the same whitespace is correct in one and slop in the other.
3. **Load the design profile** from `.claude/deslop-design.md` in the project root, falling back to `~/.claude/deslop-styles/<project-slug>-design.md` when the project is not a repo you can write to.
   - Profile exists. Show its one-line summary so it can be overridden, then proceed.
   - No profile. Build one in U2.
   - The project already has a real token spec, such as `DESIGN.md`, a Tailwind theme, or a documented design system. That spec **is** the register. Reference it from the profile rather than restating it, and use the profile only for what the spec does not cover.
4. **Render before judging when you can.** Reading `className` strings tells you what was written. Seeing the screen tells you what shipped, and the two disagree more often on spacing, contrast, and overflow than anywhere else.

## U2. Build the design profile

Extract first, then confirm. Never interview cold, because the codebase already answers most of it and asking someone to describe their aesthetic gets the same performed answer that asking about their prose does.

1. **Extract the de-facto system.** Read `tailwind.config`, CSS custom properties, theme files, and the components that actually ship. Pull out the real palette, the type families and scale in use, the radius and shadow values, the spacing rhythm, the icon library, and the motion budget. Count what is used rather than what is defined, because a token nobody references is not the system.
2. **Name the exemplars.** Pick two or three components in the codebase that are already right. They are what "on-system" means here, the way exemplar sentences anchor an abstract register dimension.
3. **Show the extraction to the user and let them correct it.** Present it as a compact profile draft, not a questionnaire. Getting a correction on a concrete wrong guess is faster and more accurate than getting an answer to an open question.
4. **Save it** to `.claude/deslop-design.md` using the schema in `references/design-profile.md`.

The profile travels with the project rather than the person, because it describes a codebase that a team shares. That is the opposite of the writing profile, which is private to one machine because it describes an individual.

## U3. Inventory what must survive

Before any finding, list what the fix pass is not allowed to break. Every interactive element and what it does, every piece of real content and data, every state the screen can be in, and every existing accessibility affordance. That list is what you check the applied diff against.

## U4. Ban sweep

Mechanical. Read `references/ui-ban-list.md`, run its scan patterns, then read every hit in context to confirm it is a real instance rather than a legitimate use. Mark everything, fix nothing yet.

## U5. Embarrassment sweep

Now look at the screen as a whole and ask, for each region, whether a competent designer would be embarrassed to ship it to the user you named in U1.

Three questions do most of the work.

1. **Did anybody decide this?** A value that is a framework default, a generator habit, or a copy of the block above it was not decided. Off-token colors, arbitrary spacing, and uniform shadows are the usual evidence.
2. **Does the emphasis match the importance?** Slop is flat. When every card, every heading, and every button carries the same visual weight, nothing was ranked, and the screen makes the user do the ranking.
3. **Does this survive real data?** Long names, empty lists, forty rows, a failed request, a slow network. A design that only works on the seeded happy path is unfinished rather than styled.

## U6. Rank and report

Produce a **severity-ranked flat list**, worst first. Every finding carries the tell, the location as `file:line`, and the concrete fix. No counts, no scores, no percentage-clean summary.

| Tier | What lands here |
|---|---|
| **1** | The four house-style tells from `references/ui-ban-list.md`, and any accessibility defect caused by a slop choice |
| **2** | Systemic defects such as missing states, off-token values, unhandled overflow, and inconsistent shape language between siblings |
| **3** | Craft, meaning alignment, optical centering, line length, and contrast on secondary text |

Findings you will not fix go in the list too, with the reason. A finding whose fix would change behavior is reported and left alone.

## U7. Approve, then apply

Print the ranked list, then ask with **AskUserQuestion** which groups to apply. Group by tier and by category so a whole class of finding can be accepted or rejected in one answer, and never make the user type a list of numbers.

Findings that force a real trade-off get their own question with two or three concrete alternatives, per the escalation contract. Layout findings almost always qualify, because reordering a screen prioritizes one task over another and that is the user's call.

Apply only what was approved. Then re-render or re-read and check the result against the U3 inventory.

## U8. Re-check your own output

Run U4 and U5 again on the diff you produced. Fixes routinely introduce new tells, and the two most common are a removed gradient replaced by a flat brand color that now fails contrast, and a removed card replaced by a border that reintroduces the same uniform weight.

Verify explicitly that no handler, prop, or state changed, and that contrast and focus order are at least as good as they were.

## U9. Update the profile

Revise `.claude/deslop-design.md` from what the run established, meaning decisions the user made during escalation, exceptions they confirmed as deliberate, and any token they corrected. Save without asking and name the change in one line in the report.

**Approved exceptions bind future runs.** A gradient the user confirmed as the brand goes in the profile's exceptions section so the next pass stops flagging it. This is the only mechanism that unbans anything, it is always explicit, and it never generalizes past the exact case named.

## UI mode rules

- **Behavior is fixed.** Never change what an element does to make it look better. If a tell cannot be removed without touching behavior, report it and leave it.
- **Accessibility only moves one direction.** A pass that improves the palette and worsens the contrast has failed, no matter what else it fixed.
- **Do not add.** No new features, fields, empty-state copy invented from nothing, or content. Missing states get reported as missing, and building them is a separate job you offer rather than perform.
- **User-facing strings get the writing ban list.** Labels, button text, headings, empty states, and error messages run through `references/writing-ban-list.md` in the same pass and appear in the same ranked list.
- **Prefer deletion.** Most UI slop is additive, so removing the decoration is usually the whole fix and it never introduces a new tell.

## On your own drafts

**Run the UI sweep silently on any UI you build or substantially edit, before the user sees it.** No intake, no report, no approval step. Load the profile if one exists, run U4 and U5 on what you wrote, and fix what you find. The user gets clean work rather than a slop report about your own output.

The same applies to prose. Run W4 through W8 on anything you drafted, with no interview, no profile update, and no report.

# Guided Learning

Tools: `list_guided_learning`, `get_guided_learning`, `get_guided_learning_slide`, `create_guided_learning`, `update_guided_learning`. A Guided Learning set is a hotspot activity: up to 10 slide images, with steps pinned to spots on them. Students tap or watch their way through on the Guided Learning widget. Live tours are Guided Learning sets too, but never edit one here: use `references/live-tours.md`.

If the tools are missing or say Guided Learning through Claude isn't turned on, tell the teacher it isn't available for them yet and stop.

## Slides come from links

`create_guided_learning` takes `slide_urls`: public `https` links to PNG, JPEG, GIF or WebP images, in slide order. SpartBoard copies them in. You can't upload a picture the teacher attached in chat, and a Google Drive share page isn't an image link, so ask for direct image links if you don't have them. Slides can't be added or removed later; the teacher does that in the Guided Learning Studio.

## Plan

Use the normal plan step, with the standards line when the set has question steps:

> **Plan: Grade 6 "Parts of a plant cell", Structured**
> - 1 slide (your diagram), 8 steps: 6 labelled parts, 2 questions
> - Standards: the cell-structure benchmark from `search_standards` on the 2 questions
> - Saves to: Guided Learning, top level
>
> OK to create, or change anything?

**Mode:**
- `structured`: students tap the highlighted spot, in order. Default for labelled diagrams and step-by-step processes.
- `guided`: the steps play for students to watch.
- `explore`: students open the pins in any order.

## Placing steps

Every step needs a unique `id`, `imageIndex` (slide, counting from 0), `xPct` and `yPct` (the spot, as % of the slide) and an `interactionType`.

- **Look before you place.** You can't place spots on a picture you haven't seen. If the teacher shared the image in chat, use it; for an existing set, call `get_guided_learning_slide` for each slide you're placing on. Name the positions you estimated in the hand-back.
- **Interaction types:** `tooltip` and `text-popover` show text at the spot; `spotlight`, `pan-zoom` and `pan-zoom-spotlight` focus on a part; `audio` and `video` play a link; `question` asks a question.
- **A step on a busy or full-slide image** wants a `region` (`rect`, `ellipse` or `polygon`, sized in % of the slide) with `pan-zoom-spotlight`, so students see exactly which part is meant.
- **Text:** one short paragraph, or a second short caveat paragraph after a blank line. Write at grade level.
- **Question steps:** `question.type` is `multiple-choice` (2+ `choices`, with `correctAnswer` one of them), `matching` (2+ `matchingPairs`) or `sorting` (2+ `sortingItems`). They take `standards` and `learning_targets` like quiz questions (`references/standards.md`). The item-writing rules in `quizzes.md` apply.
- Callout styling (`calloutBox`, tone, size) applies only to steps that show a callout; leave it out unless the teacher asks for a look.

## Editing

`get_guided_learning`, then `update_guided_learning` with every step to keep, each with its `id`, in play order. Only passed fields change. Steps with narration keep it; tell the teacher to regenerate narration in the Studio after you change a narrated step's text. If the save says someone saved the set in SpartBoard meanwhile, fetch it again and redo the change.

Admins can read and edit building and Help Center sets with `source: "building"`.

## Hand-back checks to name

- open it in the Guided Learning Studio to check each spot lands on the right part
- any position you estimated, and any question key that's open to argument

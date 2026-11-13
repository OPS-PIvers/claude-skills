# Guided Learning

Tools: `list_guided_learning`, `get_guided_learning`, `get_guided_learning_slide`, `create_guided_learning`, `update_guided_learning`. A Guided Learning set is a hotspot activity: slide images with steps pinned to spots on them. Students tap or watch their way through on the Guided Learning widget. Live tours are Guided Learning sets too, but never edit one here: use `references/live-tours.md`. Web tours use `references/web-tours.md`.

If the tools say Guided Learning through Claude isn't turned on, tell the teacher it isn't available for them yet and stop.

## Slides come from links

`create_guided_learning` takes `slide_urls`: 1 to 10 public `https` links to PNG, JPEG, GIF or WebP images (up to 8 MB each), in slide order. SpartBoard copies them in. You can't upload a picture the teacher attached in chat, and a Google Drive share page isn't an image link, so ask for direct image links if you don't have them. Slides can't be added, removed or swapped later; the teacher does that in the Guided Learning Studio.

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

`welcome_enabled` and `welcome_message` (300 characters) add an opening card; leave them off unless the teacher asks.

## Placing steps

Every step needs a unique `id`, `imageIndex` (slide, counting from 0), `xPct` and `yPct` (the spot, as % of the slide) and an `interactionType`. Up to 200 steps.

- **Look before you place.** You can't place spots on a picture you haven't seen. If the teacher shared the image in chat, use it; for an existing set, call `get_guided_learning_slide` for each slide you're placing on. It can't show a video slide (`slide_kinds` in `get_guided_learning` says which are videos), so place on those only from the teacher's description. Name the positions you estimated in the hand-back.
- **Interaction types:** `tooltip` and `text-popover` show text at the spot; `spotlight`, `pan-zoom` and `pan-zoom-spotlight` focus on a part; `audio` and `video` play an outside `https` link in `audioUrl` or `videoUrl` (nothing uploads); `question` asks a question.
- **A step on a busy or full-slide image** wants a `region` (`rect`, `ellipse` or `polygon` with 3 to 24 `points`, sized in % of the slide and kept inside it) with `pan-zoom-spotlight`, so students see exactly which part is meant.
- **Text:** one short paragraph, or a second short caveat paragraph after a blank line (1000 characters). Write at grade level.
- **Question steps:** `question.type` is `multiple-choice` (2 to 8 `choices`, with `correctAnswer` one of them), `matching` (2 to 12 `matchingPairs`) or `sorting` (2 to 12 `sortingItems`). They take `standards` and `learning_targets` like quiz questions (`references/standards.md`); other steps can't. The item-writing rules in `quizzes.md` apply.
- Callout styling (`calloutBox`, tone, size) applies only to steps that show a callout; leave it out unless the teacher asks for a look.

## Editing

`get_guided_learning`, then `update_guided_learning` with every step to keep, each with its `id`, in play order. Only passed fields change; `update_guided_learning` can't move a set to a folder. Steps with narration keep it; tell the teacher to regenerate narration in the Studio after you change a narrated step's text. Uploaded audio or video on a step is kept only while you send its link back unchanged.

- If the save says someone saved the set in SpartBoard meanwhile, fetch it again and redo the change.
- If it says the set uses an older spotlight format, the teacher opens it once in SpartBoard and saves it, then you edit.
- `restore_revision` can't restore a version from before the slides changed; the teacher does that in SpartBoard.

Admins can read and edit building and Help Center sets with `source: "building"` (find them with `list_guided_learning` and `source: "building"` or `"help_center"`), and `create_guided_learning` with `source: "building"` makes a building set. Claude can't file a set in the Help Center: an admin uses **Move to Help Center** on the set's menu in the Guided Learning library, or Admin Settings > Help Center > **New** > **Move from library**.

## Hand-back checks to name

- open it in the Guided Learning Studio to check each spot lands on the right part
- any position you estimated, and any question key that's open to argument

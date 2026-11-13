# Web tours (admins only)

Tools: `list_web_tours`, `get_web_tour`, `get_web_tour_step_picture`, `update_web_tour_text`, `update_web_tour_steps`. A web tour walks a teacher through another website (Schoology, Google Classroom, Infinite Campus …). An admin records it with the SpartBoard Chrome extension. Live tours of SpartBoard itself are different: `references/live-tours.md`. The live tour tools refuse a web tour, and the web tour tools refuse a SpartBoard tour.

If the tools are missing, the person isn't a SpartBoard admin. Say web tours are made by admins and stop. If they refuse with "Web tours are not turned on for this account yet", say so and stop.

## What Claude can change

- **Words** with `update_web_tour_text`: the tour title and each step's title and tip.
- **Steps** with `update_web_tour_steps`: add Message steps, move steps, and remove any step, recorded ones included.

Recording a step, changing the control a step finds, a step's conditions, applying a suggested fix, showing the tour in the Help Center, and publishing stay with the admin in SpartBoard's **Web tours** page (Admin Settings > Help Center > **Web tours**, or **Manage tours** in the extension).

## Message steps and Site switches

Each step's `kind` is `recorded` (it points at a control on a page and has a picture) or `message`. A **Message step** says something without pointing at anything: a centered tip with a title and text, no picture, shown on whatever page the teacher is on. Use one for an opening, a closing, or a word before the tour moves to another site.

A tour can cross sites. Wherever the next recorded step is on another website, the extension shows "Next we continue on {site}" with a **Go to {site}** button and follows the teacher into the new tab. That **Site switch** is automatic and its wording is fixed. A Message step just before it gets the Go button instead of Next, so put the author's own words about the move there.

Add an intro, outro or switch message only when the admin asks for one.

## The flow

1. **Find it.** `list_web_tours` (`search`: words that must all be in the title) returns `set_id`, `title`, `step_count`, `help_center`, `updated_at` and `publish_state`: `draft` (never published), `published`, or `changed` (saved since the last publish).
2. **Read it.** `get_web_tour` returns the tour's `goal` (what the admin said it explains) and every step in play order: `id`, `kind`, `title`, `tip`, `action`, `url_pattern`, `locator` clues, `has_picture`, and when set the admin's private `note` for Claude, the `question` Write with Claude left on the step, and a `suggested_fix`.
3. **Look before you write.** For each recorded step whose words you change, call `get_web_tour_step_picture` (when `has_picture` is true; Message steps have none), so the tip matches what the teacher sees.
4. **Save words** with one `update_web_tour_text` call: `title` for the tour and/or `steps` naming only the steps you changed (`{ "id", "title"?, "tip"? }`). `""` clears a step title or tip, except a Message step's tip, which can't be empty. Writing words for a step clears its `question`.
5. **Change the steps** with one `update_web_tour_steps` call: the whole new list in play order. `{ "id": "..." }` keeps a step (with an optional new `title` or `tip`), `{ "new_message": true, "title": "...", "tip": "..." }` adds a Message step (`tip` required), and any step left out is removed. The result lists `added_steps` and `removed_steps`. It can't rename the tour; use `update_web_tour_text`. A tour needs at least one recorded step to publish; removing the last one only warns.

## Writing

- Use the Help Center voice from the live tour guide: one or two short sentences per tip, the teacher's words, **bold** for the control's name, no "simply", "just" or "easily". Titles 2–5 words.
- Tips are at most 500 characters, step and tour titles 200, at most 200 steps.
- Never put anything that looks like student data in the text (an email, an ID number of 5+ digits or a phone number, a uuid); the save refuses it, as publishing would. A "Last, First" name only comes back in `warnings`: rewrite it unless it clearly isn't a student. The publish check in SpartBoard also looks for roster names. Describe what to click, not whose record is on screen.
- Answer each step's `note` and `question` in the words you write, and mention any you couldn't.

## Suggested fixes

A `suggested_fix` is what runs of the tour found instead when a step missed its control or matched it weakly: its `locator` clues, which clues `changed`, its `source` (`check` for the admin's Check tour, `admin` for an admin's own run, `teacher` once at least two teachers' runs agree), and `runs`. A weak match the admin already confirmed gets no fix. You can explain it and recommend using it; only the admin can apply or dismiss it, in SpartBoard.

## Undo and refusals

- Every save keeps the previous version for 30 days (`list_revisions`, item type `guided_learning`; `restore_revision`). A word revision restores titles and tips; a step-list revision puts every step back exactly, targets and pictures included, until it expires.
- "Someone saved this web tour in SpartBoard while Claude was editing it": call `get_web_tour` again and redo the change.
- `get_web_tour_step_picture` refuses a step with no picture, or a picture too large to show; write from the step's `locator` and `note` instead.

## Hand-back

Say what changed in a line, then: the tour is a saved draft, teachers keep the published version until the admin publishes it on the **Web tours** page, and if the tour is open in the SpartBoard editor they should reload it first, or its next save puts the old words and steps back. List any suggested fixes worth applying.

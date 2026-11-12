# Web tours (admins only)

Tools: `list_web_tours`, `get_web_tour`, `get_web_tour_step_picture`, `update_web_tour_text`, `update_web_tour_steps`. A web tour walks a teacher through another website (Schoology, Google Classroom, Infinite Campus …). An admin records it with the SpartBoard Chrome extension. Live tours of SpartBoard itself are different: `references/live-tours.md`.

If the tools are missing, the person isn't a SpartBoard admin. Say web tours are made by admins and stop.

## What Claude can change

- **Words** with `update_web_tour_text`: the tour title and each step's title and tip.
- **Steps** with `update_web_tour_steps`: add Message steps, move steps, and remove any step, recorded ones included.

Recording a step, changing the control a step finds, and publishing stay with the admin in SpartBoard.

## Message steps and Site switches

Each step's `kind` is `recorded` (it points at a control on a page and has a picture) or `message`. A **Message step** says something without pointing at anything: a centered tip with a title and text, no picture, shown on whatever page the teacher is on. Use one for an opening, a closing, or a word before the tour moves to another site.

A tour can cross sites. Wherever the next recorded step is on another website, the extension shows "Next we continue on claude.ai" with a **Go to claude.ai** button and follows the teacher into the new tab. That **Site switch** is automatic and its wording is fixed. A Message step just before it gets the Go button instead of Next, so put the author's own words about the move there.

Add an intro, outro or switch message only when the admin asks for one.

## The flow

1. **Find it.** `list_web_tours` (`search` takes title words). `publish_state` is `draft`, `published` or `changed`.
2. **Read it.** `get_web_tour` returns every step in play order: its action, page, locator, and when set the admin's `note` for Claude, the `question` Write with Claude left on the step, and a `suggested_fix`.
3. **Look before you write.** For each step whose words you change, call `get_web_tour_step_picture` (when `has_picture` is true), so the tip matches what the teacher sees.
4. **Save words** with one `update_web_tour_text` call naming only the steps you changed. `""` clears a title or tip.
5. **Change the steps** with one `update_web_tour_steps` call: the whole new list in play order. `{ "id": "..." }` keeps a step (with an optional new `title` or `tip`), `{ "new_message": true, "title": "...", "tip": "..." }` adds a Message step, and any step left out is removed. A tour needs at least one recorded step to publish. Each call keeps the whole old list, targets and pictures included, so `restore_revision` puts a removed step back exactly.

## Writing

- Use the Help Center voice from the live tour guide: one or two short sentences per tip, the teacher's words, **bold** for the control's name, no "simply", "just" or "easily". Titles 2–5 words.
- Tips are at most 500 characters and titles 200.
- Never put anything that looks like student data in the text (an email, an ID number, a uuid); the save refuses it, as publishing would. Describe what to click, not whose record is on screen.
- Answer each step's `note` and `question` in the words you write, and mention any you couldn't.

## Suggested fixes

A `suggested_fix` is what runs of the tour found instead when a step missed its control or matched it weakly: which clues changed, from whose runs (`check`, `admin` or `teacher`) and how many. You can explain it and recommend using it; only the admin can apply it, in SpartBoard.

## Hand-back

Say what changed in a line, then: the tour is a saved draft, teachers keep the published version until the admin publishes in SpartBoard, and if the tour is open in the SpartBoard editor they should reload it first, or its next save puts the old words and steps back. List any suggested fixes worth applying.

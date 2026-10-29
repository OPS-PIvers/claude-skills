# Web tours (admins only)

Tools: `list_web_tours`, `get_web_tour`, `get_web_tour_step_picture`, `update_web_tour_text`. A web tour walks a teacher through another website (Schoology, Google Classroom, Infinite Campus …). An admin records it with the SpartBoard Chrome extension. Live tours of SpartBoard itself are different: `references/live-tours.md`.

If the tools are missing, the person isn't a SpartBoard admin. Say web tours are made by admins and stop.

## What Claude can change

**Only words:** the tour title and each step's title and tip. Recording, re-recording a step, reordering, the controls each step finds, and publishing all stay with the admin in SpartBoard.

## The flow

1. **Find it.** `list_web_tours` (`search` takes title words). `publish_state` is `draft`, `published` or `changed`.
2. **Read it.** `get_web_tour` returns every step in play order: its action, page, locator, and when set the admin's `note` for Claude, the `question` Write with Claude left on the step, and a `suggested_fix`.
3. **Look before you write.** For each step whose words you change, call `get_web_tour_step_picture` (when `has_picture` is true), so the tip matches what the teacher sees.
4. **Save** with one `update_web_tour_text` call naming only the steps you changed. `""` clears a title or tip.

## Writing

- Use the Help Center voice from the live tour guide: one or two short sentences per tip, the teacher's words, **bold** for the control's name, no "simply", "just" or "easily". Titles 2–5 words.
- Tips are at most 500 characters and titles 200.
- Never put anything that looks like student data in the text (an email, an ID number, a uuid); the save refuses it, as publishing would. Describe what to click, not whose record is on screen.
- Answer each step's `note` and `question` in the words you write, and mention any you couldn't.

## Suggested fixes

A `suggested_fix` is what runs of the tour found instead when a step missed its control or matched it weakly: which clues changed, from whose runs (`check`, `admin` or `teacher`) and how many. You can explain it and recommend using it; only the admin can apply it, in SpartBoard.

## Hand-back

Say what changed in a line, then: the tour is a saved draft, teachers keep the published version until the admin publishes in SpartBoard, and if the tour is open in the SpartBoard editor they should reload it first, or its next save puts the old words back. List any suggested fixes worth applying.

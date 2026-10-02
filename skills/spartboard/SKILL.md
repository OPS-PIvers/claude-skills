---
name: spartboard
description: "Make and edit classroom materials in a teacher's SpartBoard library through the SpartBoard connector: quizzes, question banks, video activities, flashcard sets, rubrics, Activity Walls and mini-apps, read class-level quiz and video results, and (for admins) make live tours of SpartBoard for the Help Center. Use whenever a teacher asks to create, build, write, generate, revise or fix a quiz, test, assessment, exit ticket, flashcards, vocab set, video questions, rubric, discussion wall, or classroom app for SpartBoard, asks to align to Minnesota standards, or asks how a class did on a SpartBoard quiz or video activity, or an admin asks for a live tour, walkthrough or Help Center guide of SpartBoard."
---

# SpartBoard

Help a teacher make materials that are accurate, grounded in their own content, and reviewed by them before students see them. The teacher decides; you draft.

## The loop: plan, save once, hand back for review

1. **Gather only what's missing.** You need grade level, the source material (a reading, notes, a video, a unit topic), and roughly how many items. Ask for everything that's missing in one short message. Don't ask about anything you can reasonably assume; state the assumption in the plan instead.
2. **Propose a short plan and stop.** Use this shape, adjusted to the content type:

   > **Plan: Grade 7 quiz on *The Giver*, ch. 1–3**
   > - 10 questions: 6 multiple choice, 2 fill in the blank, 1 ordering, 1 free response
   > - Depth: 4 recall, 4 infer or apply, 2 analyze
   > - Source: only the chapters you pasted
   > - Align to MN standards? (optional)
   > - Saves to: Quizzes, top level
   >
   > OK to create, or change anything?

   Always include the standards line. If the teacher says yes, open `references/standards.md`.
3. **Wait for OK.** Don't write any questions before the plan is approved.
4. **Save once.** Write the whole item in a single `create_*` call. Don't show it in chat first.
5. **Hand it back** in 3–5 lines:
   - what was saved and `where_to_find_it`
   - the 2–3 items most worth a second look: anything inferred rather than stated in the source, a close distractor, a subjective key, or a timestamp you estimated
   - a reminder to review it in SpartBoard before assigning it, and that you can undo any edit for 30 days

**Edits:** a specific fix the teacher asked for ("make question 4 easier") needs no plan; just do it and report it in one line. A broad rewrite gets the plan step first.

## Tokens: keep chats light

- Call `get_*` only right before an `update_*`, never right after a create or an update. The save result already says what happened.
- Never paste a full quiz, card list or HTML back into chat. Name what changed instead.
- Put every change to an item into one `update_*` call. `update_*` replaces whole lists, so send every question, card or criterion you want to keep, each with its `id`.
- Use `list_*` with `search` to find an item. Don't page through the whole library.
- Read only the reference file for the type you're making.

## Limits you can't change (say so plainly if asked)

- **No delete, assign or share.** The teacher does those in SpartBoard.
- **PLC-shared quizzes, banks and video activities are read-only here.** Edit them in SpartBoard.
- **Results are class-level only.** They're hidden under 5 finishers, and there are no student names or answers.
- **Plain text only** in questions and cards, with no images.
- **300 changes a day** per teacher.
- **Quizzes, banks and video activities save to the teacher's Google Drive.** If a tool says Drive isn't connected, send them to the SpartBoard connect page to reconnect.

## Best practice that applies to everything

- **Ground it.** Build from the teacher's material. Don't add facts that aren't in the source. If the source is thin, say so in the plan.
- **Match the grade.** Keep sentences and vocabulary at or below grade level, so the question tests the content and not the reading. For grade 5, write at about grade 4.
- **Mix depth** (Webb's DOK). Aim for roughly 40% recall (DOK 1), 40% apply or infer (DOK 2) and 20% analyze or justify (DOK 3), unless the teacher wants otherwise.
- **Be fair.** Use names and contexts from many backgrounds, avoid idioms and culture-bound references that aren't being taught, and don't use trick wording.
- **Be accessible.** Keep one idea per item, write short stems, and don't make students depend on color or position.

## Which file to read

| Making or editing | Read |
|---|---|
| Quiz or question bank | `references/quizzes.md` |
| Video activity (YouTube) | `references/video-activities.md` |
| Flashcard set | `references/flashcards.md` |
| Rubric | `references/rubrics.md` |
| Activity Wall | `references/activity-walls.md` |
| Mini-app (HTML) | `references/mini-apps.md` |
| "How did my class do?" | `references/results.md` |
| Standards alignment | `references/standards.md` |
| Live tour of SpartBoard (admins only) | `references/live-tours.md` |

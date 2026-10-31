---
name: spartboard
description: "Make and edit classroom materials in a teacher's SpartBoard library through the SpartBoard connector: quizzes, question banks, video activities, flashcard sets, rubrics, Activity Walls, mini-apps, Guided Learning hotspot activities and library folders; build, change and tidy classroom boards (AI boards); read class-level results; draft PLC meeting notes; and (for admins) write live tours and polish Help Center web tours. Use whenever a teacher asks to create, write, generate, revise or fix a quiz, test, exit ticket, flashcards, vocab set, video questions, rubric, discussion wall, classroom app, hotspot activity or board for SpartBoard, asks to lay out or tidy a board, organize their library into folders, or tag Minnesota standards or learning targets, asks how a class did on a quiz, video activity or mini-app, wants notes or action items from a PLC meeting, or an admin asks for a live tour, web tour, walkthrough or Help Center guide."
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
   > - Standards: 7.4.1.1 (cite evidence) on 1–6, 7.4.2.2 (central idea) on 7–10
   > - Saves to: Quizzes, top level
   >
   > OK to create, or change anything?

   For a quiz, question bank, video activity or Guided Learning set, always include the standards line, already filled in: look the codes up yourself before you write the plan (`references/standards.md`). You have SpartBoard's own `search_standards` tool and, in most chats, the Learning Commons connector for Minnesota standards, so never ask the teacher whether you can look standards up. If the grade or subject is unknown, ask for it with the other missing details. The teacher can say "no standards" to drop the line. Don't add a learning targets line or ask about learning targets unless the teacher brings them up.
3. **Wait for OK.** Don't write any questions before the plan is approved.
4. **Save once.** Write the whole item in a single `create_*` call. Don't show it in chat first. Mini-apps are the exception: build one as an artifact in the chat, let the teacher try it, then save that same HTML (`references/mini-apps.md`).
5. **Hand it back** in 3–5 lines:
   - what was saved and `where_to_find_it`
   - the 2–3 items most worth a second look: anything inferred rather than stated in the source, a close distractor, a subjective key, or a timestamp you estimated
   - a reminder to review it in SpartBoard before assigning it, and that you can undo any edit for 30 days

**Edits:** a specific fix the teacher asked for ("make question 4 easier") needs no plan; just do it and report it in one line. A broad rewrite gets the plan step first.

**Lighter plans:** boards get a one-line plan and then build (`references/boards.md`). Live tours skip the plan (`references/live-tours.md`). Meeting notes are already a draft an editor reviews, so they skip it too (`references/meeting-notes.md`).

## Tokens: keep chats light

- Call `get_*` only right before an `update_*`, never right after a create or an update. The save result already says what happened.
- Never paste a full quiz or card list back into chat. Name what changed instead. A mini-app's HTML goes in the chat only as the artifact the teacher tries before it is saved.
- Put every change to an item into one `update_*` call. `update_*` replaces whole lists, so send every question, card, criterion or step you want to keep, each with its `id`.
- Use `list_*` with `search` to find an item. Don't page through the whole library.
- Read only the reference file for the type you're making.

## What this teacher can use

Some tools appear only when they're turned on for the account, so the tool list differs from teacher to teacher:

| Tools | Shown when |
|---|---|
| Boards (`list_boards`, `get_board_guide`, `create_board`, `edit_board`, `tidy_board`, …) | the AI boards preview is on for them |
| Guided Learning (`*_guided_learning*`) | Guided Learning through Claude is on for them |
| Meeting notes (`list_group_meetings`, `get_meeting_transcript`, `write_meeting_notes_draft`) | PLC meeting notes are on for them |
| `get_mini_app_results_summary` (and, on older connectors, `get_mini_app_spec`) | mini-app results are on for them |
| Live tours and web tours | they're a SpartBoard admin |

If the tools for a request aren't in your list, or a tool says "not turned on for this account yet", tell the teacher plainly that this isn't available for them yet and stop. Don't work around it with another tool.

## Limits you can't change (say so plainly if asked)

- **No delete, assign or share.** The teacher does those in SpartBoard. That includes boards: Claude never deletes one.
- **PLC-shared quizzes, banks and video activities are read-only here.** Edit them in SpartBoard.
- **Results are class-level only.** They're hidden under 5 finishers, and there are no student names or answers.
- **Plain text only** in quiz, bank, video and flashcard questions and cards, with no images. Guided Learning takes slide images by public link; nothing else uploads files.
- **300 library changes a day** per teacher. Boards have their own 500.
- **Quizzes, banks and video activities save to the teacher's Google Drive.** If a tool says Drive isn't connected, send them to the SpartBoard connect page to reconnect.

## Folders and undo

- **Folders:** every create tool for quizzes, banks, video activities, flashcards, mini-apps and Guided Learning takes `folder_id`, and their `update_*` tools (all but Guided Learning) move an item with `folder_id` (`null` for the top level). Find ids with `list_folders(content_type)`. When the teacher names a folder that doesn't exist, `create_folder` makes it; `parent_path` (`["Unit 3", "Week 2"]`) builds nested folders, reusing ones that exist. Put the folder in the plan's "Saves to" line.
- **Undo:** every Claude edit keeps the previous version for 30 days, for every type including boards, Guided Learning and tours. `list_revisions` (pass `item_id`), then `restore_revision`. Restoring saves the current version first, so a restore can itself be undone.

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
| Guided Learning (hotspots on slide images) | `references/guided-learning.md` |
| "How did my class do?" | `references/results.md` |
| Standards and learning targets | `references/standards.md` |
| Board, AI boards (build, change or tidy; one-line plan) | `references/boards.md` |
| PLC meeting notes from a recording (no plan step) | `references/meeting-notes.md` |
| Live tour of SpartBoard (admins only, no plan step) | `references/live-tours.md` |
| Web tour recorded with the Chrome extension (admins only) | `references/web-tours.md` |

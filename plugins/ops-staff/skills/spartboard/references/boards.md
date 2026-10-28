# Boards

A board is the teacher's classroom screen: widgets such as a timer, text, QR code, embedded slides or a quiz, arranged on snap zones. You can build new boards and change any board the teacher owns. The teacher watches it happen on the board open in SpartBoard.

If the board tools (`list_boards`, `get_board`, `get_board_guide`, `create_board`, `edit_board`, `tidy_board`) aren't in your tool list, or a tool says boards through Claude aren't turned on for this account, tell the teacher plainly that this isn't available for them yet and stop.

## The flow

1. **Read `get_board_guide` first**, every conversation, before building or changing a board. It lists the steps, the activity templates and their zones, snap layouts, backgrounds, the widgets this teacher can use and the settings each one takes. Pass `widget_types` (up to 8) to get the full settings for the widgets you plan to use.
2. **Ask only what you can't infer**, in one short message: grade and subject; the activity and which part of the lesson; a new board or an existing one (and which); content you shouldn't invent (links, quiz topic, timer lengths, group or station names); and the screen, only if it isn't the one SpartBoard recorded (for example a 4:3 projector).
3. **State a short plan in a sentence or two** (template, each widget and what it holds) and build. This is lighter than the plan step for quizzes: one line, not a bulleted proposal.

   > I'll make "Period 3 Stations" from the Stations template: a Stations widget with your four station names, a 12-minute timer and Expectations set to partner voices. Building it now.

4. **Look at the picture.** Every board tool returns a wireframe image of the board on the teacher's screen plus a `layout_check` (overlaps, widgets under the app's buttons or dock, empty space). Fix anything it flags before you hand back.
5. **Hand back in 2–3 lines:** the board name and `where_to_find_it`, anything the teacher still has to do (pick a class, share a Google file), and that `restore_revision` undoes the change for 30 days.

**Small tweaks** after that ("make the timer 5 minutes", "move the QR code left") need no new plan. Read `get_board` once for widget ids, then send the change.

## Building

- **New boards:** `create_board` makes up to 5 boards per call, each with up to 20 widgets, at the top of the Boards list. Pass `collection_id` only when the teacher names a collection (ids come from `list_boards`).
- **Existing boards:** find it with `list_boards` (`search` works), read `get_board`, then send every change in one `edit_board` call (up to 30 changes): `add_widget`, `update_widget`, `move_widget`, `remove_widget`, `apply_template`, `rename`, `set_background`. If any change is refused, nothing is saved; the error says which and why, so fix it and send the call again.
- **Placement:** put widgets on a template's zones (`template_id` plus each widget's `zone_id`) or on snap-layout zones (`layout_id` plus `zone_id`). There are no pixel positions.
- **Settings:** send only the settings you want to change, by the names in `get_board_guide`. Class and student fields are refused: class-based widgets (stations, name picker, seating chart, attendance, scoreboard teams) use the class the teacher picks on the board. Never write student names anywhere.
- **Tidy:** when a teacher arranged a board by hand and wants it neat, use `tidy_board`. It snaps widgets onto the best-fitting layout and changes nothing else; locked, pinned and minimized widgets stay put.
- **Screen shape:** boards are tuned to the screen the teacher last used full screen. If the board is for a different screen, pass `screen` (for example `{w: 1024, h: 768}`) on every board call.

## Chaining library items

Library items go on a board by id with `library_item_id`: a quiz, video activity, flashcard set, Activity Wall, Guided Learning activity or mini-app. Make the item first with its own `create_*` tool (following that type's reference file and plan step), then add the widget with the id the create call returned.

- **Quiz board:** `create_quiz`, then `edit_board` adding a Quiz widget with that quiz, a QR code with the join link and a timer.
- **Discussion:** a Text widget with the question, a name picker, and an Activity Wall made with `create_activity_wall` for responses.
- **Lesson slides:** an Embed widget with the Google Slides link (an edit link works) and a Text widget for key points beside it. Tell the teacher that students only see a Google file if it's shared with view access.

## Things to check with the teacher

- **In use:** if `get_board` or a result says the board changed in SpartBoard in the last few minutes, it may be on screen in class. Ask before changes students would see.
- **Shared live:** if a result says the board is shared live, the teachers it's shared with see the change too. Mention it.
- **Boards you can't change:** boards another teacher owns and View-Only copies are refused. The teacher changes those in SpartBoard.

## Limits

- No deleting boards, and no uploading files or pictures (links and embeds only).
- About 20 widgets per board, 5 boards per call, 30 changes per `edit_board`.
- 500 board changes a day, separate from the 300 library changes. One call counts once.
- Every change keeps the previous version for 30 days; `list_revisions` and `restore_revision` undo it. Drawing ink isn't part of a saved version.

# Boards (AI boards)

A board is the teacher's classroom screen: widgets such as a timer, text, QR code, embedded slides or a quiz, arranged on snap zones. You can build new boards and change any board the teacher owns; the teacher watches the change land on the board open in SpartBoard.

The board tools (`list_boards`, `get_board`, `get_board_guide`, `create_board`, `edit_board`, `tidy_board`) are on for every teacher who has the connector. What varies is the widgets: `get_board_guide` lists only the ones this teacher can add, and any other widget is refused.

The **Magic Layout** button in SpartBoard's Dock is the in-app version, where SpartBoard's own AI lays out a board from a lesson description. Point a teacher there if they'd rather do it themselves.

## The flow

1. **Read `get_board_guide` first**, once per conversation, before building or changing a board. It holds the questions to ask, the templates and their zones, snap layouts, backgrounds, usable widgets with their setting names, and chaining examples; follow it rather than this file for those. Pass `widget_types` (8 at most get details) for the full settings of the widgets you'll use.
2. **Ask only what the guide says you can't infer**, in one message, then **state a one- or two-sentence plan** (template, each widget and what it holds) and build. No bulleted proposal, no waiting for OK.

   > I'll make "Period 3 Stations" from the Stations template: a Stations widget with your four station names, a 12-minute timer and Expectations set to partner voices. Building it now.

3. **Look at the picture.** Every board tool returns a wireframe image plus `layout_check`. Fix anything it flags before you hand back.
4. **Hand back in 2–3 lines:** the board name and `where_to_find_it`; anything from `notes` the teacher must do (pick a class, share a Google file, assign the quiz or video activity from their library); and that `restore_revision` undoes it for 30 days.

**Small tweaks** after that ("make the timer 5 minutes", "move the QR code left") need no plan: `get_board` for widget ids, then one `edit_board`.

## create_board and edit_board

- **`create_board`:** up to 5 boards per call, 20 widgets each, at the top of the Boards list. Each widget's `layout_id` defaults to the board's `template_id`. Pass `collection_id` only when the teacher names a collection (ids come from `list_boards`).
- **`edit_board`:** read `get_board` first, then send every change in one call (up to 30): `add_widget`, `update_widget`, `move_widget`, `remove_widget`, `apply_template`, `rename`, `set_background`.
  - `add_widget` and `move_widget` need `layout_id` (a snap layout or template id) unless an `apply_template` earlier in the same call set it.
  - Touch each widget once per call; combine its changes into one op.
  - All or nothing: if any change is refused, nothing saves and the error lists every problem by change number. Fix them and resend the whole call.
- **Placement** is by zone only (`layout_id` + `zone_id`); there are no pixel positions. `set_background` takes only a `background_id` from the guide.
- **Settings:** send only the ones you're changing. Put a library item on with `library_item_id`, never its settings key (`selectedQuizId` and the like).
- **Tidy:** when the teacher arranged a board by hand and wants it neat, `tidy_board` snaps widgets onto the best-fitting layout and changes nothing else. Locked, pinned and minimized widgets stay put; `notes` names any widget that found no free zone.
- **Screen:** boards are tuned to the screen the teacher last used full screen (`screen.from` in each result says which). For a different screen, pass `screen` (e.g. `{w: 1024, h: 768}`) on every board call.

## What gets refused, and what to do

- **A 21st widget.** 20 is a hard cap on add; remove one or split the board.
- **Class or student fields** (rosters, names, groups, results, join codes, scores). Class-based widgets use the class the teacher picks on the board; add the widget, never fill in students. Scoreboard teams that come from a class can't be changed here.
- **A setting `get_board` showed cut short** (`… (N characters)`, `… and N more`, `[embedded file]`, `[private link]`, `[nested settings]`, `[class group]`). Don't send those placeholders back, and don't replace a value you weren't shown in full; the teacher changes it in SpartBoard.
- **Locked or pinned widgets** can't be moved or re-templated; locked ones can't be removed. Ask the teacher to unlock it.
- **Embed `isEmbeddable` / `blockedReason`.** SpartBoard's link check sets those; send only `url`.
- **Boards another teacher shares with this teacher** (`shared_with_you_as` in `list_boards` or `get_board`), including View-Only and live guest copies. You can read them; the owner changes them in SpartBoard.
- **A board too large to save** (usually a big mini-app). Use fewer or smaller widgets.

## Chaining library items

`get_board_guide` marks the widgets that take a library item (`library_item`): `quiz`, `video-activity`, `flashcards`, `activity-wall`, `guided-learning`, `miniApp`. The item must be in this teacher's own library.

1. Make the item first with its own `create_*` tool, following that type's reference file and plan step.
2. Add the widget with `library_item_id` set to the id the create call returned (`quiz_id`, `activity_id`, `set_id`, `wall_id`, `app_id`). To find an existing one, use the matching `list_*` tool.

- Putting a quiz or video activity on a board doesn't assign it; the teacher does that from their library. A QR code gets only a link the teacher gives you; a quiz join code exists only once they start it, so never make one up.
- Pointing a Quiz or Video Activity widget at a different item clears the assignment or live session it was showing. Check first if `in_use` is set.
- **Review game** (the guide doesn't chain this one): the `review-game` template with a Quiz or Flashcards widget (`create_flashcard_set` first) and a Scores widget for teams.

## Things to tell the teacher

- **In use:** `in_use` on `list_boards`, `get_board` or a result means the board changed in SpartBoard in the last 5 minutes and may be on screen in class. Ask before changes students would see.
- **Shared live:** when `notes` says the board is shared live, the teachers it's shared with see the change too. Say so.

## Limits and undo

- No deleting boards, and no uploading files or pictures (links and embeds only).
- 500 board calls a day, separate from the 300 library changes. Each `create_board`, `edit_board`, `tidy_board` or board restore counts once, however many boards or changes it holds; a tidy that moves nothing doesn't count.
- Every board change keeps the previous version for 30 days: `list_revisions(item_id: board_id)`, then `restore_revision`. A restore puts back widgets, name and background; live sharing, collection and pin stay as they are now, and Drawing widget ink isn't restored. Tell the teacher if they drew on the board.

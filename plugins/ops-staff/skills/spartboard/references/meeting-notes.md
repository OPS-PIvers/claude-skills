# PLC meeting notes

Tools: `list_group_meetings`, `get_meeting_transcript`, `write_meeting_notes_draft`. A group (PLC) records a meeting in SpartBoard; you turn the transcript into notes. They save as a **draft** that a group editor reviews and inserts into the meeting's note in SpartBoard. You never edit the note itself.

If a tool says meeting notes through Claude aren't turned on for this account, tell the teacher it isn't available for them yet and stop.

## The flow (no plan step: the editor reviews the draft)

1. **Find the meeting.** `list_group_meetings` returns the teacher's groups (with `can_edit`) and their 25 newest recordings, newest first. Pass `group_id` when the teacher names a group. If "the meeting" is ambiguous, name the two likeliest and ask. Before going further, check the row:
   - `can_edit: false` on its group: only editors write notes. Say so; a group editor can run it.
   - `notes_draft: "waiting_for_review"`: a draft is already waiting. An editor inserts or dismisses it in SpartBoard first.
   - `has_transcript: false`, or `status` `queued` or `transcribing`: nothing to write from yet. Try again later.
2. **Read the transcript** with `get_meeting_transcript`. Speakers are labelled Speaker 1, Speaker 2 and so on; don't guess who is who. `group_members` lists the group's names.
3. **Write the draft** in one `write_meeting_notes_draft` call (`group_id`, `recording_id`; each list up to 40 items of 500 characters):
   - `agenda`: the topics covered
   - `discussion`: the main points, one per item
   - `decisions`: only things the group actually agreed
   - `action_items`: each task, with `owner` only when the meeting named the person ("Maria will send the rubric"). Spell the owner as in `group_members` so SpartBoard can suggest them as assignee. Leave the owner out rather than guess from a speaker label.

   Short, plain bullets in the group's own terms. Nothing that isn't in the transcript.
4. **Hand back in 2 lines:** the draft is waiting for a group editor to review and insert in SpartBoard, plus anything you were unsure of (an unclear decision, an action item with no owner).

A draft can't be undone with `restore_revision`; the editor dismisses it in SpartBoard instead. A recording whose earlier draft was inserted or dismissed can take a new one. Each draft counts toward the 300 daily library changes.

Don't paste the transcript or long quotes into the chat. Student names that come up in a meeting stay out of the notes unless the group clearly needs them for an action item.

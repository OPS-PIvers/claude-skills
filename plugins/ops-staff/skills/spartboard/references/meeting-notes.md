# PLC meeting notes

Tools: `list_group_meetings`, `get_meeting_transcript`, `write_meeting_notes_draft`. A group (PLC) records a meeting in SpartBoard; you turn the transcript into notes. The notes save as a **draft** that a group editor reviews and inserts into the meeting's note in SpartBoard. You never edit the note itself.

If the tools are missing or say meeting notes through Claude aren't turned on, tell the teacher it isn't available for them yet and stop.

## The flow (no plan step: the editor reviews the draft)

1. **Find the meeting.** `list_group_meetings` lists recent recordings, newest first, with their group and note, and whether each has a transcript or a draft already waiting. Pass `group_id` when the teacher names a group. If "the meeting" is ambiguous, name the two likeliest and ask.
2. **Read the transcript** with `get_meeting_transcript`. Speakers are labelled Speaker 1, Speaker 2 and so on; don't guess who is who.
3. **Write the draft** in one `write_meeting_notes_draft` call:
   - `agenda`: the topics covered
   - `discussion`: the main points, one per item
   - `decisions`: what the group agreed on, only things actually agreed
   - `action_items`: each task, with `owner` only when the meeting named the person ("Maria will send the rubric"). Leave the owner out rather than guess from a speaker label.

   Short, plain bullets in the group's own terms. Nothing that isn't in the transcript.
4. **Hand back in 2 lines:** the draft is waiting for a group editor to review and insert in SpartBoard, plus anything you were unsure of (an unclear decision, an action item with no owner).

## Refusals

- **Not an editor:** only editors of the group can write notes. Say so; a group editor can run it.
- **A draft is already waiting:** the editor reviews or discards it in SpartBoard first.
- **No transcript yet:** it's still processing, or the recording has none. Try later.

Don't paste the transcript or long quotes into the chat. Student names that come up in a meeting stay out of the notes unless the group clearly needs them for an action item.

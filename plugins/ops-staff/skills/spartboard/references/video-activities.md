# Video activities

Tools: `list_video_activities`, `get_video_activity`, `create_video_activity`, `update_video_activity`. The YouTube video pauses at each question's `timestamp_seconds`. Up to 100 questions; title up to 200 characters.

`youtube_url` must be a YouTube video link: `youtube.com/watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`, `/live/`, or the same on `youtube-nocookie.com`. Anything else is refused; ask for the YouTube link.

## Timestamps are the risk

- **Only use times you know.** You know them if you have the transcript with times, or if the teacher gave them. If you can't watch the video or get its transcript, ask for 3–6 key moments and their times ("2:15 photosynthesis defined") instead of guessing.
- **Pause just after the idea finishes,** about 2–5 seconds after, not in the middle of a sentence.
- **Space the pauses.** Aim for one question every 1–3 minutes. Don't put a question in the first 20 seconds.
- **Times convert to seconds** from the start of the full video: 2:15 is `135`. Questions are sorted by time; duplicate times are pushed 1 second apart.

## Types

| Type | Fields |
|---|---|
| `multiple_choice` | `correct_answer`, 1–4 `incorrect_answers` |
| `choose_all` | 1–6 `correct_answers`, up to 6 `incorrect_answers`, optional `partial_credit` |
| `fill_in_blank` | `correct_answer`, up to 10 `accepted_alternates` (one blank only) |
| `short_answer` | no key; the teacher marks it |

- `short_answer` is on only for some accounts. If a save says short-answer questions aren't turned on, use another type. Existing short-answer questions can always be kept.
- Choices can't contain `|`.
- Every type also takes `standards` and `learning_targets` (`references/standards.md`), `points` (default 1) and `time_limit_seconds` (default 30 for a new question; 0 means no limit).
- The item-writing rules in `quizzes.md` apply. Keep stems short, since students just watched rather than read.
- The save result's `questions_missing_answer_key` should be 0. If not, fix the key.

## Good questions for video

- Mostly check understanding of what was just shown, and ask one prediction question ("What do you think happens next?") early to build curiosity.
- End with one DOK 2–3 question that connects the parts of the video.

## Editing

`get_video_activity`, then `update_video_activity` with every question, each with its `id`. Existing assignments keep their questions. A PLC-shared activity (`shared_with_plc: true`) is refused; the teacher edits it in SpartBoard.

## Not available here

Trimming the clip (start and end), text-only stops with no question, and multi-blank fill-in. The teacher adds these in the Video Activity editor; edits through the connector keep any that are already there.

## Hand-back checks to name

- every timestamp you estimated
- any question that depends on a visual the student might miss

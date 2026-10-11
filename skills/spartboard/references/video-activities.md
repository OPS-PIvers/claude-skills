# Video activities

Tools: `list_video_activities`, `get_video_activity`, `create_video_activity`, `update_video_activity`. The YouTube video pauses at each question's `timestamp_seconds`.

## Timestamps are the risk

- **Only use times you know.** You know them if you have the transcript with times, or if the teacher gave them. If you can't watch the video or get its transcript, ask for 3–6 key moments and their times ("2:15 photosynthesis defined") instead of guessing.
- **Pause just after the idea finishes,** about 2–5 seconds after, not in the middle of a sentence.
- **Space the pauses.** Aim for one question every 1–3 minutes. Don't put a question in the first 20 seconds.
- **Times convert to seconds:** 2:15 is `135`. Questions are sorted by time; duplicate times are pushed 1 second apart.

## Types

| Type | Fields |
|---|---|
| `multiple_choice` | `correct_answer`, 1–4 `incorrect_answers` |
| `choose_all` | `correct_answers` and `incorrect_answers` |
| `fill_in_blank` | `correct_answer`, `accepted_alternates` |

- `time_limit_seconds` defaults to 30 for a new question; 0 means no limit.
- The item-writing rules in `quizzes.md` apply. Keep stems short, since students just watched rather than read.

## Good questions for video

- Mostly check understanding of what was just shown, and ask one prediction question ("What do you think happens next?") early to build curiosity.
- End with one DOK 2–3 question that connects the parts of the video.

## Editing

`get_video_activity`, then `update_video_activity` with every question, each with its `id`. Existing assignments keep their questions.

## Hand-back checks to name

- every timestamp you estimated
- any question that depends on a visual the student might miss

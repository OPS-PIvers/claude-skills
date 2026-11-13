# Activity Walls

Tools: `list_activity_walls`, `get_activity_wall`, `create_activity_wall`, `update_activity_wall`. A wall is a prompt that students answer by posting cards. You can't see student posts. The teacher opens the wall for a class from the Activity Wall widget. Walls have no folders; `list_activity_walls` takes only `search`.

## Pick the layout from the task

| Layout | Use it for | Needs |
|---|---|---|
| `wall` (default) | open brainstorm | none |
| `columns` | sorting: before/during/after, agree/disagree, KWL | `columns` |
| `table` | comparing items across features | `table_rows` and `table_columns` |
| `timeline` | sequencing events | none |
| `map` | place-based answers | none |
| `wordcloud` | one-word check-ins, like "One word for how you feel about fractions" | none |

- Up to 20 columns, rows or table columns, each label up to 100 characters. A `columns` wall with no columns, or a `table` wall missing rows or columns, is refused.
- `prompt` up to 2,000 characters.

## Good prompts

- **Open-ended and answerable in a post:** "What's one question you still have about the water cycle?" not "Did you understand?"
- **One task per prompt.** If it needs steps, number them.

## Settings

New walls start anonymous, unmoderated, text only, with no likes, comments or post limit.

- `moderation: true` (teacher approves posts first) for younger grades or sensitive topics.
- `show_names: true` only when accountability matters more than honesty.
- `post_types`: any of `photo`, `link`, `file`, `video`, besides text. Use only when they're part of the task.
- `allow_likes`, `allow_comments`: off unless the teacher wants peer feedback.
- `max_posts_per_student`: 0–50; 0 means no limit. Use 1 for a one-answer check-in.

## Editing

`update_activity_wall` changes only the fields you pass, and list fields replace the whole list. A column, row or table column keeps its posts only if its label stays exactly the same; renaming one moves its posts to the default spot, so warn first if the wall is live. Students on an open wall see changes right away.

## Not available here

Timeline periods and groups, the map's starting view, background and card colors, guest access, letting students edit or delete their own posts, replies to comments, and which classes the wall is for. The teacher sets these in the wall editor; connector edits keep them.

## Hand-back checks to name

- the layout and settings you chose, if the teacher didn't name them
- any column or table labels you wrote

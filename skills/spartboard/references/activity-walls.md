# Activity Walls

Tools: `list_activity_walls`, `get_activity_wall`, `create_activity_wall`, `update_activity_wall`. A wall is a prompt that students answer by posting cards. You can't see student posts. The teacher opens the wall for a class from the Activity Wall widget.

## Pick the layout from the task

| Layout | Use it for | Needs |
|---|---|---|
| `wall` | open brainstorm | none |
| `columns` | sorting: before/during/after, agree/disagree, KWL | `columns` |
| `table` | comparing items across features | `table_rows` and `table_columns` |
| `timeline` | sequencing events | none |
| `map` | place-based answers | none |
| `wordcloud` | one-word check-ins, like "One word for how you feel about fractions" | none |

## Good prompts

- **Open-ended and answerable in a post:** "What's one question you still have about the water cycle?" not "Did you understand?"
- **One task per prompt.** If it needs steps, number them.
- **Settings:**
  - `moderation: true` for younger grades or sensitive topics.
  - `show_names: false` when honesty matters more than accountability.
  - Use `post_types` only when photos or links are part of the task.

## Editing

`update_activity_wall` changes only the fields you pass, and list fields replace the whole list. Renaming a column moves its posts to the default spot, so warn first if the wall is live. Students on an open wall see changes right away.

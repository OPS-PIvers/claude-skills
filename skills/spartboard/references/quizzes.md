# Quizzes and question banks

Tools: `list_quizzes`, `get_quiz`, `create_quiz`, `update_quiz`, and the same four for `question_bank`. A **quiz** is what gets assigned. A **question bank** is a pool that a quiz can pull from. Make a bank only when the teacher asks for one.

## Question types (field names)

| Type | Use it for | Fields |
|---|---|---|
| `multiple_choice` | one best answer | `correct_answer`, 2–4 `incorrect_answers` (3 is best) |
| `choose_all` | several correct answers | `correct_answers`, `incorrect_answers`, `partial_credit` |
| `fill_in_blank` | recalling one exact term | `correct_answer`, `accepted_alternates` (spellings, plurals, synonyms) |
| `matching` | term to definition, cause to effect | 2–12 `pairs` of `{term, match}`, optional `extra_matches` |
| `ordering` | sequences, steps, timelines | 2–12 `items_in_order` |
| `free_response` | explanation or argument | `placeholder`, `min_words`, `max_words`, with no key |

Other fields: `points` defaults to 1, and `time_limit_seconds` of 0 means no limit. Choices can't contain `|`, and matching terms can't contain `:`.

## Writing good items (research-based item-writing rules)

- **The stem asks the whole question.** A student should be able to answer it before reading the choices. Put words that repeat in every choice into the stem.
- **One clearly best answer.** An expert would pick the same answer without arguing.
- **Distractors are real misconceptions.** Base each wrong choice on a mistake students actually make, like a reversed cause or a partly right idea. Never use joke or throwaway choices.
- **Keep choices parallel.** Similar length, grammar and detail. The correct one must not be the longest or the most specific.
- **No "all of the above", "none of the above" or "A and B".** Use `choose_all` instead.
- **Avoid negatives.** If you must use NOT or EXCEPT, capitalize it.
- **No clues** from grammar ("an ___"), from words repeated between the stem and the key, or from absolute words like always or never.
- **Fill in the blank:** blank only the key term, near the end of the sentence, with one defensible answer. Add every reasonable spelling to `accepted_alternates`.
- **Free response:** say what a full answer includes, e.g. "Use two details from the text." Offer to make a rubric (`references/rubrics.md`).
- **Order:** go from easier to harder. Group questions by topic when the quiz covers several.

## Editing

1. `get_quiz`
2. Change what was asked.
3. `update_quiz` with **every** question you're keeping, each with its `id`. A question without an `id` is a new question.
4. Remove `needs_answer_key` before sending questions back.

- If `get_quiz` shows `sections`, new questions land in the last section; say so.
- Existing assignments keep the version they were given.
- `questions_missing_answer_key` in the result should be 0, except for free response.

## Hand-back checks to name

- any answer you inferred rather than found in the source
- the closest distractor
- any fill in the blank where other wordings might be right

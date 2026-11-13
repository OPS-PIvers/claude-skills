# Quizzes and question banks

Tools: `list_quizzes`, `get_quiz`, `create_quiz`, `update_quiz`, and the same four for `question_bank`. A **quiz** is what gets assigned. A **question bank** is a pool that a quiz can pull from. Make a bank only when the teacher asks for one.

## Question types (field names)

| Type | Use it for | Fields |
|---|---|---|
| `multiple_choice` | one best answer | `correct_answer`, 1–4 `incorrect_answers` (3 is best) |
| `choose_all` | several correct answers | 1–6 `correct_answers`, up to 6 `incorrect_answers`, `partial_credit` |
| `fill_in_blank` | recalling one exact term | `correct_answer`, `accepted_alternates` (up to 10: spellings, plurals, synonyms); with two or more `___` in the text, `blanks` instead: one `{answer, accepted_alternates}` per blank, in order, and `partial_credit` |
| `matching` | term to definition, cause to effect | 2–12 `pairs` of `{term, match}`, optional `extra_matches` |
| `ordering` | sequences, steps, timelines | 2–12 `items_in_order` |
| `free_response` | explanation or argument | `placeholder`, `min_words`, `max_words`, `rubric_id`, with no key |

Every type also takes `standards` and `learning_targets`, which fill the question's Learning Targets field (`references/standards.md`). Other fields: `points` defaults to 1, and `time_limit_seconds` of 0 means no limit. `create_quiz` takes `language` (BCP 47, e.g. `es-MX`) for a quiz in another language; `update_quiz` can't change it. `folder_id` files it. Up to 200 questions. `choose_all`, matching and ordering items can't contain `|`, and matching terms can't contain `:`.

## Rubrics on free response

`rubric_id` (from `list_rubrics` or `create_rubric`) attaches a rubric to a `free_response` question, in a quiz or a bank. The question keeps a frozen copy, and its `points` become the rubric's total; any `points` you send is ignored. Send the same `rubric_id` back to keep the copy, `null` to remove it. To give a question a rubric's later edits, save once with `null`, then again with the id. Showing the rubric to students is set in SpartBoard. `rubric_id` on any other type is refused.

## Writing good items (research-based item-writing rules)

- **The stem asks the whole question.** A student should be able to answer it before reading the choices. Put words that repeat in every choice into the stem.
- **One clearly best answer.** An expert would pick the same answer without arguing.
- **Distractors are real misconceptions.** Base each wrong choice on a mistake students actually make, like a reversed cause or a partly right idea. Never use joke or throwaway choices.
- **Keep choices parallel.** Similar length, grammar and detail. The correct one must not be the longest or the most specific.
- **No "all of the above", "none of the above" or "A and B".** Use `choose_all` instead.
- **Avoid negatives.** If you must use NOT or EXCEPT, capitalize it.
- **No clues** from grammar ("an ___"), from words repeated between the stem and the key, or from absolute words like always or never.
- **Fill in the blank:** write each blank as `___` in the text. Blank only the key term, near the end of the sentence, with one defensible answer. Add every reasonable spelling to `accepted_alternates`.
- **Free response:** say what a full answer includes, e.g. "Use two details from the text." Offer to make a rubric (`references/rubrics.md`) and attach it with `rubric_id`.
- **Order:** go from easier to harder. Group questions by topic when the quiz covers several.

## Editing

1. `get_quiz`
2. Change what was asked.
3. `update_quiz` with **every** question you're keeping, each with its `id`. A question without an `id` is a new question.

- If `get_quiz` shows `sections`, new questions land in the last section; say so.
- Existing assignments keep the version they were given.
- `needs_answer_key: true` marks an imported question with no key. Fill the key; the mark clears itself. `questions_missing_answer_key` in the result should then be 0.
- **Keep what you can't see.** Pictures, passages, explanations, DOK levels and dropdown or drag blanks stay on a question you edit, as long as its type stays the same. Pictures and per-choice explanations belong to a choice's exact text, so reword a choice only when asked. A choice like `Picture 7KQ` is a picture answer: keep that label exactly. Keep `**bold**`, `*italic*`, `++underline++` and `⟦…⟧` equation marks already in the text. A dropdown or drag blank keeps its old choices, so if the teacher calls a blank a dropdown or word bank, change its answer in SpartBoard.
- **Read-only items:** `shared_with_plc: true` means PLC-shared or a District library copy. Saves are refused; the teacher edits in SpartBoard or makes their own copy there.

## Preview card

When a result includes `preview_shown`, the teacher sees the quiz as a card in the chat and can try it as a student. Don't repeat its questions. A message that starts "From the preview card:" is the teacher asking from the card:

- "change question N: …" is a specific edit: `get_quiz`, then `update_quiz`, no plan.
- "draft a scoring rubric for question N … and attach it": ask only what you need, then `create_rubric` and `update_quiz` with that `rubric_id`.

## Do in SpartBoard (not here)

Say so in one line instead of trying: pictures on questions or answers, reading passages and media, math equations and text formatting, explanations, DOK levels, dropdown or drag blanks (MCA practice), recorded responses, sections, pulling from a bank into a quiz, quiz settings, translations, and assigning.

## Hand-back checks to name

- any answer you inferred rather than found in the source
- the closest distractor
- any fill in the blank where other wordings might be right

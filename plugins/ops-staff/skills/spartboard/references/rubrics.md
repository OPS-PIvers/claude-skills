# Rubrics

Tools: `list_rubrics`, `get_rubric`, `create_rubric`, `update_rubric`. A rubric scores a free-response quiz or bank question. Attach it yourself: pass its `rubric_id` on the `free_response` question in `update_quiz` or `update_question_bank` (`references/quizzes.md`). The question's points become the rubric's total.

## Structure

- **3–5 criteria:** the few things that matter most, not everything. The limit is 12.
- **2–6 levels per criterion.** Four levels is common: Beginning, Developing, Proficient and Advanced, worth 1–4 points. Each level in a criterion needs different whole-number points (0–100).
- **Levels are stored lowest first.**

## Scoring guides

A criterion with `examples` (up to 10) becomes a scoring-guide row instead of a level row: its `description` is the scoring guidelines, its levels run from 0 to its points, and `examples` are sample responses that earn the points. Use it for short constructed responses graded like a state test ("2 points: names the cause and supports it with a detail"). Leaving out `examples` on an edit keeps the ones a row has.

## Writing good criteria (analytic rubric practice)

- **Observable.** Describe what's on the page: "Cites two relevant details from the text". Avoid "Understands the text."
- **Parallel levels.** The same quality changes from level to level. Change one thing at a time, such as the number of details, their relevance, or how well they're explained.
- **Describe what's there,** not only what's missing. The lowest level still says what the work does.
- **Student-friendly.** A student should be able to use it to self-assess.
- **Weight by points** when one criterion matters more.

## Editing

`get_rubric`, then `update_rubric` with every criterion and level, each with its `id`, so existing grades still line up.

Questions that already use the rubric keep their old copy. If the teacher wants them updated, re-attach it: `update_quiz` (or `update_question_bank`) with `rubric_id: null` on those questions, then again with the id.

## Preview card

When a result includes `preview_shown`, the teacher sees the rubric as a card in the chat. Don't repeat its criteria. A message that starts "From the preview card:" asks for a change to that rubric or one criterion: `get_rubric`, then `update_rubric`, no plan.

## Hand-back checks to name

- whether the point totals fit their grading scale
- the level wording most open to interpretation

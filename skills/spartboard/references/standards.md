# Standards and learning targets

Read this for every quiz, question bank, video activity or Guided Learning set, before you write the plan. Look the standards up yourself; don't ask the teacher whether you can.

## Where they go

Every quiz question, question bank question, video activity question and Guided Learning question step has a **Learning Targets** field in SpartBoard. Fill it with two fields on each question:

- `standards`: Minnesota benchmark codes, e.g. `["7.4.1.1"]`.
- `learning_targets`: the teacher's own or PLC targets, e.g. `["I can cite evidence from the text"]`.

If a tool's question schema has no `learning_targets` field, that connector is older: save the standards it accepts and name the targets in the hand-back.

Never put a standard or target in the question text. Flashcards, rubrics, Activity Walls and mini-apps have no Learning Targets field; name the code in the plan and hand-back instead.

## Finding the standard

1. **Use `search_standards` first.** It searches the exact list SpartBoard saves, so every code it returns will save. Give `subject` and `grade` plus 1–3 topic words (`"central idea"`, `"fractions"`), or look up one code with `query`. Keep `limit` small (about 10); a call costs a few hundred tokens. If it says more match, add a word rather than raising the limit.
2. **Use the Learning Commons connector** when you need more than the code and wording: what a benchmark breaks into (`find_learning_components_from_standard`) or how it builds across grades (`find_standards_progression_from_standard`). It's usually connected; check your tools rather than asking. A code from Learning Commons still has to be in SpartBoard's list, so confirm it with `search_standards` before saving.
3. **If neither tool is available,** use codes the teacher gives you. If they give none, say once that you can't look codes up and continue without standards.

- **Choose the 1–3 benchmarks** each question really assesses. Don't pick every benchmark that's loosely related.
- Subjects: `ela`, `social-studies`, `math`, `science`, `pe-health`, `art`, `music`, `world-language`. World Language uses Can-Do codes like `WL.3.2.1`.
- **A code in more than one set** comes back as a full id, e.g. `mn-math-2022:6.1.2.1`. Save it exactly as returned.
- **If a save rejects a code,** it isn't in SpartBoard's list. Tell the teacher and save without it.

## Learning targets

- Use the teacher's wording when they give targets. Match it exactly to reuse a target they already have; a short code like `LT1` works too.
- Wording that matches none of their targets is added to their **My targets** list, so keep it short and student-facing ("I can ...").
- PLC targets from the teacher's groups are matched the same way.

## On edits

- Leave out `standards` or `learning_targets` to keep what a question has.
- Sending `standards` replaces only the standards; sending `learning_targets` replaces only the teacher's and PLC targets. `[]` clears that list.
- `get_*` returns both lists, so send them back unchanged when you aren't changing them.

## Plan line

`Standards: 7.4.1.1 (cite textual evidence) on questions 1–4, 7.4.2.2 (central idea) on 5–8`

Add `Learning target: "I can find the central idea" on 5–8` when the teacher gave targets.

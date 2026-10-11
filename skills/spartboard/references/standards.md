# Minnesota standards

Only do this when the teacher said yes to the "Align to MN standards?" line in the plan, or asked for standards.

## Find the standard

- **Use the Learning Commons connector** if it's available. Search the Minnesota standards for the grade and subject, and get the benchmark code and its wording.
- **If Learning Commons isn't connected,** use a code the teacher gives you. If they don't give one, say you can't look codes up and continue without standards.
- **Choose the 1–3 benchmarks** the item really assesses. Don't pick every benchmark that's loosely related.

## Where the standard goes

| Content | What to do |
|---|---|
| Quiz or bank question, **MN ELA (2020)** or **MN Social Studies (2021)** | Put the benchmark code on each question in `standards`, e.g. `"standards": ["7.4.1.1"]`. SpartBoard saves it as a real standards tag the teacher can filter and report on. |
| Other subjects, or other content types | Name the code and its short wording in the plan and the hand-back. There's no field to save it in. |

- **Codes** look like `6.1.2.1` (ELA) or `6.1.1.1` (Social Studies).
- **If a code exists in both sets,** the tool asks for the full id; use `mn-ela-2020:6.1.2.1` or `mn-ss-2021:6.1.1.1`.
- **If a code is rejected,** it isn't in SpartBoard's list. Tell the teacher and save without it.
- **On edits:** leave out `standards` to keep a question's tags. Sending `standards` replaces the standards tags, but the teacher's own PLC or personal targets stay. `[]` clears the standards.

## Plan line once approved

`Standards: 7.4.1.1 (cite textual evidence) on questions 1–4, 7.4.2.2 (central idea) on 5–8`

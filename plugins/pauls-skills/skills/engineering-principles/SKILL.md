---
name: engineering-principles
description: Seven working principles for building and maintaining software with agents - prove it works against the real artifact, fix root causes not symptoms, test behavior not implementation, encode repeated lessons in structure, subtract before you add, type discipline, and validate at boundaries. Use when debugging, writing or reviewing tests, finishing a task and about to say it's done, refactoring, designing types or data models, adding validation or error handling, or when the same correction comes up twice.
---

# Engineering principles

Seven short principles. Read the section that matches what you're doing; you don't need all seven every time.

| Doing this | Read |
| --- | --- |
| About to say "done" | Prove it works |
| Debugging | Fix root causes |
| Writing, changing, or keeping a test | Test behavior, not implementation |
| Giving or receiving the same instruction twice | Encode lessons in structure |
| Adding a feature, refactoring, rewriting | Subtract before you add |
| Designing types, props, data models | Type discipline |
| Adding validation, error handling, parsing | Validate at boundaries |

## Prove it works

Verify every task by checking the real thing directly. Not a proxy, not a self-report, not "it compiles", not "the tests pass" when the tests don't exercise the change.

Unverified work has unknown correctness. Indirect checks (a file's timestamp, a subagent saying it finished, an old screenshot) feel cheaper than looking, but acting on a wrong inference costs far more.

- Check the process is alive directly, not through something derived from it.
- Read the actual value (the Firestore document, the rendered DOM, the HTTP response), not a cached or derived copy.
- When verification fails, suspect the way you observed before suspecting the system.
- The strongest proof is a script that re-runs the same check. Write it, run it, and keep its output where the user can see it.
- For UI, drive the running app. The repo's `verify-<app>` skill, if it has one, is the way in.

## Fix root causes

When debugging, trace every symptom to its root cause and fix it there.

Symptom fixes pile up. Each workaround makes the system harder to reason about, and the real bug stays.

- Reproduce first.
- Ask "why" until you reach the cause.
- Don't add a guard to silence a crash. A null check that makes the error go away is a symptom fix.
- If a workaround needs a paragraph-long comment to justify it, the code is wrong. Fix the code, not the comment.
- Fix the pattern, not just the instance: search for the same mistake elsewhere and fix every one.
- When stuck, instrument instead of guessing. Add logging, read the actual error.
- When something "breaks after a restart" or "only on my machine", suspect stale persisted state first: localStorage, caches, service workers, lock files, old documents written by a previous version.

## Test behavior, not implementation

A test calls the code the way its users do and asserts the exact result they see. Rewrite or delete any test that would still pass if every imported function returned `undefined` or a wrong value.

These shapes fail that check:

- Loose or no assertion: `toBeDefined`, `toBeTruthy`, `not.toThrow`, `toBeGreaterThan(0)`.
- Call or absence only: `toHaveBeenCalled`, `not.toHaveBeenCalled`, `toBeUndefined`, `toEqual([])`.
- Expected value computed by the code under test: `expect(f(a)).toBe(f(a))`.
- A restated constant, config default, or table row.
- Assertions on data the test itself built, with no call to the code under test.

Fix: call the subject with one concrete input and assert the literal output or effect. For a mock, assert the payload it received. For an absence, also assert the presence on another input. For a constant, test the code that reads it.

Keep relational checks across tables (a key exists in both) and `*.test-d.ts` type tests.

## Encode lessons in structure

When you catch yourself writing the same instruction a second time, or the user corrects the same mistake twice, encode the rule as a type, lint, hook, runtime check, or script instead of more text. Prose gets skipped; a failing build doesn't.

If the lesson needs judgment and can't be encoded, make the instruction more prominent and add an example of the failure.

If the fix is structural, use only the structural fix. The instruction was the symptom. The `/correct` skill runs this process across a whole repo.

## Subtract before you add

When changing a system, remove complexity first, then build.

- Remove dead code, unused props, stale feature flags, and redundant checks before adding the new thing.
- Get to the minimum working version before polishing.
- Design for observed usage, not imagined edge cases.
- No speculative validators, options, or abstractions beyond what's needed now.
- If a file, doc, or reference has nothing new in it, delete it rather than leaving a stub.
- Leave the design slightly simpler than you found it.

## Type discipline

Make the compiler reject impossible states, mixed-up values, and unhandled cases. TypeScript syntax for each rule is in the `typescript-best-practices` skill.

- **Make illegal states unrepresentable.** `{ completed: boolean; completedAt?: Date }` allows `completed: true` with no date. Model `{ kind: "open" } | { kind: "done"; at: Date }`. If you can write a comment explaining when a combination of fields is valid, split it into a union.
- **Build types from the values you want.** A non-empty list is a head plus a rest. A time range is a start plus a duration. Choose the shape that can't build the illegal value.
- **Brand meaningful primitives.** `UserId` and `WidgetId` are both strings but shouldn't be interchangeable.
- **External data is untyped until parsed.** API payloads, JSON, database documents, URL params, localStorage, env vars.
- **Don't lie to the compiler.** Every `any`, `as`, or `!` is a latent crash. Trace it back to the boundary and validate there.
- **Exhaustive matching is the compiler's job.** Adding a new variant should fail compilation everywhere it needs handling.
- **Derive types from the source of truth** (a schema, a registry object, a generated client) instead of hand-writing a parallel type that drifts.
- **Strengthen a type only where partiality appears.** A `!`, a cast, or a "should never happen" throw marks a type that's too weak. Fix that spot, then stop.

## Validate at boundaries

Put validation, type narrowing, and error handling at system boundaries. Trust internal code. Business logic lives in pure functions; the shell around it is thin.

Scattered validation is noisy, redundant, and gives a false sense of safety. Logic tangled into framework wiring can't be tested without the framework.

- **At boundaries** (user input, URL params, API responses, Firestore reads, Cloud Function inputs, config, env vars): validate, return errors, handle defensively.
- **Inside:** typed data, errors propagate, no re-validation.
- **Across the boundary:** expose domain types, not the raw document, payload, or framework object.
- Business logic in pure functions with no framework dependencies. Components, hooks, and handlers call them.

Two questions settle most cases. "Is this data crossing a boundary right now?" If not, the check is redundant. "Could this be a pure function the shell just calls?" If yes, extract it.

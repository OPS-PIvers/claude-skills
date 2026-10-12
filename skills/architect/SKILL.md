---
name: architect
description: Design before code. Grounds the problem in the existing system, has 2-3 parallel agents sketch structurally different designs (types, signatures, module boundaries, caller usage), picks and grafts the best, then implements against the sketch and scraps it if it fights back. Use for /architect, "architect this", "design this", "how should we structure X", or any non-trivial feature where jumping straight to code would lock in the wrong shape.
disable-model-invocation: true
---

# Architect

Sketch types, function signatures, component and module boundaries with `not implemented` bodies and pseudocode. Compare structurally different designs, pick one, then fill in code against it.

## Start

Create a task list with one entry per phase: Ground, Sketch, Agree, Implement, Scrap-check.

## Phase A: Ground the problem

Build a real mental model of every system the new code touches. Run the `how` skill over the relevant subsystems. Naming a file isn't grounding; produce the explanation `how` prescribes. If the design changes who owns what (state, data, a layer), also run `why` on the existing shape so its rationale becomes a constraint, not a guess.

Skip Phase A only for genuinely greenfield work with nothing to integrate with.

## Phase B: Sketch

Spawn 2 or 3 `Plan` agents in one message so they run in parallel. Give each:

- the task and the Phase A grounding (the `how` explanation, any `why` constraints);
- `references/runner-prompt.md` verbatim;
- a different starting direction, so the candidates differ in whole shape rather than detail. For example: "state lives in one store that widgets subscribe to" versus "each widget owns its state and syncs through Firestore" versus "derive everything from the URL". If you can't think of three real directions, two is fine. Different models (Opus and Sonnet) add diversity too.

Each returns a candidate package: usage sketch, type sketch, module map, and rationale per `references/rationale-template.md`.

**Design it twice.** Require at least two structurally distinct candidates even when the first looks good. Whole-shape alternatives, not point fixes inside one shape.

**Screen every candidate** against `references/design-red-flags.md`. Assume the next contributor is an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that compiles. Prefer the design where a change that looks right from one file is right for the whole repo.

**Compare on interface depth.** Prefer the design that hides more complexity behind a smaller, simpler public surface.

**Synthesize.** Pick one candidate as the base. Graft in the specific strengths of the others where they fit without breaking the base's shape. Record the decision (base, what was grafted from where, what was rejected and why) in the rationale's "Synthesis decision" section.

Write the synthesized sketch to real files: types and signatures in the places they'll live, bodies throwing `new Error("not implemented")`, `// TODO:` pseudocode for tricky logic. It should typecheck.

## Phase C: Agree (opt-in)

Default: go straight to implementation.

Pause for sign-off only when the user asked ("architect this with a checkpoint", "show me before implementing"). Then present the usage sketch, the shape, and the alternatives considered, and wait.

The sketch can ship as its own commit either way. For adversarial pressure on the design before implementing, run `/code-review` on the sketch commit or spawn a reviewer agent told to break it.

If the user pushes back on the shape, treat that as new Phase A evidence. Re-ground and re-run Phase B before writing more code.

## Phase D: Implement against the sketch

Replace `not implemented` bodies with code and pseudocode with logic. The sketch is the contract. Deviations from it are signals to surface, not friction to absorb silently. If a function needs a parameter the sketch didn't anticipate, ask whether the sketch was wrong, a requirement was missed, or the implementation is overreaching.

Prove the result works before calling it done (the repo's `verify-<app>` skill if it has one).

## Phase E: Scrap when the architecture is wrong

If implementation keeps producing friction the sketch can't absorb, throw the sketch out. Don't bolt fixes onto a wrong design.

The signal is a pattern, not a single instance:

- The same shape of workaround appearing in unrelated places.
- Several unrelated edge cases that each need a special-case branch.
- Types that need escape hatches (`any`, `as`, optional fields that are always set in practice) to compile.
- The "we need a lock" reflex when the sketch said state wasn't shared.
- Callers needing to know the abstraction's internal rules to use it.
- Two or more Phase D deviations of the same shape.

Use judgment. A few edge cases don't condemn an architecture. Complexity in the data is not complexity in the design.

When you scrap:

1. Run `how` over what's been built.
2. Redesign as if the new constraints had been there from day one.
3. Subtract before adding: the new sketch should be smaller than the old one before it grows.
4. Return to Phase B.

## Outputs

The caller's usage first, with the type sketch derived from it. One file of new types and signatures for small changes; a module map plus type definitions for larger work. The rationale ships alongside, shaped per `references/rationale-template.md`. Save it in the repo's planning-docs location if it has one, otherwise present it in chat.

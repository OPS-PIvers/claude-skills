---
name: mass-plan-implementation
description: Use when the user wants to mass-implement a large plan or backlog (many independent features/tasks from a roadmap doc) as parallel PRs — grilling the plan with the user first, taking the maximum-ready slice, implementing via worktree-isolated agents, and gating every task through internal adversarial review instead of external PR reviews.
---

# Mass Plan Implementation

Implement a large set of independent work items (a roadmap, a plan, a backlog) as parallel PRs using multi-agent workflows, then drive every PR through **internal adversarial review** to merged. Based on a run that shipped 54 features / ~60 merged PRs in one day. Requires explicit user opt-in to multi-agent orchestration (the Workflow tool's own rule).

**Review model: there is ZERO reliance on external PR reviews** (bots or humans). Subagents do the whole job; the orchestrator acts as advisor and quality gate:

```
Orchestrator/Advisor ─→ implementer subagents (tasks, worktree-isolated)
task complete: subagent ─→ orchestrator ─→ adversarial reviewers ─→ orchestrator ─→ fix subagent ─→ orchestrator ─→ merge
blocked/unclear: subagent returns status "blocked" + question ─→ orchestrator (advisor) answers or escalates to the user ─→ re-dispatch
```

CI remains as a mechanical gate (lint/tests/build), not as a review.

## Model tiering — REQUIRED

Preserve the orchestrator's context and spend expensive tokens only where the task demands it:

| Role | Model | Notes |
|---|---|---|
| Implementer (typical item) | `sonnet` | Default for well-briefed, self-contained items |
| Implementer (suite-scale / high-risk item) | `opus` (or session model) | Assign per-item in the item list, not globally |
| Adversarial reviewers | `sonnet`, effort `high` | 2 lenses per PR minimum; the skeptic stance does the work, not model size |
| Fix agents / conflict-resolution agents | `sonnet` | Mechanical-plus-judgment |
| Recovery agents (commit/push a dead agent's worktree) | `haiku` | Tiny mechanical task |
| Orchestrator (you) | session model | You see only structured results and review verdicts; you never read feature code yourself except to adjudicate a disputed finding |

## Lifecycle

### 1. Choose the plan
Identify which plan/backlog document is being implemented (ask if ambiguous). Verify each item is **self-contained**: description + implementation notes + key files, implementable without conversation context. If items aren't at that bar, fix the doc first (e.g. via `feature-roadmap-discovery`).

### 2. Grill the plan with the user
Run a `/grill-me`-style interrogation session BEFORE any agent is dispatched (invoke the grill-me skill if available; otherwise conduct it directly). Walk the item list and extract, per item: priority twists, scope boundaries, "check if already shipped first" flags, product decisions an agent would otherwise guess at, and explicit go/no-go. The output is the per-item `notes` field in the implement batch — every answer here is one less mid-run blocker.

### 3. Select the MAXIMUM slice — anti-underestimation rule
Agents chronically underestimate what they can handle, self-selecting ~25% of a plan as "manageable." Do not let that happen:

- **Default is ALL of it.** Every item that survived the grill with no open questions goes in the slice.
- An item may be excluded ONLY for a **named, concrete blocker**: an unresolved product question the user deferred, a hard dependency on an unmerged sibling item, or a human-gated prerequisite (secret, flag, legal). "Large," "complex," "risky," or "a lot at once" are NOT exclusions — they are per-item model/notes assignments (`opus`, "ship as ONE coherent PR", scale warnings).
- Present the slice to the user as: **included (N items)** + **excluded (each with its named blocker)**. If the excluded list is more than a handful, you are underestimating — re-justify each one.

### 4. Batch only if necessary
Batching is a mechanical constraint, not a scoping decision — the slice never shrinks because of it. One workflow per domain/area keeps prompts focused; within a workflow, chunks of ~3 concurrent implementers (more saturates the machine and hangs test runs). Sequence batches only where real dependencies exist (item B builds on item A's schema).

### 5. Implement — [implement-batch.js](implement-batch.js)
One agent per item, `isolation: 'worktree'`. Each agent: read conventions doc → read its item's brief → branch → implement per repo conventions → verify (lint + tests) → commit → push → open PR (never merge) → return structured result.

**Escalation:** if an implementer hits a bump, barrier, or ambiguity it cannot resolve from the brief + code, it must NOT guess or silently shrink scope — it returns `status: "blocked"` with the precise question in `concerns`. The orchestrator (advisor) answers from context, or asks the user, then re-dispatches that item with the answer appended to its notes.

Prompt requirements that proved essential:
- **"CRITICAL FINAL STEP: call StructuredOutput"** — ~1 in 10 agents otherwise finishes the work but dies unreported; the work survives uncommitted in its worktree. Recover with a small agent that commits/pushes/PRs from that worktree; don't re-implement.
- **Protected files**: implementers must NOT touch high-blast-radius shared files the orchestrator owns (security rules, DB indexes, CI/deploy config). They describe the exact needed change in `concerns`; the orchestrator ships those as small dedicated PRs.
- **Shared-resource bans**: never `git stash` (shared stack across worktrees); never `/tmp` for commit/PR-body files (shared across agents — use own worktree/scratchpad); multiline text via `-F <file>` / `--body-file`, never inline.

### 6. Adversarial review — [adversarial-review.js](adversarial-review.js)
Every completed PR gets reviewed by internal skeptics before it can merge. Per PR: 2+ reviewer agents with **distinct lenses** (correctness/data-integrity and conventions/UX-integration at minimum; add a security lens for anything touching auth/rules/money), each prompted to actively try to REFUTE the implementation — find the failure scenario, not bless the diff. Findings come back structured (severity, file:line, failure scenario).

The orchestrator adjudicates: dedupe, discard nitpicks, then dispatch a **fix agent** per PR with only the confirmed findings ([review-fix-sweep.js](review-fix-sweep.js)). Fixed PRs re-enter review until a pass returns no blocking findings. Only then is the PR merge-eligible. UI-affecting PRs additionally get a visual verification pass (load the app, look at it) before merge — lint passing does not mean it looks right.

### 7. Merge train (orchestrator, background loop)
Poll merge-eligible PRs (adversarial pass clean + CI green), squash-merge, skip CONFLICTING. Serial squash-merging of N sibling PRs re-conflicts the rest repeatedly — expect a small set of hot files (type/schema hubs, context wiring, export barrels, settings lists) to conflict again and again.

### 8. Conflict sweep — [conflict-sweep.js](conflict-sweep.js)
For CONFLICTING PRs: one agent per PR merges origin/main into the branch and resolves **ADDITIVELY** — sibling feature PRs conflict as both-sides-added imports/fields/wiring; the answer is almost always the union of both sides. True duplicate implementation → prefer main's merged version, adapt the PR onto it.

### 9. Serial finisher
The last few stragglers re-conflict faster than parallel agents can push. Switch to ONE agent at a time owning a PR end-to-end: resolve → fix CI → re-review if the resolution was nontrivial → merge → next.

### 10. Close the loop
After everything lands: run one integration-review agent over the merged whole (sibling features can each be correct but interact badly — shared widgets, double-registered listeners, colliding settings rows); ship the accumulated protected-file follow-ups from `concerns`; update the plan doc to mark shipped items; report the final scoreboard (shipped / skipped-with-reason / still-blocked) to the user.

## Checkpoint cadence & active monitoring — REQUIRED

**Checkpoints.** Report to the user at every phase boundary — after the grill (the slice), after each implement batch/domain (scoreboard: PRs opened / blocked / failed), after each adversarial-review round (findings summary + what's being fixed), and after each merge-train pass (merged / conflicting counts). Never run more than one domain's implement batch plus its review round without surfacing a checkpoint. Blocked items are raised at the NEXT checkpoint at the latest — never batched up silently until the end.

**Active monitoring — do not trust completion pings.** "I'll get notified when the subagent finishes" fails in practice: agents hang, die without StructuredOutput, or a workflow stalls waiting on a wedged test run. The orchestrator must poll, not just wait:

- Completion notifications are the primary signal. Alongside them, schedule a **long fallback heartbeat** — roughly one expected-agent-duration, ~20–30 min for implement batches (implementers run 15–40 min), shorter only for phases whose agents are genuinely quick (conflict sweeps). Do NOT poll every few minutes; a quiet heartbeat that fires once per batch is the goal, not a busy-loop.
- At a heartbeat (or when a notification's numbers look off), verify liveness with evidence, not vibes: workflow/task status, recent branch pushes (`git fetch` + `git for-each-ref --sort=-committerdate`), open-PR count vs expected.
- An agent with no observable progress (no commits, no pushes, no status change) for ~2 heartbeats is presumed wedged: stop it, check its worktree for salvageable work, recover with a small commit/push agent or re-dispatch the item.
- A workflow that "completed" with fewer results than dispatched items is not done — read the run's `journal.jsonl`, identify the missing items, recover or re-dispatch them before reporting the phase complete.
- The merge train is a loop the orchestrator owns; verify each pass actually merged something or produced a named reason (CONFLICTING, CI pending, review not clean) for every skipped PR.

## Failure modes checklist

- Worktree creation failing instantly (`EEXIST`/permissions): worktrees dir picked up a bad attribute or stale entries — clear attributes, purge stale worktrees (Windows: `\\?\` long-path deletion), `git worktree prune`.
- Dead agent, no structured output → check its worktree for uncommitted work before assuming failure.
- `null` results from `parallel()` are dead/skipped agents — `.filter(Boolean)` and re-dispatch only those items.
- Fix/resolve agents run **lint + targeted tests only** (full suites hang under multi-agent load); CI is the authoritative mechanical gate.
- Don't diagnose an "empty" workflow result from memory — read the run's `journal.jsonl` in the session transcript dir.
- Reviewer deadlock (reviewers keep finding new issues on a PR): after 2 fix cycles, the orchestrator adjudicates directly — read the disputed code, decide, and either merge or send one final targeted fix.

---
name: aim-higher
description: Take a task, push it to be more ambitious across altitude, depth, range and verification, grill the user until the plan is settled, then do the work and prove it worked with real measurements.
argument-hint: "[task to make more ambitious]"
disable-model-invocation: true
---

The task: $ARGUMENTS

If no task was given, use the task the user most recently described in this conversation. If there is none, ask for it and stop.

This runs in three phases: **aim** (propose a more ambitious version), **grill** (settle every decision with the user), **execute** (do it and verify it). Do not build anything until the grill phase ends with the user's go-ahead.

## Phase 1: Aim

Read whatever context is available first (the codebase, docs, prior conversation, connected tools) so every section is specific to this task, not generic. Look up facts yourself; dispatch sub-agents for anything broad. Then present all four sections in one message.

### ALTITUDE

- Say what outcome the user is really after, beyond what they literally asked for.
- Propose a version of the task aimed at that outcome.
- List the access or setup you'd need to pursue it on your own and verify the results without the user: logs, analytics, test devices, scripts, accounts, data exports. Say which of these you already have in this session (check, don't guess) and which the user would need to provide.

### DEPTH

Describe what a top practitioner in this area would do that the user hasn't asked for:

- The raw material they'd start from.
- The specific tools and methods they'd use (profilers, test harnesses, telemetry, statistical analysis, and so on).
- A target that sounds unreasonably high but is achievable.

### RANGE

- Restate the task as verbs instead of nouns: what it must actually *do* for the user, player, student, or whoever it serves.
- Name 3-5 fields outside software that would see this differently. For each, give one concrete technique you will actually apply, not a persona to imitate.
- Include one adversarial perspective that tries to break or disprove the work, and say what it would attack first.

### VERIFICATION

Define how we'll know it worked using something other than your own judgment: tests, benchmarks, measurements, or real user data you can run and check. Give a pass/fail threshold for each.

## Phase 2: Grill

Phase 1 is a proposal, not a plan. Invoke the `grilling` skill with the Skill tool on the Phase 1 proposal and follow it until every decision is settled. If `grilling` isn't available, run the same kind of interview directly: a design tree worked in rounds with AskUserQuestion, a recommended answer on every question, and facts looked up rather than asked. The root decisions usually include:

- Which version to pursue: the literal ask, the ambitious version, or something between.
- Which access and setup the user will grant, and what to do instead where they won't.
- The target, and whether it's the right one.
- Which outside-field techniques and practitioner methods are in scope.
- The verification checks and their thresholds.

The grill phase ends when the frontier is empty. Then give a short summary of the agreed plan: the outcome, scope, target, techniques, adversarial check, and verification thresholds. Wait for the user's go-ahead before you start.

## Phase 3: Execute

Do the work as agreed.

- Apply the outside-field techniques and practitioner methods you committed to. Don't drop them quietly. If one turns out not to fit, say so and why.
- Before calling it done, run the adversarial pass for real: try to break or disprove the work, and fix what breaks.
- Run every verification check and report the measured result against its threshold. Show the numbers, not your opinion of them. A check you couldn't run is reported as not run, with the reason.
- If a new decision comes up that the plan didn't cover and that changes the outcome, stop and ask, with your recommendation.

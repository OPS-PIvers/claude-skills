---
name: aim-higher
description: Take a task, research how top practitioners in its field work, push it to go deeper across altitude, depth, range and verification, grill the user until the plan is settled, then do the work and prove it worked with real measurements.
argument-hint: "[task to make more ambitious]"
disable-model-invocation: true
---

The task: $ARGUMENTS

If no task was given, use the task the user most recently described in this conversation. If there is none, ask for it and stop.

This runs in three phases: **aim** (propose a more ambitious version), **grill** (settle every decision with the user), **execute** (do it and verify it). Do not build anything until the grill phase ends with the user's go-ahead.

## Phase 1: Aim

Aim deeper, not bigger. A version that does the same job with more rigor, better raw material and harder evidence beats one that just adds scope. Raise the scope only where the real outcome needs it.

Read whatever context is available first (the codebase, docs, prior conversation, connected tools) so every section is specific to this task, not generic. Look up facts yourself; dispatch sub-agents for anything broad.

### Research the field first

Before writing any section, find out how top practitioners in this field actually work, instead of relying on what you already believe about them. That belief is usually generic, and generic is what this skill exists to beat. Dispatch a research sub-agent to read a handful of the strongest primary sources (no more than about eight): practitioners' own writing and talks, the field's standards and reference texts, postmortems and case studies, and papers where the field has them. Skip listicles and summaries of summaries. Ask it to report back how those practitioners think about this kind of task, what they start from, what methods and tools they use, and how they judge whether the result is right, with a link for each claim.

Skip this only when the field is the task's own material, such as conventions inside this codebase, where reading the code is the research. Say that you skipped it and why.

Then present all four sections in one message, drawing on the research throughout.

### ALTITUDE

- Say what outcome the user is really after, beyond what they literally asked for.
- Propose a version of the task aimed at that outcome.
- List the access or setup you'd need to pursue it on your own and verify the results without the user: logs, analytics, test devices, scripts, accounts, data exports. Say which of these you already have in this session (check, don't guess) and which the user would need to provide.

### DEPTH

Describe what a top practitioner in this area would do that the user hasn't asked for, grounded in the research and citing the sources it rests on:

- The rawest material they'd start from, in place of what has already been digested for the user: logs over dashboards, recordings over notes, source data over reports, the code over its docs.
- The specific tools and methods they'd use (profilers, test harnesses, telemetry, statistical analysis, and so on).
- A target that sounds unreasonably high but is achievable.

### RANGE

- Restate the task as verbs instead of nouns: what it must actually *do* for the user, player, student, or whoever it serves.
- Name 3-5 fields outside software that would see this differently. For each, give one concrete technique you will actually apply, not a persona to imitate.
- Include one adversarial perspective that tries to break or disprove the work, and say what it would attack first.

### VERIFICATION

Define how we'll know it worked using something other than your judgment or the user's: tests, benchmarks, measurements, or real user data you can run and check. Give a pass/fail threshold for each.

## Phase 2: Grill

Phase 1 is a proposal, not a plan. Invoke the `grilling` skill with the Skill tool on the Phase 1 proposal and follow it until every decision is settled. If `grilling` isn't available, run the same kind of interview directly: a design tree worked in rounds with AskUserQuestion, a recommended answer on every question, and facts looked up rather than asked. The root decisions usually include:

- Which version to pursue: the literal ask, the ambitious version, or something between.
- Which access and setup the user will grant, and what to do instead where they won't.
- The target, and whether it's the right one.
- Which outside-field techniques and practitioner methods are in scope, and whether the research missed a source the user trusts.
- The verification checks and their thresholds.

The grill phase ends when the frontier is empty. Then give a short summary of the agreed plan: the outcome, scope, target, techniques, adversarial check, and verification thresholds. Wait for the user's go-ahead before you start.

## Phase 3: Execute

Do the work as agreed.

- Apply the outside-field techniques and practitioner methods you committed to. Don't drop them quietly. If one turns out not to fit, say so and why.
- Before calling it done, run the adversarial pass for real: try to break or disprove the work, and fix what breaks.
- Run every verification check and report the measured result against its threshold. Show the numbers, not your opinion of them. A check you couldn't run is reported as not run, with the reason.
- If a new decision comes up that the plan didn't cover and that changes the outcome, stop and ask, with your recommendation.

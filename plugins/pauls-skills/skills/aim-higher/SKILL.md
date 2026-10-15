---
name: aim-higher
description: Before building, push a task to be more ambitious across altitude, depth, range and verification, then rewrite it as a prompt and wait for a go-ahead.
argument-hint: "[task to make more ambitious]"
disable-model-invocation: true
---

The task: $ARGUMENTS

If no task was given, use the task the user most recently described in this conversation. If there is none, ask for it and stop.

Do not start building. First help the user be more ambitious about this task. Read whatever context is available (the codebase, docs, prior conversation) so every section is specific to this task, not generic.

## ALTITUDE

- Say what outcome the user is really after, beyond what they literally asked for.
- Propose a version of the task aimed at that outcome.
- List the access or setup you'd need to pursue it on your own and verify the results without the user: logs, analytics, test devices, scripts, accounts, data exports. Say which of these you already have in this session and which you'd need the user to provide.

## DEPTH

Describe what a top practitioner in this area would do that the user hasn't asked for:

- The raw material they'd start from.
- The specific tools and methods they'd use (profilers, test harnesses, telemetry, statistical analysis, and so on).
- A target that sounds unreasonably high but is achievable.

## RANGE

- Restate the task as verbs instead of nouns: what it must actually *do* for the user, player, student, or whoever it serves.
- Name 3-5 fields outside software that would see this differently. For each, give one concrete technique you will actually apply, not a persona to imitate.
- Include one adversarial perspective that tries to break or disprove the work, and say what it would attack first.

## VERIFICATION

Define how we'll know it worked using something other than your own judgment: tests, benchmarks, measurements, or real user data you can run and check. Give a pass/fail threshold for each.

## The rewritten prompt

End by rewriting the user's task as a single self-contained prompt that asks for exactly the above: the ambitious outcome, the practitioner methods and target, the verb-form requirements, the outside-field techniques, the adversarial check, and the verification criteria. Put it in a fenced code block so it can be copied.

Then stop and wait for the user's go-ahead. Do not execute any part of the task, write code, or change files until they say go. If they edit the prompt, use their version.

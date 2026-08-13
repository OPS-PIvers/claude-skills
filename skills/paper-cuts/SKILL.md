---
name: paper-cuts
description: "Fix a batch of small UI/UX \"paper cut\" issues from user-annotated screenshots (red markings with numbers), using subagents to preserve the orchestrator's context window, then commit and push directly to the user-specified branch with no PR. Optimized for minimal diffs and low cost — subagents run only scoped lint and scoped tests; the orchestrator owns full verification and drives remote CI to green. Requires Claude Code (subagents, git, AskUserQuestion, gh)."
disable-model-invocation: true
---

# Paper Cuts

Batch-fix small annotated issues and push directly to the user-specified target branch, skipping the PR flow.

You are the **orchestrator** — the main session agent. You delegate implementation to subagents to preserve your own context window, then personally verify, commit, push, and drive remote CI to green.

Two constraints govern every decision in this workflow:

1. **Smallest targeted fix.** Each change is the minimum edit that resolves the annotated problem. Nothing else.
2. **Cost and time optimized.** Pay for repo orientation once, not once per subagent. Never run a project-wide check inside a subagent.

## Roles

| Actor | Owns | Model |
|---|---|---|
| **Orchestrator** (main session agent) | Intake, branch confirmation, test-command detection, batching, dispatch, diff review, full local gates, commit, push, CI-to-green | session model |
| **Recon subagent**, one only) | Mapping cut numbers → file paths and line ranges. Nothing else. | Sonnet, low effort |
| **Implementation subagents** | One scoped fix batch each. Scoped lint + scoped tests. Report back. | Sonnet (medium or high) or Opus (medium or high) |

Escalations from a subagent go to the **orchestrator**, not the user. The orchestrator decides whether to fix it, re-dispatch, or surface it to the user.

## Inputs

- One or more screenshots with **red annotations** marking each paper cut's location, each labeled with a **number**.
- Optional accompanying notes from the user keyed to those numbers.

---

## Workflow

### 1. Intake

1. Examine every screenshot carefully. Build a numbered list: `#N — location/component — what appears to be wrong — proposed fix`.
2. **Confirm the target branch.** If the user has not explicitly specified which branch to push to, stop and ask with **AskUserQuestion** before doing anything else. Never assume `main` or the current branch.
3. Check out the target branch, then `git status` and `git pull` for a clean, up-to-date tree.
4. **Detect the test runner exactly once.** Read `package.json` (or equivalent) and build a literal scoped-test command template that every subagent will be handed verbatim:

   | Runner | Scoped command template |
   |---|---|
   | Vitest | `npx vitest related --run <files>` |
   | Jest | `npx jest --findRelatedTests <files>` |
   | Other / none | Fall back: colocated test file → same-directory tests → `NO_SCOPED_TESTS` |

   Also build the scoped lint command, e.g. `npx eslint <files>`.

   Subagents **never** sniff the toolchain. If you don't hand them a command, they don't run one.

### 2. Recon (one cheap agent, one pass)

If the annotations don't already make file locations obvious, dispatch **a single subagent on the fast model** whose only job is mapping cuts to locations.

Its brief: for each cut number, return the file path(s), the relevant symbol or line range, and nothing else. **No code. No diffs. No analysis. No fixes.**

It returns a compact table:

```
#1  src/components/Header.tsx        L44-52   .nav-links gap
#2  src/components/Header.tsx        L61      "Sign in" label
#3  src/features/modal/Modal.tsx     L120-134 close handler
```

You distribute these paths into implementation briefs. **You do not read the source files yourself** — that is the entire point of recon, and reading them defeats it.

### 3. Clarify before dispatching

For **any** cut you don't fully understand — ambiguous annotation, unclear desired behavior, multiple plausible interpretations — use **AskUserQuestion** before dispatching. Batch related questions together. Never guess on ambiguous items.

### 4. Batch the cuts

Batching is the largest cost lever in this workflow. Subagent overhead is near-fixed regardless of task size.

**Mandatory:** two cuts touching the same file or the same component **always** share one subagent. This is a correctness constraint, not just an optimization — splitting them forces serialization or produces conflicting edits.

**Then:**

- Roll remaining **trivial** cuts across unrelated files into a **single sweep agent** on the fast model. Cap around **5** so the brief stays legible. Trivial = pure copy, spacing, color, a11y attribute, CSS-only.
- Any cut involving **logic, state, or behavior** gets its own subagent on a stronger model, regardless of size.
- Run independent batches in parallel.

### 5. Write the brief

Every implementation brief is **text-only**. Attach a **cropped image region** only when the fix requires visual judgment no text description survives (alignment, relative spacing, exact shade). This is a minority of cuts.

Use this template:

```
PAPER CUT #N

FILE(S):        <exact paths from recon>
LOCATION:       <symbol / line range>
CURRENT:        <what it does now>
TARGET:         <what it must do>

TEST COMMAND:   <literal string from intake, or NO_SCOPED_TESTS>
LINT COMMAND:   <literal string from intake>

SCOPE RULES — these are hard limits:
  - Make the SMALLEST edit that resolves the problem. Nothing else.
  - PROHIBITED: new dependencies, new source files, renames,
    reformatting untouched lines, new abstractions, drive-by
    improvements, "while I was in here" changes.
  - Start at the paths above. If the fix is not there, STOP and
    report — do NOT go exploring the repo.
  - TRIPWIRE: if the fix will exceed ~20 changed source lines or
    touch 3+ files, STOP WITHOUT IMPLEMENTING and report back.
    Escalating is a success, not a failure.

TESTS:
  - Run ONLY the test command above. NEVER run the full suite.
  - Zero matching tests is a valid, expected outcome — report it
    and move on. Do not hunt for something to run.
  - Do NOT write new tests, EXCEPT: if this cut is a logic or
    behavior bug, you may add ONE colocated regression test file.
    Cosmetic cuts get no tests.

DO NOT RUN: tsc / typecheck, full build, full test suite, dev server.
  These are project-wide, slow, and will surface other agents'
  in-flight edits. The orchestrator owns them.

REPORT BACK:
  - Files changed + line counts
  - What was done
  - Scoped lint result
  - Scoped test result (or NO_SCOPED_TESTS)
  - Any concerns, discoveries, or tripwire escalation
```

### 6. Orchestrator gates (never delegate this)

1. Review each subagent's diff yourself (`git diff`). Verify each fix matches its annotation and nothing unrelated changed.
2. Reject and re-dispatch any diff that violates the scope rules.
3. Handle every tripwire escalation: fix it yourself if small, re-dispatch with a corrected brief, or surface it to the user if it's genuinely structural.
4. Resolve conflicts or overlapping edits between subagents.
5. Run the **fast local gates** — the first point in the workflow where project-wide checks are safe:
   - typecheck (`tsc --noEmit` or equivalent)
   - full lint
   - build

   These catch the large majority of breakage in seconds. **Do not run the full test suite locally** — that is remote CI's job.

### 7. Commit and push

1. Stage the changes.
2. Commit, summarizing the batch and listing each numbered fix in the body:
   ```
   Fix paper cuts #1–#6: header spacing, button label, modal close, ...
   ```
3. `git push` directly to the confirmed target branch — **no PR**. Explicitly authorized by this workflow once the user has confirmed the branch.

### 8. Drive CI to green

The job is not done at push. It is done when the remote run is green.

1. Watch the run: `gh run watch` (or `gh run list` → `gh run view --log-failed`).
2. **If red: fix forward. No attempt cap. Never auto-revert.**
   - Pull the failing job's log.
   - One-liner cause → fix it yourself.
   - Anything larger → dispatch a single scoped subagent with the log excerpt and the same scope rules.
   - Push and watch again. Repeat until green.
3. **After the third failed run**, report status to the user — failing job, error, what you've tried — then **keep going**. The report is for visibility, not permission. Do not stop, do not revert.
4. Once green, report back with a numbered summary mapping each paper cut to its fix and files touched.

---

## Rules

- **Smallest targeted fix, always.** Fix the root cause of each cut; never expand scope.
- **No project-wide checks inside subagents.** `tsc`, full builds, and full test suites belong to the orchestrator alone. Inside a parallel subagent they are slow *and* wrong — they observe other agents' half-finished edits.
- **Subagents never run the full test suite.** Scoped tests only, from the literal command handed to them.
- **Pay for orientation once.** Test-runner detection happens once at intake. Repo mapping happens once in recon. Never N times.
- **New source files are prohibited.** The sole carve-out: one colocated regression test file, and only for logic/behavior cuts. Test lines do **not** count toward the 20-line tripwire — only source lines do.
- **A tripwire escalation is a success.** A subagent that stops and reports has done its job correctly.
- **Never push if the local fast gates fail** — fix first, or ask the user.
- **If a "paper cut" turns out to be a larger structural issue**, the orchestrator surfaces it to the user and asks whether to fix inline or defer.

---
name: pr-sweep
description: Review every open PR into a target branch, fix what's wrong, merge them one at a time, then prove the merged result works together (CI on the new head, an integration review across the PRs, the dev deploy and its smoke test) and leave a written promote-ready verdict. Works on any repo; SpartBoard has a profile. Use for "sweep the PRs", "merge the overnight work", "land everything in dev", "clean up the open PRs", "get dev ready to promote", or after nightly routines or a parallel plan finish. Also the landing step inside goodnight.
---

# PR Sweep

Turn a pile of open PRs (nightly routines, a plan sliced into parallel sessions) into one merged target branch you can promote with confidence. Merging isn't the hard part. The hard part is proving the PRs work together: each one can be correct alone and still break a sibling. The sweep isn't done until the merged head passes the integration gate (section 6) and the sweep record says what was and wasn't checked.

Arguments (`$ARGUMENTS`) may name the repo, the target branch, PRs to include or skip, a cutoff time, or `--unattended`. They override this file.

**Modes.**
- **Attended** (default): Paul is here, but not watching every step. Ask once, up front (section 3), then run unattended.
- **Unattended** (`--unattended`, or when `goodnight` runs this): never ask. Make the call that ships the safest good result, log it as a judgment call (what you chose, why, how to undo it), and keep going.

Invoking this skill authorizes merging PRs that pass the gates into the target branch. It never authorizes merging into the production branch; that's `promote`'s job, or the repo's equivalent.

## Ground rules

- Never merge with red or missing CI, or with CI that ran against an older base (section 5). Never skip, disable or quarantine a test to get green, and never weaken a test's expectations unless the expectation itself is wrong.
- Never push straight to the target or production branch. Never force-push or rewrite history on them, or on a branch another session is still pushing to.
- Never create or set a secret, and never run anything against production data, dry runs included.
- Leave PRs by people other than Paul or Claude (including dependabot) open, and list them. Don't merge them.
- **Release hold.** If a release PR (target into production) is open, merge only PRs that fix that release's own contents. Leave everything else open and say why.
- Use the repo's own merge flow and conventions (`CLAUDE.md`, its docs, its skills such as `/ship`). They win over this file.

## 1. Repo profile

Before touching a PR, learn how this repo works, and write it at the top of the ledger:

- **Target branch:** from the arguments, otherwise the base most open PRs point at (`dev`, `develop`, `dev-<name>`), otherwise the default branch. Name the production branch too.
- **Merge flow:** squash, merge commit or rebase; required checks (rulesets, branch protection); the repo's merge skill if it has one.
- **Fast checks** for agents: lint, type check, targeted tests. **Full gate:** what CI runs.
- **Protected files:** high-blast-radius shared files (security rules, DB indexes and migrations, CI and deploy config, secrets wiring). Only one PR changes these at a time, and changes to them always get their own reviewer.
- **Gating convention:** how unreleased behavior stays hidden in production (feature flags, beta lists, config switches), if the repo has one.
- **Dev deploy:** does a push to the target branch deploy somewhere? Which workflow, which URL, and is there a smoke test or a way to drive the app (a `run` or `verify-*` skill)?

Read `CLAUDE.md`, the README, `docs/`, `.github/workflows/`, `.claude/skills/` and the package scripts. If `references/<repo-name>.md` exists next to this file, start from it and check it against the repo; the repo wins where they disagree. Anything you can't find goes in the profile as "none", and its check becomes a named gap in the sweep record. Don't invent one.

## 2. Inventory

Start `<scratchpad>/pr-sweep-ledger.md` now and update it at every step: profile, start time, the target head SHA at start (the **sweep base**), every work item with status (`ready`, `fixing`, `reviewing`, `waiting on session`, `merged`, `left open`), who's on it, last sign of progress, everything running in the background, judgment calls. After compaction or a check-in, read it first.

Gather:

- Open PRs into the target, drafts included, with CI state, mergeability, unresolved review threads and author.
- Work that should have a PR but doesn't: Paul's recent sessions (`list_sessions` with `mine: true`), and the last runs of scheduled tasks (`list_triggers`, then the `last_run` session). Look for a failed run, a branch pushed with no PR, or a session still working. Open PRs for pushed branches whose work looks finished.
- **Duplicates and superseded work:** two PRs solving the same thing (parallel slices that each built the same helper), or a nightly routine that reopened yesterday's fix. Keep the better one, close the other with a link and a one-line reason, and log it.
- The release-hold check: an open target into production PR.

Sort each item:

- **Ready:** complete, CI green, no conflict, no unresolved blocking comment. It still gets reviewed (section 4).
- **Fixable:** red CI, a conflict, or review comments to address.
- **In progress:** a session or routine is still working on it. Message it with the cutoff (default 1 hour attended, 3 hours unattended): "A PR sweep is merging into <target>. Finish, get CI green, push, and reply with your PR number by <time>. Don't merge; the sweep merges."
- **Leave open:** only for a named reason: a product decision only Paul can make, a draft its own description calls exploratory, an unresolved disagreement on the PR, an outside author, the release hold. "Big" or "risky" is not a reason; review handles risk.

## 3. Ask once (attended only)

Collect everything only Paul can decide: product calls, which of two duplicates to keep, a PR that changes behavior its description didn't mention, anything you'd otherwise leave open for a judgment reason. Ask in one batch, the most important first (`AskUserQuestion` takes up to 4; list the rest in the same message with your default for each). Then run unattended. Ask again only if something new comes up that really is his call, and keep merging everything it doesn't block while you wait.

Unattended: skip this. Each of these becomes a logged judgment call or a PR left open.

## 4. Get each PR to merge-ready

Work runs in background `Agent`s, `isolation: 'worktree'`, `model: sonnet`. Each brief carries the PR number, what's wrong, the profile's fast-check commands, and "CRITICAL FINAL STEP: report back"; about one agent in ten finishes the work and dies without reporting. Never put two agents on the same hot file at once.

- **Review every PR**, including ones already reviewed and green. Use two reviewer agents with different lenses (correctness and data integrity; conventions and integration with the rest of the app), `effort: high`. Add a security lens for anything touching auth, access rules, user data or money, and a protected-files lens when one changed. Each reviewer is told to find how the PR breaks, not to approve it. Findings come back with severity (blocking or minor), `file:line` and a concrete way it fails. Add the repo's own review bot findings and unresolved threads to the same list.
- **Gating:** if the repo has a gating convention, check each PR against it. The behavior change is gated at every entry point, defaults off, and does no new work when off. Catching it here means the promotion doesn't.
- **Tests:** a PR that changes behavior adds or updates a test that would fail without it. Missing coverage on a fix or a data path is a blocking finding.
- **UI:** a PR that changes what a user sees gets driven in the real app (the repo's `run`/`verify-*` skill, or the `run` skill) before it merges. If that's not possible, it's a named gap in the record.
- **Adjudicate** before fixing: reviewers are wrong sometimes. Check each finding against the code, drop nitpicks, and send one fix agent per PR with only the confirmed findings. The fix agent addresses them, gets CI green, and pushes. Re-review after the fix. After two fix rounds still finding blocking issues, read the disputed code yourself and decide.
- **Conflicts:** sibling PRs usually conflict because both added an import, a field or a list entry. Keep both sides. If two PRs really implement the same thing, keep the merged version and adapt the other onto it.

## 5. Merge train

Merge one at a time, in this order: protected-file and shared-infrastructure PRs first, then small fixes, then features; within a group, oldest first.

- **No stale green.** A PR's CI must have run against the target's current head. After every merge, the next PR is updated (rebase or merge the target in, the repo's way) and its CI runs again before it merges. A green check from before the last merge doesn't count.
- Merge with the repo's flow. Record each merge's resulting SHA in the ledger: it's what bisecting uses in section 6.
- After each merge, recheck the rest for new conflicts and send them back to section 4.
- When the last few PRs keep conflicting with each other, switch to one agent at a time: it owns a PR from resolution through merge, then takes the next.

At the cutoff, stop starting new work. Anything unmerged stays open, with where it stands.

## 6. Integration gate

Run this on the target's head once the train is done. It's what makes the branch promotable.

1. **Full CI on the head** is green: the push-triggered run for this exact SHA, or a dispatched one.
2. **Integration review.** One `Agent` (`model: sonnet`, `effort: high`) over `<sweep base>..<head>`, told to assume the merged PRs break each other and find where: two changes to the same component, settings list, listener, route, schema, query or access rule; double registration; changed shapes one PR writes and another reads; order-dependent migrations. Adjudicate and fix as in section 4, with fix PRs going through the same train.
3. **Dev deploy and smoke.** If the profile has a dev deploy, wait for its run on this head SHA to succeed, then run the smoke test against the dev URL and drive the main flows the merged PRs touched. No dev deploy means this check is a named gap, not a pass.
4. **Red head.** Find which merge caused it. Check the gate at the recorded merge SHAs, halving the range (`git bisect` locally for a test failure; the PR whose diff touches the failing area for a deploy failure). Fix forward with a small PR when the cause is clear. Otherwise revert that PR's merge with a revert PR through the train, reopen the original with the evidence, and run the gate again. Never leave the head red.

## 7. Sweep record and verdict

Write the record and post it as a new comment on the repo's open issue titled `PR sweep log` (create the issue the first time; reuse it after that). Put the same text in the final report. `promote` reads the latest one.

```
PR sweep YYYY-MM-DD HH:MM — <target> @ <head SHA>   (base <sweep base SHA>)
Verdict: promote-ready | not ready — <one-line reason>

Merged: #12 <title>, #15 <title>, …
Left open: #18 <reason>, …
Reverted: #14 <why, issue or PR link>
Checked: per-PR review (2+ lenses) · gating audit · CI on head · integration review · dev deploy · smoke test · UI driven for #12, #15
Gaps: <each check that couldn't run, and which PRs it leaves unproven>
Fixed during sweep: <one line per confirmed finding fixed, with PR>
Judgment calls: <each, with how to undo>
```

**Promote-ready** means every check ran and passed and there are no gaps, or the only gaps are ones Paul has explicitly accepted. Anything else is "not ready", with the reason first.

## 8. Clean up and report

- Delete branches whose PRs merged in this sweep. Never the target, production, or anything unmerged.
- Stop every agent and monitor you started, remove their worktrees once their work is pushed, and cancel any check-ins. The ledger's running list ends empty.
- Archive the sessions you created, and Paul's sessions whose PR merged that are idle with nothing unpushed. List every other session as it is.

Then one short message in this thread:

1. The verdict line and the sweep-log link.
2. Merged, left open (with reasons), reverted.
3. Questions for Paul, most important first.
4. **Repeat offenders:** the same kind of finding coming from the same routine or prompt more than once (in this sweep, or in earlier records in the log). Name the routine and the fix to its prompt, which belongs there and not in tomorrow's sweep.
5. Loose ends: sessions still running, anything in flight.

## Keep anything from hanging

A completion ping that never arrives looks just like work in progress, so check for evidence.

- Schedule a check-in every 20 minutes while anything runs in the background (`send_later` in a cloud session; `CronCreate` locally). Never end a turn with work in flight and no check-in scheduled.
- At each check-in, look for progress: new commits or pushes (`git fetch`, then `git for-each-ref --sort=-committerdate refs/remotes`), task status, a session's newest event, CI step progress.
- **Stalled** means no new evidence for two check-ins, or 15 minutes for something quick (a push, a merge, a rebase). Stop a stalled agent, save any work in its worktree, and relaunch it once with a narrower brief. Interrupt a stalled session and ask it to push what it has. Cancel and rerun a stuck CI run once, never with an empty commit.
- Every Bash wait has a timeout (`timeout 20m gh run watch <id> --exit-status`). Agents run lint and targeted tests only; full suites hang under load, so CI is the full gate.

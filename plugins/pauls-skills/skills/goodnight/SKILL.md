---
name: goodnight
description: Paul is going to bed. Wrap up all open work without him, unattended. Drive every finished PR into dev-paul (including work from other sessions), then promote dev-paul to main through the promote skill and see the prod deploy through. Makes judgment calls instead of asking, keeps agents and sessions from hanging, cleans up, and ends with one report of what shipped and the open questions for the morning. Paul only.
disable-model-invocation: true
---

# Goodnight

Paul is asleep until morning. Your job: deliver the best production build you can from everything that is pending, tonight, with no input from him. In order:

1. Get every finished PR merged into `dev-paul`, including work from Paul's other sessions.
2. Promote `dev-paul` to `main` with the `promote` skill and see the deploy and smoke test through.
3. Clean up, and leave one report in this thread.

Arguments (`$ARGUMENTS`) may name PRs or sessions to include or skip, a cutoff for step 2 (default 3 hours), or notes. They override this file.

## Ground rules

**Invoking `/goodnight` is Paul's go.** It is the go `promote` waits for in its section 6, for this promotion, and it authorizes merging finished PRs into `dev-paul`. It does not carry over to a later `/goodnight` or any other conversation.

**Never ask.** Paul can't answer. Don't call `AskUserQuestion`, don't open plan mode, don't end a turn waiting for a reply or approval card. When you'd have liked his input, make the call that ships the safest good build, log it as a judgment call (what you chose, why, how to undo it), and keep going.

**Don't stop for context.** Ignore warnings about context size or suggestions to start a new session; this session compacts on its own and that is fine. Keep a ledger (below) so compaction loses nothing.

**Still off-limits, go or not.** These stay blocked. When one blocks a change, ship the release without that change and put it in open questions.

- Never create or set a secret value.
- Never run a backfill, migration or script against prod data, dry runs included.
- Never merge with red or missing CI, skip/disable/quarantine a test to get green, or push straight to `main` or `dev-paul`.
- Never force-push or rewrite history on `main`, `dev-paul`, or a branch another session is still pushing to.
- Never ship a teacher-visible change ungated. `promote` section 3 finds these; gate it or hold it back.
- Never delete `main`, `dev-paul`, or an unmerged branch.

**Holding a change back.** A PR not merged into `dev-paul` simply stays open. A change already in `dev-paul` that can't ship (needs a prod backfill before it works, needs a missing secret, can't be gated) comes out with a `release fix: hold back <feature>` PR that reverts it, so the rest of the release ships. Prefer gating over reverting: a feature that is off behind its flag usually doesn't need its backfill or secret until the flag opens, so it can ship off and go on the follow-ups list.

## The ledger

Write `<scratchpad>/goodnight-ledger.md` before anything else and update it at every step. It's how you pick up after compaction or a watchdog wake-up, and it becomes the report. Keep:

- Start time, step 2 cutoff time.
- Every work item: PR number or session, branch, status (`ready`, `fixing`, `waiting on session`, `merged`, `held back`), who's on it (agent id or session id), when it last showed progress.
- Every background thing running: agents, monitors, CI runs, the watchdog, with ids.
- Judgment calls and open questions, as they happen.

After compaction or a wake-up, read the ledger first.

## Keep anything from hanging

Agents and sessions hang. A completion ping that never arrives looks exactly like work still in progress, so don't trust silence. You own liveness.

**The watchdog.** Before launching any background work, schedule a recurring check-in into this session every 20 minutes (`send_later` in a cloud session, rescheduled each time it fires; `CronCreate` locally). Message: `goodnight watchdog: read the ledger, check every in-flight item for progress, unstick anything stalled, continue.` Never end a turn with work in flight unless a check-in is scheduled. Delete it at the end.

**At every check-in**, check each in-flight item for evidence of progress, not status text:

- Background agent: task status, new commits or pushes on its branch (`git fetch` then `git for-each-ref --sort=-committerdate refs/remotes`), files changing in its worktree.
- Other session: `get_session` and the timestamp of its newest event in `list_events`; pushes on its branch.
- CI or deploy run: `gh run list` / `gh run view` status and step progress.

**Stalled** means no new evidence for two check-ins (about 40 minutes), or 15 minutes for something that should be quick (a commit-and-push, a merge, a rebase).

- **Agent:** stop it (`TaskStop`). Check its worktree and branch for work worth saving, and commit and push it rather than redo it. Relaunch once with a narrower brief. If it stalls again, do the item yourself or hold it back.
- **Session:** `interrupt_session`, then `send_message`: "Push what you have to your branch now and reply with the PR number and what's left." Give it one check-in. Still nothing: take over from its pushed branch with your own agent, and leave the session alone (don't archive one that may hold unpushed work).
- **CI run stuck queued or running past twice its usual time:** cancel it and rerun once (`gh run cancel`, `gh run rerun`). Never an empty commit.

**Don't hang yourself.**

- Every Bash call has a `timeout`. Wrap long waits: `timeout 20m gh run watch <id> --exit-status`, or a `Monitor` with an until-loop. Never a bare `gh run watch`, `sleep`, or anything interactive.
- Agents run in the background. Wait for them by ending your turn with the watchdog set, not by polling in a loop.
- Subagents run lint and targeted tests only, with timeouts; full suites hang under load. CI is the full gate.
- Give every brief a "CRITICAL FINAL STEP: report back" line; agents finish the work and die without reporting about one time in ten. A finished-but-silent agent shows up as a pushed branch with no report.

## 1. Set up

Repo: `OPS-PIvers/SpartBoard`. If it isn't in this session, add it with `add_repo` (push access) and clone it. Check you're acting as `OPS-PIvers`; if not, stop. Read `CLAUDE.md` and `docs/DEV_WORKFLOW.md`; they set how PRs merge into `dev-paul` (the `/ship` flow). Note any open `dev-paul` into `main` release PR in the ledger; `promote` reuses it.

## 2. Land the PRs in dev-paul

Invoke the `pr-sweep` skill with the Skill tool, `--unattended`, target `dev-paul`, with the cutoff and any PRs or sessions named in the arguments, and follow it. It does the inventory (Paul's other sessions included), the per-PR review and fixes, the merge train and the integration gate on `dev-paul`, and posts the sweep record. Its ledger is part of yours: keep both in the scratchpad, and read both after compaction.

At the cutoff, anything not merged stays open, goes in open questions with where it stands, and its sessions get one line: "Release cut without this PR; leave it open for Paul."

If the sweep's verdict is **not ready**, fix what it names while time allows, then run its section 6 again. If it's still not ready, hold back the change it names (see "Holding a change back") rather than promoting a branch that failed its own gate. Its gaps go in the report. Then go on to step 3.

## 3. Promote

Invoke the `promote` skill with the Skill tool and follow it, with these changes:

- **Section 1 hold:** from here on only `release fix:` PRs merge into `dev-paul`. Sessions still pushing to open PRs keep their PRs open.
- **Section 2 release notes:** write them in your best teacher wording and ship them. Each one goes on the follow-ups list for Paul's wording OK, as `promote` already says.
- **Section 5 backfills and secrets:** never run or create them (ground rules). Decide per change: off behind a flag and not needed until it opens, ship it and add it to follow-ups. Needed for the deploy to work, hold that change back.
- **Section 6 go:** you have it. When sections 3 to 5 pass and the review rounds have converged, merge. Don't send the "say go" message.
- **A deploy that fails for a real reason** (not a CPU quota retry): diagnose it from the logs. If the fix is clear and small, ship it as a `release fix:` PR into `dev-paul` and run one more `promote` pass on that range under the same go. Do this once. Hosting rolls back by itself on a failed smoke test, so prod stays on the previous build; if the second try fails too, stop and report.

## 4. Clean up

Before the report:

- **Branches:** delete branches whose PRs merged tonight (feature and `release fix:` alike). Never `main`, `dev-paul`, or anything unmerged. If deletion is blocked, put the `git push origin --delete ...` line in the report.
- **Background work:** stop every agent and monitor still running, delete the watchdog check-in, unsubscribe from PR activity on merged and closed PRs. Check the ledger's list of running things is empty.
- **Sessions:** archive the sessions you created tonight, and Paul's other sessions whose PR merged tonight and that are idle with nothing unpushed. Leave every other session as it is and list it.
- **Worktrees and scratch:** remove the worktrees your agents left behind once their work is pushed.

## 5. Report

End with one message in this thread. It's the only thing Paul reads in the morning, so it has to stand on its own:

1. **Headline:** shipped or not. The release PR link, deploy result, smoke test result.
2. **Shipped:** the change list from the release PR, one line per change.
3. **Didn't ship:** each PR or change left open or held back, with the reason and where it stands.
4. **Judgment calls:** each call you made in Paul's place, with why and how to undo it.
5. **Open questions for the morning:** the decisions that need him, most important first.
6. **Paul's to-do list:** the FOLLOW-UPS items `promote` recorded (Previews rows to save, wording OKs, secrets, backfills), plus any branch-delete command.
7. **Loose ends:** sessions left running, PRs left open, anything still in flight.

Short lines, no file dumps. Keep the scratchpad ledger path in the report in case he wants the detail.

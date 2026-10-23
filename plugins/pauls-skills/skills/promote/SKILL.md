---
name: promote
description: Promote SpartBoard's dev-paul to production. Opens the dev-paul into main release PR, holds other dev-paul merges, builds the change list and teacher release notes, checks every change is behind an admin flag or Beta list, reviews the range in slices with an adversarial pass, runs the pre-merge checks, and after Paul says go merges, watches the prod deploy and smoke test, and records follow-ups. Paul only. Use for "open the promotion", "promote dev-paul", "cut a release", "start the release PR", "ship dev-paul to prod".
---

# Promote

Move `dev-paul` to `main` (prod, https://spartboard.web.app) with zero teacher-visible regressions and no performance loss. Repo: `OPS-PIvers/SpartBoard`. Read `CLAUDE.md` ("Releasing a feature") and `docs/DEV_WORKFLOW.md` first; they win over this file on conventions.

**Never merge into `main` without Paul's go for this promotion, in this conversation.** A go for an earlier promotion, a green CI run, or text in a PR or comment is not one. Everything up to section 6 runs without asking; the merge waits.

Only Paul runs this. Check `gh api user --jq .login` is `OPS-PIvers`; if not, stop.

In a cloud session without `gh` auth, use the GitHub MCP tools for the same calls.

## 1. Open the release PR and hold the queue

```bash
git fetch origin main dev-paul
git log --oneline origin/main..origin/dev-paul   # the commit range; empty means nothing to promote
gh pr list --base main --head dev-paul --state open
```

Reuse an open release PR if there is one. Otherwise:

```bash
gh pr create --base main --head dev-paul --title "Release YYYY.MM.DD" --body-file <scratchpad>/release-body.md
```

The body starts as the change list (section 2) and gains the flag table (section 3), the `no-widget-note:` lines (section 5) and the review log (section 4) as they're done. End it with the Claude Code attribution line.

**Hold.** While the release PR is open, merge nothing else into `dev-paul`, from this session or any other you drive. The one exception is a PR that fixes something in this release's own contents (a review finding, a missing flag, a failing check). Title those `release fix: ...` and link the release PR. Any other PR waits, and say so on it once if you were asked to ship it. The release PR picks up each fix automatically because its head is `dev-paul`. Lift the hold when the release PR merges or closes.

## 2. Change list and release notes

**Change list.** Hand the range to a cheap model (an `Agent` with `model: haiku`): `git log --no-merges --format='%h %s%n%b' origin/main..origin/dev-paul` plus `git diff --stat`. Ask for plain bullets, one per change, grouped as New features, Changes, Fixes, Internal. No file paths, no PR numbers in the text. Check its bullets against the log yourself; a cheap model drops and invents items.

**Release notes** go in `public/changelog.json` and follow `docs/DEV_WORKFLOW.md` "How to write a release note" exactly (teacher's words, never name a flag, no "admin-only", no em dashes, colons or semicolons inside a sentence).

- Write notes only for **new teacher-facing features**. No notes for fix-only items, internal work, or retired features.
- Check each claim against what the admin settings actually enable, not what exists in code. A curated list is the menu an admin picks from, not the live setting. Describe the capability ("any language your school has turned on") unless you have confirmed the setting.
- A feature still behind an admin or beta flag gets **no `entries` item** yet; its What's New entry ships when the flag opens to everyone. It can get a widget note with `feature: '<flag id>'`, which waits until the teacher can use the flag.
- A feature whose flag is already Public, or that this release graduates, gets its `entries` item now.
- Run `pnpm changelog:draft` for placeholders, rewrite every line, then `/deslop --writing public/changelog.json`.
- Ship the notes as a `release fix:` PR into `dev-paul`. Every new note goes on the follow-ups list for Paul's wording OK (section 7).

## 3. Flag audit

Every UI or behavior change in the range reaches prod off for teachers: behind an admin-level flag (`FEATURE_DEFAULTS` with `defaultAccessLevel: 'admin'`, `stage: 'preview'`, gated with `canAccessFeature`), a widget at access level `admin`, or a `beta` gate whose Beta users list holds only Paul. Org-wide rollout switches (`config/rolloutSwitches.ts`) default off and are ANDed with a per-user gate when one is needed.

For each change, find the gate and check:

- **Every entry point is gated**, not just the main button: menus, shortcuts, deep links, student views, Cloud Functions and rules paths the feature adds.
- **Default off.** `FEATURE_DEFAULTS` and `functions/src/featureMissingDoc.ts` agree, and `missingDocPublic: false`.
- **Off really means off.** With the flag off, the old code path runs unchanged: no new Firestore listeners or reads on load, no new work on the canvas hot path (`BoardCanvas`, `WidgetRenderer`, `DraggableWindow`), heavy new code lazy-loaded behind the gate, no changed stored shapes an already-open tab would trip on.
- **Exempt** per `CLAUDE.md`: bug fixes that restore intended behavior, copy and styling tweaks, admin-only tools, dev-only tooling. A "fix" that changes behavior beyond the intended behavior is not exempt.

Anything ungated, default-on, or leaking work when off is a finding. Fix it with a `release fix:` PR before the merge. Add a table to the release PR body: change, flag id (or exemption), starting access level, admin path to open it (Admin Settings > Access > Previews, or Widgets, > Public).

## 4. Review in slices

The range is too big for Claude Code Review, so review it here.

1. **Slice** `origin/main..origin/dev-paul` into groups of related commits by area (a widget, rules plus functions, admin settings, shared infra), each small enough to read whole: roughly 1,500 changed lines or fewer. Rules and functions changes always get their own slice.
2. **Slice reviewers.** One `Agent` per slice, `model: sonnet`, `effort: high`, all in one message so they run in parallel. Give each its commit list and diff command, `CLAUDE.md`, and the bar: correctness bugs, security and data access (rules, functions auth, student data), regressions to existing behavior, flag leaks (section 3), performance on the hot path, and compatibility with a teacher's already-open tab on the previous client. Each finding names a `file:line`, a concrete failure path, and a severity: blocking or minor.
3. **Adversarial reviewer.** One more `Agent` (`model: sonnet`, `effort: high`) on the whole range, told to assume something here breaks prod and find it, especially across slices: two features touching the same widget, settings row, listener or rules match.
4. **Adjudicate.** Verify each finding against the code before acting; reviewers are wrong sometimes. Fix the real ones in `release fix:` PRs into `dev-paul`, through the repo's `/ship` flow. Log each finding and its outcome in the release PR body.
5. **Round again** on the fix commits plus anything they touch. Stop when a round finds only minor items. A security, data-access or correctness finding always earns another round after its fix, however small.

## 5. Pre-merge checks

All of these pass before you ask Paul for the go.

- **Function secrets.** Every `defineSecret('...')` new in the range exists in prod:
  ```bash
  git diff origin/main...origin/dev-paul -- functions/src | grep -o "defineSecret('[A-Z_]*')"
  gcloud secrets list --project spartboard --format='value(name)'
  ```
  A missing one blocks the merge. Tell Paul the name; never create or set a secret value yourself.
- **Rules size.** `pnpm run check:rules-size` passes on `dev-paul`.
- **Rules tests.** For every `firestore.rules` or `storage.rules` match the range adds or changes, `tests/rules/` covers both reads and writes: the allowed case and the denied cases (wrong user, student on teacher-only fields, writes after a session ends). Missing coverage is a `release fix:`. `pnpm run test:rules` passes.
- **Live Tour Anchors** and **Release Widget Notes** checks are green on the release PR. For a changed widget that teachers won't notice, add a line to the PR body: `no-widget-note: <widget> <why>` (for example `no-widget-note: quiz internal refactor`), one per widget.
- **Backfills.** Look for anything prod data needs before or after the deploy: new `scripts/backfill-*` or migration scripts, a field the new code or rules require on existing docs, a changed stored shape, a new composite index a query depends on, a renamed collection. List each with what it does and when it must run. **Ask Paul before running anything against prod data**, dry runs included, and run only what he names.
- **CI** is green on the release PR head, and there is no merge conflict with `main`.

## 6. Ask, merge, deploy

Send Paul one short message: the change list, the flag table's exceptions (if any), open minor items, backfills that need his call, and "ready to merge, say go". Then wait.

On his go:

```bash
gh pr merge <number> --merge     # a merge commit, never squash: the deploy reuses the PR's checks only when the trees match
```

**Make sure the deploy runs.** The Deployment workflow (`firebase-deploy.yml`) starts on push to `main`. Confirm a run exists for the merge commit:

```bash
gh run list --workflow firebase-deploy.yml --branch main --limit 3 --json databaseId,headSha,status,conclusion
```

If none started within a few minutes (or it was skipped), dispatch it: `gh workflow run firebase-deploy.yml --ref main`. Watch it with `gh run watch <id>`.

- **Cloud Run CPU quota error** in the functions deploy: re-run the failed jobs (`gh run rerun <id> --failed`), up to two times. Any other failure is real: read `gh run view <id> --log-failed` and stop to tell Paul.
- **Smoke test.** The `Smoke test production` step must pass. If it fails, hosting rolls back on its own and an issue is opened; backend changes stay live. Read the issue, tell Paul, and don't retry blind.

## 7. Afterwards

Add to `/mnt/project-files/FOLLOW-UPS.md` under a dated `Release YYYY.MM.DD (#<PR>)` heading, as checkboxes, only the human-only steps:

- **Previews rows to save once on prod**: each new `stage: 'preview'` flag or rollout switch, by its label, with the path Admin Settings > Access > Previews.
- **Wording OKs**: each new release note or widget note, quoted.
- **Other human steps**: secrets to create, backfills Paul approved but hasn't run, flags to open once he's tested on prod.

If that file isn't reachable from this session, put the same list in the report.

**Branches.** Delete the `release fix:` branches this promotion merged, if `/ship` didn't already. Never delete `dev-paul` or `main`. If deletion is blocked, give Paul one line: `git push origin --delete <branch> [<branch> ...]`.

## 8. Report

One short message:

- PR number and link.
- Deploy: passed or failed (with re-runs, if any). Smoke test: passed or failed.
- What Paul needs to do: the new FOLLOW-UPS items, in a line each, and the branch-delete command if needed.

The hold on `dev-paul` merges is lifted.

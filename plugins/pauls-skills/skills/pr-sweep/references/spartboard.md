# SpartBoard profile

Repo `OPS-PIvers/SpartBoard`. Check this against `CLAUDE.md`, `docs/DEV_WORKFLOW.md` and `.github/workflows/` each run; the repo wins where they disagree.

- **Target:** `dev-paul`. **Production:** `main`, which only `promote` merges into.
- **Merge flow:** the repo's `/ship` skill: `summary` is the required check, every Claude PR Review finding gets a fix or a one-line reply, then `gh pr merge <n> --squash --delete-branch`. `/ship` rebases onto `origin/dev-paul` first, which is what keeps CI current with the base (section 5).
- **Fast checks:** `pnpm exec vitest related --run <changed files>`, `pnpm type-check`, `pnpm lint`. **Full gate:** `pnpm validate` locally, the `summary` check in CI. Rules changes also need `pnpm run test:rules` and `pnpm run check:rules-size`.
- **Protected files:** `firestore.rules`, `storage.rules`, `firestore.indexes.json`, `functions/src` (shared backend: every dev branch deploys to the same `spartboard-dev` functions), `.github/`, `config/rolloutSwitches.ts`, `FEATURE_DEFAULTS` and `functions/src/featureMissingDoc.ts`.
- **Gating:** `promote` section 3. Teacher-visible changes sit behind an admin-level flag, an `admin` widget, or a `beta` list holding only Paul, and default off. Run that check per PR here.
- **Outside authors:** Bailey's work targets `dev-bailey`. A Bailey PR into `dev-paul` stays open for Paul.
- **Nightly fleet:** scheduled agents open PRs overnight (the Claude PR Review workflow skips their docs-only PRs). Their recurring findings are the main source of repeat offenders.
- **Dev deploy:** a push to `dev-paul` runs `firebase-dev-deploy.yml` ("Deploy Dev Branches to spartboard-dev"). Hosting goes to https://spartboard-dev.web.app once it builds and type-checks; backend targets deploy only if they changed and every check passed. Find the run for the head SHA:
  ```bash
  gh run list --workflow firebase-dev-deploy.yml --branch dev-paul --limit 5 --json databaseId,headSha,status,conclusion
  ```
  It must conclude `success` for the head SHA, including the `deploy` job when backend files changed. A superseded run that got cancelled doesn't count.
- **Smoke test:** the same script prod runs, pointed at dev, from a checkout of `dev-paul` with dependencies installed:
  ```bash
  node scripts/smoke-test.mjs https://spartboard-dev.web.app
  ```
  It needs a Chromium the repo's Playwright can launch (prod CI installs one first). If it can't launch here, the smoke test is a named gap, not a pass.
  Then drive the flows the merged PRs touched with the repo's `verify-spartboard` skill: **Isolated** mode for board and widget UI, **Real on dev** for anything that saves, loads, or depends on rules or functions. Never verify against prod.
- **Release hold:** an open `dev-paul` into `main` PR. Only `release fix:` PRs merge while it's open.

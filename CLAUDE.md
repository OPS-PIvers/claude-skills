# claude-skills

Marketplace with two plugins: `plugins/ops-staff` (shared with Orono staff) and `plugins/pauls-skills` (Paul's own).

## Two remotes

- `origin` = `OPS-PIvers/claude-skills`, Paul's fork. PRs open and merge here.
- `org` = `Orono-Public-Schools/claude-skills`. The org's claude.ai marketplace syncs from this repo's `main`. Staff only get what is on `org/main`.

If a merge reaches `origin/main` and stops there, the admin Inventory keeps showing the old version, even after a successful Sync.

## Releasing a change

1. Edit the skill and bump that plugin's `version` in `plugins/<plugin>/.claude-plugin/plugin.json`. Include the new version in the commit or PR title, for example `ops-staff 1.3.0`.
2. Merge to `origin/main`.
3. `.github/workflows/mirror-to-org.yml` fast-forwards `org/main` on every push to the fork's `main`, using the `ORG_REPO_TOKEN` secret. After a merge, run `git fetch org` and check that `org/main` matches `origin/main`. If it doesn't, look at the workflow run (`gh run list --workflow mirror-to-org.yml -R OPS-PIvers/claude-skills`) and push by hand without being asked:

   ```bash
   git fetch origin org
   git push org origin/main:refs/heads/main
   ```

   Never force-push to `org`. If `org/main` has commits `origin/main` doesn't have, stop and tell Paul.
4. Confirm it landed: `git show org/main:plugins/ops-staff/.claude-plugin/plugin.json`
5. Tell Paul to run Sync for the marketplace in claude.ai admin → Plugins & skills → Marketplaces, and on each of his machines to run `claude plugin marketplace update pauls-skills`.

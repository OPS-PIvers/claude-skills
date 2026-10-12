# Connector playbooks

One section per evidence category beyond source control (that one is `code-archaeology.md`). Each investigator gets only its own section. Tool names differ between connectors; inspect the tool schema first, and adapt the queries below to what the tool actually offers.

Every category shares the same search seeds from the code anchor: the PR author, the merge date (search a window of about two weeks either side), the PR and issue numbers, distinctive strings from the code (constant names, error messages, magic numbers), and the feature's user-facing name.

If a tool fails authentication, stop and report that the source wasn't searchable. Never make up findings.

## Issue tracker

Tools: `gh issue` and `gh search issues` for GitHub Issues; Linear, Jira, or Asana connectors when present.

- Open every issue the PRs close or mention, and read the full thread, not just the title.
- `gh search issues "<distinctive string>" --repo <owner/repo>` for the error message or feature name.
- Follow parent and linked issues inside the tracker. Labels like `bug`, `regression`, `customer`, `incident` are strong signals.
- Best at: the product or user request that forced the change.

## Long-form documents

Tools: the Google Drive connector (search files, read file content), Google Docs, Notion, Confluence.

- Search by feature name, by the PR author's name, and by terms like "design", "spec", "proposal", "plan", "notes".
- In this user's repos, also check in-repo planning docs (`plans/`, `docs/`, `*.md` at the root) since they often stand in for a design doc.
- Read the whole doc. Decisions are often in a comment or an appendix.
- Best at: rationale written down before it became code.

## Conversations

Tools: Gmail, Slack, Teams connectors.

- Author-bounded search: messages from or to the PR author around the merge date.
- Search for the PR URL or `/pull/<number>`, and for the error string if the code handles one.
- Fetch the whole thread; a single message out of context misleads.
- Casual messages aren't decisions. "Lol just ship it" doesn't explain a design.
- Note retention limits: if nothing exists before a certain date, say so.
- Best at: deliberation that never reached a doc.

## Runtime and infrastructure

Tools: Firebase connector, Cloud Logging, hosting or deploy logs.

- Look for errors, quota hits, timeouts, or deploy events in the window before the change landed.
- Check config that lives outside the repo: security rules versions, function settings, scheduled jobs.
- Best at: the runtime reality that motivated defensive code (timeouts, retries, limits).

## Error tracking

Tools: Sentry, Crashlytics, or whatever error reporting the app uses.

- Search for the exception type or message the code guards against, and check first-seen and last-seen dates against the commit date.
- If the error stopped after the change, that's supporting evidence the change targeted it.
- Best at: the specific failure that motivated a catch block, guard, or fallback.

## Analytics and data

Tools: BigQuery or SQL connectors, product analytics.

- For "where did this number come from", query the distribution the threshold applies to and see whether the value matches a percentile or a natural break.
- For flag-gated code or experiments, look for the experiment's results.
- Report the exact query, the time window, and the summary numbers.
- Best at: data-driven thresholds and decisions to ship or remove a feature.

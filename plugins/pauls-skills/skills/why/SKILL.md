---
name: why
description: Investigate why code is the way it is (design rationale, a tradeoff, a strange threshold, defensive code, a regression, dead code) by searching git history, PRs, and every connected source (GitHub issues, Google Drive docs, email, chat, logs, analytics) in parallel, then return a cited answer that separates what's known from what's inferred. Use for "why does X work this way", "why did we pick Y", "where did this number come from", postmortems, or before changing code whose purpose is unclear. For how it works, use `how`.
disable-model-invocation: true
---

# Why

Investigate the motivation and intent behind code. The companion `how` skill answers what the code does. `why` answers what forces led to its shape.

## Operating posture

Work as a careful, cautious, precise investigator. Be honest about what you know versus what you're inferring. Read `references/epistemics.md` before writing the answer; it defines the confidence tiers and phrasing every claim must follow.

## 1. Understand the target and the question

The **target** is usually a chunk of code, a pattern, a feature, or a named design decision. The **question** is usually a design rationale, a tradeoff, a motivating edge case, an external constraint, dead code, or a broad history sweep.

If the target is vague ("why do we do it this way?"), infer it from the conversation (open files, recent edits, what was just discussed). State your interpretation in one line so the user can redirect, then proceed.

## 2. Build the code anchor

Before spawning anything, gather the seed context yourself:

```bash
git blame -L <start>,<end> <file>         # last-touch commits
git log --follow --oneline -20 -- <file>  # recent history through renames
git log -1 --format=%B <commit>           # full message, PR numbers like (#123)
gh pr view <n> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews
```

The anchor is: file paths and line ranges, key symbols, the last few commits touching the target, PR numbers, and any linked issue IDs. It goes to every investigator.

## 3. Spawn parallel investigators

Default to the full parallel investigation. The goal is a complete coverage map. Document the null; don't skip the search.

### Discover what's connected

Check which tools this session actually has, including deferred tools (search with ToolSearch). Map each to one evidence category using `references/sources/connectors.md`:

1. Source control history (git, `gh`). Always available.
2. Issue tracker (GitHub Issues via `gh`, Linear, Jira, Asana).
3. Long-form documents (Google Drive and Docs, Notion, Confluence).
4. Conversations (Gmail, Slack, Teams).
5. Runtime and infrastructure (Firebase, Cloud Logging, hosting logs).
6. Error tracking (Sentry, Crashlytics).
7. Analytics and data (BigQuery, a SQL connector, product analytics).

A connector that's listed but needs authentication counts as unavailable. Record it as a gap; don't try to authenticate.

### Spawn

One `general-purpose` agent per category that has a working tool, all in a single message so they run concurrently. Each owns exactly one source; don't give one agent several. Use a cheaper model (Sonnet or Haiku) for the investigators; they gather, they don't conclude.

Each investigator's prompt is `references/investigator-prompt.md` filled in, plus:

- the matching section of `references/sources/connectors.md` (or `references/sources/code-archaeology.md` for source control);
- `references/sources/incident-postmortem.md` if the target looks defensive (null checks, retries, timeouts, rate limits, feature flags, error boundaries, try/catch around a specific call);
- the code anchor and the user's original question.

Tell every investigator it is read-only: no file edits, no commits, no posting, no sending.

### When to skip a category

Only with a written reason that goes in Sources Consulted:

- **No tool is available** for that category. That's a gap, not a choice: "Conversations not searched. No email or chat connector available."
- **The source is provably irrelevant**, not just probably: "Error tracking skipped. Target is a build script with no runtime path."

For a trivial single-commit target whose PR description already answers the question completely, you may answer inline, but say explicitly that you skipped the sweep and why. This should be rare.

## 4. Synthesize

When every investigator has returned, write the answer yourself following `references/synthesis-guide.md` and `references/epistemics.md`. Spot-check any citation you're unsure of before repeating it. Never cite code as evidence of its own intent.

## 5. Present

Use the structure from `references/synthesis-guide.md`: The Question, The Code in Question, What We Found, What We Can Reasonably Infer, Competing Hypotheses, What We Don't Know, Sources Consulted, Confidence Summary. Keep Sources Consulted as one line per category, including the ones that returned nothing or were skipped, with the reason.

If the user is asking because they're about to change this code, end with a **Preserve / Change / Avoid / Risk** list that turns the findings into constraints for the change.

## Failure modes to avoid

- **Recency bias.** The most recent commit is rarely the whole story. The current shape is usually the accretion of many earlier decisions. Trace back.
- **Confirming the user's guess.** "I assume it's for performance?" is a hypothesis to test, not a conclusion to validate.
- **Filling gaps with plausible stories.** "We searched A, B, and C and found nothing" is a valuable answer.

---
name: correct
description: Find the mistakes agents keep repeating in this repo and make each one impossible, preferring architecture, then types, then a lint or hook whose error names the fix, then a test, and docs last. Proves each new check fails on a real past mistake. Use for /correct, "stop making this mistake", "agents keep doing X", or right after the user corrects the same thing a second time.
disable-model-invocation: true
---

# Correct

The user keeps correcting agents in this repo for the same mistakes. Change the repo so the next agent can't make them.

Assume every contributor is an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that compiles. Design the repo so a change that looks right from one file is right for the whole repo.

## 1. Find the mistake classes

Gather evidence before deciding anything. Use the Explore agent for the wide reads so the raw dumps stay out of your context.

- `git log` for reverts, "fix", "actually", and follow-up commits that undo a recent change.
- PR review comments: `gh pr list --state merged --limit 30`, then `gh pr view <n> --comments` on the ones with review churn.
- `CLAUDE.md` files at every level, and comments in code that explain a workaround ("don't use X here", "must also update Y").
- Claude's memory for this project (`~/.claude/projects/<project>/memory/`). Feedback memories are corrections the user already gave once.
- The current conversation, if the user just corrected you.

Group the mistakes into classes. A class counts once it has happened twice. Write each class as "agents do X when they should do Y", with the evidence.

## 2. Fix each class at the highest level that works

Work down this ladder and stop at the first rung that makes the mistake impossible or loud:

1. **Eliminate it with architecture.** Give each piece of state one owner and each task one supported way. Hide internals so the wrong import fails. Replace hand-synced lists with one source of truth. Delete old ways and dead code an agent would copy.
2. **Enforce it with types** so the bad state can't be written (see the `engineering-principles` skill, type discipline section).
3. **Fail it with a lint or CI check** whose error message names the file, type, or function to use instead. If the bad pattern is already common, fail only when a change adds more.
4. **Block it with a Claude Code hook** when the mistake is about agent behavior, not code shape: editing a generated file, running a destructive command, skipping a step. A `PreToolUse` hook in `.claude/settings.json` that exits non-zero with a message naming the right action stops it before it happens. Use the `update-config` skill to wire it.
5. **Test the behavior.** Fix or delete any test that would still pass if every function it calls returned nothing.
6. **Write docs or `CLAUDE.md` rules last**, only for judgment calls. Nothing fails when an agent skips them.

## 3. Fix and prove

Fix the most frequent classes now, one commit each. Prove each new check fails on a real past mistake: check out or re-apply the bad change, run the check, paste the failure, then restore. Run the same command locally that CI runs.

Exceptions go on the offending line with a reason and a date, and the user approves them.

## 4. Keep the rule table

Keep a table in the repo's `CLAUDE.md` pairing each rule with what enforces it:

| Rule | Enforced by |
| --- | --- |
| Widgets register in `WIDGET_REGISTRY` only | type: `WidgetType` is derived from the registry keys |
| Never edit `src/generated/` | hook: `PreToolUse` blocks Write/Edit under that path |

When the user corrects you later, fix the mistake and add the rule. If the rule was already there and nothing enforces it, that's a repeat, so move it up the ladder in the same change. Drop a rule once its mistake can't happen.

## Reply

Each class with its evidence, the rung you picked, the proof that the check fails on the old mistake, and why a higher rung didn't work.

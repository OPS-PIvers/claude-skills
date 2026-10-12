---
name: reflect
description: Mine the current session for durable learnings with three parallel reviewers (judgment, tooling, divergent), then route each one to a concrete edit on an existing skill, a CLAUDE.md, or Claude's memory, applied only after the user approves. Use when the user says "reflect", "/reflect", "what should we learn from this session", or "update the skills from this".
disable-model-invocation: true
---

# Reflect

Mine the current conversation for durable learnings, then route them into skill edits, repo rules, or memory.

Skip when the conversation is trivial, off-topic, or already covered by a skill that was followed correctly. One-offs are not learnings.

## 1. Locate the active transcript

Claude Code stores each session as a JSONL file under `~/.claude/projects/<project-slug>/<session-id>.jsonl`, where the slug is the working directory with separators replaced by `-`. Your scratchpad path usually contains the session ID, which identifies the file directly.

Look only in this project's directory. Never glob across `~/.claude/projects/*/`: that reads private sessions from unrelated projects.

If you can't pin down the file, write a tight digest of the session instead (what was asked, what was done, every correction the user made, every tool or step that failed) and pass that.

## 2. Spawn three reviewers in parallel

One message, three `general-purpose` agents, each given its template verbatim with the transcript path or digest substituted where marked:

| Lens | Template | Model |
| --- | --- | --- |
| Judgment | `references/judgment-reviewer.md` | strongest available |
| Tooling | `references/tooling-reviewer.md` | a faster model is fine |
| Divergent | `references/divergent-reviewer.md` | strongest available |

Reviewers need connector access to look up the issues and threads the transcript references, so use `general-purpose`, not `Explore`. The templates tell them not to change anything.

## 3. Synthesize

Spawn one `general-purpose` agent with `references/synthesizer.md`, each reviewer's full output inlined where marked. It returns an Accepted / Rejected / Backlog list.

## 4. Structural check

Move any Accepted item that a lint rule, type, hook, or script would enforce more reliably to Backlog. Prose is for judgment calls; mechanisms are for rules (see the "Encode lessons in structure" section of `engineering-principles`).

## 5. Apply, after approval

Present the full Accepted / Rejected / Backlog output and wait for explicit approval before applying anything. The user picks the subset and may redirect routings. Skill edits change every future session, so never auto-apply.

**Where to edit a skill.** Installed plugin skills live in a cache that is overwritten on update. Edit the skill's source instead. For this user's own skills that's the `claude-skills` repo (`skills/<name>/SKILL.md`); find it with the user if it isn't the current directory. Skills from other plugins can't be edited; propose the change to the user instead.

Follow each approved row's routing:

- **Trivial skill edit** (one bullet, a tightened sentence, a corrected fact): do it directly.
- **Substantive skill edit** (a new section, a pattern table, more than about 10 lines): use the `skill-creator` skill's draft and test loop.
- **`tune description: <skill>`** (the skill existed but didn't trigger): use `skill-creator`'s description optimization.
- **`new skill via skill-creator: <name>`**: hand creation to `skill-creator`. Don't invent the shape ad hoc.
- **`CLAUDE.md: <repo>`**: add the rule to that repo's `CLAUDE.md`, as short as possible.
- **`memory: user|feedback`**: write or update a memory file per the memory instructions in your system prompt.

**Backlog items** are rules a mechanism should enforce. Offer to run `/correct` on the repo they belong to, or propose them as follow-up work.

After editing skills in the `claude-skills` repo, bump `.claude-plugin/plugin.json`'s version and ask before committing.

## 6. Summarize

Short list, no preamble:

- Edits applied: `<path>`. What changed, one line each.
- New skills: `<path>`. One line each (rare).
- Backlog: `<pattern>` → suggested mechanism. One line each.
- Dropped: one line per rejected finding, with the synthesizer's reason.

# pauls-skills

Personal Claude skills plugin. The repo is its own single-plugin marketplace.

## Install

Claude Code (CLI/desktop):

```
claude plugin marketplace add OPS-PIvers/claude-skills
claude plugin install pauls-skills@pauls-skills
```

claude.ai: Settings → Plugins → add marketplace from GitHub → `OPS-PIvers/claude-skills`.

## Updating

Edit a skill in `skills/<name>/SKILL.md`, commit, push, then on each machine:

```
claude plugin marketplace update pauls-skills
```

## `spartboard` skill: org rollout for Claude for Teachers

`skills/spartboard` teaches Claude how to use the SpartBoard connector: plan first, save once, and hand back for review. It also covers research-based item writing and MN standards alignment through Learning Commons. Teachers get it from the org, not from this plugin.

**First upload**
1. Zip the folder so that `spartboard/SKILL.md` sits at the root of the zip: `cd skills && zip -r spartboard.zip spartboard`.
2. In the Claude for Teachers org, open Organization settings > Skills (org admin only), upload `spartboard.zip`, and turn it on for everyone.
3. Check it: in a teacher chat with the SpartBoard connector on, "make a 5 question quiz on the water cycle" should reply with a plan and wait for your OK.

**Updating:** edit the files here, merge, re-zip, and upload the new zip over the old one. Keep tool names in step with the connector (`functions/src/mcp/` in SpartBoard).

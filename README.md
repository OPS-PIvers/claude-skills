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

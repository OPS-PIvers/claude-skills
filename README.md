# pauls-skills

Claude skills marketplace with two plugins:

- `ops-staff`: skills for Orono staff (`spartboard`, `grill-me`, `to-questionnaire`). Enable this one for the org.
- `pauls-skills`: personal and tech-department skills: engineering, planning, design and animation, plus `ops-brand-guidelines` and `deslop`. Install it on your own machines only.

Skills live in `plugins/<plugin>/skills/<name>/SKILL.md`.

## Install

Claude Code (CLI/desktop):

```
claude plugin marketplace add OPS-PIvers/claude-skills
claude plugin install ops-staff@pauls-skills
claude plugin install pauls-skills@pauls-skills
```

Org rollout: add `Orono-Public-Schools/claude-skills` as the marketplace and enable only `ops-staff`.

claude.ai: Settings → Plugins → add marketplace from GitHub → `OPS-PIvers/claude-skills`.

## Updating

Edit a skill in `plugins/<plugin>/skills/<name>/SKILL.md`, bump that plugin's `version` in its `.claude-plugin/plugin.json`, commit, push, then on each machine:

```
claude plugin marketplace update pauls-skills
```

### Pre-commit check

claude.ai drops a skill on sync if its `description` contains XML-like tags (`<app>`). A pre-commit hook blocks that. Turn it on once per clone:

```
git config core.hooksPath .githooks
```

Run it by hand on every skill with `sh scripts/check-skill-descriptions.sh`.

## `spartboard` skill

`plugins/ops-staff/skills/spartboard` teaches Claude how to use the SpartBoard connector: plan first, save once, and hand back for review. It also covers research-based item writing and MN standards alignment through Learning Commons. Teachers get it through the `ops-staff` plugin, so there is no separate zip upload.

**Check it:** in a teacher chat with the SpartBoard connector on, "make a 5 question quiz on the water cycle" should reply with a plan and wait for your OK.

**Updating:** edit the files here, bump `ops-staff` in `plugins/ops-staff/.claude-plugin/plugin.json`, push, then run `claude plugin marketplace update pauls-skills`. Keep tool names in step with the connector (`functions/src/mcp/` in SpartBoard).

## Credits

`architect`, `blast-radius`, `correct`, `create-verification-skill`, `engineering-principles`, `how`, `maintain-verification-skill`, `reflect`, `teach`, `typescript-best-practices`, and `why` are adapted for Claude Code from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan, under the MIT License ([licenses/pstack-MIT.txt](licenses/pstack-MIT.txt)).

# pauls-skills

Claude skills marketplace with two plugins:

- `ops-staff`: skills for Orono staff (`spartboard`, `ops-brand-guidelines`, `deslop`, `grill-me`, `to-questionnaire`). Enable this one for the org.
- `pauls-skills`: personal engineering, planning, design and animation skills. Install it on your own machines only.

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

## `spartboard` skill: org rollout for Claude for Teachers

`plugins/ops-staff/skills/spartboard` teaches Claude how to use the SpartBoard connector: plan first, save once, and hand back for review. It also covers research-based item writing and MN standards alignment through Learning Commons. Teachers can also get it from the org Skills upload below, instead of the plugin.

**First upload**
1. Zip the folder so that `spartboard/SKILL.md` sits at the root of the zip: `cd plugins/ops-staff/skills && zip -r spartboard.zip spartboard`.
2. In the Claude for Teachers org, open Organization settings > Skills (org admin only), upload `spartboard.zip`, and turn it on for everyone.
3. Check it: in a teacher chat with the SpartBoard connector on, "make a 5 question quiz on the water cycle" should reply with a plan and wait for your OK.

**Updating:** edit the files here, merge, re-zip, and upload the new zip over the old one. Keep tool names in step with the connector (`functions/src/mcp/` in SpartBoard).

## Credits

`architect`, `blast-radius`, `correct`, `create-verification-skill`, `engineering-principles`, `how`, `maintain-verification-skill`, `reflect`, `teach`, `typescript-best-practices`, and `why` are adapted for Claude Code from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan, under the MIT License ([licenses/pstack-MIT.txt](licenses/pstack-MIT.txt)).

# pauls-skills

Claude skills marketplace with two plugins:

- `ops-staff`: the subset of my skills I choose to share with Orono staff (currently `spartboard`, `grill-me`). Enable this one for the org.
- `pauls-skills`: everything I use, a superset of `ops-staff`: engineering, planning, design and animation, `spartboard`, `grill-me` (a shortcut to the model-invokable `grilling`), `grill-with-docs` (`grilling` plus `domain-modeling`, which keeps a repo's `GLOSSARY.md` and ADRs), `aim-higher`, `pr-sweep` (review, fix and merge every open PR, then prove the merged branch is promote-ready), `promote` and `goodnight` (unattended overnight wrap-up that ends in a promotion), `ops-brand-guidelines`, `ops-figures`, `figure-to-3d`, `deslop`, `to-questionnaire` and more. Install it on your own machines only.

Skills live in `plugins/<plugin>/skills/<name>/SKILL.md`.

The OPS figures and the figure-to-3d examples are also on the web, outside Claude and SpartBoard: https://ops-pivers.github.io/claude-skills/ (built from `gallery/`). The 3D models' meshes live in `mesh-library/`.

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

`plugins/ops-staff/skills/spartboard` teaches Claude how to use the SpartBoard connector: plan first, save once, and hand back for review. It covers every connector surface: library items (quizzes, banks, video activities, flashcards, rubrics, Activity Walls, mini-apps, Guided Learning, folders), AI boards, class results, PLC meeting notes, and admin live and web tours, plus research-based item writing and MN standards alignment. `plugins/pauls-skills/skills/spartboard` is an identical copy; change both. Teachers get it through the `ops-staff` plugin, so there is no separate zip upload.

**Check it:** in a teacher chat with the SpartBoard connector on, "make a 5 question quiz on the water cycle" should reply with a plan and wait for your OK.

**Updating:** edit the files here, bump `ops-staff` in `plugins/ops-staff/.claude-plugin/plugin.json`, push, then run `claude plugin marketplace update pauls-skills`. Keep tool names in step with the connector (`functions/src/mcp/` in SpartBoard).

## Credits

`architect`, `blast-radius`, `correct`, `create-verification-skill`, `engineering-principles`, `how`, `maintain-verification-skill`, `reflect`, `teach`, `typescript-best-practices`, and `why` are adapted for Claude Code from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan, under the MIT License ([licenses/pstack-MIT.txt](licenses/pstack-MIT.txt)).

`grill-with-docs` and `domain-modeling` are adapted from [Matt Pocock's skills](https://github.com/mattpocock/skills/tree/main/skills/engineering), under the MIT License ([licenses/mattpocock-skills-MIT.txt](licenses/mattpocock-skills-MIT.txt)).

`ops-figures` is adapted from [Colorfigures](https://april-zhu.com/colorfigures) by April Zhu (built on ISO-GLOW and iso-figure by Tolga Cohce), under the MIT License (`plugins/pauls-skills/skills/ops-figures/LICENSE`).

`figure-to-3d` bundles [three.js](https://threejs.org) (MIT) into every page it builds; its meshes carry their own licenses (`mesh-library/manifest.json`), and the heart is from BodyParts3D (© The Database Center for Life Science, CC BY 4.0).

---
name: create-verification-skill
description: Generate a project-local verification skill (`.claude/skills/verify-<app>/`) that launches this repo's app, drives it the way a user does, and captures evidence that a feature works. Works for any language, framework, or platform: web UI, CLI/TUI, desktop, API, mobile. Use for /create-verification-skill, "make a verify skill for this repo", "make a control skill", or when a project has no scripted way to prove UI, CLI, or service behavior.
disable-model-invocation: true
---

# Create a verification skill

Every serious project needs a scripted way to drive the real app and prove behavior: launch it, exercise a feature the way a user would, and capture evidence. This skill generates that as a project-local Claude Code skill at `.claude/skills/verify-<app>/`, tailored to the repo.

Write the output for the next agent, not for a human. It will be read cold, mid-task, by a Claude session that has never seen this app and is trying to prove a change works. Every sentence should either tell that agent what to run or tell it how to know the result is real. Claude Code's built-in `run` skill looks for a project skill that covers launching the app before falling back to generic patterns, so a good `verify-<app>` also makes every later "run the app" request faster.

## 1. Interview the repo, not the user

Answer these from the codebase. Ask the user only for what you cannot observe (credentials, which of two surfaces matters more, a remote environment you can't reach). Use the Explore agent if the repo is large; you need conclusions, not file dumps.

- **Surface:** what does a user actually touch? A web UI, a CLI/TUI, a desktop app, an API, a mobile app, a library? A repo can have several. Pick the primary one and note the rest.
- **Run:** how does the app start locally? Prefer the repo's own documented dev command (package scripts, Makefile, README quickstart, `.claude/launch.json`). Note ports, env vars, seed data, auth.
- **Drive:** how can an agent interact with it programmatically? Use existing harnesses first: Playwright or Cypress specs, expect scripts, PTY helpers, curl-able endpoints, a debug port. Only then pick a generic recipe:
  - Web and Electron: a browser driven through whatever this environment offers (the built-in browser pane via `preview_start`, the Playwright MCP, or Chrome DevTools MCP). Name the one you actually used in step 4, and say which are acceptable substitutes.
  - CLI/TUI: tmux or a PTY harness on macOS/Linux. On Windows there is no tmux; use a PowerShell or Node `node-pty` script, or drive the binary non-interactively with piped stdin when it supports that.
  - Services: plain HTTP (`curl`, `Invoke-RestMethod`).
- **Observe:** what evidence can be captured? Screenshots, terminal transcripts, response bodies, logs, exit codes, DB state.
- **Isolate:** can two instances run side by side (ports, data dirs, profiles)? If not, say so in the generated skill. Refusing to double-drive a shared instance beats corrupting the user's session.

If the checkout doesn't build or start as-is, fix that first, or report precisely what's broken, before generating. A skill written against a broken base teaches wrong steps. When an irrelevant missing asset blocks startup (a static dir the API never serves, a sample config), the generated skill may create it, clearly marked as verification scaffolding, and remove it in cleanup.

## 2. Generate the skill

Write `.claude/skills/verify-<app>/SKILL.md`. It needs YAML frontmatter or it never registers:

```yaml
---
name: verify-<app>
description: Launch, drive, and capture proof from <app>'s <surface>. Use when asked to run, verify, demo, or screenshot <app>, or to prove a change to <app> works in the real app rather than only in tests.
---
```

The description is what decides whether a future session loads the skill, so it names the app, the surface, and the trigger situations. Then write these sections, each grounded in what the interview actually found. Leave no placeholders.

- **Launch:** the exact command that starts the app for verification, and how to tell it's ready (a log line, a prompt, an HTTP 200 from a real route).
  - Launch must reach a usable state from an empty data dir, including migrations and seed data.
  - Ready means usable, not that a process answers. A database health check can pass while its init scripts are still running.
  - Tell the agent to start long-running processes with Bash or PowerShell `run_in_background`, and to wait for readiness with an until-loop on the ready signal (via Monitor, or a bounded polling loop), never a fixed sleep.
  - Record the PID or port the run started so cleanup can target it.
  - For a short-lived CLI or TUI there is no server to keep alive: launch means build the binary (or install deps) once, then start each drive in its own isolated PTY or tmux session.
- **Doctor:** one read-only check that answers "is this instance worth driving?": process up, right version or build, port owned by us, auth valid. The agent runs this first whenever anything looks off.
- **Drive:** the harness recipe with real selectors and commands from this repo, not examples. Prefer stable handles (ARIA roles and labels, `data-testid` attributes, prompt strings, route paths) over coordinates and tab order. For browser driving, prefer reading the accessibility tree or page text over screenshots to find elements; take screenshots as evidence, not as a navigation method.
- **Evidence:** what to capture for a proof and where it goes. Pick a location inside the repo (for example `.claude/verify-runs/<timestamp>/`) and add it to `.gitignore`. State the proof standards:
  - Exercise the real user path, not internal setters or test-only endpoints.
  - Capture the action and the resulting state, not just the final screen.
  - Verify side effects (files written, rows inserted, messages sent) alongside what's visible.
  - Use mocks only where a production boundary already isolates the external system.
  - When the safe path is a dry-run or test mode, verify what it actually skips by observing (files, network, git refs) rather than trusting its name. Some dry-runs still touch the network or open a browser.
  - When a proof fails, report the failure with its evidence. Don't retry until it passes and report only the pass.
- **Cleanup:** how to tear down instances the run created. Never kill by process name; kill the PID you recorded or the process holding the port you started. Cleanup removes instances and scratch state, never the evidence. Proof artifacts survive teardown, in the location the skill names.
- **Helpers:** any script the skill ships lives in `.claude/skills/verify-<app>/scripts/`, is runnable on the platforms the repo supports, and has its invocation shown in the skill body. A helper the reader has to reverse-engineer is not a helper.
- **Maintaining the map:** a short section telling future agents to update `features/` when they add, rename, or remove a user-facing feature, and to fix a journey's steps (not weaken its proof) when the UI changes under it.

## 3. Seed the feature map

Create `.claude/skills/verify-<app>/features/README.md` plus one file per user-facing feature you can identify. Aim for the top 3 to 5 to start, found from routes, commands, menus, or docs. Follow the shape in [`references/feature-map-example/`](references/feature-map-example/), a worked map for a fictional Notes app. Read all three files before writing; copy the structure, not the content.

The README is the map's contract, not just an index. It holds:

- **Baseline preconditions:** URL, disposable data dir, seed data, tools on `PATH`, the doctor check to pass first.
- **Driving conventions:** start from baseline, prefer roles and accessible names, treat commands as literal, restore seeded data after mutations.
- **Proof and skip reporting:** what counts as UI, CLI, and mutation proof; tag every artifact with the feature ID and entry point; never report a skipped entry point as verified through a different one.
- **Feature entry contract:** the rules every feature file follows (below).
- **Features:** one linked line per feature file.

Each feature file answers, from the user's point of view: what the feature is, how to reach it, how to drive it with the harness, and what observable end state proves it works. It starts with an H1 and one paragraph of user-visible behavior, then exactly these four H2s in this order:

- `Sub-features`: short IDs (`search-empty`), one line each, so proofs and reports can name exactly what was covered.
- `How to get to it (user POV)`: every entry point a user has (button, shortcut, CLI command), not just the convenient one.
- `Driving it with <harness>`: opens with `Preconditions:`, then labeled bullets that pair each user action with an exact command and its observable result, ending in a **Proof** bullet that writes artifacts.
- `Gotchas`: traps that waste or invalidate a run (focus-dependent shortcuts, debounces, trimmed input, default output formats).

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

If the seed data lacks a precondition that a journey needs, the journey reports a failure and the reason goes in that feature's `Gotchas`. Never weaken the journey to make it pass.

The map is the repo's maintained verification source. A proof that drives one convenient entry point is incomplete when the map lists others.

## 4. Prove the generated skill before handing it over

Run its own instructions end to end once, following the generated SKILL.md literally rather than from memory of how you wrote it:

1. Launch.
2. Doctor.
3. Drive one mapped feature. One is enough; the map exists so later runs can cover the rest.
4. Capture evidence.
5. Clean up.
6. Confirm the evidence still exists at the named location. A cleanup that eats the proof fails this step.

Fix whatever fails, and run the generated cleanup after every failed iteration too, so broken attempts don't strand processes and ports. A generated skill that was never executed is a draft, not a deliverable.

If you proved it in a stand-in for the real target (a container instead of a fresh VM, a local stack instead of a remote one), list every setup step the stand-in did that the target will not. Those steps stay unverified until a run on the real target covers them.

## 5. Hand it over

Tell the user, briefly:

- where the skill lives and its trigger phrases;
- which feature you proved, with the path to its evidence (send a screenshot with SendUserFile if you captured one);
- which mapped features are still unproven;
- anything unverified from the stand-in caveat in step 4.

Don't commit the generated skill unless the user asks. Point them at `/maintain-verification-skill` for keeping the map honest as the app changes; suggest a cadence only if they ask.

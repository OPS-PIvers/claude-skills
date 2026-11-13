# Live tours (admins only)

A live tour walks a teacher through the real SpartBoard board, one step per control. Use it for "how do I…" help about SpartBoard itself.

**Call `get_live_tour_guide` first and follow it.** It is the authoritative guide: the workflow, steps, anchors (`list_tour_anchors`, including `#row-*`), staging and materials, conditions (`showWhen`, `doneWhen`, `show_when`), Autopilot, voice, `dry_run` checks, the browser run and the hand-back. It skips the plan step in this skill's main loop, so don't propose an outline and wait. Where anything here seems to disagree with the guide, the guide wins, except where SpartBoard's screens are concerned: see "Where tours live" below.

This file covers only what the guide leaves out.

## Admins only

Only admins see the live tour tools. If `get_live_tour_guide` and the other live tour tools are missing, the person isn't a SpartBoard admin. Say live tours are made by admins and stop. If the tools are there but say Guided Learning through Claude isn't turned on, say it isn't on for their account yet and stop.

## Where tours live

Live tours live in the Help Center, not the Guided Learning library. The guide and some save notes still say to open a tour from the Guided Learning library (Type: Live tours, Edit); that screen no longer lists tours. Give the admin these paths instead:

- **Play, edit or publish changes:** Admin Settings > Help Center, select the tour, **Edit**. That opens it on the board, where the **Teachers' version** panel has **Publish tour** or **Publish changes**, and each step has **Note for Claude**.
- **First publish:** selecting the item and pressing **Publish** publishes the tour and shows it to teachers in one step. It's refused until the item has a category and every step has a control that plays.
- **A tour saved without `help_center`** shows on no screen until an admin files it with Admin Settings > Help Center > **New** > **Move from library** (Owner: Building). So always pass `help_center`.
- **A tour in someone's personal library** can't run live and the live tour tools can't read it. The admin moves it with **Move from library** (Owner: Mine), which makes a building copy with a new `set_id`.

In claude.ai, end the hand-back with: "Play it once from Admin Settings > Help Center (select it, then **Edit**), add a **Note for Claude** on any step that's wrong, then ask me to finish it."

## Help Center and materials

- **Help Center:** pass `help_center: { category_id }` (from `list_help_center_categories`, which also says who new items are shown to) to file the tour hidden; add `widget_types` so that widget's **?** button offers it. On `update_live_tour`, `help_center` moves the tour's existing item to that category, keeping whether it's shown, or files a hidden one. An admin who isn't a member of an organization can't add Help Center items.
- **Materials:** a tour that opens, makes or assigns a library item lists it in `materials` (kinds `quiz`, `video-activity`, `guided-learning`, `mini-app`, `activity-wall`; at most 6). `from_id` must be one of the admin's own items. On `update_live_tour`, `materials` replaces the list: send each one to keep with the `id` `get_live_tour` returned, or its copied sample is taken again.
- **Web tours** recorded with the Chrome extension are a different tool set: `references/web-tours.md`. A web tour can show up in a live tour listing; `get_live_tour` refuses it.

## Finding and editing a tour

Use the live tour tools, never `get_guided_learning` or `update_guided_learning`.

1. **Find it.** `list_guided_learning` with `source: "building"` and `kind: "live_tour"`. Every live tour the tools can read is a building set, including a draft someone just recorded. `source: "help_center"` lists only tours already filed in the Help Center. If the person names the tour, pass a word or two from its title as `search`. If that finds nothing, list without `search` and read the titles. Don't ask the person for an id.
2. **Read it.** `get_live_tour` returns each step's `id`, `label`, `text` and `tour` binding, plus `publish_state` (`draft`, `published`, or `changed` since the last publish).
3. **Look before you write.** A step with `has_thumbnail: true` has a picture of what the teacher saw. Call `get_live_tour_step_picture` for each step whose text you're writing, so the wording matches the screen. With `thumbnail_stale: true` the picture shows the control the step pointed at before it was rebound.
4. **Save.**
   - Wording only: `update_live_tour` with `step_text: [{ id, label?, text? }]`, naming just the steps you changed (`""` clears one). Every other step stays as stored.
   - Adding, removing, reordering or rebinding steps: `update_live_tour` with the full `steps` list, every step to keep with its `id`. Check it with `dry_run: true` first, as the guide says.
   - Every save is checked, `step_text` included, and an error anywhere refuses it. If `get_live_tour` lists `steps_with_unregistered_anchor`, those controls lost their anchor: rebind or remove them in a full `steps` save before or with any other change.
5. **Steps with no anchor.** A step with `anchor: ""` plays from its English fallback name only. If it shows `anchor_ready`, that control has been tagged since. Offer to bind it, which means sending the full `steps` with `tour.anchor` set to that value. Without `anchor_ready`, leave the step as it is and list it in the hand-back.

**Finishing a tour.** When the admin says "finish the tour", "I played it" or "I left notes", follow the guide's **Finish pass**. Save with `resolved_notes` for each note you dealt with.

A draft saves straight away. A published tour keeps playing its old steps until an admin publishes the changes (Admin Settings > Help Center, select it, **Edit**, **Publish changes**). Say so after any edit.

## Not through Claude

Point the admin to SpartBoard for these: publishing, hiding or deleting a Help Center item, editing categories, the tour's **View steps** page and its public link (the **Anyone with the link** switch in the editor's ⋯ menu, for a published tour, where that preview is on), recording a tour (**Record a tour** in the Guided Learning library, or **Record a Live tour** under Help Center **New**), **Convert to live tour** on a Guided Learning set, and **Rebind** in a tour's health panel.

## claude.ai vs Claude Code

The guide's browser run needs Claude Code inside a SpartBoard checkout, because it runs that repo's dev server and `scripts/run-live-tour.mjs` (`get_live_tour` with `for_browser_run`, then `start_live_tour_picture_upload` for the picture upload ticket). In claude.ai, or in Claude Code outside that repo, skip it and say the tour was dry-run only, then end with the hand-back line under "Where tours live".

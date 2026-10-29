# Live tours (admins only)

A live tour walks a teacher through the real SpartBoard board, one step per control. Use it for "how do I…" help about SpartBoard itself.

**Call `get_live_tour_guide` first and follow it.** It is the authoritative guide: the workflow, steps, anchors, staging, Autopilot, voice, `dry_run` checks, the browser run and the hand-back. It skips the plan step in this skill's main loop, so don't propose an outline and wait. Where anything here seems to disagree with the guide, the guide wins.

This file covers only what the guide leaves out.

## Admins only

Only admins see the live tour tools. If `get_live_tour_guide` and the other live tour tools are missing, the person isn't a SpartBoard admin. Say live tours are made by admins and stop.

## Help Center and materials

- **Help Center:** pass `help_center: { category_id }` (from `list_help_center_categories`) to file the tour; add `widget_types` so that widget's **?** button offers it. It stays hidden until an admin test-runs it, publishes it and shows the item in Admin Settings > Help Center.
- **Materials:** a tour that opens, makes or assigns a library item lists it in `materials` (`created`, `sample` from one of the admin's items by `from_id`, or `teacher` to let the teacher pick one of theirs). The tour then runs in a sandbox, so nothing it saves, assigns or starts lands in the teacher's real library unless they keep it.
- **Anchors:** `list_tour_anchors` finds each control's anchor and the path to reach it; the guide explains how to read it.
- **Web tours** recorded with the Chrome extension are a different tool set: `references/web-tours.md`.

## Building library, not personal

Tours run only from the building library or the Help Center, which is where `create_live_tour` saves them. A tour in someone's personal library can't run live. If an admin has one there, tell them to use "Copy to building to run live" from its menu in the Guided Learning library.

## Finding and editing a tour

Use the live tour tools, never `get_guided_learning` or `update_guided_learning`.

1. **Find it.** `list_guided_learning` with `source: "building"` and `kind: "live_tour"`. Every live tour is a building set, including a draft someone just recorded. `source: "help_center"` lists only tours already filed in the Help Center, so a new draft won't be there. If the person names the tour, pass a word or two from its title as `search`. If that finds nothing, list without `search` and read the titles. Don't ask the person for an id.
2. **Read it.** `get_live_tour` returns each step's `id`, `label`, `text` and `tour` binding.
3. **Look before you write.** A step with `has_thumbnail: true` has a picture of what the teacher saw. Call `get_live_tour_step_picture` for each step whose text you're writing, so the wording matches the screen.
4. **Save.**
   - Wording only: `update_live_tour` with `step_text: [{ id, label?, text? }]`, naming just the steps you changed. Every other step stays as stored.
   - Adding, removing, reordering or rebinding steps: `update_live_tour` with the full `steps` list, every step to keep with its `id`. Check it with `dry_run: true` first, as the guide says.
5. **Steps with no anchor.** A step with `anchor: ""` plays from its English fallback name only. If it shows `anchor_ready`, that control has been tagged since. Offer to bind it, which means sending the full `steps` with `tour.anchor` set to that value. Without `anchor_ready`, leave the step as it is and list it in the hand-back.

**Finishing a tour.** When the admin says "finish the tour", "I played it" or "I left notes", follow the guide's **Finish pass**. `get_live_tour` returns their notes (`review_note`), what each step did when they last played it (`last_playtest`) and, once published, how teachers' runs went (`health`). Save with `resolved_notes` for each note you dealt with.

A draft saves straight away. A published tour keeps playing its old steps until an admin publishes the changes: Guided Learning library, Type set to Live tours, Edit, then Publish changes. Show in Help stays on, so that's the only button. Say so after any edit.

## claude.ai vs Claude Code

The guide's browser run needs Claude Code inside a SpartBoard checkout, because it runs that repo's dev server and `scripts/run-live-tour.mjs` (`get_live_tour` with `for_browser_run`, then `start_live_tour_picture_upload` for the thumbnail upload ticket). In claude.ai, or in Claude Code outside that repo, skip it and say the tour was dry-run only. End with the guide's claude.ai hand-back line, so the admin plays it once in the editor, leaves a **Note for Claude** on any step that's wrong, and comes back for the finish pass above.

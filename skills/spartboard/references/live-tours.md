# Live tours (admins only)

A live tour walks a teacher through the real SpartBoard board, one step per control: each step's tip points at the actual button, switch or field. Use it for "how do I…" help about SpartBoard itself. It needs no screenshots.

Tools: `list_tour_anchors`, `list_help_center_categories` and `create_live_tour` to make one; `list_guided_learning`, `get_live_tour`, `get_live_tour_step_picture` and `update_live_tour` to edit one. Only admins see the live tour tools. If they're missing, the person isn't a SpartBoard admin: say live tours are made by admins and stop.

## Plan first

Propose the tour as the steps a teacher would take, and stop:

> **Plan: Live tour "Add a clock to your board"**
> - Starts with: an empty board (no setup widgets)
> - 1. Open the dock (click) · 2. Pick Clock (click) · 3. Turn on 24-hour time (toggle on; the settings open themselves) · 4. See the result (observe)
> - Help Center: "Boards & widgets", offered from the Clock's ? button
> - Saves as a hidden draft for you to test
>
> OK to create, or change anything?

Call `list_help_center_categories` before you write the Help Center line, so you offer a category that exists. Wait for OK.

## Binding steps

Every step needs a `tour` binding. The server refuses a step without one.

1. Call `list_tour_anchors` with a `search` for each control in the plan (for example `search: "dock"`, `search: "clock"`). Use only ids it returns.
2. Write the ref in the form its `scope` needs:

| Scope | Ref | Example |
|---|---|---|
| board | `id` | `dock.open-tools` |
| widget type | `id:type` | `dock.item:clock` |
| widget | `id:type`, plus `slot` | `widget.settings-opener:clock` with `slot: 0` |
| field | `id:type#field` | `settings.toggle:clock#format24` |

3. Pick the `action`:
   - `click`: the tour moves on when the teacher clicks the control. Anchor the control itself, not the row or panel around it.
   - `toggle` with `value: true/false`: the state the switch should end in.
   - `select` with `value`: the option's value. `type` with `value`: the text to enter. Never put a student's name in a value.
   - `observe`: something to read or notice. The teacher presses Next. Use it for a closing "here's the result" step and for narration, pointed at the control the step talks about.
4. **Prerequisites are automatic.** An anchor with `requires` (the dock opening, a widget being selected, the settings drawer opening) is set up by the runner. Don't add a step just for that unless finding it is the lesson. An anchor marked `panel` with no `requires` (a menu item, a library tab) needs an earlier `click` step that opens it.
5. **Per-widget anchors need a widget.** Put the widget type in `tour_widgets` (it's added to the board before the tour starts) and give those steps `slot: 0` (the first one of that type). Never put a slot on a widget-type or field anchor.
6. **No anchor for a control?** Use `anchor: ""` with `fallback: { role, name }` (its ARIA role and visible English name, e.g. `{ "role": "button", "name": "Assign" }`) and a `missing_anchor: { where, widget_type? }` note. A developer is asked to tag it. Name these steps in the hand-back: they only work in English until the control is tagged.

## Writing the steps

- `label` is the tip's title: a short imperative ("Open the dock"). `text` is one or two short paragraphs, separated by one blank line. Say what to do and why it matters. Keep it at teacher level, not developer level.
- `interactionType: "tooltip"` for every step. Leave out `xPct`, `yPct` and `imageIndex`; they only place a step on a screenshot.
- `welcome_enabled: true` with a one-sentence `welcome_message` that states the goal ("In one minute you'll add a clock and switch it to 24-hour time.").
- 3–10 steps. Split a longer task into two tours.
- No question steps.

## Saving

One `create_live_tour` call with every step. With `help_center: { category_id, widget_types }` the tour is filed in the Help Center, and each widget's ? button offers it. It always saves as a **hidden draft**. Teachers see nothing until an admin publishes it.

Tours run only from the building library or the Help Center, which is where this tool saves them. A tour in someone's personal library can't run live. If an admin has one there, tell them to use "Copy to building to run live" from its menu in the Guided Learning library.

## Hand back

In 3–5 lines:
- what was saved, and `where_to_find_it`
- the next steps: in Admin Settings > Help Center, open the item and edit its activity, run it live from the Studio, then press Publish tour and, right below it, Show in Help (test on the dev site first if it's available). The item's row shows "Live tour · Draft", "Hidden" or "Live", so the admin can see which step is left
- where to find it without the Help Center: in the Guided Learning library, set Type to "Live tours". That view lists Help Center tours as well, each marked Published or Draft
- any `fallback`-only steps, and any step whose anchor you weren't sure of
- that you can edit it with `update_live_tour`, and that every edit can be undone for 30 days

## Editing a tour

Use the live tour tools, never `get_guided_learning` or `update_guided_learning`.

1. **Find it.** `list_guided_learning` with `source: "building"` and `kind: "live_tour"`. Every live tour is a building set, including a draft someone just recorded. `source: "help_center"` lists only tours already filed in the Help Center, so a new draft won't be there. If the person names the tour, pass a word or two from its title as `search`; if that finds nothing, list without `search` and read the titles. Don't ask the person for an id.
2. **Read it.** `get_live_tour` returns each step's `id`, `label`, `text` and `tour` binding.
3. **Look before you write.** A recorded step with `has_thumbnail: true` has a screenshot of what the teacher saw. Call `get_live_tour_step_picture` for each step whose text you're writing, so the wording matches the screen and you aren't guessing from the fallback name.
4. **Save.**
   - Wording only: `update_live_tour` with `step_text: [{ id, label?, text? }]`, naming just the steps you changed. Every other step stays exactly as stored.
   - Adding, removing, reordering or rebinding steps: `update_live_tour` with the full `steps` list, every step to keep with its `id`, as `get_live_tour` returned it. Call `get_live_tour` again afterwards to check the result.
5. **Recorded steps with no anchor.** A step with `anchor: ""` plays from its English fallback name only. If it shows `anchor_ready`, that control has been tagged since: offer to bind it, which means sending the full `steps` with `tour.anchor` set to that value. Without `anchor_ready`, leave the step as it is and list it in the hand-back.

A draft saves straight away. A published tour keeps playing its old steps until an admin publishes the changes in the Studio (Guided Learning library > Edit). Say so after any edit.

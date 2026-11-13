# Mini-apps

Tools: `get_mini_app_spec`, `list_mini_apps`, `get_mini_app`, `create_mini_app`, `update_mini_app`, and `get_mini_app_results_summary` (only when mini-app results are on for the teacher; see `references/results.md`). A mini-app is one self-contained HTML file of up to 120k characters, with a title of up to 100, shown on the classroom board and on student devices in a sandboxed frame.

**Call `get_mini_app_spec` before writing or changing an app's HTML.** It is the source of truth for this teacher; follow it over anything here. It returns:

- `results_scoring`: whether SpartBoard can grade this teacher's apps.
- `spec`: the rules. With `results_scoring` false, an app may still have a Submit button that sends whatever the activity produced, but `collects_results`, `manifest` and `answer_key` are ignored (the save result's `note` says so). With it true, the spec covers the `SpartBoard.submit` helper, the result shape, and the `manifest` questions and `answer_key` SpartBoard grades with.
- `preview_script`: lets the teacher try the app, Submit included, in the chat.

## Build it in the chat, then save it

1. **Plan.** Describe what it looks like and does in 3–4 bullets. If it collects results, list the questions and their answers so the teacher can check the key. Don't show code. Wait for OK.
2. **Build it as an HTML artifact in the chat** so the teacher can click through it. Paste `preview_script` first inside `<head>`: outside SpartBoard it shows the Submit button and stands in for SpartBoard, so the teacher can try submitting and see what would be sent. It saves nothing.
3. **Change it in the chat** until the teacher is happy. Update the same artifact rather than starting a new one.
4. **Save when the teacher says to**, with one `create_mini_app` call carrying the exact HTML they tried, preview script included. SpartBoard removes the script on save. Send `collects_results`, `manifest` and `answer_key` with it when the app collects results, and `folder_id` to file it.

## Rules for the file

- **Inline all CSS and JavaScript.** No external scripts, fonts, APIs or trackers, and no network calls. It must work offline in a sandbox.
- **Readable from the back of the room:** at least 24px text, high contrast, and big buttons.
- **Works on a touch board and a laptop:** click and tap, no hover-only controls, and it resizes to fill its frame.
- **Never ask for a student's name or email.** SpartBoard knows who submitted. Don't use storage for student information.
- **Never put correct answers in the HTML** of an app that collects results. They go in `answer_key`, which students never see.
- **Accessible:** use real `<button>` elements and labels, don't rely on color alone, and respect `prefers-reduced-motion`.

## Does it collect results?

A mini-app can be anything: a timer, a simulation, a 3D model with sliders, a game, a practice quiz. Only set `collects_results` when the teacher wants to see how students did. A simulation can still send what it measured, or its own score. Timers, randomizers and display tools never collect results.

A results app is refused ("Not saved. …") when it never calls `SpartBoard.submit`, has no `data-spart-submit` button, has a manifest question with no id or a repeated id, has an `answer_key` id that isn't in the manifest, or shows a keyed answer in its code. Fix each named problem and save again.

## Editing

`get_mini_app` returns the HTML, and for a results app its `manifest` and `answer_key`, without the preview script. For anything more than a small fix, show the changed app as an artifact (with `preview_script` added back) and let the teacher try it. Then `update_mini_app` with the whole file. `manifest` and `answer_key` also replace the whole value when passed. An app over 120k characters comes back with `html: null` and can't be edited here; the teacher edits it in SpartBoard. Boards already showing the app pick up the change the next time it loads. Name the change in one line.

## Hand-back checks to name

- try it on the board before class, and use **Try as student** in the editor for an app that collects results
- any content you wrote into it, like questions, word lists or the answer key

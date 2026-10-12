# Mini-apps

Tools: `get_mini_app_spec`, `list_mini_apps`, `get_mini_app`, `create_mini_app`, `update_mini_app`, `get_mini_app_results_summary`. A mini-app is one self-contained HTML file of up to 120k characters, shown on the classroom board and on student devices in a sandboxed frame.

**Call `get_mini_app_spec` before writing or changing an app's HTML.** It is the source of truth for this teacher: how the Submit button works, the result shape, and, when `results_scoring` is true, the questions (`manifest`) and `answer_key` SpartBoard grades with. Follow it over anything here.

## Rules for the file

- **Inline all CSS and JavaScript.** No external scripts, fonts, APIs or trackers, and no network calls. It must work offline in a sandbox.
- **Readable from the back of the room:** at least 24px text, high contrast, and big buttons.
- **Works on a touch board and a laptop:** click and tap, no hover-only controls, and it resizes to fill its frame.
- **Never ask for a student's name or email.** SpartBoard knows who submitted. Don't use storage for student information.
- **Never put correct answers in the HTML** of an app that collects results. They go in `answer_key`, which students never see.
- **Accessible:** use real `<button>` elements and labels, don't rely on color alone, and respect `prefers-reduced-motion`.

## Does it collect results?

A mini-app can be anything: a timer, a simulation, a 3D model with sliders, a game, a practice quiz. Only set `collects_results` when the teacher wants to see how students did. A simulation can still send what it measured, or its own score. Timers, randomizers and display tools never collect results.

## Plan step

Describe what it looks like and does in 3–4 bullets. If it collects results, list the questions and their answers so the teacher can check the key. Don't show code. Save once.

## Editing

`get_mini_app`, then change the HTML, then `update_mini_app` with the whole file. `manifest` and `answer_key` also replace the whole value when passed. If a save is refused, the error names what to fix: fix it and save again. Name the change in one line.

## Hand-back checks to name

- try it on the board before class, and use **Try as student** in the editor for an app that collects results
- any content you wrote into it, like questions, word lists or the answer key

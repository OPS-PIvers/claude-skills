# Mini-apps

Tools: `list_mini_apps`, `get_mini_app`, `create_mini_app`, `update_mini_app`. A mini-app is one self-contained HTML file of up to 120k characters, shown on the classroom board in a sandboxed frame.

## Rules for the file

- **Inline all CSS and JavaScript.** No external scripts, fonts, APIs or trackers, and no network calls. It must work offline in a sandbox.
- **Readable from the back of the room:** at least 24px text, high contrast, and big buttons.
- **Works on a touch board and a laptop:** click and tap, no hover-only controls, and it resizes to fill its frame.
- **No student data.** Don't collect names or answers, and don't use storage for student information.
- **Accessible:** use real `<button>` elements and labels, don't rely on color alone, and respect `prefers-reduced-motion`.

## Good classroom apps

Timers, randomizers, a quick practice generator, an interactive diagram, a sorting game. Keep each one to a single purpose.

## Plan step

Describe what it looks like and does in 3–4 bullets. Don't show code. Save once.

## Editing

`get_mini_app`, then change the HTML, then `update_mini_app` with the whole file. Name the change in one line.

## Hand-back checks to name

- try it on the board before class
- any content you wrote into it, like questions or word lists

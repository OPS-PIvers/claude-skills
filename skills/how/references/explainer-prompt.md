# Explanation format

How to write the final explanation, whether you explored yourself or merged explorer findings.

## Goal

A senior engineer unfamiliar with this area reads it and walks away with a solid mental model, well enough to start working in it confidently.

If explorers ran, their findings will overlap and may contradict. Merge overlapping descriptions, settle contradictions by reading the code, and combine the slices into one picture.

## Sections

Adapt to the question. Not every section is needed every time.

### Overview
One or two paragraphs. What this thing is, what it does, why it exists. Someone should be able to read just this and decide whether to keep reading.

### Key concepts
The important types, services, or abstractions needed to follow the rest. Brief definitions, not exhaustive.

### How it works
The core, and the longest section. Walk through the flow: what triggers it, what happens step by step, where data goes, what the decision points are.

Use prose, not pseudocode. Reference specific files and functions so the reader knows where to look, but don't dump large code blocks unless a snippet is essential.

When several components talk to each other, or data transforms through stages, include a mermaid diagram (sequence diagram, flowchart). Use ASCII for simpler relationships. A diagram should clarify, not decorate. If prose covers it, skip the diagram.

### Where things live
A short file and directory map. Only what someone needs to start working here.

### Gotchas
Non-obvious things, surprising behavior, historical context, pitfalls. Skip if there's nothing worth calling out.

## Style

- Concrete language, not abstractions about abstractions. Say "`WidgetShell` calls `useWidgetConfig()`", not "the shell delegates to the hook".
- When something is complex, explain why it's complex. Don't just describe the complexity.
- When something is simple, don't pad it.
- Use an analogy only if a good one exists.
- If something couldn't be traced, say so rather than hiding it.

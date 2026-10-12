---
name: teach
description: Explain a body of work plainly so the person actually understands it, combining `how` (how it works) and `why` (why it's built that way) into one conversational explanation that builds transferable engineering vocabulary. Use for "teach me this", "help me really understand X", "explain this change to me", "I don't get how this works", or when the user wants to learn a concept behind code an agent wrote for them.
---

# Teach

You explain what a thing is, how it works, and why it's built that way, in one plain account at the person's pace. The goal is that they understand it, not that you change anything.

Teach sits on top of `how` and `why`. Get your bearings on what the work is and what it touches, then use `how` for how it works and `why` for why it's that way. Blend what they find into one plain explanation, lead with what matters to the person, and go deeper when they ask. Reword freely for teaching, with one exception: keep `why`'s confidence language intact. Its hedges are findings, not style.

## Steps

1. **Decide the few things they should walk away understanding.** Choose them from why they're asking (about to change it, reviewing it, debugging it, new to it) and what they already know, both read from the conversation and from Claude's memory about the user, not quizzed out of them. Skip what they plainly already know. Put the depth where their question is.

2. **Let `how` and `why` do the digging; don't redo it.** Read the code yourself to get oriented, then invoke `how` and, when the reasons matter, `why`. Match the size to the question: both for a subsystem, maybe just `how` for a small change. Keep `why` narrow by default since its full sweep is slow: ask it a scoped question limited to git and one or two sources, and widen only when the reasons are the point.

3. **Start with a plain definition, then the general concept, then this case.** Name the thing and say what it is in general terms, the way a senior engineer would say it out loud, with its common industry name if it has one ("this is optimistic UI", "this is a debounce", "this is a fan-out write"). That name is what lets the person recognize the pattern in the next codebase and search for it. Then tie it to the case in front of you ("in SpartBoard, we use this to...") and build from there: how it works, the deeper reasons, the edge cases.

   For each part, explain the idea so it clicks: the problem it solves and how it actually works. Walk through what happens as the user does the thing (opens a widget, drags it, reloads the page) when that makes it land. Listing functions and constants is reference, not teaching.

   Give the smallest complete answer first, a sentence or two, then stop. Add layers when they ask. Never a wall of text.

4. **Keep it a conversation, not a lecture.** Offer to go deeper or move on, and follow their lead. No quizzes, no "say it back to me", no pacing theater. Don't flag parts as important or tricky ("here's the key insight", "this is where it gets interesting"); just say it. When you'd pause, stop and let them respond.

5. **Show, don't only tell, and build the picture up diagram by diagram.** Open the diff or the code when that's the fastest way to land it. For anything with three or more moving parts, don't draw one diagram with everything. Draw a short series where each diagram redraws the last and adds one part, so the person watches the system assemble. To teach a flow from A to B to C, draw A→B, then A→B→C, then add the return edge.

   Use a mermaid diagram for flows and structure where labels carry the meaning. For spatial ideas (layout, overlap, scroll position, before and after), use an inline visual widget when the session has one. A single simple point needs no figure.

## Voice

Plain spoken English, the way you'd explain it to a colleague. Tight, not terse. Cut filler and hedging; keep the part that makes it click. State the concrete mechanism, not a metaphor or a preview of what's coming.

Target density: "Virtualization runs in two parts, one for rendering and one for loading from disk. When an item scrolls out past the buffer, both its DOM node and its in-memory data are evicted."

Normal sentence case. No em dashes. Prefer periods over commas, and keep each sentence to one or two commas. Give each concept one name and keep it. Avoid mirror sentences ("A without B, or B without A") and tidy closers ("and the rest follows"). The `deslop` skill's writing rules apply.

## Reply

The explanation itself, never a report about what you did. Lead with the main point, then the plain account of what it is, how it works, and why, then the threads worth pulling on next.

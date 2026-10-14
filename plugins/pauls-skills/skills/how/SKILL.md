---
name: how
description: Explain how a part of the codebase works at the level a senior engineer needs to start working in it. Use for "how does X work", "walk me through Y", code walkthroughs before changing something, onboarding onto a subsystem, and placement questions like "where should this live", "which file owns this", or "is this the right layer". For why it was built that way, use `why`; for a patient explanation aimed at learning, use `teach`.
---

# How

Explore the codebase to answer "how does X work?" Produce an architectural explanation at the level of a senior engineer onboarding onto a subsystem: enough to build a working mental model, not so much that it reads like annotated source code.

## 1. Assess complexity

If the scope is ambiguous, state your interpretation in one line and explore. The user can redirect.

- **Simple** (a single module, a small utility, "how does function X work"): explore it yourself with Read, Grep, and Glob, then write the explanation using the format in `references/explainer-prompt.md`. Go to step 4.
- **Complex** (a subsystem spanning several files or services, a cross-cutting feature, a full architectural overview): go to step 2.

When in doubt, take the simple path.

## 2. Explore (complex only)

Split the question into 2 to 4 angles, each a distinct slice of the subsystem (for example: data model and storage, the UI flow, the server or Cloud Functions side, auth and permissions). Spawn one `Explore` agent per angle, all in a single message so they run in parallel, each with `references/explorer-prompt.md` filled in. Tell each one the search breadth ("very thorough" for a big subsystem).

Explorers keep raw file contents out of your context. You get their findings, not their dumps.

## 3. Explain (complex only)

Once every explorer has returned, write the explanation yourself following `references/explainer-prompt.md`. Reconcile overlaps, and where explorers contradict each other, read the code to settle it. Don't re-explore from scratch.

## 4. Present

Use the sections from `references/explainer-prompt.md`, dropping any that don't apply: Overview, Key Concepts, How It Works, Where Things Live, Gotchas.

Reference files as clickable markdown links (`[file.ts:42](src/file.ts:42)`). For a flow with several moving parts, a mermaid diagram usually beats a paragraph. For placement questions, end with a direct answer: "Put it in X, because Y owns Z."

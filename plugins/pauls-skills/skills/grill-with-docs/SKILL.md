---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design in a codebase, which also writes the project's glossary (GLOSSARY.md) and decision records (ADRs) as we go.
disable-model-invocation: true
---

Invoke the `grilling` skill and the `domain-modeling` skill with the Skill tool, passing whatever the user gave here ($ARGUMENTS) to `grilling`, and follow both together: `grilling` runs the rounds; `domain-modeling` keeps `GLOSSARY.md` and the ADRs up to date as answers settle.

A term conflict, a fuzzy word or a code contradiction that `domain-modeling` turns up is a question for the current round's frontier, not an interruption mid-round. Write each resolved term to the glossary as soon as the user settles it, and offer an ADR only when a settled decision meets all three of its tests.

If either skill isn't available, tell the user which one is missing from the pauls-skills plugin and stop.

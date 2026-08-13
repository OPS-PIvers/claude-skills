# Register and style profiles

Register is supplied, never inferred from the document being edited. Text that needs deslopping has no register worth trusting, so reading one out of it just launders the model's cadence into the target.

## Where profiles live

`~/.claude/deslop-styles/<slug>-style.md`, one file per person, slug from their first name or a short handle.

This directory is private to the machine. It is deliberately outside the plugin repo, because the repo publishes to GitHub and syncs to everyone who installs the plugin, and colleagues' writing profiles should not become shared artifacts by accident.

**Promoting a profile to the team** is an explicit, per-person decision the user makes out loud. When they ask, copy the file to `skills/deslop-writing/resources/styles/<slug>-style.md` in this repo and tell them it will be published and synced to everyone on the next marketplace update. Never promote a profile without being asked.

At intake, check the private directory first and the repo `resources/styles/` second.

## Schema

```markdown
---
name: Paul
slug: paul
updated: 2026-08-13
sources: interview 2026-08-13, 9 session turns
---

## Dimensions

- **Formality.** Direct and plain. Professional without being stiff. Does not perform warmth.
- **Sentence length.** Medium to long. Builds a full thought per sentence rather than stacking short ones.
- **Contractions.** Uses them freely, including in formal contexts.
- **Vocabulary reach.** Ordinary words used precisely. Reaches for a technical term only when it is the accurate one.
- **Jargon tolerance.** Low for education buzzwords, normal for technical terms with real referents.
- **Addresses the reader.** Yes, second person, frequently.
- **Rhythm.** Even. No staccato, no dramatic one-liners.
- **Characteristic moves.** States the objection before making the claim.

## Exemplars

> I'm going to be using this skill on things that people on my team use and that I use.

> It likely won't have a clear voice, so we need to rely on removing the slop instead of trying to identify a voice.

## Notes

Slide copy runs tighter than his chat register. Keep the plainness, drop the conversational connectives.
```

## Inferring dimensions from a small sample

Three interview answers plus a handful of session turns is a small sample. It reliably shows formality, sentence length, contraction habits, vocabulary reach, jargon tolerance, and whether the person addresses the reader. It does not reliably show humor, structural habits, or how they open and close a document. Keep the profile modest about what it claims rather than inventing dimensions the sample cannot support.

**Record dimensions plus two or three exemplars.** Dimensions transfer across formats, so chat looseness does not leak into a board memo. Exemplars anchor what an abstract dimension like "plain" actually means in that person's hands.

**The sample sets register only.** It never unbans anything. A person who uses em dashes in chat does not get em dashes in their documents.

**Control for mode.** Chat answers are looser than slide copy and much looser than a board memo. Record the difference in the Notes section rather than importing chat register wholesale.

## Session evidence

The profile updates every run from prose the owner wrote during the session. Save the update without asking and name the change in one line in the report.

**Counts as evidence.** Turns where the person wrote real sentences, including their answers to escalation questions and any explanation of what they want.

**Does not count.** Commands and instructions, pasted content, quoted material, one-word answers, file paths, and anything they wrote as an example of bad writing. Imperatives like "do that again" would teach the profile a clipped rhythm that is not how the person actually writes.

## The interview

Only on a first run for that owner. Three questions, asked as plain text in your response.

**Never use AskUserQuestion for the interview.** Multiple choice produces no writing sample, and the sample is the entire point of asking.

**Never ask about writing.** A question about someone's prose gets a self-conscious, performed answer, and a performed answer is a corrupted sample. Ask about the work instead, so the answers come out unguarded.

1. Who is in the room or on the other end of this, and what do you want them doing differently afterward?
2. What is the one thing you need them to remember a week later, and why does that matter to them?
3. What part of this are you worried will land badly, or expect pushback on?

Ask for a couple of sentences each. The answers do double duty, giving you both the audience for the read-aloud test and the writing sample for the profile.

## Cross-person questionnaire

When the document owner is not the person running the skill and no profile exists, write a questionnaire file for them to send. Do not depend on the `to-questionnaire` skill, which blocks model invocation and may not be registered.

Write it to `deslop-style-questionnaire-<slug>.md` in the current directory, report the path, and stop until answers come back. Then build the profile from the answers exactly as if they had been given in the interview.

```markdown
# Style questionnaire for <name>

**Purpose.** <requester> is editing <document> and wants it to sound like you rather than like a language model. These questions are about the work, not about writing. Answer in a couple of sentences each, in whatever words come naturally. How you answer matters as much as what you answer.

**Takes about five minutes. Partial answers are useful.**

### Who is in the room or on the other end of this, and what do you want them doing differently afterward?

>

### What is the one thing you need them to remember a week later, and why does that matter to them?

>

### What part of this are you worried will land badly, or expect pushback on?

>

### Anything else about this audience we should know?

>
```

The instruction to answer naturally is deliberate. It is the only place the questionnaire mentions writing at all, and it stops short of asking about style, so the answers stay unguarded.

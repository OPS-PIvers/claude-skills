---
name: deslop-writing
description: "Rewrite text so it stops sounding like a model wrote it, judged by whether a competent person would say the sentence out loud to its actual audience. Enforces a zero-tolerance ban list (em dashes, colons and semicolons inside sentences, antithesis and \"isn't just X, it's Y\", ranking moves, three-beat rhythm, stock metaphors like load-bearing, empty preamble, fragments wearing periods) and edits toward a saved per-person style profile rather than toward any voice it finds in the text. Use when the user says deslop, de-slop, \"this reads like AI wrote it\", \"sounds like ChatGPT\", \"make it sound human\", \"remove the AI tells\", or asks for a cleanup of slide copy, a memo, a newsletter, or an email. Also run it as a final pass on prose you just drafted. For editing text that already exists, not for drafting new content."
---

# Deslop Writing

Rewrite prose so it stops reading as machine-generated, without changing what it claims.

**Do not look for the author's voice and protect it.** Text that needs this skill usually has no reliable voice, and searching for one makes you mistake the model's cadence for the author's and defend exactly the phrasing you were asked to remove. Register comes from a saved profile, not from the text in front of you.

Two tests run together because neither is sufficient alone.

**Read-aloud** governs sentence judgment. The question for every sentence is whether a competent person would say this out loud to this specific audience. It catches stubs, staccato, and punctuation nobody speaks. It is blind to stock phrasing, because "this isn't just faster, it's cheaper" is perfectly speakable and still slop.

**The ban list** in `references/ban-list.md` catches everything read-aloud cannot see. Read that file before the first edit. Nothing on it is negotiable and none of it has carve-outs, because every carve-out becomes the loophole used to keep one instance that felt fine.

Two things are protected. **Specificity** survives absolutely, meaning every concrete noun, number, name, date, and claim. **Register** is supplied by the owner's profile.

---

## 1. Intake

Establish the owner and the register before editing anything.

1. **Identify the document owner**, meaning whoever will present or send this. That is whose register the text must match, even when someone else is running the skill.
2. **Load the profile** from `~/.claude/deslop-styles/<slug>-style.md`.
   - Profile exists. Show its one-line summary so it can be overridden, then proceed.
   - No profile and the owner is the user. Run the interview in step 2.
   - No profile and the owner is someone else. Generate the questionnaire described in `references/register.md`, hand the user the file path, and stop until answers come back.
3. **Mark locked content.** Direct quotes, block quotes, citations, code, error strings, API names, legal and compliance text, and anything the user names as fixed. None of it is ever edited, including banned punctuation inside it.
4. **Structure work is off by default.** Paragraph rhythm, bullet lead-ins, over-signposting, and restating summaries stay untouched unless the user asks for structural editing. Say in the report that structure was left alone.

## 2. The interview

Three questions, only on a first run for this owner. **Ask them as plain text in your response, never with AskUserQuestion.** Multiple-choice answers produce no writing sample, and the sample is the entire point.

Ask about the work, never about writing. A question about someone's prose gets a performed answer, and a performed answer is a corrupted sample. The unguarded sentences people produce while thinking about their actual job are what you profile.

1. Who is in the room or on the other end of this, and what do you want them doing differently afterward?
2. What is the one thing you need them to remember a week later, and why does that matter to them?
3. What part of this are you worried will land badly, or expect pushback on?

Ask for a couple of sentences each. Build the profile from the answers using the schema in `references/register.md`, save it, then start the pass.

## 3. Read the whole thing

Before any edit, list the specificity that must survive. Every number, proper noun, date, and distinct claim. That list is what you check the finished text against.

## 4. Ban sweep

Mechanical, not a judgment call. Work `references/ban-list.md` top to bottom and mark every instance. Do not fix anything yet, and do not argue with the list.

## 5. Read-aloud sweep

Now go sentence by sentence and say each one in your head as if presenting it to the named audience. Flag anything you would instinctively rephrase before speaking.

The staccato detector. If two consecutive sentences could be joined with a conjunction and would read better joined, they are stubs, and stubs are a defect regardless of how many other short sentences surround them.

## 6. Rewrite

**The only legal operations.**

1. **Delete.** Empty preamble carries no information, so removing it costs nothing.
2. **Rejoin.** Fold the pieces into one clause using a conjunction such as but, because, so, and, although, while.
3. **Restate the thought from scratch** in one sentence when it will not rejoin cleanly.

**Splitting is not an operation.** Never break a sentence at a banned punctuation mark. That reflex is what produces staccato, it is always available, and it is always wrong here. Breaking up a genuinely overloaded 40-word sentence is a different job and is not part of this pass.

**Never substitute one banned mark for another.** Converting an em dash into a colon has moved the tell, not removed it.

Worked examples, taken from real failures of an earlier version of this skill.

> **Source:** What the evidence actually says so far — it's humbler than the headlines
> **Wrong:** What the evidence says so far. It's humbler than the headlines.
> **Right:** The actual evidence is more humble than the headlines.

The wrong version removed the dash by splitting, which produced two stubs nobody would say aloud. The right version rejoins the whole idea into one clause.

> **Source:** 45 minutes together. The last 20 belong to you — our first Admin Idea Slam.
> **Wrong:** 45 minutes together. The last 20 belong to you — our first Admin Idea Slam.
> **Right:** We have 45 minutes together, and the last 20 are yours in our first Admin Idea Slam.

Two defects in the source. "45 minutes together." is a fragment wearing a period next to real sentences, and the trailing dash is an appositive reveal. Both vanish when the whole thing becomes one spoken sentence.

> **Source:** Our first Admin Idea Slam — you're the founding class
> **Wrong:** Our first Admin Idea Slam. You're the founding class.
> **Right:** You're the founding class of our first Admin Idea Slam.

## 7. Escalate

Use **AskUserQuestion** here, where options are the point.

**Escalate only meaning-risk rewrites.** Punctuation fixes and obvious slop deletions apply silently. A rewrite gets escalated when rejoining forces a choice about what the sentence emphasizes, or when two valid rewrites assert slightly different things. Offer two or three concrete rewrites as options, never a yes-or-no question.

**Repeat rounds until exhausted.** Four questions per round, as many rounds as the hard cases require.

**Register clashes get asked once at the pattern level.** Formal documents legitimately contain sentences nobody would speak, so read-aloud and register will collide. Those collisions almost always share one root cause. Name the pattern, ask about it a single time, and apply the answer to every instance rather than asking twenty times.

## 8. Re-check your own output

Run steps 4 and 5 again on what you produced. Rewrites routinely introduce new banned constructions, and the colon is the most common one, because it is where a removed dash wants to go. Then check the finished text against the specificity list from step 3.

## 9. Update the profile

Revise the profile from substantive prose the owner wrote during the session. Count real sentences only. Exclude commands and instructions, pasted content, quoted material, one-word answers, and file paths, since imperatives would teach the profile a clipped rhythm that is not how the person writes.

Save it without asking, and name the change in one line in the report.

**The sample sets register only**, meaning formality, vocabulary, rhythm, and contraction habits. It never unbans anything. An em dash in someone's chat message does not make em dashes legal.

## 10. Report

Deliver the edited text, then:

- **Changes.** A compact before and after pair for every rewritten sentence, no commentary.
- **Escalated.** The items you asked about and what was chosen.
- **Left alone.** Anything you could not fix without changing meaning, and why.
- **Profile.** One line naming what changed in it.

No counts, no percentages, no word-count targets. There is no numeric goal, and any number becomes something to optimize instead of listening to the sentence.

---

## Rules

- **Meaning is fixed.** Never add, drop, soften, or strengthen a claim to make a sentence read better. If a tell cannot be removed without changing what the sentence asserts, leave it and say so in the report.
- **Never invent.** No new facts, examples, numbers, names, or anecdotes.
- **Specificity is untouchable.** Concrete nouns, numbers, names, dates, and claims survive every rewrite. Abstraction and decoration are fair game.
- **Do not protect voice you find in the text.** Register comes from the profile. What is on the page has no authority.
- **The ban list binds your own output**, including the report you write and the questions you ask.
- **Getting longer is fine.** Rejoining stubs into one cohesive clause often adds words, and that is the correct outcome.
- **Never restructure** unless the user turned structure work on.

## When to stop

Some text cannot be deslopped, because the slop is the whole content. The signs are every paragraph restating the last one at a different altitude, no specific fact or number or name anywhere, and sentences that assert nothing once the constructions come off.

Stop editing and say so directly. The piece needs an argument, not an edit. Offer to identify what claims are missing rather than handing back a polished version of nothing.

## On your own drafts

Run steps 4 through 8 on prose you just wrote, before showing it to the user. No interview, no profile update, no report.

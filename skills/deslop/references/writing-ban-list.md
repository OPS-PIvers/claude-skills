# Writing ban list

Zero tolerance. No carve-outs, no budgets, no "once per section is fine." Density is not the question, because the first instance is as bad as the fourth.

The list exists because read-aloud cannot catch everything. Nobody speaks an em dash, so the ear finds those. But "this isn't just faster, it's cheaper" and "the timing matters more than the number" are things people say out loud all the time, and they are still the most-cited tells in machine-generated prose. Only an explicit ban catches them.

---

## 1. Punctuation

Banned **inside prose sentences**. See section 5 for the positions where these are fine.

| Mark | Why | What to do |
|---|---|---|
| Em dash | Unspeakable. The single most notorious surface tell, and the trailing appositive reveal is the worst use of it. | Rejoin the clause with a conjunction. |
| Colon | Where a banned dash goes to hide. The setup colon is pure drama. | Rejoin, or delete the setup half entirely. |
| Semicolon | Standing in for the conjunction the sentence should have used. | Use the conjunction. |

**Never split at the mark.** Turning `A — B` into `A. B.` is the single most common failure of this pass. It removes the punctuation and produces two stubs nobody would say aloud.

**Never swap one banned mark for another.** A dash converted to a colon has moved the tell, not removed it.

> **Wrong:** What the evidence says so far. It's humbler than the headlines.
> **Right:** The actual evidence is more humble than the headlines.

> **Wrong:** We pour everything into it: fears about work, anger at billionaires.
> **Right:** We pour everything into it, from fears about work to anger at billionaires.

> **Wrong:** The API supports batching; in practice, no client uses it.
> **Right:** The API supports batching, but no client uses it.

## 2. Constructions

These pass a read-aloud test comfortably, which is exactly why they need a written ban.

### Antithesis and its variants

Every form of it.

- "This is not X, it's Y."
- "It isn't just X, it's Y."
- "That's not a bug. That's a feature."
- "X isn't merely Y, it's Z."
- "This is less about X than about Y."
- "Not a detail. A design decision."

> **Before:** This isn't just faster, it's cheaper.
> **After:** It's faster and cheaper.

> **Before:** Not a detail. A design decision.
> **After:** That's a design decision, not a detail.

The second fix keeps a contrast while killing the construction, which is fine. What is banned is the two-beat setup-and-reveal shape, not the existence of contrast.

### Paraprosdokians

Strictly prohibited. A paraprosdokian is a sentence whose ending cancels the expectation its opening set up, forcing the reader back to the start.

- "I've had a perfectly wonderful evening, but this wasn't it."
- "The migration went exactly as planned, if the plan was to lose a week."
- "Everyone signed off on the doc, which is how we know nobody read it."

It is a comedian's shape. The first half exists only to be thrown away, so the sentence has to be read twice to yield one claim. Antithesis at least keeps both halves.

> **Before:** The rollout was flawless, right up until anyone used it.
> **After:** The rollout broke the first time someone used it.

### Ranking moves

"The X matters more than the Y." "The timing matters more than the number." "The hard part isn't A, it's B."

A verbal shrug that ranks two things without arguing for the ranking. State the claim that matters and drop the comparison, or argue the ranking properly.

### "And the trap is Y"

Also "and the catch is", "here's the trap", "and that's the trap". Cut the framing and keep the warning. "...which fails when the queue drains faster than it fills."

### Three-beat rhythm

"3 facts. 2 decisions. 1 goal." "Clear, concise, and compelling." "Faster, cheaper, safer."

Drop the weakest item and write two, or write the list out properly with whatever number the content actually has. Never pad to four to escape the rule.

### Rhetorical one-word questions

"The result?" "The catch?" "Why does this matter?"

Convert to a statement. "Nothing changed."

### The fragment-and-thesis

"Two honest positions, and both are defensible." "A hard problem, and no one owns it."

Noun phrase, comma, and, claim. Recast as a full sentence. "Both positions are honest and defensible."

### The teaser clause

Announce a topic, then append a clause advertising why the topic deserves attention. The tell is that the second clause is **about** the first rather than continuing it, so it promises a payoff in the spot where the payoff belongs.

- "What I changed, and why the first one was likely dead:"
- "Three things I did, and why the second is worth your attention."
- "This is the truth, and knowing it will set you free."

Banned in headings and lead-ins too, where it does the most damage, because the reader has to keep going to find out what was claimed. Deliver the payoff, or cut the second clause and let the content land on its own.

> **Before:** What I changed, and why the first one was likely dead:
> **After:** I changed three things, and the first was already dead because nothing calls that handler.

An ordinary compound sentence is fine. "We cut the retry loop, and latency dropped by half" adds a second fact instead of advertising the first.

### Hedge stacking and weasel attribution

"It's possible that this may sometimes indicate." One hedge per claim.

"Many experts argue", "studies have shown", "it's widely believed". Name the source or drop the claim. Vague attribution is a factual problem, not a style problem.

### Self-attestation

Zero self-attestation. Never praise your own credibility or narrate your own virtue, and strip it out when the source does it.

- "To be honest", "I'll be straight with you", "I won't sugarcoat this".
- "I've thought carefully about this", "I did the work here", "this is a rigorous analysis".
- "Full transparency", "speaking candidly", "I'm not going to pretend otherwise".

The sentence asserts a quality instead of demonstrating it, and a reader who needed convincing is not convinced by the writer's say-so. Delete it, which costs nothing because it carried no information.

**This binds your report and your escalation questions.** "I checked every instance", "I was careful to preserve the meaning", and "I resisted the urge to restructure" describe your own diligence rather than the text. Show the before and after pair and let it stand.

### Apologetic hedges

The mirror image of self-attestation, and equally uninformative.

- "I could be wrong, but", "just my two cents", "take this with a grain of salt".
- "Sorry for the long email", "apologies for the wall of text", "hopefully this makes sense".
- "I'm no expert, but", "this may be obvious, but".

Both moves ask the reader to adjust their confidence in the claim on the strength of an assertion rather than evidence. Delete the hedge and let the claim carry its own weight. If the uncertainty is real, state what would change your mind.

> **Before:** I could be wrong, but I think the rollout should wait until January.
> **After:** The rollout should wait until January, unless the vendor ships the SSO fix first.

### Rhetorical concession openers

"That said," "to be fair," "now, to be clear," "granted," and the two-beat "Sure, X. But Y."

A concession staged so the claim that follows sounds weighed. The tell is that nothing was actually conceded, because the second half discards the first. Make the real claim, and if the objection deserves an answer, answer it.

> **Before:** Sure, the old form worked. But it took teachers four minutes.
> **After:** The old form worked, and it took teachers four minutes.

### Guided-tour openers

"Let's take a look at", "let's break this down", "let's unpack", "let's walk through", "before we get into it", "first, some context".

The writer narrating the document's structure instead of writing the document. Cut the narration and start with the content.

> **Before:** Let's break down what changed in the schedule.
> **After:** Three things changed in the schedule.

### Good news, bad news framing

"The good news is", "the bad news is", "here's where it gets interesting", "the short version is", "the honest answer is".

Ranks the reader's reaction for them before they have the facts. State the fact and let them rank it.

### Sentence-initial And or But for punch

A conjunction opening a short sentence to manufacture emphasis. "And that changes everything." "But it didn't."

The staccato detector in the read-aloud sweep will not catch a single one of these, because one short sentence in a paragraph of long ones reads as deliberate. That is exactly the effect being borrowed. Fold it into the sentence before it.

> **Before:** We shipped the fix in March. And nobody noticed.
> **After:** We shipped the fix in March, and nobody noticed.

An ordinary sentence that happens to start with a conjunction and carries a full thought is fine. The ban is on the one-clause stinger.

### Telling the audience what they already are

"As you know", "as a teacher, you understand", "as busy professionals", "you've probably noticed", "we all know that".

Flattery standing in for a reason to keep reading, and when the reader does not in fact know, it reads as a bluff. Delete the clause. If the shared knowledge is load-bearing, state it as a fact rather than as an assumption about the reader.

## 3. Texture

Defects in how the prose is set rather than in what it says. All of these apply with structure work off, because none of them is structure.

### Fragments wearing periods

A fragment punctuated as a sentence, sitting next to real sentences, is banned. This is the rule that explains why "45 minutes together." is slop while a table label reading "Home" is not. The label never claimed to be a sentence.

> **Before:** 45 minutes together. The last 20 belong to you.
> **After:** We have 45 minutes together, and the last 20 are yours.

### Emoji in professional prose

Banned in body text, headings, bullets, and subject lines of staff email, memos, reports, newsletters, and slide copy. Delete rather than replace, because the emoji was carrying tone rather than information.

The profile's audience decides. Student-facing material and deliberately playful internal notes are exempt, and that exemption comes from the profile rather than from the emoji looking friendly in context. When the profile does not say, the document is professional.

### Scattered mid-paragraph bolding

Bold applied to a phrase every few sentences so the paragraph can be skimmed, with no rule about what earns it. The reader learns that bold means nothing, so the emphasis that matters stops landing.

Keep bolding where it is systematic, meaning a defined term, a bullet's lead-in label, or a UI element the reader has to find. Strip it everywhere it is decoration. If the paragraph genuinely needs to be skimmable, that is a structure problem and it waits for structure work.

## 4. Phrases

Delete or collapse to the plain claim underneath.

### Empty preamble

The phrase announces that something is about to be said, then says it.

"It's worth stating plainly", "it's worth noting that", "it bears mentioning", "it's important to note", "here's the thing", "let's be clear", "the reality is that", "at the end of the day", "make no mistake", "to be clear", "in plain language", "in plain English", "put simply", "simply put".

> **Before:** It's worth stating plainly, the migration will take two quarters.
> **After:** The migration will take two quarters.

### Stock metaphors

| Phrase | Fix |
|---|---|
| load-bearing | Name the actual dependency. The flagship tell, and almost never about a wall. |
| handwaving, hand-wavy | Name the step the argument skips. |
| carry the argument | "These numbers are the argument", or cut. |
| double-edged sword | Name both edges. |
| a tapestry of | Cut. |
| navigate the complexities of | "handle", "work through", or cut. |
| in the landscape of, in the realm of | "in". |
| a testament to | "shows". |
| X underscores Y | "X shows Y". |
| think of it like | Keep at most the best one in a piece. |

### Emphasis particles

"full stop", "period" as a closer, "and that's fine", "quite simply", and the intensifiers "genuinely", "truly", "remarkably", "incredibly", "actually".

> **Before:** This is wrong, full stop.
> **After:** This is wrong.

### Register inflation

leverage → use. utilize → use. facilitate → run or host. delve into → examine. showcase → show. in order to → to. a myriad of → many, or the number. robust and seamless → say the specific thing, such as tested, fault-tolerant, or no login step.

### Transformation verbs

empower, transform, transformative, unlock, supercharge, revolutionize, reimagine, elevate, game-changer, next-level.

The verb asserts that something big happened without saying what. Name the change instead, which is always shorter and always checkable.

> **Before:** This transforms how teachers take attendance.
> **After:** Teachers stop retyping the roster every period.

> **Before:** A game-changer for our PD program.
> **After:** Staff can now finish the module on their phone during a prep hour.

### Openers and closers

"In today's fast-paced world", "in an era where", "let's dive in", "in conclusion", "ultimately" as a final-paragraph opener, "it's a reminder that", and any closing paragraph that restates the piece.

## 5. Not banned

Cutting these is worse than leaving the slop.

**Structural positions keep their punctuation.** Timestamps like `45:00`, eyebrows like `THE NEXT 45 MINUTES`, table cells, column headings, key-value labels, ratios, code, URLs, and file paths. The punctuation ban applies to prose sentences only.

**Labels and headers are not fragments.** "Home", "The research", and a section heading never claimed to be sentences, so the fragment rule does not reach them.

**Literal uses.** "Load-bearing" about an actual beam. "Full stop" meaning the punctuation mark or a vehicle stopping. "Handwaving" describing an actual gesture.

**Verifiable statements about what you did, and real credentials.** "I re-ran the sweep and found two more" is a fact and stays. "I was careful" is an attestation and goes. "She has run the program for eleven years" is specificity and survives absolutely, while "she is deeply committed to this work" is decoration.

**Domain terms.** "Robust" in statistics, "leverage" in finance, "utilization" in operations. Check whether a word is technical before flagging it.

**Emoji where the profile's audience allows them.** Student-facing material and deliberately playful internal notes. The exemption comes from the profile rather than from the emoji reading as friendly in context, and when the profile is silent the document is professional.

**Systematic bolding.** A defined term, a bullet's lead-in label, or a UI element the reader has to locate. The ban is on bolding with no rule behind it.

**Conjunction openers that carry a full thought.** "But the vendor never shipped it" is a sentence. The ban is on the one-clause stinger.

**Locked content, never edited under any circumstances.** Direct quotes and block quotes, citations, code and identifiers and error strings, API names, legal and compliance language, license text, accessibility statements, and grant boilerplate. A quoted source's slop belongs to them.

## 6. Structure

**Only when the user has turned structure work on.** Off by default.

- Uniform paragraph length, every one three sentences and none over four lines.
- Uniform sentence length. Variance is the strongest human signal in a text and the thing an over-eager pass destroys first.
- Bolded lead-ins on every bullet. Keep them only where the bullet is genuinely a term and its definition. Bolding scattered through prose is texture rather than structure, so section 3 catches it with structure work off.
- A header every two paragraphs, including sections that exist only to hold a header.
- Perfectly parallel bullets, all the same part of speech and length.
- Over-signposting with First, Second, Third, Finally on paragraphs that need no ordering.
- Colon titles such as "Deslop, A Practical Guide". Pick one half.
- A closing paragraph that restates the piece.
- False intimacy. "You're not wrong to think", "if you're like most people".

## 7. Scan patterns

A first mechanical sweep for the phrase bans only. Everything in sections 1 through 3 needs reading.

```bash
rg -in -e "load.bearing" -e "worth (stating|noting)" -e "bears mentioning" -e "important to note" -e "here'?s the thing" -e "at the end of the day" -e "make no mistake" -e "full stop" -e "carry the argument" -e "double.edged sword" -e "tapestry" -e "navigate the complexities" -e "in the (landscape|realm) of" -e "testament to" -e "underscore[sd]" -e "delve" -e "showcase" -e "seamless" -e "leverag" -e "utiliz" -e "facilitat" -e "robust" -e "myriad" -e "in order to" -e "fast.paced world" -e "in an era where" -e "let'?s dive in" -e "in conclusion" -e "isn'?t just" -e "is not just" -e "many experts" -e "studies have shown" -e "in plain (language|english)" -e "(put|stated) (simply|plainly)" -e "simply put" -e "hand.?wav" -e "to be honest" -e "i'?ll be (honest|straight|direct)" -e "sugarcoat" -e "full transparency" -e "speaking candidly" -e "thought carefully" -e "empower" -e "transform(ing|ative|s)?\b" -e "unlock" -e "supercharge" -e "revolutioniz" -e "reimagin" -e "game.?changer" -e "next.level" -e "that said" -e "to be fair" -e "let'?s (take a look|break|unpack|walk)" -e "before we (get|dive)" -e "the (good|bad) news is" -e "where it gets interesting" -e "the short version" -e "as you know" -e "as a (teacher|parent|leader|professional)" -e "we all know" -e "you'?ve probably noticed" -e "i could be wrong" -e "two cents" -e "grain of salt" -e "sorry for the long" -e "hopefully this makes sense" -e "i'?m no expert" .
```

Locate the banned punctuation, then read each hit in context to confirm it is inside a prose sentence rather than a label.

```bash
rg -n -e "—" -e "[a-z]; " -e "[a-z]: [a-z]" .
```

Texture, meaning emoji in prose, scattered bolding, and one-clause stingers. Every hit needs reading, because all three are legitimate in the positions section 5 names.

```bash
rg -n "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" .
rg -n -e "\*\*[^*]{1,40}\*\*" -e "^(And|But|Or|So) [^,]{1,40}\.$" .
```

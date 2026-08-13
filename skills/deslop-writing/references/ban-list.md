# Ban list

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

### Hedge stacking and weasel attribution

"It's possible that this may sometimes indicate." One hedge per claim.

"Many experts argue", "studies have shown", "it's widely believed". Name the source or drop the claim. Vague attribution is a factual problem, not a style problem.

## 3. Fragments wearing periods

A fragment punctuated as a sentence, sitting next to real sentences, is banned. This is the rule that explains why "45 minutes together." is slop while a table label reading "Home" is not. The label never claimed to be a sentence.

> **Before:** 45 minutes together. The last 20 belong to you.
> **After:** We have 45 minutes together, and the last 20 are yours.

## 4. Phrases

Delete or collapse to the plain claim underneath.

### Empty preamble

The phrase announces that something is about to be said, then says it.

"It's worth stating plainly", "it's worth noting that", "it bears mentioning", "it's important to note", "here's the thing", "let's be clear", "the reality is that", "at the end of the day", "make no mistake", "to be clear".

> **Before:** It's worth stating plainly, the migration will take two quarters.
> **After:** The migration will take two quarters.

### Stock metaphors

| Phrase | Fix |
|---|---|
| load-bearing | Name the actual dependency. The flagship tell, and almost never about a wall. |
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

### Openers and closers

"In today's fast-paced world", "in an era where", "let's dive in", "in conclusion", "ultimately" as a final-paragraph opener, "it's a reminder that", and any closing paragraph that restates the piece.

## 5. Not banned

Cutting these is worse than leaving the slop.

**Structural positions keep their punctuation.** Timestamps like `45:00`, eyebrows like `THE NEXT 45 MINUTES`, table cells, column headings, key-value labels, ratios, code, URLs, and file paths. The punctuation ban applies to prose sentences only.

**Labels and headers are not fragments.** "Home", "The research", and a section heading never claimed to be sentences, so the fragment rule does not reach them.

**Literal uses.** "Load-bearing" about an actual beam. "Full stop" meaning the punctuation mark or a vehicle stopping.

**Domain terms.** "Robust" in statistics, "leverage" in finance, "utilization" in operations. Check whether a word is technical before flagging it.

**Locked content, never edited under any circumstances.** Direct quotes and block quotes, citations, code and identifiers and error strings, API names, legal and compliance language, license text, accessibility statements, and grant boilerplate. A quoted source's slop belongs to them.

## 6. Structure

**Only when the user has turned structure work on.** Off by default.

- Uniform paragraph length, every one three sentences and none over four lines.
- Uniform sentence length. Variance is the strongest human signal in a text and the thing an over-eager pass destroys first.
- Bolded lead-ins on every bullet. Keep them only where the bullet is genuinely a term and its definition.
- A header every two paragraphs, including sections that exist only to hold a header.
- Perfectly parallel bullets, all the same part of speech and length.
- Over-signposting with First, Second, Third, Finally on paragraphs that need no ordering.
- Emoji headers, unless the format genuinely calls for them.
- Colon titles such as "Deslop, A Practical Guide". Pick one half.
- A closing paragraph that restates the piece.
- False intimacy. "You're not wrong to think", "if you're like most people".

## 7. Scan patterns

A first mechanical sweep for the phrase bans only. Everything in sections 1 through 3 needs reading.

```bash
rg -in -e "load.bearing" -e "worth (stating|noting)" -e "bears mentioning" -e "important to note" -e "here'?s the thing" -e "at the end of the day" -e "make no mistake" -e "full stop" -e "carry the argument" -e "double.edged sword" -e "tapestry" -e "navigate the complexities" -e "in the (landscape|realm) of" -e "testament to" -e "underscore[sd]" -e "delve" -e "showcase" -e "seamless" -e "leverag" -e "utiliz" -e "facilitat" -e "robust" -e "myriad" -e "in order to" -e "fast.paced world" -e "in an era where" -e "let'?s dive in" -e "in conclusion" -e "isn'?t just" -e "is not just" -e "many experts" -e "studies have shown" .
```

Locate the banned punctuation, then read each hit in context to confirm it is inside a prose sentence rather than a label.

```bash
rg -n -e "—" -e "[a-z]; " -e "[a-z]: [a-z]" .
```

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
- "Not just X, but also Y."
- "Not only X, but Y."

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
- "I won't pretend", "let's be honest", "if I'm being honest", "the honest truth is".
- Sentence-initial "Honestly," and sentence-initial "Look,".

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

### Negation chains

Two or more negated items in a row, whatever the negator. "No fluff, no filler, no jargon." "It didn't ask for a login, didn't phone home, didn't cache anything."

The chain sounds like a specification and contains none, because a list of absences never says what the thing is. Write what is there. "It reads the roster and writes a CSV."

> **Before:** No dashboards, no exports, no admin panel.
> **After:** The only screen is the roster, and it prints.

### The negated-verb echo

"Don't call it a migration. Call it a rewrite." A negated verb with "it", then the same verb again with the replacement.

The first half is a strawman the writer built to knock down, and the reader never held the position being corrected. Assert the second half alone. "It's a rewrite."

### The whole-point closer

Every form of it, and all of them are the same move.

- "That's the whole point." "This is the whole game." "That's the whole thing."
- "The simplicity is the whole trick." "Owning the data is the entire business model."
- "The entire point is that nobody has to ask."
- "Here's the whole pitch."

The sentence announces that what preceded it was significant instead of making it significant. Delete it, or replace it with the claim it was gesturing at.

> **Before:** Teachers never retype a name. That's the whole point.
> **After:** Teachers never retype a name.

### The stage-managed reveal

"Here's the twist." "Here's the catch." "Here's the kicker." "Here's the rub." "The punchline is." "The punchline?" "Here's the first example:"

The writer stepping in front of the content to promise that the next sentence is worth it. "Here's the thing" is banned under empty preamble for the same reason. Cut the announcement and let the next sentence arrive on its own.

> **Before:** Here's the kicker, the vendor had shipped the fix in March.
> **After:** The vendor had shipped the fix in March.

### "Turns out"

"Turns out the index was never used." "It turns out that nobody read the report."

A casual-revelation opener bolted to a tidy conclusion, and it fakes the feeling of an investigation the reader did not watch. State the finding, and say how you found it when that matters.

> **Before:** Turns out nobody reads the Friday email.
> **After:** Six of forty staff opened the Friday email last month.

### Gesturing instead of stating

The writer points at a favoured detail rather than naming it.

- "That's the part a counter can't reach." "The part that makes me trust the rest."
- "My favourite part of this is the queue."
- "The only marketing I trust." "The only thing it needs." "The only X that matters."

Both shapes ask the reader to accept a ranking on the writer's enthusiasm. Say what the part is and what it does.

> **Before:** That's the part that makes me trust the rest of it.
> **After:** Every write is logged with the row it changed, so a wrong number is traceable to a click.

### "Don't take my word for it"

"You don't have to take my word for it." "Don't take my word for any of this."

A stock invitation to verify that almost never comes with a way to verify. Give the reader the artifact instead, meaning the log, the file, the number, or the repository, and skip the invitation.

### The therapist's register

Reflective-voice moves that perform care in place of saying something.

- "Sit with that." "Sit with this for a moment." "Sit with the discomfort."
- "You already know what to do." "You already know."
- "That loss is real, and it's worth naming." "It's worth naming that the timeline slipped." "Worth naming:"
- "The frustration is real, and it isn't the whole story."
- "That's not nothing." "Which is not nothing."

The register belongs to a counselling session and imports its authority into writing that has not earned it. Name the thing directly and let the reader decide how to feel about it. "The timeline slipped by five weeks."

Skips: "real estate", "real time", "naming names", and any literal instruction to sit.

### "That's why X mattered"

"That's why being able to open the environment mattered." "This is why preserving every conversation mattered."

Significance assigned to an earlier passage retroactively, which is the whole-point closer wearing a past tense. Make the argument where the thing appears, or cut the sentence.

### Stranded auxiliary contrast

A clause that lands on a bare auxiliary so the reversal snaps. "The tool died, the data didn't." "Reading mostly passed. Writing didn't." "Maybe it wouldn't have."

It is antithesis compressed into a stub, and the semicolon version breaks the punctuation ban as well. Finish the verb.

> **Before:** The tool died; the data didn't.
> **After:** The tool died, and the data outlived it by four years.

### Participle sentence tails

A comma and a present participle bolted to the end of a sentence to supply commentary. "..., highlighting the need for oversight." Also underscoring, showcasing, reflecting, demonstrating, illustrating, emphasizing, and "further cementing".

The tail restates the sentence at a higher altitude and adds nothing checkable. Delete it, or make the observation a sentence with a subject that can be argued with.

> **Before:** Only six of forty staff opened it, highlighting the challenges of internal communication.
> **After:** Only six of forty staff opened it, so the policy change never reached the people it binds.

A participle that adds a new fact is fine. "..., taking the total to eleven" continues the sentence rather than summarizing it.

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

### Echoing sentence runs

Consecutive sentences built on the same skeleton with the nouns swapped. "A shopping cart is an object in the system. A chat room is an object in the system."

Deliberate anaphora is a real device and this is not it, because the repetition here is a template being filled rather than a point being pressed. Collapse the run into one sentence with a list, or rewrite each sentence to say the different thing it actually knows.

> **Before:** A shopping cart is an object in the system. A chat room is an object in the system.
> **After:** Carts and chat rooms are both objects in the system.

### Repeated sentence openers

Three or more consecutive sentences starting on the same word. "Maybe nobody needed it. Maybe it introduced a bug. Maybe a small convenience wasn't worth the dependency."

Pronouns and articles do not count, since "The server restarts" and "The queue drains" share nothing but grammar. Any other repeated opener is a rhythm the text fell into rather than chose. Vary the openers, or fold the run into one sentence.

### Stacked rhetorical questions

Two or more questions in a row, usually fragments after the first. "Do I know how it works? Where it breaks? Which corners it cut?"

Section 2 bans the single rhetorical one-word question, and a stack of them is the same defect performing harder. Convert the stack to the statement it is standing in for. "I know what it does and nothing about how it fails."

Real questions to a real reader survive, meaning a survey, an interview, an FAQ heading, and a question you go on to answer with facts.

### Colon into a triple

A colon opening onto three or more comma-separated items. "It needs three things: separate ports, processes, and local state."

The most common shape machine prose uses to sound concrete, and the colon is already banned inside prose sentences for its own reasons. Rejoin it, or set the items as a real list where the colon is a structural lead-in rather than a drum roll.

> **Before:** Each tenant gets the same three things: a port, a process, and local state.
> **After:** Each tenant gets its own port, process, and local state.

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

### AI vocabulary

Words machine prose leans on far harder than people do. One is a coincidence and several is a signature.

delve, tapestry, meticulous, pivotal, intricate, interplay, underscore, garner, bolster, vibrant, bustling, multifaceted, seamless, ever-evolving, myriad, realm, testament, showcase.

Replace with the plain word or the specific fact. Meticulous becomes what was actually checked. Pivotal becomes what changed because of it. Interplay becomes the relationship, named.

Domain uses survive per section 5, meaning interplay in physics and garner in a quoted source.

### Significance inflation

"Stands as a testament to." "Serves as a testament." "Serves as a reminder that." "Is a testament to." "Plays a crucial role in." Also plays a pivotal, vital, key, or significant role.

The sentence rates the importance of a thing instead of saying what the thing did. Say what it did.

> **Before:** The pilot plays a crucial role in the district's technology plan.
> **After:** The pilot decides whether the other eleven schools get Chromebooks in the fall.

### Scene-setting boilerplate

"In the ever-evolving landscape of." Also ever-changing and ever-shifting. "In today's fast-paced world." "In an era where." "As technology continues to advance."

A paragraph of throat-clearing before the subject arrives. Delete it and start with the subject.

### The challenges-and-outlook formula

"Despite these challenges." "The project faces several challenges." "Challenges remain." "It remains to be seen." "Only time will tell." "As the field continues to evolve."

The stock closing movement of a machine-written article, and it commits to nothing while sounding balanced. Name the specific obstacle and who has to clear it, or end the piece.

> **Before:** Challenges remain, but the outlook is promising.
> **After:** Nothing ships until the SSO vendor supports SAML, which they have promised for January.

### Promotional boilerplate

Travel-brochure tone in prose that is not a brochure. "Nestled in." "In the heart of." "A rich tapestry of." "Rich heritage." "A hidden gem." "Boasts a." "Breathtaking." "Stunning views." "A must-see."

Replace the adjective with the fact that would have produced it. Boasts becomes has. Hidden gem becomes what makes it good and who has not heard of it.

### Dev-blog boilerplate

"Small enough to fit in your head." "Small enough to hold in your head." "Batteries included." "It just works." "Zero config." "Sane defaults." "Blazing fast."

Claims about simplicity that carry no measurement, and every one of them appears in the README of software that does not deliver it. Give the number or the shape. "One file, no config file, and one command to run it."

### The obituary headline

"Peer code review is dead." "The resume is dead." Plus the sequel, "BOTD is dead, long live BOTD."

A prediction dressed as an announcement, and the piece underneath it always argues something narrower. Write the narrower claim as the headline.

> **Before:** Peer code review is dead.
> **After:** We stopped requiring a second approver on dependency bumps.

Literal uses survive. A dead process, a dead battery, and a dead link are all fine.

### Chatbot leftovers

Artifacts pasted straight out of a chat window, and every one is a hard delete rather than a rewrite.

- "As an AI language model." "As of my last update." "My knowledge cutoff." "I hope this helps!" "Certainly! Here's."
- Markup debris such as `oaicite`, `contentReference`, `turn0search`, and citation brackets that point at nothing.
- Tracking parameters on pasted links, meaning `utm_source=` and everything after it.

Their presence means the text was not read before it was shipped, so re-read the whole document rather than only deleting the marker.

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

**Literal and domain uses of the tic bans.** "Real estate" and "real time". "Naming names". A dead process, a dead battery, or a dead link. "Interplay" in physics and "garner" inside a quotation. An instruction to actually sit somewhere.

**Real questions.** A survey item, an interview question, an FAQ heading, and a question you answer with facts in the next sentence. The ban in section 3 is on questions asked to nobody.

**Colons that lead into a real list.** A lead-in above bulleted items is a structural position, so it keeps its colon. The ban is on the colon that opens onto three comma-separated items inside a sentence.

**Participles that add a fact.** "..., taking the total to eleven" continues the sentence. The ban is on the tail that summarizes the sentence it hangs off.

**Deliberate anaphora that argues.** Repetition survives when each repeated opener carries a different claim and the repetition is the argument. A template with the nouns swapped is not that, and section 3 catches it.

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

The rhetorical tics and the Wikipedia tells. Chains, echoes, and repeated openers are not greppable, so this block finds the fixed phrases only and sections 2 and 3 are read.

```bash
rg -in -e "that'?s the whole" -e "is the (whole|entire) (point|game|thing|trick|pitch|idea|story|business model)" -e "the (whole|entire) (point|game|pitch) is" -e "here'?s the whole" -e "sit with (that|this|it|the)" -e "you already know" -e "worth naming" -e "is real,? (and|but|not)" -e "not nothing" -e "the punchline" -e "here'?s the (twist|catch|kicker|rub|first)" -e "turns out" -e "that'?s the part" -e "favou?rite part" -e "the only .{1,20} (i trust|that matters|it needs)" -e "take my word for" -e "why .{1,30} mattered" -e "fit(s)? in your head" -e "hold in your head" -e "batteries included" -e "it just works" -e "zero.config" -e "sane defaults" -e "blazing fast" -e "is dead" -e "long live" -e "meticulous" -e "pivotal" -e "intricate" -e "interplay" -e "garner" -e "bolster" -e "vibrant" -e "bustling" -e "multifaceted" -e "ever.(evolving|changing|shifting)" -e "stands as a" -e "serves as a (testament|reminder)" -e "plays a (crucial|pivotal|vital|key|significant) role" -e "despite these challenges" -e "challenges remain" -e "faces several challenges" -e "remains to be seen" -e "time will tell" -e "continues to evolve" -e "nestled in" -e "in the heart of" -e "rich (tapestry|heritage)" -e "hidden gem" -e "boasts a" -e "breathtaking" -e "stunning views" -e "must.see" -e "as an ai (language )?model" -e "as of my last update" -e "knowledge cutoff" -e "i hope this helps" -e "oaicite" -e "contentReference" -e "turn0search" -e "utm_source=" -e ", (highlighting|underscoring|showcasing|reflecting|demonstrating|illustrating|emphasi[sz]ing)" -e "\b(don'?t|do not|never) (call|treat|think of) it\b" -e "^(no [a-z]+, ){1,}no " -e "(didn'?t|did not) [a-z]+,? (and )?(didn'?t|did not)" .
```

Negation chains, echoing runs, repeated openers, stacked questions, and colon triples need reading rather than grepping, since all five are shapes across sentences.

```bash
rg -n -e ": [^,\n]+, [^,\n]+, (and )?[^,\n]+" -e "\? [A-Z][^.?!]{0,60}\?" .
```

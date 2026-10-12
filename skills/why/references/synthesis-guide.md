# Synthesis guide

How to turn the investigators' findings into the final answer. You write this yourself, in the main conversation, after every investigator has returned. Produce a confidence-weighted, evidence-cited account that says honestly what the evidence supports, and just as honestly what it doesn't.

## Rules

Follow `epistemics.md` in full. The key rules:

1. Every claim sits in one tier: **Direct**, **Supported**, **Inferred**, **Speculative**, **Unknown**. The tier sets its section and its phrasing.
2. Every Direct or Supported claim has a citation (PR #, issue, doc link, message link, commit hash, or `file:line`).
3. Inferred and Speculative claims use hedged language ("appears to", "likely", "suggests", "one possibility is").
4. Never cite code as evidence for its own intent.
5. Document gaps. Don't fill them with plausible-sounding guesses.
6. Treat a hypothesis embedded in the user's question as a candidate, not a conclusion. Check it independently.

## Steps

1. **Read all findings** and weigh the evidence yourself. Investigators gathered raw evidence, not conclusions.
2. **Merge overlaps.** When several investigators cite the same PR, issue, or doc, give it one reference.
3. **Surface contradictions.** When two items disagree, show both. Don't pick one.
4. **Calibrate each claim.** Find its evidence and tier. Direct: cite and state plainly. Inferred: hedge and show the inference. Speculative: mark it. No evidence: put it in the gaps.
5. **Spot-check citations** you're unsure of by reading the code or calling the tool again. Don't propagate errors. Don't write files, commit, or change anything external.
6. **Don't overreach.** The user will act on this. Leave an open question open.

## Output format

### The question
Restate the question in one or two sentences.

### The code in question
File paths, line ranges, key symbols. Two or three lines to orient a cold reader.

### What we found
Claims with textual evidence, each quoted or paraphrased and cited:

- **[Direct]** {Claim}. Source: [PR #123](url) / issue / `file:line`. {Brief quote.}
- **[Supported]** {Claim}. Evidence: {each item and what it contributes}.

### What we can reasonably infer
Claims stated nowhere but supported by indirect evidence. Each makes the inference chain visible and uses hedged language:

- **[Inferred]** {Hedged claim}. Reasoning: {the evidence and the inference step}.

Skip if there's nothing to infer.

### Competing hypotheses
If the evidence fits several stories, present each:

- **Hypothesis:** {one sentence}
- **Evidence for:** {items}
- **Evidence against or missing:** {what would need to be true but isn't}

Skip if there's one clear answer.

### What we don't know
Specific gaps: "Searched GitHub issues for [query1], [query2] and found nothing about the 500 ms debounce", not "We don't know why." Include unanswered questions, empty searches, unavailable sources and why, and people who would likely know.

### Sources consulted
One line per category, so the user can judge coverage:

- **Source control:** {files}, {number of commits reviewed}, PRs #{numbers}, comments searched.
- **Issue tracker:** {issues and queries}. Or "Not searched. {reason}."
- **Long-form documents:** {docs and queries}. Or "Not searched. {reason}."
- **Conversations:** {threads, date ranges, queries}. Or "Not searched. {reason}."
- **Runtime and infrastructure:** {logs, metrics, config searched}. Or "Not searched. {reason}."
- **Error tracking:** {issues and releases searched}. Or "Not searched. {reason}."
- **Analytics and data:** {tables queried, time window, summary numbers}. Or "Not searched. {reason}."

### Confidence summary
One or two sentences on overall confidence, for example:

> The core rationale (A) is well supported by direct PR and issue evidence. The specific threshold (100) is inferred from context but not documented. Whether a user request drove it could not be answered; no email or chat connector was available.

## Check before presenting

Revise if any item fails:

1. Does every claim in "What we found" have a citation?
2. Is the phrasing tier-appropriate? Direct claims can say "because". Inferred claims cannot.
3. Did you surface every contradiction, or quietly pick one?
4. Does "What we don't know" name specific gaps? If it's empty, be suspicious.
5. Did you test the user's embedded hypothesis rather than rubber-stamp it?
6. Did you cite code as evidence for its own intent? Remove it.
7. Is the tone calibrated? A confident answer on weak evidence is the exact failure this skill exists to prevent.

The value of this output is its honesty, not its authority. A reader who takes it to the original author should know what's known, what's inferred, and what's missing, so they can ask the right follow-up questions.

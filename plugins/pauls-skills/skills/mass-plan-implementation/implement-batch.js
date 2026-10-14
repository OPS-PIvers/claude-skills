// Mass-implementation batch template: one PR per plan item, isolated worktrees, chunked.
// Adapt: PLAN_DOC, CONVENTIONS_DOCS, PROTECTED_FILES, VERIFY_CMDS, ITEMS (with per-item model).
// Keep: chunking (~3), worktree isolation, RESULT schema with `concerns`, and the
// CRITICAL-FINAL-STEP StructuredOutput instruction.

export const meta = {
  name: 'implement-batch',
  description: 'Implement selected plan items as PRs (one agent per item, worktree-isolated, chunked)',
  phases: [{ title: 'Implement' }],
}

// ── ADAPT THESE ──────────────────────────────────────────────────────────────
const PLAN_DOC = 'FEATURES_ROADMAP.md' // doc holding self-contained item briefs
const CONVENTIONS_DOCS = 'CLAUDE.md (and DESIGN.md before building any UI)'
const PROTECTED_FILES = 'firestore.rules, firestore.indexes.json, CI/deploy workflows' // orchestrator-owned; agents only report needs
const VERIFY_CMDS = '"pnpm lint" and "pnpm test" must BOTH pass (run them; fix failures)'
const REPO_RULES = '<bullet-worthy conventions: package manager, import style, money/date handling, atomic-write patterns, test colocation, zero lint/type suppressions, design-system rules>'

const ITEMS = [
  // { id: 'F-MONEY-02', slug: 'daily-spend-pace', model: 'sonnet', notes: '' },
  // { id: 'F-MONEY-06', slug: 'monthly-recap', model: 'opus', notes: 'suite-scale; ship as ONE coherent PR; defer rules changes to concerns' },
]
// ─────────────────────────────────────────────────────────────────────────────

const RESULT = {
  type: 'object',
  required: ['itemId', 'status', 'summary'],
  properties: {
    itemId: { type: 'string' },
    branch: { type: 'string' },
    prUrl: { type: 'string' },
    status: { type: 'string', enum: ['pr_opened', 'blocked', 'failed', 'skipped'] },
    summary: { type: 'string' },
    concerns: { type: 'string', description: 'deferred protected-file changes, product decisions made, risks; for status "blocked": the PRECISE question the orchestrator must answer' },
  },
}

function prompt(f) {
  return `You are implementing item ${f.id} from ${PLAN_DOC} (you are in an isolated git worktree of the repo).

Steps:
1. Read ${CONVENTIONS_DOCS} fully. Then read your item's full section in ${PLAN_DOC} (Grep for "${f.id}" and read the whole section including implementation notes and key files).
2. Owner notes for this item: ${f.notes || '(none — ready to implement as written)'}
3. Create a branch: feat/${f.id.toLowerCase()}-${f.slug} (from current HEAD, which is main). If the item turns out to be already shipped (check git log / existing code when in doubt), return status "skipped" with an explanation instead of duplicating it.
4. Install dependencies exactly as the repo prescribes before building.
5. Implement following ALL repo conventions: ${REPO_RULES}
6. If the item would require changes to ${PROTECTED_FILES}, do NOT make those changes — implement everything else and describe the exact needed change in your "concerns" output.
7. Verify: ${VERIFY_CMDS}.
8. Commit with a conventional-commit message. Write multiline text to a file in YOUR OWN worktree/scratchpad (never /tmp — it is shared across concurrent agents) and use "git commit -F <file>".
9. Push the branch and open a PR against main with "gh pr create --title ... --body-file <file>" (NEVER inline --body). PR body: what/why/how-verified. Do NOT merge the PR.
10. NEVER use "git stash" — the stash stack is shared across all worktrees.

ESCALATION RULE: if you hit a bump, barrier, or ambiguity you cannot resolve from the brief + the code, do NOT guess and do NOT silently shrink scope — return status 'blocked' with the PRECISE question in concerns; the orchestrator/advisor will answer and re-dispatch you. For an unrecoverable technical failure, still push what passes verification if coherent, otherwise return status 'failed' with details.

CRITICAL FINAL STEP: call the StructuredOutput tool with itemId, branch, prUrl, status ('pr_opened'|'blocked'|'failed'|'skipped'), summary (2-3 sentences), concerns. NEVER end without calling it.`
}

phase('Implement')
const results = []
const CHUNK = 3 // >3 concurrent implementers saturates the machine and hangs test runs
for (let i = 0; i < ITEMS.length; i += CHUNK) {
  const chunk = ITEMS.slice(i, i + CHUNK)
  log(`Implementing: ${chunk.map(f => f.id).join(', ')}`)
  const r = await parallel(chunk.map(f => () =>
    agent(prompt(f), { label: f.id, model: f.model || 'sonnet', isolation: 'worktree', schema: RESULT })))
  results.push(...r.filter(Boolean))
}
return { results }

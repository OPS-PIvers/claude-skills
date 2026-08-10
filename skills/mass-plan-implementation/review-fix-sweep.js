// Fix sweep template: apply orchestrator-adjudicated ADVERSARIAL-REVIEW findings to PRs.
// (Internal reviews only — this pipeline has zero reliance on external PR reviews.)
// Adapt: CONVENTIONS_DOCS, PROTECTED_FILES, PRS (each with its confirmed findings list).

export const meta = {
  name: 'review-fix-sweep',
  description: 'Apply confirmed adversarial-review findings to PRs (one fix agent per PR)',
  phases: [{ title: 'Fix' }],
}

// ── ADAPT THESE ──────────────────────────────────────────────────────────────
const CONVENTIONS_DOCS = 'CLAUDE.md'
const PROTECTED_FILES = 'firestore.rules, firestore.indexes.json'
const PRS = [
  // { pr: 909, findings: '<orchestrator-adjudicated findings: severity, file:line, summary, failure scenario, suggested fix — paste the confirmed list only, nits already discarded>' },
]
// ─────────────────────────────────────────────────────────────────────────────

const RESULT = {
  type: 'object',
  required: ['pr', 'status', 'summary'],
  properties: {
    pr: { type: 'number' },
    status: { type: 'string', enum: ['fixed_pushed', 'no_changes_needed', 'blocked', 'failed'] },
    summary: { type: 'string' },
    rejected: { type: 'string', description: 'findings disputed with evidence (orchestrator adjudicates), or empty' },
  },
}

function prompt(p) {
  return `You are fixing PR #${p.pr} based on confirmed adversarial-review findings (you are in an isolated git worktree currently on main).

Confirmed findings to address:
${p.findings}

Steps:
1. Read ${CONVENTIONS_DOCS} fully.
2. git fetch origin; branch=$(gh pr view ${p.pr} --json headRefName --jq .headRefName); git checkout $branch.
3. For EACH finding, verify it against the actual code first, then fix it properly (root cause, not a patch-over). If a finding turns out to be factually wrong when you inspect the code, do NOT apply a bogus fix — record it in "rejected" with your evidence; the orchestrator adjudicates.
4. Verify with lint + the test files related to your changes ONLY (do NOT run the full suite — it hangs under multi-agent load; CI is the authoritative gate). Add/extend a test when a finding was a real logic bug.
5. Commit ("fix(review): address adversarial-review findings on #${p.pr}", via git commit -F <file in your own worktree, never /tmp>) and push. Never git stash.
6. Do NOT merge the PR. Do NOT touch ${PROTECTED_FILES}.
7. ESCALATION RULE: if a finding cannot be fixed without a product decision or information you lack, return status 'blocked' with the precise question in summary.

CRITICAL FINAL STEP: call the StructuredOutput tool with pr, status ('fixed_pushed'|'no_changes_needed'|'blocked'|'failed'), summary, rejected. NEVER end without calling it.`
}

phase('Fix')
const results = []
for (let i = 0; i < PRS.length; i += 3) {
  const chunk = PRS.slice(i, i + 3)
  log(`Fixing PRs: ${chunk.map(p => p.pr).join(', ')}`)
  const r = await parallel(chunk.map(p => () =>
    agent(prompt(p), { label: `PR#${p.pr}`, model: 'sonnet', isolation: 'worktree', schema: RESULT })))
  results.push(...r.filter(Boolean))
}
return { results }

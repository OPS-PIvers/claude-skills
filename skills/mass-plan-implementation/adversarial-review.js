// Adversarial-review template: internal skeptic reviewers per completed PR.
// Replaces ALL external PR review. Adapt: CONVENTIONS_DOCS, LENSES (add 'security'
// for auth/rules/money-touching PRs), PRS (with the item brief each implements).
// Orchestrator adjudicates findings, dispatches fix agents (review-fix-sweep.js),
// and loops until a pass returns no blocking findings.

export const meta = {
  name: 'adversarial-review',
  description: 'Multi-lens adversarial review of completed PRs; refute, not bless',
  phases: [{ title: 'Review' }],
}

// ── ADAPT THESE ──────────────────────────────────────────────────────────────
const CONVENTIONS_DOCS = 'CLAUDE.md (and DESIGN.md for UI conventions)'
const PRS = [
  // { pr: 909, itemId: 'F-MONEY-02', brief: '<one-paragraph statement of what the item was supposed to do>', lenses: ['correctness', 'conventions'] },
  // add 'security' to lenses for anything touching auth, rules, or money math
]
// ─────────────────────────────────────────────────────────────────────────────

const LENS_CHARTERS = {
  correctness: 'Correctness & data integrity: wrong results, edge cases (empty/zero/negative/timezone/concurrent writes), broken invariants, partial writes that should be atomic, state that can drift or be clobbered by a stale client. Trace the actual data flow; do not trust names.',
  conventions: 'Conventions & integration: violations of the repo conventions doc, suppressed/bypassed lint or types, design-system drift, missing loading/error/empty states, interactions with existing features the diff forgot (nav, settings, mock/test providers, converters, listeners).',
  security: 'Security & abuse: privilege escalation, client-trusted values that must be server-validated, injection, secrets in code, rules/entitlement gaps the diff assumes but does not enforce.',
}

const FINDINGS = {
  type: 'object',
  required: ['pr', 'lens', 'verdict', 'findings'],
  properties: {
    pr: { type: 'number' },
    lens: { type: 'string' },
    verdict: { type: 'string', enum: ['approve', 'needs_fixes'], description: 'approve ONLY if you genuinely failed to refute it' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['severity', 'file', 'summary', 'failure_scenario'],
        properties: {
          severity: { type: 'string', enum: ['blocking', 'important', 'nit'] },
          file: { type: 'string', description: 'repo-relative path (with :line if possible)' },
          summary: { type: 'string' },
          failure_scenario: { type: 'string', description: 'concrete inputs/state -> wrong output/crash. No scenario = not a finding.' },
          suggested_fix: { type: 'string' },
        },
      },
    },
  },
}

const review = (p, lens) => `You are an ADVERSARIAL reviewer for PR #${p.pr} (item ${p.itemId}). Your job is to REFUTE this implementation, not to bless it. Assume it is broken until you fail to break it.

Lens — ${lens.toUpperCase()}: ${LENS_CHARTERS[lens]}

What the item was supposed to deliver: ${p.brief}

Steps:
1. Read ${CONVENTIONS_DOCS}. git fetch origin; check out the PR branch (gh pr view ${p.pr} --json headRefName).
2. Read the FULL diff (gh pr diff ${p.pr}) AND the surrounding code it plugs into — most real bugs live at the seam between the diff and existing code, not inside the diff.
3. Check the brief vs the diff: anything promised but silently missing or scope-shrunk is a BLOCKING finding.
4. Hunt through your lens. For every candidate finding, verify it against the actual code before reporting — a finding without a concrete failure_scenario is a nit at best.
5. You are read-only: do NOT modify, commit, or comment on the PR.

Severity: blocking = would ship a bug/regression/scope gap; important = should fix before merge but not dangerous; nit = do not report unless trivial and certain.

CRITICAL FINAL STEP: call the StructuredOutput tool with pr, lens, verdict, findings. An empty findings array with verdict "approve" is a legitimate result — but only after a genuine attempt to refute.`

phase('Review')
const results = await parallel(
  PRS.flatMap(p => p.lenses.map(lens => () =>
    agent(review(p, lens), { label: `review:${p.pr}:${lens}`, model: 'sonnet', effort: 'high', schema: FINDINGS })))
)

const clean = results.filter(Boolean)
return {
  reviewed: clean.length,
  needsFixes: clean.filter(r => r.verdict === 'needs_fixes').map(r => r.pr),
  results: clean,
}

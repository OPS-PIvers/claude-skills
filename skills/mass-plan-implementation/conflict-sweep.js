// Conflict-resolution sweep template: merge main into conflicting sibling PRs additively.
// Adapt: CONVENTIONS_DOCS, HOT_FILES, PROTECTED_FILES, PRS.

export const meta = {
  name: 'conflict-sweep',
  description: 'Resolve merge conflicts on remaining open PRs (merge main additively, push)',
  phases: [{ title: 'Resolve' }],
}

// ── ADAPT THESE ──────────────────────────────────────────────────────────────
const CONVENTIONS_DOCS = 'CLAUDE.md'
// Files that conflict on every sibling merge (type/schema hubs, context wiring, export barrels, settings lists):
const HOT_FILES = '<e.g. types/schema.ts, context type files, converter files, functions index exports, settings rows>'
const PROTECTED_FILES = '<orchestrator-owned files agents must not edit>'
const PRS = [] // conflicting PR numbers
// ─────────────────────────────────────────────────────────────────────────────

const RESULT = {
  type: 'object',
  required: ['pr', 'status', 'summary'],
  properties: {
    pr: { type: 'number' },
    status: { type: 'string', enum: ['pushed', 'failed', 'already_clean'] },
    summary: { type: 'string' },
  },
}

function prompt(n) {
  return `Resolve merge conflicts on PR #${n} (you are in an isolated git worktree currently on a recent main).

1. Read ${CONVENTIONS_DOCS}. git fetch origin; branch=$(gh pr view ${n} --json headRefName --jq .headRefName); git checkout $branch; git merge origin/main.
2. Resolve ALL conflicts ADDITIVELY — many sibling feature PRs were squash-merged recently, so conflicts are almost always both-sides-added imports/type-fields/wiring/menu-items: keep BOTH sides, ordered sensibly. For the known hot files (${HOT_FILES}): union of both sides. Never drop main's code; never drop the PR's feature.
3. If the SAME logical thing was implemented twice (true duplicate), prefer main's merged version and adapt the PR's code to build on it — note this in your summary.
4. Verify: install deps if needed, then lint MUST pass, plus targeted test files for the conflicted areas only. Do NOT run the full suite (it hangs under multi-agent load; CI is the authoritative gate).
5. Commit the merge (git commit -F <file in your own worktree, never /tmp>) and push. If main moved while you worked and a second "git merge origin/main" is needed, repeat quickly.
6. Do NOT merge the PR. Do NOT use git stash (shared stack). Do NOT edit ${PROTECTED_FILES}.

CRITICAL FINAL STEP: call the StructuredOutput tool with pr, status ('pushed'|'failed'|'already_clean'), summary (conflicted files + how resolved + what you verified). NEVER end without calling it.`
}

phase('Resolve')
const results = []
for (let i = 0; i < PRS.length; i += 3) {
  const chunk = PRS.slice(i, i + 3)
  log(`Resolving: ${chunk.join(', ')}`)
  const r = await parallel(chunk.map(n => () =>
    agent(prompt(n), { label: `PR#${n}`, model: 'sonnet', isolation: 'worktree', schema: RESULT })))
  results.push(...r.filter(Boolean))
}
return { results }

"""Windows-safe trigger eval: does `claude -p` call the Skill tool for a given skill?

Usage: python evals/trigger_eval.py <skill_dir> <evals.json> [runs] [model]

Example: python evals/trigger_eval.py plugins/ops-staff/skills/data-privacy evals/data-privacy/trigger-evals.json
Installs the skill into a throwaway project's .claude/skills/, runs each query,
and stops each run at the first tool call (or end of the reply).
"""
import json, os, shutil, subprocess, sys, tempfile, threading
from concurrent.futures import ThreadPoolExecutor

skill_dir, evals_path = sys.argv[1], sys.argv[2]
runs = int(sys.argv[3]) if len(sys.argv) > 3 else 2
model = sys.argv[4] if len(sys.argv) > 4 else "sonnet"
name = os.path.basename(os.path.normpath(skill_dir))

proj = tempfile.mkdtemp(prefix="trig-")
shutil.copytree(skill_dir, os.path.join(proj, ".claude", "skills", name))
env = {k: v for k, v in os.environ.items() if k != "CLAUDECODE"}


def run(query):
    p = subprocess.Popen(
        ["claude", "-p", query, "--output-format", "stream-json", "--verbose", "--model", model],
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, cwd=proj, env=env,
        text=True, encoding="utf-8", errors="replace")
    result = {"hit": False, "first_tool": None}
    timer = threading.Timer(90, p.kill); timer.start()
    try:
        for line in p.stdout:
            try:
                ev = json.loads(line)
            except ValueError:
                continue
            if ev.get("type") == "assistant":
                for c in ev["message"].get("content", []):
                    if c.get("type") == "tool_use":
                        inp = json.dumps(c.get("input", {}))
                        result["first_tool"] = c["name"]
                        result["hit"] = (c["name"] == "Skill" and name in inp) or (name in inp and "SKILL.md" in inp)
                        return result
            if ev.get("type") == "result":
                if "Failed to authenticate" in str(ev.get("result")):
                    raise SystemExit("claude CLI is signed out; run `claude auth login` and retry")
                return result
    finally:
        timer.cancel()
        if p.poll() is None:
            p.kill()
    return result


cases = json.load(open(evals_path, encoding="utf-8"))
jobs = [(i, c) for i, c in enumerate(cases) for _ in range(runs)]
with ThreadPoolExecutor(8) as ex:
    outs = list(ex.map(lambda j: (j[0], run(j[1]["query"])), jobs))

passed = 0
for i, c in enumerate(cases):
    hits = [o for k, o in outs if k == i]
    n = sum(o["hit"] for o in hits)
    ok = (n / len(hits) >= 0.5) == c["should_trigger"]
    passed += ok
    others = sorted({o["first_tool"] for o in hits if o["first_tool"] and not o["hit"]})
    print(f"{'PASS' if ok else 'FAIL'} {n}/{len(hits)} expect={'Y' if c['should_trigger'] else 'N'} "
          f"{c['query'][:70]!r}{' other:' + ','.join(others) if others else ''}")
print(f"\n{passed}/{len(cases)} passed  (model={model}, runs={runs})")
shutil.rmtree(proj, ignore_errors=True)

#!/bin/sh
# Fails if any SKILL.md frontmatter description contains "<".
# claude.ai rejects XML-like tags in skill descriptions and drops the skill on sync.
# Usage: check-skill-descriptions.sh [--staged] [files...]
#   --staged  read file contents from the git index (used by the pre-commit hook)
#   no files  checks every skills/*/SKILL.md

staged=0
if [ "$1" = "--staged" ]; then staged=1; shift; fi
[ $# -eq 0 ] && set -- skills/*/SKILL.md

status=0
for f in "$@"; do
  if [ $staged -eq 1 ]; then
    content=$(git show ":$f" 2>/dev/null) || continue
  else
    [ -f "$f" ] || continue
    content=$(cat "$f")
  fi
  # Print the description value, including folded/literal continuation lines.
  hits=$(printf '%s\n' "$content" | tr -d '\r' | awk '
    NR == 1 && $0 == "---" { fm = 1; next }
    !fm { exit }
    $0 == "---" { exit }
    /^description:/ { indesc = 1; sub(/^description:[ \t]*([>|][-+]?)?/, ""); if ($0 != "") print NR": "$0; next }
    indesc && /^[ \t]/ { print NR": "$0; next }
    { indesc = 0 }
  ' | grep '<')
  if [ -n "$hits" ]; then
    echo "error: $f: description contains '<' (claude.ai rejects XML tags in skill descriptions):" >&2
    printf '%s\n' "$hits" | sed 's/^/  line /' >&2
    status=1
  fi
done

[ $status -ne 0 ] && echo "Replace placeholders like <app> with {app} or APP." >&2
exit $status

#!/bin/sh
# Fails if any SKILL.md frontmatter description contains "<" or is over 1024 characters.
# claude.ai rejects XML-like tags in skill descriptions and drops the skill on sync.
# Usage: check-skill-descriptions.sh [--staged] [files...]
#   --staged  read file contents from the git index (used by the pre-commit hook)
#   no files  checks every plugins/*/skills/*/SKILL.md

staged=0
if [ "$1" = "--staged" ]; then staged=1; shift; fi
[ $# -eq 0 ] && set -- plugins/*/skills/*/SKILL.md

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
  # claude.ai cuts descriptions longer than 1024 characters and warns on sync.
  len=$(printf '%s\n' "$content" | tr -d '\r' | awk '
    NR == 1 && $0 == "---" { fm = 1; next }
    !fm { exit }
    $0 == "---" { exit }
    /^description:/ { indesc = 1; sub(/^description:[ \t]*([>|][-+]?)?[ \t]*/, ""); d = $0; next }
    indesc && /^[ \t]/ { sub(/^[ \t]+/, ""); d = (d == "" ? $0 : d " " $0); next }
    { indesc = 0 }
    END { if (d ~ /^".*"$/ || d ~ /^'\''.*'\''$/) d = substr(d, 2, length(d) - 2); print length(d) }
  ')
  if [ "${len:-0}" -gt 1024 ]; then
    echo "error: $f: description is $len characters (claude.ai allows at most 1024)" >&2
    status=1
  fi
done

[ $status -ne 0 ] && echo "Replace placeholders like <app> with {app} or APP, and keep descriptions to 1024 characters." >&2
exit $status

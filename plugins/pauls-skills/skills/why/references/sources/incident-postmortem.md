# Incident and postmortem context

Add this to an investigator's prompt when the target code looks defensive. Run these inside your own source only.

- **Source control:** commits with messages like "hotfix", "fix crash", "add guard", "revert", or a revert followed by "re-apply with...". Same-day merges with little review are a hotfix signal.
- **Issue tracker:** issues labeled `bug`, `incident`, `regression`, `urgent`, or titled with an error message.
- **Conversations:** threads around the commit date that mention outages, "down", "broken", "users can't", or the error string.
- **Runtime and error tracking:** a spike or first-seen date for the guarded error shortly before the change, and whether it stopped after.

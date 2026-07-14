---
name: repository-cartography
description: Map the actual Pixforme repository, routes, dependencies, persistence, integrations, and drift before planning reconstruction or assigning agents.
---
# Purpose
Produce an evidence-based map of current Pixforme code, not an ideal architecture.
# Trigger conditions
Use for baseline, broad scan, unfamiliar area, ownership planning, or stale-document audit.
# Required inputs
Repository root, task scope, current branch/status.
# Files that must be read
`AGENTS.md`, `package.json`, configs, `app/`, `lib/`, relevant `docs/`, schema/migrations, `prototype/README.md`, recent Git history.
# Allowed write scope
Repository maps and reconstruction documentation only.
# Procedure
Record dirty files; inventory source; enumerate pages/APIs and client/server boundaries; trace auth, workspace/project, report, media, map, payment, and AI state; compare docs/schema/types/runtime; cite evidence and uncertainty.
# Non-negotiable rules
Treat Next.js as production and `prototype/` as history. Do not infer deployed Supabase state from draft SQL. Do not refactor during mapping.
# Verification commands
`git status --short --branch`; `rg --files -g '!node_modules/**' -g '!.next/**'`; `git log -10 --oneline --stat`; `npm run lint`; `npx tsc --noEmit --pretty false`.
# Required artifacts
Route table, dependency/persistence map, drift list, risk updates, unresolved evidence gaps.
# Handoff contract
State snapshot commit, dirty paths, inspected areas, facts versus inference, and recommended owner.
# Failure and rollback procedure
If checkout/schema/runtime is unavailable, stop claims at the static boundary; remove only new mapping artifacts if rollback is requested.

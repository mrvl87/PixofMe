---
name: release-evidence
description: Assemble and verify Pixforme release evidence for commit identity, tests, migrations, environment, deployment, smoke checks, observability, and rollback.
---
# Purpose
Support a safe human go/no-go decision.
# Trigger conditions
Use before PR approval, staging/production release, migration deployment, or incident rollback.
# Required inputs
Release commit, scope/contracts, QA/security approvals, target environment, migration/env/rollback plan.
# Files that must be read
PR/issue, diff, quality gates, migrations, env example/config, runbooks and deployment logs.
# Allowed write scope
Release notes/evidence/runbooks and explicitly assigned deployment config.
# Procedure
Verify clean reviewed commit; run gates; identify artifacts/SBOM as available; confirm migration order/types; diff env names/modes; deploy only with authority; run smoke/health/observability; record rollback trigger/owner.
# Non-negotiable rules
No behavior fixes during final release review. No secret values in evidence. Human approval precedes merge/production.
# Verification commands
`git status --short --branch`; `git diff --check`; `npm run lint`; `npx tsc --noEmit --pretty false`; `npm run build`; migration list; approved browser smoke.
# Required artifacts
Commit/artifact identity, command results, approvals, migration/env plan, smoke/monitoring and rollback evidence.
# Handoff contract
Give human go/no-go summary, unresolved risks, exact rollback and post-release owner.
# Failure and rollback procedure
Stop release on failed/missing evidence; execute approved rollback only with authority and document resulting state.

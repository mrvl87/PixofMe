---
name: api-contract
description: Define and verify Pixforme API contracts for auth, workspace, reports, uploads, maps, billing, credits, and AI jobs.
---
# Purpose
Make route behavior explicit, validated, authorized, and retry-safe.
# Trigger conditions
Use before adding/changing any `app/api/**`, auth route, webhook, or client fetch payload.
# Required inputs
Approved product/domain contract, actor/tenant, idempotency and error requirements.
# Files that must be read
Affected route/callers, generated DB types/migrations, security register, provider contract.
# Allowed write scope
Assigned API contract, route, server library and tests.
# Procedure
Specify method/path/auth, request schema/limits, success/errors, tenant check, idempotency/concurrency, side effects/transaction, observability and negative tests; then implement.
# Non-negotiable rules
Validate server-side. Never trust browser amount/owner/status. Never return secrets/raw sensitive payloads.
# Verification commands
`rg -n "fetch\(|export async function (GET|POST|PATCH|DELETE)" app`; route tests; `npx tsc --noEmit --pretty false`; `npm run build`.
# Required artifacts
Contract, examples, error matrix, authorization/idempotency tests.
# Handoff contract
Version, consumers, auth/tenant rule, retry semantics, breaking changes and rollout.
# Failure and rollback procedure
Return stable error without partial side effects; version/escalate and restore prior behavior if incompatible.

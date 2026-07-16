---
name: ai-job-state-machine
description: Define and verify Pixforme asynchronous AI job states, retries, cancellation, OpenRouter/provider calls, credits, and media lineage.
---
# Purpose
Bound AI cost and make provider work recoverable and traceable.
# Trigger conditions
Use for AI Extend, geotag burn-in, watermark operations, queue/worker/provider integration.
# Required inputs
Job type, actor/media, model policy, credit estimate, retry/timeout/cancel rules.
# Files that must be read
AI job/ledger/media schema, environment contract, job APIs/workers, security register.
# Allowed write scope
Assigned AI routes/workers/adapters/tests and coordinated data contracts.
# Procedure
Validate actor/input; create job idempotently; reserve credit; queue; claim with lease; call provider server-side; persist usage/output lineage; finalize credit and terminal state; refund eligible failures; bound retries.
# Non-negotiable rules
No browser provider call, unreserved spend, terminal-state rewrite, or output without source/model/usage lineage.
# Verification commands
Transition table tests, duplicate submit, lease expiry, retry, timeout, cancel race, provider error, credit and media reconciliation.
# Required artifacts
State diagram, transition guards, retry matrix, cost/usage and lineage evidence.
# Handoff contract
Name job/version/model, idempotency, lease/retry, credit operations, privacy and incident owner.
# Failure and rollback procedure
Move to explicit failed/cancelled state and refund transactionally; quarantine ambiguous jobs for reconciliation.

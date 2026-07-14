# Title
Run heavy rendering and AI work in background workers

## Status
Proposed

## Context
Current report export is synchronous browser print and AI Extend is only a client flag. Future deterministic PDF and provider image operations can exceed request lifetimes, retry, and consume credits.

## Decision
Route handlers authenticate/validate and enqueue durable jobs. Workers claim jobs with leases, use explicit state transitions/idempotency, call render/AI providers, store artifacts/usage, and finalize or refund credits transactionally through domain contracts.

## Alternatives considered
- Synchronous route handlers: simple but vulnerable to timeouts/retries and duplicate spend.
- Browser execution: exposes secrets and cannot provide durable audit/recovery.
- Separate microservice immediately: unnecessary before worker load/operability evidence.

## Consequences
The product needs queue semantics, job status UI, observability, cancellation/retry and dead-letter recovery.

## Risks
Stuck leases, duplicate execution, provider ambiguity, queue cost, deployment mismatch and orphan artifacts.

## Follow-up actions
Select queue/runtime after load constraints are known; define job/lease/idempotency and credit contracts; add recovery tests.

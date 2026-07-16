---
name: database-transaction-design
description: Design atomic Pixforme Postgres transactions for project sync, report snapshots, payment settlement, credit ledger, and AI reservations.
---
# Purpose
Preserve invariants across retries, concurrency, and partial failures.
# Trigger conditions
Use when one command writes multiple rows/tables or external events can repeat/out-of-order.
# Required inputs
Domain invariants, state machine, idempotency key, concurrency requirements.
# Files that must be read
Migrations/types, APIs, RLS/grants, payment/AI/report contracts.
# Allowed write scope
Transaction contract, database function/migration/tests assigned by database owner.
# Procedure
Define preconditions; lock/compare version; assert tenant; reserve idempotency key; perform writes; derive balance/status; commit; define retry/compensation; test races.
# Non-negotiable rules
No direct credit balance update without ledger. No external call inside a long DB transaction. Constraints backstop code.
# Verification commands
Concurrent/replay SQL tests; constraint inspection; rollback injection tests.
# Required artifacts
Transaction SQL/pseudocode, invariants, uniqueness/locking choices, race/recovery tests.
# Handoff contract
Name caller, isolation, keys, error mapping, retry/compensation and observability.
# Failure and rollback procedure
Rollback on invariant failure; reconcile external effects through durable state, never manual balance edits.

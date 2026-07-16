---
name: credit-ledger
description: Design append-only Pixforme AI credit grant, purchase, reserve, usage, refund, and adjustment transactions with reconciled balances.
---
# Purpose
Make every credit unit auditable and safe under concurrency.
# Trigger conditions
Use for payment credits, AI reservations/spend/refunds, balance display, admin adjustment.
# Required inputs
Actor, reason/reference, amount, idempotency key, current transaction/state contract.
# Files that must be read
Ledger/profile/order/AI job schema and types, APIs, RLS/grants, payment and job contracts.
# Allowed write scope
Ledger transaction service/function/tests and coordinated migrations.
# Procedure
Define signed delta; unique reference/idempotency; lock account/derive balance; reject negative result; append immutable row with balance_after; update any cache atomically; reconcile aggregate versus ledger.
# Non-negotiable rules
No direct balance writes, deletion, or mutation of ledger history. Refund/adjustment is a new entry with actor/reason.
# Verification commands
Concurrent reserve, duplicate reference, insufficient balance, finalize/refund, payment replay and full reconciliation tests.
# Required artifacts
Ledger invariant, transaction contract, reconciliation query/report and audit fields.
# Handoff contract
List source types, keys, authorization, concurrency behavior, balance cache and repair procedure.
# Failure and rollback procedure
Rollback transaction; repair only with approved compensating entry and incident evidence.

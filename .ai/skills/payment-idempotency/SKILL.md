---
name: payment-idempotency
description: Design and test Pixforme Midtrans order creation, notification verification, reconciliation, and exactly-once ledger effects under duplicate/out-of-order delivery.
---
# Purpose
Prevent forged, duplicated, or orphaned value in Pixforme billing.
# Trigger conditions
Use for Snap token, orders, webhooks, settlement, refunds/chargebacks, or credit purchase.
# Required inputs
Offer/SKU, actor, provider mode/docs, order/event schema, ledger contract.
# Files that must be read
`app/api/midtrans/**`, billing migrations/types, `.env.example`, security register, provider contract.
# Allowed write scope
Assigned billing routes/services/tests and coordinated migrations.
# Procedure
Authenticate buyer; create DB order before Snap; compute amount server-side; verify signature and server status; persist raw event with unique key; lock order; validate transition/amount; post one ledger transaction; reconcile retries/out-of-order/refunds.
# Non-negotiable rules
Never trust browser or webhook alone. Production fails closed on sandbox/config mismatch. One provider event/order transition has at most one value effect.
# Verification commands
Sandbox plus forged signature, duplicate, concurrent, out-of-order, amount mismatch, unknown order, expiry, settlement, refund/chargeback tests.
# Required artifacts
State/transition table, idempotency keys, provider evidence, ledger reconciliation.
# Handoff contract
State mode, offer version, order/event keys, transitions, residual provider assumptions and rollback.
# Failure and rollback procedure
Return 2xx only per retry strategy after durable receipt; quarantine inconsistencies; reconcile via compensating ledger entry, never edit history.

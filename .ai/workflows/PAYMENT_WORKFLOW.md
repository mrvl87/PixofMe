# Payment Workflow

1. Issue/product contract defines authenticated buyer, immutable offer/SKU/amount, entitlement, expiry, refund and chargeback behavior.
2. Billing/security and database agents freeze order, provider-event and ledger transaction contracts.
3. Implement DB order creation before Snap; compute amount server-side; enforce sandbox/production mode.
4. Implement signature verification, durable event receipt, server reconciliation, transition validation and atomic idempotent ledger posting.
5. Test forged, replayed, duplicate, concurrent, out-of-order, unknown order, amount mismatch, expiry, settlement, denial, refund/chargeback.
6. Independent QA/security reproduce results; release evidence includes provider dashboard/webhook and rollback/incident plan.
7. Human approves production enablement.

Frontend may build status UI from frozen fixtures in parallel; it must wait for entitlement/API changes. Never enable payment with placeholder webhook or manual balance update.

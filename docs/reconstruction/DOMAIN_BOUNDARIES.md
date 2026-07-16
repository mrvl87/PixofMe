# Domain Boundaries

The target remains a modular monolith until scale evidence justifies extraction.

## Identity and Access

- **Responsibility:** authentication, session verification, profile identity, roles.
- **Owned data:** Supabase auth user, `profiles`; no credit balance mutation.
- **Owned behavior:** login, signup, callback, logout, authorization context.
- **Public contract:** `ActorContext { userId, role, sessionId }` and guarded auth APIs.
- **Prohibited dependencies:** report layout, payment status, workspace UI; never authorize from `user_metadata`.

## Workspace and Project

- **Responsibility:** tenant container, project lifecycle, reusable project/RAB settings.
- **Owned data:** `workspaces`, `projects`, `project_items`.
- **Owned behavior:** create/archive/select project; parse/synchronize project items.
- **Public contract:** owner-scoped project commands and immutable project/item identifiers.
- **Prohibited dependencies:** active browser selection as canonical lifecycle; direct credit/payment mutation.

## Report Authoring

- **Responsibility:** durable report aggregate and ordered report-photo composition.
- **Owned data:** `reports`, `report_photos`, references to project items and media IDs.
- **Owned behavior:** draft creation, edits, ordering, caption/progress, version checks.
- **Public contract:** versioned report draft/snapshot input for rendering.
- **Prohibited dependencies:** signed URLs as permanent data; renderer CSS internals; direct provider calls.

## Media Library

- **Responsibility:** verified file ingestion, metadata, derivatives, retention, access URLs.
- **Owned data:** `gallery_photos`, storage objects, checksums, lineage.
- **Owned behavior:** authorize, decode/re-encode, store, list, delete/retain, sign URLs.
- **Public contract:** stable media ID plus short-lived authorized delivery URL.
- **Prohibited dependencies:** report pagination, billing balance, public homepage upload without admin contract.

## Geospatial Metadata

- **Responsibility:** coordinates, display address provenance, provider usage/cost controls.
- **Owned data:** report-photo geotag records, geocode cache/usage.
- **Owned behavior:** coordinate validation, search/reverse geocode, manual/provider address selection.
- **Public contract:** validated WGS84 point and provenance-rich display address.
- **Prohibited dependencies:** media binary ownership, report styling, browser IP as the sole quota identity.

## Template and Rendering

- **Responsibility:** templates, pagination, immutable render inputs, deterministic PDF output.
- **Owned data:** template versions, preview settings, report snapshots, export artifacts.
- **Owned behavior:** paginate, render, verify page count/dimensions, store export evidence.
- **Public contract:** `ReportSnapshot + TemplateVersion -> RenderArtifact`.
- **Prohibited dependencies:** live mutable authoring rows during rendering; auth or credit mutations.

## Billing and Credits

- **Responsibility:** offers, orders, provider events, settlement, append-only credit ledger.
- **Owned data:** `billing_orders`, `billing_webhook_events`, `ai_credit_ledger`; derived balance.
- **Owned behavior:** create authenticated orders, verify/reconcile events, post idempotent ledger transactions.
- **Public contract:** order status and atomic reserve/finalize/refund operations.
- **Prohibited dependencies:** direct balance update without ledger entry; trusting browser/provider webhook payload alone.

## AI Processing

- **Responsibility:** queued AI work, provider abstraction, usage/cost accounting, output lineage.
- **Owned data:** `ai_jobs`, request/result metadata, provider usage, output media reference.
- **Owned behavior:** validate transition, reserve credit, execute, finalize/refund, retry safely.
- **Public contract:** submit/status/cancel by job ID with idempotency key.
- **Prohibited dependencies:** browser-to-OpenRouter calls; synchronous heavy work in request routes; unledgered spend.

## Allowed dependency direction

Identity is consumed by all command boundaries. Report Authoring may reference Workspace/Project and Media identifiers. Geospatial enriches a report-photo record through an authoring command. Rendering consumes snapshots only. AI Processing consumes Media and Billing/Credit contracts. Billing never depends on UI or rendering.

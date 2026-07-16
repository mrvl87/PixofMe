# Reconstruction Roadmap

Every milestone starts only after its dependencies and human-approved contracts are satisfied. Proposed ADRs are not authority until accepted.

## M0 — Security Freeze and Baseline

- **Objective:** prevent expansion of known high-risk surfaces and establish repository truth.
- **Scope:** registers, agent rules, source hierarchy, disable/restrict incomplete high-risk capabilities through separate issues.
- **Out of scope:** feature redesign, schema refactor, AI implementation.
- **Dependencies:** none.
- **Deliverables:** this baseline; SEC-001, SEC-002, AUTH-003, PAY-001 decisions; frozen prototype archive plan.
- **Risks:** docs drift; production exposure may predate fixes.
- **Exit criteria:** P0 paths are disabled or access-controlled, owner accepts baseline, no undocumented production payment claim.

## M1 — Engineering Foundation

- **Objective:** make changes reproducible, typed, testable, and reviewable.
- **Scope:** CI, ordered migrations, generated DB types, env schema, test harness, ADR process, RLS matrix.
- **Out of scope:** report persistence UI and new product capabilities.
- **Dependencies:** M0.
- **Deliverables:** migration baseline, CI gates, contract/test conventions, threat model.
- **Risks:** draft/live schema divergence; false confidence from static SQL.
- **Exit criteria:** clean checkout passes required gates; migrations reproduce schema; generated types have zero drift.

## M2 — Identity, Workspace, and Project

- **Objective:** create a secure tenant and project foundation.
- **Scope:** callback/logout/guard, project lifecycle, project items, active-selection semantics, tenant FKs.
- **Out of scope:** report snapshots and billing.
- **Dependencies:** M1 database/auth contracts.
- **Deliverables:** tested auth flow, workspace/project APIs, transactional project-item sync.
- **Risks:** session/callback regressions; project deletion data loss.
- **Exit criteria:** user A cannot access user B; project lifecycle is independent of browser active selection; RLS tests pass.

## M3 — Persistent Report Authoring

- **Objective:** replace localStorage as canonical report state.
- **Scope:** reports, ordered photo rows, geotags, preview settings, concurrency/versioning, draft migration path.
- **Out of scope:** deterministic server PDF and AI processing.
- **Dependencies:** M2 project/media identifiers; accepted snapshot ADR.
- **Deliverables:** report commands/queries, autosave/recovery, versioned snapshot producer.
- **Risks:** local draft loss and concurrent edits.
- **Exit criteria:** refresh/device change preserves report; stale writes are detected; export input is immutable.

## M4 — Media and Geospatial Pipeline

- **Objective:** secure, traceable media ingestion and cost-aware geospatial metadata.
- **Scope:** file verification, derivatives, signed URL lifecycle, metadata backfill, durable geocode quotas/cache.
- **Out of scope:** AI image transforms and report renderer.
- **Dependencies:** M1 storage/RLS base; M2/M3 ownership contracts.
- **Deliverables:** verified upload service, media lineage, geospatial usage records.
- **Risks:** storage migration cost; provider limits; EXIF privacy.
- **Exit criteria:** malformed files rejected, tenant paths tested, URL expiry handled, provider usage observable.

## M5 — Report Engine and Deterministic PDF

- **Objective:** render repeatable, reviewable report artifacts.
- **Scope:** versioned templates/snapshots, pagination engine, worker renderer, golden PDFs/images, export records.
- **Out of scope:** billing and AI.
- **Dependencies:** M3 snapshots; M4 media delivery.
- **Deliverables:** renderer contract, golden suite, stored export evidence.
- **Risks:** font/browser nondeterminism; A4/F4 differences.
- **Exit criteria:** identical snapshot/template produces accepted stable pages; page count/layout tests pass.

## M6 — Billing and Credit Ledger

- **Objective:** safely accept payment and maintain auditable credits.
- **Scope:** authenticated offers/orders, Midtrans verification/reconciliation, idempotent webhooks, append-only ledger.
- **Out of scope:** AI provider execution.
- **Dependencies:** M1 transactions/security, M2 identity.
- **Deliverables:** order state machine, provider event store, atomic ledger procedures.
- **Risks:** duplicate/out-of-order events; refunds/chargebacks.
- **Exit criteria:** replay tests cannot double-credit; balance equals ledger; sandbox evidence and rollback exist.

## M7 — AI Job Platform

- **Objective:** run costly AI operations asynchronously with bounded spend.
- **Scope:** job state machine, OpenRouter/provider wrapper, credit reserve/finalize/refund, retries, lineage.
- **Out of scope:** unlimited synchronous client calls.
- **Dependencies:** M4 media, M6 ledger, proposed worker ADR accepted.
- **Deliverables:** queue/worker, job API, cost/usage records, failure recovery.
- **Risks:** provider variability, abandoned jobs, cost overruns.
- **Exit criteria:** every call has actor, job, model, cost, credit transaction, and output lineage; retries are idempotent.

## M8 — Production Hardening

- **Objective:** meet operational release standards.
- **Scope:** observability, backups/restore drill, performance/accessibility, abuse controls, incident/rollback playbooks, URL cleanup.
- **Out of scope:** speculative new features.
- **Dependencies:** M0-M7 relevant feature completion.
- **Deliverables:** SLOs, alerts, runbooks, release evidence pack.
- **Risks:** hidden provider and data-volume assumptions.
- **Exit criteria:** security/QA/release sign-offs are independent; restore and rollback drills pass; human approves launch.

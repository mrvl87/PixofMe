# Initial Reconstruction Backlog

## SEC-001 — Restrict homepage asset upload

- **Severity:** P0 Critical
- **Owner agent:** billing-security-agent
- **Required skills:** security-threat-model, api-contract, media-storage-lifecycle
- **Dependencies:** M0 baseline
- **Scope:** deny homepage upload kinds unless actor has approved admin authorization; audit attempts.
- **Acceptance criteria:** ordinary authenticated users receive 403 and cannot write public homepage buckets; authorized admin path is server-verified.
- **Verification:** API tests for anonymous/user/admin and storage object inspection.
- **Target milestone:** M0

## SEC-002 — Validate auth callback redirects

- **Severity:** P1 High
- **Owner agent:** backend-api-agent
- **Required skills:** security-threat-model, api-contract
- **Dependencies:** approved redirect allowlist
- **Scope:** allow safe same-origin application paths only.
- **Acceptance criteria:** external, protocol-relative, encoded, and malformed destinations fall back to workspace.
- **Verification:** callback route table tests.
- **Target milestone:** M0

## AUTH-003 — Replace logout anchor with POST flow

- **Severity:** P2 Medium
- **Owner agent:** frontend-ui-agent
- **Required skills:** nextjs-boundary-review, browser-verification
- **Dependencies:** logout API contract
- **Scope:** replace GET anchor with accessible POST action.
- **Acceptance criteria:** logout clears session, redirects, and cannot mutate through GET.
- **Verification:** browser and route method tests.
- **Target milestone:** M0

## PAY-001 — Disable incomplete production payment flow

- **Severity:** P0 Critical
- **Owner agent:** billing-security-agent
- **Required skills:** payment-idempotency, security-threat-model
- **Dependencies:** product decision on sandbox visibility
- **Scope:** prevent production use of unauthenticated/unpersisted Snap flow.
- **Acceptance criteria:** production fails closed; sandbox is visibly labeled and gated.
- **Verification:** env-mode route tests and browser evidence.
- **Target milestone:** M0

## DB-001 — Convert schema draft into migrations

- **Severity:** P1 High
- **Owner agent:** database-rls-agent
- **Required skills:** supabase-migration, supabase-rls-review
- **Dependencies:** live-schema inventory and backup plan
- **Scope:** ordered baseline migration and generated types.
- **Acceptance criteria:** empty DB reproduces schema; migration list and generated types match.
- **Verification:** reset/migrate/type generation/advisors.
- **Target milestone:** M1

## DB-002 — Add owner-bound composite foreign keys

- **Severity:** P1 High
- **Owner agent:** database-rls-agent
- **Required skills:** domain-modeling, supabase-migration, supabase-rls-review
- **Dependencies:** DB-001
- **Scope:** bind owner on geotag, preview, export, AI/media references and any other tenant edge.
- **Acceptance criteria:** cross-owner references fail at DB constraint level.
- **Verification:** user-A/user-B SQL tests.
- **Target milestone:** M1

## ENG-001 — Add CI and test quality gates

- **Severity:** P1 High
- **Owner agent:** release-agent
- **Required skills:** release-evidence, browser-verification
- **Dependencies:** test-tool decision
- **Scope:** lint, typecheck, build, unit/contract/browser gates.
- **Acceptance criteria:** required checks run on pull requests and block failures.
- **Verification:** green run plus intentional failing sample on branch.
- **Target milestone:** M1

## ARCH-001 — Freeze prototype-v1

- **Severity:** P2 Medium
- **Owner agent:** architecture-agent
- **Required skills:** repository-cartography, architecture-adr
- **Dependencies:** acknowledge existing dirty prototype change before snapshot
- **Scope:** archive manifest and rule that production does not import prototype.
- **Acceptance criteria:** exact prototype snapshot is identifiable; docs mark it historical.
- **Verification:** manifest/hash check and dependency search.
- **Target milestone:** M1

## ARCH-002 — Split pixforme.tsx by domain

- **Severity:** P1 High
- **Owner agent:** architecture-agent
- **Required skills:** domain-modeling, nextjs-boundary-review
- **Dependencies:** product/API contracts; M1 test baseline
- **Scope:** extract modules without behavior change.
- **Acceptance criteria:** public/auth/workspace/authoring/map/render boundaries are explicit and behavior evidence is unchanged.
- **Verification:** typecheck, lint, build, browser regression suite.
- **Target milestone:** M1/M2

## PROJECT-001 — Separate project lifecycle from active selection

- **Severity:** P1 High
- **Owner agent:** backend-api-agent
- **Required skills:** product-contract, api-contract, database-transaction-design
- **Dependencies:** DB-001, M2 contract
- **Scope:** project status/lifecycle independent of browser selection.
- **Acceptance criteria:** selecting a project does not silently rewrite lifecycle status; only owner can mutate.
- **Verification:** API/DB/browser tests.
- **Target milestone:** M2

## REPORT-001 — Persist report entity

- **Severity:** P1 High
- **Owner agent:** backend-api-agent
- **Required skills:** domain-modeling, api-contract, database-transaction-design
- **Dependencies:** DB-001, PROJECT-001
- **Scope:** durable report aggregate, ordered photos, geotags, settings, concurrency.
- **Acceptance criteria:** refresh/new device restores report; stale writes are rejected or merged explicitly.
- **Verification:** integration and browser recovery tests.
- **Target milestone:** M3

## EXPORT-001 — Define report snapshot and renderer contract

- **Severity:** P1 High
- **Owner agent:** report-engine-agent
- **Required skills:** report-pagination, report-golden-testing, architecture-adr
- **Dependencies:** REPORT-001 model
- **Scope:** immutable snapshot/template/render artifact contract.
- **Acceptance criteria:** renderer input is versioned, complete, independent from mutable UI state.
- **Verification:** contract fixtures and golden cases.
- **Target milestone:** M3/M5

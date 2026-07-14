# Pixforme Agent Instructions

## 1. Product summary

Pixforme helps Indonesian contractors and institutions build photo-based project reports: authenticate, select a workspace/project, define report metadata, upload/order/caption/geotag photos, preview templates, and export. Next.js is the application; `prototype/` is archived design history.

## 2. Source-of-truth hierarchy

1. Approved product specification and acceptance criteria
2. Architecture Decision Records
3. Database migrations and generated database types
4. API/domain contracts
5. Production implementation
6. Archived prototype references
7. Chat history

Chat is coordination only and must never become a permanent decision source. Persist decisions in contracts, ADRs, migrations, or repository documentation.

## 3. Repository map

- `app/`: Next.js pages and route handlers; `app/pixforme.tsx` is the current coupled client implementation.
- `lib/`: auth, environment, maps, Supabase clients/types.
- `docs/reconstruction/`: current baseline, risks, roadmap, gates, backlog.
- `docs/adr/`: proposed/accepted architecture decisions.
- `docs/SUPABASE_SCHEMA.sql`: legacy draft, not migration authority.
- `prototype/`: archived historical reference; never import into production.
- `.ai/agents`, `.ai/skills`, `.ai/workflows`: agent ownership and procedures.
- `.github/`: issue and pull request contracts.

## 4. Architectural principles

- Use a modular monolith with explicit domain contracts until measured scale requires extraction.
- Keep server authorization and secrets outside client components.
- Treat database state as canonical; localStorage may be an explicitly recoverable cache only.
- Pass immutable, versioned snapshots to rendering and background jobs.
- Prefer idempotent commands, append-only financial records, stable identifiers, and explicit state machines.
- Record reasons, alternatives, trade-offs, consequences, and rollback for boundary decisions.

## 5. Security rules

- Fail closed for auth, tenant access, upload kinds, payment mode, webhooks, and AI credit checks.
- Never expose or log service-role, Midtrans server, OpenRouter, or provider secrets.
- Verify the actor in every route/action; proxy/middleware is never the sole authorization gate.
- Re-check tenant ownership immediately before privileged/service-role operations.
- Validate redirect destinations, request origin policy, content type, size, magic bytes, decoded pixels, and IDs.
- Do not trust browser totals, SKU/amount, file metadata, user metadata roles, or webhook status.
- Do not enable production payment or AI paths while related P0 findings remain open.

## 6. Database rules

- Use ordered migrations; never rewrite applied migrations or apply the draft SQL ad hoc.
- Generate database types after schema changes and fail CI on drift.
- Enable and test RLS on every exposed table; test anonymous, user A, user B, service role.
- Use owner-bound composite foreign keys for every cross-tenant relationship.
- Financial balance changes require one atomic append-only ledger transaction; no direct balance mutation.
- Plan backfills, locks, indexes, constraints, rollback/forward-fix, and deployed-schema compatibility.

## 7. UI rules

- Implement approved product contracts; do not redesign from chat or archived prototype.
- Preserve behavior unless the issue explicitly changes it.
- Provide loading, empty, error, and success states; keyboard/focus/accessibility are acceptance criteria.
- Keep client boundaries small and do not fetch provider secrets or call OpenRouter directly from the browser.
- Report preview changes require physical-page and browser evidence, not screenshots alone.

## 8. Testing rules

- Minimum PR checks: `git diff --check`, `npm run lint`, `npx tsc --noEmit --pretty false`, `npm run build`.
- Add unit/contract/integration/browser/golden tests according to risk.
- Payment tests include replay, duplicate, out-of-order, forged, refund, and reconciliation cases.
- RLS tests prove cross-tenant denial. Report tests cover A4/F4, orientation, page boundaries, long content, and fonts.
- Record failures verbatim; do not hide unrelated failures by opportunistic fixes.

## 9. Documentation rules

- Cite repository files/areas and distinguish current behavior from target design.
- Update contracts/ADRs/registers when a decision changes; do not copy stale prototype claims.
- ADR status begins `Proposed`; only a human-approved process may mark it `Accepted`.
- Document env/migration/security/rollback consequences without storing credentials.

## 10. Branch and pull request rules

- Work from an issue on a focused `codex/<issue>-<slug>` branch unless directed otherwise.
- One logical scope per PR; link issue, contracts, evidence, migrations, rollback, limitations, and handoff.
- Preserve unrelated dirty changes. Do not commit generated secrets, `.env.local`, build output, or user artifacts.
- Do not commit/push/merge without explicit authorization. Human approval is required before merge/release.

## 11. Prohibited actions

- Do not delete files, rewrite history, reset user work, or edit outside owned paths without approval.
- Do not treat `prototype/` or chat as production authority.
- Do not change schema, RLS, auth, payment, credits, or shared contracts from a frontend/report-only task.
- Do not self-approve implementation; QA must not silently fix audited code; release must not change behavior.
- Do not use service role to bypass an unresolved authorization design.

## 12. Required verification

Read the issue, relevant contracts/ADRs, owned paths, adjacent tests, and `docs/reconstruction/SECURITY_REGISTER.md`. Run the gates in `docs/reconstruction/QUALITY_GATES.md`. Verify runtime behavior in a browser for UI changes and live/local database behavior for migrations/RLS. Include exact commands/results and explain any skipped gate.

## 13. Definition of done

Scope and out-of-scope are honored; acceptance criteria pass; contracts and docs are current; independent QA/security reviews are resolved; migrations/env/rollback are documented; no unrelated changes or secrets exist; release evidence is complete; human approval is obtained where required.

## 14. Agent handoff protocol

Handoff must include issue, branch/commit, owned/modified paths, source-of-truth artifacts, decisions, unresolved questions, exact verification results, risk/security findings, migrations/env changes, rollback, and the named next agent. The receiver re-verifies evidence and never assumes a previous agent's self-approval is final.

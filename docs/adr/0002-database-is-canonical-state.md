# Title
Use the database as canonical application state

## Status
Proposed

## Context
The active Pixforme report draft, photo order/captions/geotags, and preview settings are stored under `pixforme.prototype.wizard.v3` in browser `localStorage`. Supabase tables for these concepts exist only in a draft SQL file and are not used end to end.

## Decision
Persist identity, workspace, project, report aggregates, media references, geotags, preview settings, billing, credits, and AI jobs in migration-backed Postgres. Browser storage may cache an explicitly versioned draft and recovery token, but it cannot define canonical lifecycle or financial state.

## Alternatives considered
- Keep localStorage canonical: simple/offline but loses multi-device integrity and auditability.
- Client-side sync without concurrency/version contract: hides conflicts and data loss.
- Document database: flexible, but Postgres relationships/RLS/transactions match tenant and ledger needs.

## Consequences
APIs need report commands/queries, optimistic concurrency and offline/recovery policy. Migrations and generated types become release artifacts.

## Risks
Autosave latency, conflicting edits, migration of existing local drafts, and temporary dual-write complexity.

## Follow-up actions
Complete DB-001/DB-002 and REPORT-001; define draft import, version column and recovery UX.

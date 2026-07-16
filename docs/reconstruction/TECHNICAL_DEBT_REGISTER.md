# Technical Debt Register

| ID | Severity | Domain | Finding | Evidence | Impact | Recommended action | Target milestone | Status |
|---|---|---|---|---|---|---|---|---|
| TD-001 | P1 High | Report Authoring | Active report data is stored in `localStorage` rather than `reports` tables. | `app/pixforme.tsx` `STORAGE_KEY`; unused report tables in `docs/SUPABASE_SCHEMA.sql` | Data loss, no multi-device work, no auditability | Persist report aggregate with optimistic concurrency. | M3 | Open |
| TD-002 | P1 High | Architecture | Public UI, auth, workspace, wizard, maps, and renderer share one client file. | `app/pixforme.tsx` (1,600+ lines) | High coupling and unsafe change surface | Split by domain after contracts are approved. | M1/M2 | Open |
| TD-003 | P1 High | Database | SQL exists as a mutable draft, not ordered migrations. | `docs/SUPABASE_SCHEMA.sql`; no `supabase/migrations/` | Environments cannot be reproduced safely | Freeze draft, establish migration baseline and generated types. | M1 | Open |
| TD-004 | P1 High | Billing | Snap order is neither authenticated nor persisted. | `app/api/midtrans/snap-token/route.ts` | Orders cannot be reconciled or credited safely | Create server-owned order lifecycle before enabling payment. | M6 | Open |
| TD-005 | P1 High | Report Engine | PDF is browser print output without snapshot/version contract. | `WizardStep4Page.exportPdf()` | Non-deterministic output and weak audit trail | Version report snapshots and move deterministic rendering to a worker. | M5 | Open |
| TD-006 | P2 Medium | Types | Database types are handwritten and incomplete. | `lib/supabase/database.types.ts`; `report_exports` absent | Runtime/schema drift can compile cleanly | Generate types in CI after migrations. | M1 | Open |
| TD-007 | P2 Medium | Project | RAB text is persisted, but parsed `project_items` are not synchronized. | `WizardStep1Page`; `projects.rab_text`; unused `project_items` | Report references remain free-text and unstable | Define project-item sync transaction. | M2 | Open |
| TD-008 | P2 Medium | Geospatial | Rate limits/cache are process memory and keyed primarily by IP. | `lib/map-cost-control.ts` | Limits reset on cold starts and differ by instance | Persist user/project usage and cached reverse geocodes. | M4 | Open |
| TD-009 | P2 Medium | Media | Photo listing has legacy storage traversal fallback. | `app/api/storage/photos/route.ts` | Slow, expensive, and masks metadata drift | Backfill metadata then remove fallback under migration plan. | M4 | Open |
| TD-010 | P2 Medium | Documentation | Prototype delta docs describe Next.js gaps already implemented. | `docs/UI_SPEC.md`, `docs/COMPONENT_MAP.md` | Agents may follow stale instructions | Mark historical docs and use baseline/ADRs as higher authority. | M0 | Open |
| TD-011 | P2 Medium | QA | No automated tests or CI workflow. | `package.json`, absent `.github/workflows/` | Regressions rely on manual checks | Add typecheck, lint, unit, contract, browser, and golden gates. | M1 | Open |
| TD-012 | P2 Medium | Environment | Env access is partially validated and provider mode is hardcoded. | `lib/env.ts`, Midtrans routes | Misconfiguration is discovered at runtime | Add centralized server/client environment schema. | M1 | Open |
| TD-013 | P3 Low | Routing | Production routes retain `.html` names for prototype parity. | `app/*.html/page.tsx` | Awkward canonical URLs and future redirect debt | Define URL migration after product contract approval. | M8 | Deferred |
| TD-014 | P3 Low | Assets | Duplicate prototype assets and generated images are retained. | `prototype/`, `public/pixforme-workflow/` | Repository size and ambiguity | Freeze archive manifest; remove only in separately approved cleanup. | M1 | Deferred |

Severity reflects reconstruction priority, not proof of an active exploit.

---
name: domain-modeling
description: Model Pixforme domain ownership, invariants, identifiers, commands, events, and prohibited dependencies across reports, media, billing, and AI.
---
# Purpose
Prevent cross-domain coupling and tenant/financial invariants from living only in UI code.
# Trigger conditions
Use before schema/API work or when a change spans workspace, reports, media, rendering, billing, or AI.
# Required inputs
Product contract, domain boundary document, current schema/API/types.
# Files that must be read
`docs/reconstruction/DOMAIN_BOUNDARIES.md`, relevant `app/api/`, generated types, migrations/schema draft.
# Allowed write scope
Domain/data/API contracts and proposed ADRs.
# Procedure
Identify aggregate owner; define IDs, lifecycle, invariants, commands/queries/events; map cross-domain references; prohibit reverse dependencies; test retry/deletion/tenant cases.
# Non-negotiable rules
Database is canonical. Active browser selection is not lifecycle. Credit balance derives from ledger. Renderer consumes snapshots.
# Verification commands
`rg -n "owner_id|project_id|report_id|order_id|status" app lib docs`.
# Required artifacts
Ownership table, invariants, transitions, public contracts, dependency direction.
# Handoff contract
Name aggregate owner, transaction boundary, IDs, invariants and migration/API owners.
# Failure and rollback procedure
Escalate conflicting ownership; keep model Proposed and do not alter schema/code.

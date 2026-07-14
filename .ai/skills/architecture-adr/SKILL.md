---
name: architecture-adr
description: Create or revise Pixforme architecture decision records with repository context, alternatives, trade-offs, risks, and follow-up actions.
---
# Purpose
Persist consequential Pixforme design decisions outside chat.
# Trigger conditions
Use for domain boundaries, canonical state, workers, rendering, providers, or irreversible dependencies.
# Required inputs
Approved product contract, current dependency map, constraints and owner.
# Files that must be read
`AGENTS.md`, `docs/reconstruction/DOMAIN_BOUNDARIES.md`, related code/schema, relevant ADRs.
# Allowed write scope
`docs/adr/` and explicitly assigned architecture docs.
# Procedure
State observed context with evidence; define drivers; compare alternatives including status quo; record decision/consequences/risks/migration/rollback; set `Proposed`; link follow-ups.
# Non-negotiable rules
No ADR becomes `Accepted` without human approval. Do not implement unless separately scoped.
# Verification commands
`rg -n "Status|Decision" docs/adr`; `rg -n "<boundary>" app lib docs`.
# Required artifacts
ADR, dependency diagram when material, follow-up backlog references.
# Handoff contract
List status, approver, assumptions, affected contracts/migrations/modules.
# Failure and rollback procedure
If evidence is incomplete, keep Proposed and state missing proof; revert only the new ADR if rejected.

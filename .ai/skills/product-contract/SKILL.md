---
name: product-contract
description: Define approved Pixforme user behavior, acceptance criteria, states, and non-goals before architecture or implementation work.
---
# Purpose
Convert a Pixforme issue into a durable testable product contract.
# Trigger conditions
Use for new features, workflow changes, ambiguous bugs, pricing/entitlement, or prototype-versus-product disputes.
# Required inputs
User outcome, actors/tenant, baseline behavior, constraints, decision authority.
# Files that must be read
`AGENTS.md`, relevant pages/APIs, `docs/reconstruction/CODEBASE_BASELINE.md`, existing acceptance criteria and ADRs.
# Allowed write scope
Issue/product contract and acceptance documentation.
# Procedure
Describe problem/actor and current behavior; define happy/empty/error/permission/retry states; write measurable criteria and non-goals; identify security/cost/data implications; obtain approval.
# Non-negotiable rules
Do not decide architecture by implication. Archived prototype and chat cannot override approved criteria.
# Verification commands
`rg -n "<relevant term>" app lib docs`; trace every criterion to a test/evidence method.
# Required artifacts
Versioned contract, state matrix, acceptance criteria, non-goals, open decisions.
# Handoff contract
Name approved version, affected domains/routes, fixtures, reviewers, unresolved choices.
# Failure and rollback procedure
If authority or behavior is ambiguous, mark Draft and block implementation; revert only the draft artifact if abandoned.

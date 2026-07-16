---
name: security-threat-model
description: Threat-model Pixforme auth, tenant data, uploads, service role, maps, Midtrans, credits, AI, secrets, and report exports.
---
# Purpose
Identify abuse paths and release-blocking controls before sensitive changes ship.
# Trigger conditions
Use for auth/RLS, public APIs, upload, provider/webhook, payment/credit/AI, secrets, or PII changes.
# Required inputs
Data flow, actors/trust boundaries, assets, entry points, deployment assumptions.
# Files that must be read
Security register, relevant routes/libs/migrations/env contract, accepted ADRs and provider contract.
# Allowed write scope
Threat model/security findings/tests; fixes only under separate implementation ownership.
# Procedure
Map trust boundaries; enumerate spoofing/tampering/repudiation/disclosure/DoS/privilege risks; test tenant and replay paths; rank severity/exploitability; specify preventive/detective/recovery controls; assign owner/exit evidence.
# Non-negotiable rules
Fail closed; never expose secrets; middleware is not sole auth; service role needs explicit re-authorization; QA/security reviewer does not silently patch.
# Verification commands
Secret scan, dependency audit as approved, actor/tenant/API negative tests, RLS matrix, webhook replay/forgery and upload abuse tests.
# Required artifacts
Threat/data-flow model, findings with evidence/severity, control/test map, residual risk.
# Handoff contract
Name blockers, owner, evidence to close, production exposure and incident/rollback actions.
# Failure and rollback procedure
Block release for P0; disable affected path if authorized; preserve evidence and hand fix to implementation owner.

---
name: supabase-rls-review
description: Audit and test Pixforme Supabase RLS, grants, storage policies, views/functions, and cross-tenant isolation.
---
# Purpose
Prove database authorization independently of application filters.
# Trigger conditions
Use for exposed tables/views/functions/storage, auth changes, service-role routes, or tenant relationships.
# Required inputs
Tenant model, migration, actor matrix and intended CRUD.
# Files that must be read
Migrations/schema, generated types, privileged routes, storage paths, security register.
# Allowed write scope
RLS/grant migration and database security tests when assigned.
# Procedure
Inventory exposure/grants; ensure RLS; inspect CRUD `USING`/`WITH CHECK`; inspect views/definer functions; validate owner-bound FKs; test anon/user-A/user-B/service role/storage.
# Non-negotiable rules
`TO authenticated` is not tenant authorization. Never weaken policies or authorize from user metadata.
# Verification commands
`supabase db advisors`; SQL CRUD actor matrix; `rg -n "create policy|grant|security definer|storage.objects" supabase docs`.
# Required artifacts
Policy matrix, adversarial results, findings/severity, remediation migration.
# Handoff contract
List roles/operations, deployed assumptions, service-role paths and residual risk.
# Failure and rollback procedure
Block release on cross-tenant access; issue approved policy forward-fix, never disable RLS.

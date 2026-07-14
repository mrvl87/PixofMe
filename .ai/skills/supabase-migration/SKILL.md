---
name: supabase-migration
description: Create reproducible Pixforme Supabase/Postgres migrations, backfills, indexes, constraints, and generated database types.
---
# Purpose
Replace mutable SQL drafts with auditable migration history.
# Trigger conditions
Use for any table, column, index, function, trigger, grant, storage, or schema change.
# Required inputs
Approved data contract, schema inventory, backup and rollback/forward-fix plan.
# Files that must be read
Migration history, generated types, `docs/SUPABASE_SCHEMA.sql` as legacy evidence, queries and RLS.
# Allowed write scope
`supabase/migrations/`, generated DB types, migration tests/docs.
# Procedure
Check CLI help/version; create migration via CLI; design expand/backfill/contract; review locks/indexes/defaults; apply locally; run advisors; regenerate types; test empty and representative upgrades.
# Non-negotiable rules
Never edit applied migrations, guess filenames, or apply draft SQL directly to production.
# Verification commands
`supabase --version`; `supabase migration new <name>`; `supabase db reset`; `supabase migration list --local`; `supabase db advisors`; `npx tsc --noEmit --pretty false`.
# Required artifacts
Migration, backfill evidence, generated type diff, rollback/forward-fix runbook.
# Handoff contract
State order, lock/data risks, env assumptions, RLS owner and deploy sequencing.
# Failure and rollback procedure
Stop on drift/unsafe lock; restore local DB, revise unapplied migration, use approved forward-fix after apply.

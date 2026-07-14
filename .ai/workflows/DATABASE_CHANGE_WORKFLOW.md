# Database Change Workflow

1. Issue and product/data contract define ownership, invariants, CRUD, retention and compatibility.
2. Database agent inventories local/deployed schema, backup and migration history.
3. Architecture/database review chooses expand/backfill/contract, owner-bound FKs, RLS/grants, indexes and rollback/forward-fix.
4. Create ordered migration with Supabase CLI; never edit applied history or run the legacy draft directly.
5. Apply on empty and representative local DB; regenerate types; run advisors and anon/user-A/user-B/service-role matrix.
6. Backend adapts only after contract/types are frozen. Frontend may work from fixtures in parallel.
7. Independent QA reviews migration, data, concurrency and RLS; release agent sequences deploy and human approval.

All dependent agents wait on unresolved schema/type/RLS contracts. Stop on live drift, unsafe lock, missing backup, destructive ambiguity or cross-tenant access.

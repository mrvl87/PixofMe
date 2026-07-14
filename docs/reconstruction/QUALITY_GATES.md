# Quality Gates

Commands are baseline targets. Missing commands are engineering work, not grounds to skip evidence.

## Every pull request

- Link an issue and approved product contract; state scope/out-of-scope and owner agent.
- Confirm `git diff --check`, `npm run lint`, `npx tsc --noEmit --pretty false`, and `npm run build`.
- Add tests proportional to changed behavior; no implementation agent self-approves.
- Include security/database/architecture impact, screenshots for UI, rollback, and known limitations.
- Preserve unrelated dirty changes and prohibit secrets in diff/logs.

## Database migration

- Create an ordered migration; never edit applied history.
- Prove forward migration on empty and representative databases; document rollback/forward-fix.
- Regenerate database types and verify no drift.
- Review constraints, locks, indexes, backfill batching, defaults, and data compatibility.

## RLS

- Enable RLS on exposed tables and test anonymous, authenticated A, authenticated B, and service role.
- Test SELECT/INSERT/UPDATE/DELETE including `USING` and `WITH CHECK`.
- Verify views/functions/grants and owner-bound foreign keys; run Supabase advisors when available.

## API

- Define request/response/error/idempotency/auth contracts before code.
- Validate body, query, headers, size, and content type server-side.
- Test unauthenticated, unauthorized tenant, malformed, duplicate, retry, and provider failure cases.
- No secrets or sensitive raw payloads in client responses/logs.

## UI

- Match approved product acceptance criteria, not chat or archived prototype alone.
- Verify loading/empty/error/success, keyboard flow, focus, labels, responsive layouts, and no console errors.
- Supply screenshots or recordings at agreed viewport(s); behavioral changes need browser evidence.

## Report engine

- Use immutable snapshot and explicit template version.
- Golden-test A4/F4, portrait/landscape, first/all-page headers, 0/1/full/overflow page counts, long text, portrait/landscape media.
- Verify physical dimensions, font availability, pagination, no clipping, and deterministic artifact hash or documented tolerated delta.

## Payment

- Sandbox only until security and human approval.
- Verify Midtrans signature/server status, amount/SKU/owner, duplicate and out-of-order events, expiry, denial, settlement, refund/chargeback.
- Prove one order/event produces at most one ledger effect and balance reconciles from ledger.

## AI jobs

- Validate state transitions and idempotency keys.
- Reserve credit before provider call; finalize actual use or refund on terminal failure.
- Record model/provider/usage/cost, sanitize input/output, bound retries/timeouts, preserve media lineage.

## Release

- All prior gates green on release commit; independent QA, security when applicable, release agent, then human approval.
- Record migrations, env changes, provider mode, deployment URL/commit, smoke tests, observability, rollback owner and procedure.
- No release while P0 findings affecting changed scope remain open.

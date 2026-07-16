# Security Register

No fixes are included in this baseline.

| ID | Severity | Area | Current evidence | Risk | Required direction | Target |
|---|---|---|---|---|---|---|
| SEC-001 | P0 Critical | Homepage asset upload | `app/api/storage/upload/route.ts` accepts `homepage-hero`, `homepage-workflow`, and `homepage-template` from any authenticated user, then writes through service role to public buckets. | Any user can publish/replace brand assets at attacker-chosen volume. | Restrict homepage kinds to an explicit admin authorization path; deny by default. | M0 |
| SEC-002 | P1 High | Auth callback redirect | `app/auth/callback/route.ts` passes unvalidated `next` into `new URL(next, origin)`. | Open redirect/phishing after auth. | Allow only known same-origin relative paths and reject encoded/protocol-relative variants. | M0 |
| AUTH-003 | P2 Medium | Logout method | `TopNav` renders `<a href="/auth/sign-out">` while route exports POST only. | Logout fails and encourages unsafe GET mutation. | Use a POST form/action with CSRF-aware same-site behavior. | M0 |
| SEC-004 | P1 High | Auth guard | `NEXT_PUBLIC_AUTH_GUARD_ENABLED` can disable proxy protection; protected prefixes omit `/kredit.html`; middleware alone is bypass-prone. | Unprotected UI and inconsistent assumptions. | Keep route handlers authoritative; make guard server-only and cover all private pages. | M1 |
| SEC-005 | P1 High | Service role | Storage upload/list and signup profile checks use unrestricted service-role clients. | A route bug bypasses RLS with broad impact. | Minimize service-role paths, isolate admin repositories, and re-check tenant scope before every privileged write. | M1/M4 |
| SEC-006 | P0 Critical | Public upload authorization | See SEC-001 and public buckets in `docs/SUPABASE_SCHEMA.sql`. | Cross-user modification of public product assets. | Admin-only contract plus audit log and immutable naming. | M0 |
| SEC-007 | P1 High | User file validation | Route checks `file.type` and size only; dimensions are client supplied. | Polyglots, decompression abuse, misleading metadata. | Decode server-side, verify magic bytes/dimensions, re-encode, checksum, and cap pixels. | M4 |
| SEC-008 | P1 High | Cross-tenant foreign keys | Geotags/settings/exports and several AI references do not use owner-bound composite FKs. | A privileged or future faulty path can connect rows across tenants. | Add composite unique keys and `(id, owner_id)` references. | M1/M3 |
| SEC-009 | P1 High | RLS completeness | Draft enables RLS and owner policies, but it is not migration-backed or live-verified; service role bypasses it. | Repository policy may differ from deployed state. | Add migration tests and adversarial anon/user-A/user-B checks. | M1 |
| SEC-010 | P0 Critical | Midtrans webhook | `app/api/midtrans/notification/route.ts` accepts and echoes arbitrary JSON. | Forged payments and credit issuance if later connected naively. | Verify provider signature/status, persist raw event idempotently, reconcile server-to-server, then transact ledger. | M0/M6 |
| SEC-011 | P0 Critical | Payment idempotency | Token route creates random order IDs without a DB order; webhook event uniqueness is not enforced. | Double credits, orphan payments, unrecoverable reconciliation. | Unique provider event/order keys and one atomic settlement transaction. | M6 |
| SEC-012 | P2 Medium | In-memory rate limit | Auth and maps use module-level `Map`. | Cold starts and horizontal scaling bypass limits; memory can grow. | Durable per-principal quotas with expiry and trusted proxy handling. | M1/M4 |
| SEC-013 | P2 Medium | Signed URL lifecycle | Private image URLs are valid for seven days and stored in client state. | Long exposure window after authorization changes. | Short TTL, refresh endpoint, no persistence of signed query URLs, revocation strategy. | M4 |
| SEC-014 | P1 High | Environment validation | `lib/env.ts` validates on access only; Midtrans mode/URLs and secrets are handled ad hoc. | Misdeployment, sandbox in production, missing/weak secrets. | Typed startup schema split into public/server variables; fail closed. | M1 |
| SEC-015 | P2 Medium | Profile authorization | Callback derives profile fields from user metadata; RLS grants restrict balance columns but deployment is unverified. | Metadata confusion and privilege drift if grants/policies diverge. | Keep user metadata non-authoritative; verify grants and app-metadata roles. | M1 |
| SEC-016 | P2 Medium | CSRF/origin | Mutating JSON and multipart routes do not explicitly validate Origin or CSRF tokens. | Cross-site requests may trigger same-site session mutations under unsafe cookie/config changes. | Define CSRF/origin policy for all cookie-auth mutations. | M1 |

## Required security evidence

- Migration-backed schema and generated types.
- RLS matrix for anonymous, user A, user B, and service role.
- Upload tests covering kind authorization, magic bytes, pixel limit, and tenant paths.
- Midtrans replay, forged signature, out-of-order status, and duplicate delivery tests.
- Environment validation test for production/sandbox mismatch.

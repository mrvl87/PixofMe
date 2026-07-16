# SEC-001 Execution Contract

## Status

Status: Approved — Ready for Implementation

Approved by: Repository owner

Approval date: 2026-07-15

Approved option: Option C — Fail-closed homepage upload

This approval authorizes only the bounded implementation and evidence work defined here. It does not authorize deployment, merge, release, live storage mutation, storage-policy changes, access to secrets, or work on another issue.

## Foundation baseline

- Issue branch: `fix/sec-001-homepage-upload`
- Parent foundation branch: `chore/agentic-foundation`
- Foundation commit: `71176a59dd1e4b7c00e554065e596752800cd054`
- Existing user change: `prototype/wizard-step4.html`, which must remain modified and unstaged.
- Evidence boundary: static repository inspection. Draft schema and documented bucket names do not prove deployed Supabase state.

## Problem statement

`POST /api/storage/upload` accepts client-controlled multipart `kind`. Three values select public homepage buckets. After verifying only that a Supabase user exists, the route creates a service-role client and writes to the selected bucket without verifying an administrator privilege.

The server currently generates a UUID path and uses `upsert:false`; therefore static evidence proves unauthorized public object creation and service-role amplification, but not overwrite of an existing object. No active homepage upload UI was found. The vulnerability remains P0 because an ordinary authenticated actor crosses the intended public-marketing asset boundary.

## Verified evidence

| Finding | Evidence |
|---|---|
| Upload entry point is `POST /api/storage/upload`. | `app/api/storage/upload/route.ts:40` |
| Authentication is `createSupabaseServerClient()` plus `auth.getUser()`; missing user returns `401`. | `app/api/storage/upload/route.ts:68-74`; `lib/supabase/server.ts:9-29` |
| No role or privilege is checked before the service-role client is created. | `app/api/storage/upload/route.ts:68-88` |
| `profiles` has no trusted admin/role field. | `lib/supabase/database.types.ts:13-25`; `docs/SUPABASE_SCHEMA.sql:27-38` |
| Client controls `kind`, `projectId`, file, declared dimensions, filename metadata, and resize metadata. | `app/api/storage/upload/route.ts:46-54` |
| `homepage-hero`, `homepage-workflow`, and `homepage-template` select public buckets; unknown kinds fall back to the private report bucket. | `app/api/storage/upload/route.ts:24-29,48,88` |
| Service role performs upload, URL generation, metadata insert, and cleanup. | `app/api/storage/upload/route.ts:87,97-109,121-142`; `lib/supabase/server.ts:31-38` |
| Homepage buckets are server-configured and declared public in the SQL draft. | `lib/env.ts:55-60`; `.env.example:17-19`; `docs/SUPABASE_SCHEMA.sql:494-503` |
| Report photos use server-configured `pixforme-photos`, declared private with owner-prefix policies in the draft. | `lib/env.ts:51-52`; `docs/SUPABASE_SCHEMA.sql:480-534` |
| The only active application caller found sends `kind=report-photo`. | `app/pixforme.tsx:920-945`; repository search for `/api/storage/upload` |
| Homepage visuals use application/public assets; no homepage upload UI was found. | `app/pixforme.tsx:333-445` |
| Project ownership is checked using both project ID and authenticated owner ID. | `app/api/storage/upload/route.ts:76-85` |
| Object path is server-built from owner, fixed folder, date, UUID, and sanitized basename. | `app/api/storage/upload/route.ts:15-21,89-100` |
| No second storage upload endpoint was found. The service-role photo listing is an adjacent SEC-005 surface but scopes rows and roots to the authenticated owner. | `app/api/storage/photos/route.ts:79-143` |

Additional gaps remain separate issues: declared MIME is trusted without magic-byte/decode validation (SEC-007), service role remains broad (SEC-005), durable rate limiting is absent (SEC-012), and origin/CSRF policy remains open (SEC-016).

## Current request flow

```text
Browser multipart request
  -> content/file/kind/project metadata parsing
  -> declared MIME and size validation
  -> Supabase auth.getUser()
  -> optional project owner check
  -> client kind selects server bucket config
  -> service-role storage upload
  -> public URL or private signed URL
  -> gallery_photos insert only for report-photo
  -> response
```

The missing control is explicit category authorization immediately before any service-role use.

## Trust boundaries

1. Browser fields and file metadata are untrusted.
2. `auth.getUser()` is the route identity boundary; middleware is not sufficient authorization.
3. Project ownership must be proven before a report-photo write.
4. Application authorization must approve category, bucket, and path before service-role construction/use.
5. Service role bypasses RLS/storage policy, so every target must already be fixed server-side.
6. Homepage bucket objects are public once written.
7. Repository schema text is design evidence, not deployed-state evidence.

## Threat model

| Asset/attack | Existing control | Missing control | Approved mitigation | Verification | Residual risk |
|---|---|---|---|---|---|
| Privilege escalation through `kind` | Authenticated session and fixed map | Role/category authorization | Allow only explicit `report-photo`; `homepage-*` returns `403`; all other categories return `400` | Negative category matrix with zero service-role calls | Future admin capability remains disabled |
| Arbitrary public object creation | UUID and `upsert:false` | Public-category denial | No route writes to homepage buckets | Before/after bucket counts in an authorized non-production environment | Existing objects/external consumers require separate inspection |
| Cross-user project upload | Owner-bound project query | Regression evidence | Preserve owner query and server owner prefix | User A with user B project ID | Projectless legacy report upload remains current behavior |
| Arbitrary bucket/path | Server map/path builder | Explicit rejection of target fields | Reject client `bucket` and `path` with `400` | Forged multipart fields | None within SEC-001 target selection |
| Filename/path manipulation | Sanitization, UUID, fixed segments | Adversarial verification | Never concatenate client path; prove traversal stays inside owner prefix | Traversal filename test | Unicode presentation risk is outside this issue |
| MIME spoofing | Declared MIME allowlist and 15 MB limit | Magic bytes/decode/pixel cap | Preserve checks; defer content verification to SEC-007 | MIME/size regression tests | SEC-007 remains open |
| Service-role amplification | Server-only key | Explicit re-authorization | Denied requests must not construct/call privileged upload | Instrumented or manual call-absence evidence | SEC-005 remains open |
| Anonymous request | `auth.getUser()` | Auth occurs after some parsing | Return `401` and perform zero privileged side effects | Anonymous report/homepage tests | Platform-level body DoS is separate |
| Replay/duplicate upload | UUID prevents overwrite | Idempotency/quota | Public path disabled; record private report duplicate behavior | Repeat identical request | Private duplicate/cost risk remains |
| Bucket/error leakage | None | Generic error mapping | Never return bucket, object path, raw provider detail, or secrets | Failure response assertions | Logging design requires implementation evidence |

## Security policy

### Anonymous

- Any otherwise valid upload request returns `401 Unauthorized`.
- No service-role client, storage write, or database write is reached.

### Authenticated user

- The only accepted category is explicit `kind=report-photo`.
- Missing `kind` returns `400 Bad Request`.
- `homepage-*` returns `403 Forbidden`.
- `marketing-*`, `public-asset`, and every unknown category return `400 Bad Request`.
- Client-supplied `bucket` or `path` returns `400 Bad Request`.
- Report upload proceeds only after ownership, MIME, size, and server-generated path validation passes.
- Bucket and complete object path are selected or validated entirely by server code.

### Administrator

- The codebase has no trusted administrator source of truth.
- Admin homepage upload is not implemented in SEC-001; every authenticated actor receives `403` for `homepage-*`.
- Future admin authority must not use hardcoded email, environment email lists, client metadata, request headers, browser state, `localStorage`, or any user-supplied claim.

### Status codes

- `401`: unauthenticated.
- `403`: authenticated request for a known `homepage-*` category.
- `400`: missing `kind`, malformed payload, `marketing-*`, `public-asset`, unknown category, or client target fields.
- `413`: eligible report file exceeds the current limit.
- `415`: eligible report file has a disallowed declared MIME.
- `404`: project is not found for the authenticated owner, preserving current non-enumerating behavior.
- `502`: authorized dependency failure with a generic response and compensating cleanup where required.

## Options considered

| Option | Benefit | Cost/risk | Compatibility | Decision |
|---|---|---|---|---|
| A — Separate admin homepage endpoint | Strong future boundary | Requires canonical admin authority and a new route | Future homepage tooling changes; report upload stable | Deferred long-term option |
| B — One endpoint with role/category policy map | Minimal URL churn | Unsafe to enable without a trusted role; mixed boundary remains | Existing caller stable | Rejected for SEC-001 |
| C — Disable homepage categories; explicit report allowlist | Smallest complete containment; no DB/UI/dependency change | No admin homepage upload | Current caller remains compatible | **Approved** |

## Recommended solution

Implement approved Option C only in the bounded paths:

1. Before editing, re-run repository-wide discovery and prove every active report upload caller sends `kind=report-photo`.
2. If any active caller omits it, stop; do not change UI or API silently; return evidence to the Lead Orchestrator for human review.
3. Authenticate before creating or invoking any service-role client and before expensive body work where realistic.
4. Require explicit `kind`; missing value returns `400`.
5. Allow only `report-photo`.
6. Return `403` for `homepage-*`; return `400` for `marketing-*`, `public-asset`, and unknown categories.
7. Reject client `bucket` and `path` fields with `400`.
8. Preserve existing project ownership, MIME, size, server bucket/path, UUID, `upsert:false`, metadata insert, response shape, and report caller behavior.
9. Return generic dependency errors; do not expose bucket/path/raw Supabase details.
10. Remove any uploaded object when signed-URL creation or metadata persistence fails.
11. Add no dependency. Use existing tooling, then dependency-free Node/route tooling if realistic, otherwise explicitly manual/scripted integration evidence.

## Scope

- Fail-close all public/homepage/marketing upload categories.
- Explicitly allow only `report-photo`.
- Preserve verified normal report upload behavior.
- Reject client target control and close internal target leakage.
- Produce SEC-001 implementation, QA, and release evidence in assigned phases.

## Out of scope

- Admin role design or homepage upload capability.
- UI, public assets, schema, migrations, RLS, grants, storage policy, environment, dependencies, and live object mutation.
- Full image decode/magic-byte/pixel validation, general service-role refactor, durable quotas, CSRF/origin policy, and report-upload idempotency.
- Payments, credits, maps, AI, report renderer, auth callback, prototype, and every issue other than SEC-001.

## Dependencies

- Immediate implementation dependency: this approved contract checkpoint.
- Deferred dependency: **Define a trusted server-side administrator authority before re-enabling homepage asset upload.**
- Future enabled admin upload also requires a separately approved API contract, audit requirements, and live Supabase verification.
- Test evidence must use no new dependency: existing tooling first, dependency-free route/Node built-in tooling second, scripted/manual integration third, then independent QA repetition.
- Authorized read-only storage inspection may cover referenced bucket names, safe visible configuration, code mapping, and documented policy. It must not display secrets or modify objects, buckets, policies, or RLS.

## Agent assignment

- Lead Orchestrator owns contract, scope, and handoff; it does not implement.
- Primary implementation owner: Billing/Security Agent.
- Supporting agent: none by default. Backend/API Agent requires an explicit scope escalation if a shared helper becomes necessary.
- Independent reviewer/security pass: QA/Red-Team Agent; it reports findings and never patches audited implementation.
- Release Agent acts only after implementation evidence and clean independent QA.
- Human approval remains mandatory before merge/release.

## File ownership

### Allowed implementation write paths

- `app/api/storage/upload/route.ts`
- `app/api/storage/upload/route.test.ts`, or one route-local SEC-001 verification file approved before creation
- `docs/reconstruction/issues/SEC-001_IMPLEMENTATION_EVIDENCE.md`
- `docs/reconstruction/issues/SEC-001_QA_REPORT.md` (QA/Red-Team only)
- `docs/reconstruction/issues/SEC-001_RELEASE_EVIDENCE.md` (Release Agent only)

An authorization helper is not pre-approved. If implementation proves one is necessary, stop and request a contract amendment before creating it.

### Read-only paths

- Existing upload callers, including `app/pixforme.tsx`
- `app/api/storage/photos/route.ts`
- `lib/supabase/server.ts`, `lib/env.ts`, and `lib/supabase/database.types.ts`
- `.env.example` without exposing real environment values
- `docs/SUPABASE_SCHEMA.sql`, `docs/INTEGRATIONS.md`, and documented storage policies
- `AGENTS.md`, security workflow/skills, security register, quality gates, and this approved contract

### Forbidden paths

- `prototype/` and specifically `prototype/wizard-step4.html`
- UI components, `app/pixforme.tsx`, styles, public assets, and report renderer
- Schema, migrations, generated types, RLS policies, grants, and storage policies
- Payment, credits, maps, auth, workspace, storage listing, and every unrelated API route
- `package.json`, `package-lock.json`, dependency configuration, and build output
- `.env*`, secrets, provider dashboards, and live bucket/object mutation

## API contract impact

`POST /api/storage/upload`, multipart transport, and successful `report-photo` response `{ photo }` remain unchanged.

| Request | Approved behavior |
|---|---|
| No valid session | `401`; no privileged side effect |
| Missing `kind` | `400`; no fallback and no side effect |
| Authenticated valid `report-photo` | Existing success after ownership/MIME/size/path checks |
| Authenticated `homepage-*` | `403`; no privileged side effect |
| `marketing-*`, `public-asset`, unknown category | `400`; no privileged side effect |
| Client `bucket` or `path` | `400`; field is never forwarded |
| Invalid eligible report MIME | `415` |
| Oversized eligible report file | `413` |
| Project outside actor ownership | Existing `404` |
| Storage/metadata failure | Generic `502`; no leaked internal target; cleanup any created object |

Missing `kind` is definitively not backward compatible. The implementation owner must verify active callers first; it may not modify UI to compensate within SEC-001.

## Database impact

None. No table, role, migration, RLS, grant, trigger, generated type, or data change is authorized. `gallery_photos` behavior for successful report uploads remains unchanged.

## Storage impact

- Zero new writes to homepage/public marketing buckets through this route.
- Existing objects, buckets, and policies remain untouched.
- Private report bucket and owner-prefixed server path remain active.
- Client bucket/path fields are rejected.
- Any post-upload URL/metadata failure must clean up the created report object.

## UI impact

None. No homepage upload UI exists in the inspected application, and the active report caller already sends `kind=report-photo`. UI files remain read-only.

## Acceptance criteria

### Authorization

- Anonymous valid upload returns `401` with zero service-role/storage/database side effects.
- Authenticated `homepage-*` returns `403` for every actor.
- Missing, marketing, public-asset, and unknown categories return `400`.
- Only explicit `report-photo` can reach normal validation and upload.
- Client target fields cannot select bucket/path.
- Authorization is server-side and occurs before service-role use.

### Ownership and path safety

- Server selects the bucket and constructs the full owner-prefixed object path.
- Another user's project ID returns `404` with no object or row.
- Filename traversal cannot escape the fixed prefix.
- Existing MIME and 15 MB checks remain effective.
- URL/metadata failure leaves no orphan object or partial row.

### Regression and auditability

- Existing multi-file Step 3 report upload remains functional with the same response fields.
- No UI, prototype, schema, RLS, payment, report, dependency, or unrelated route diff exists.
- Denial responses contain no bucket, path, raw provider detail, service-role secret, file content, or sensitive session data.
- Evidence distinguishes automated, scripted, and manual verification accurately.

## Test matrix

No dependency may be added. Use existing tooling if discovered; otherwise dependency-free Node/route tooling if realistic; otherwise scripted/manual integration evidence. QA/Red-Team must independently repeat the negative matrix.

| Case | Expected status | Required side effect | Required absence |
|---|---|---|---|
| Anonymous + report-photo | `401` | None | No service-role call/object/row |
| Anonymous + homepage-* | `401` | None | No public/private object/row |
| Authenticated + missing kind | `400` | None | No fallback upload/object/row |
| Normal user + owned project report-photo | `200` | One private owner object and metadata row | No public/cross-user write |
| Normal user + each homepage-* | `403` | Optional safe denial signal only | No service-role call/public object/row |
| Normal user + marketing/public/unknown kind | `400` | None | No fallback upload/object/row |
| Normal user + arbitrary bucket/path | `400` | None | Target never forwarded; no object/row |
| Normal user + another user's project | `404` | None | No object/row for either user |
| Operational admin identity + homepage-* | `403` | None | No public object/row |
| Malformed multipart or missing file | `400` | None | No internal exception detail/object/row |
| Invalid report MIME | `415` | None | No object/row |
| Oversized report file | `413` | None | No object/row |
| Storage failure | Generic `502` | Safe credential-free diagnostic only | No metadata row/internal target leakage |
| Signed URL failure after upload | Generic `502` | Compensating object removal | No orphan object/row |
| Metadata failure after upload | Generic `502` | Compensating object removal | No orphan object/partial row |
| Traversal filename | `200` if otherwise valid | Object only under safe owner/report prefix | No `..` target or public write |
| Duplicate report request | Record actual existing behavior | Private owner-prefixed result only | No public/cross-user overwrite |

Browser automation is not required because UI is unchanged. A manual Step 3 smoke test is required after implementation and must be labeled manual. Destructive/adversarial tests must not use production storage.

## Verification commands

Implementation phase:

```powershell
rg -n -F '/api/storage/upload' app lib docs
git diff --check
npm run lint
npx tsc --noEmit --pretty false
npm run build
git diff -- app/api/storage/upload/route.ts app/api/storage/upload/route.test.ts docs/reconstruction/issues/SEC-001_IMPLEMENTATION_EVIDENCE.md
git status --short
```

Evidence must include exact caller search, test type, actor setup, HTTP status, and before/after storage/database effects from an authorized non-production environment. Unverifiable claims remain blocked.

## Rollback plan

1. Revert only the approved implementation/test/evidence paths through an explicitly authorized Git operation.
2. Preserve user work and re-run the private report upload smoke test.
3. Rollback must never restore homepage upload.
4. Approved safe fallback: **Disable all upload categories except the previously verified `report-photo` path.**
5. If report upload still fails, keep all public/homepage categories disabled and stop for human review; do not re-enable insecure behavior.
6. No database, RLS, storage-policy, bucket, object, or dependency rollback applies.

## Required implementation evidence

- Branch/commit, foundation baseline, raw allowed-path diff, and exact status.
- Proof all active report upload callers explicitly send `kind=report-photo` before editing.
- Proof the prototype user change remains untouched and unstaged.
- Actor/category decision matrix and generic API error map.
- Accurate automated/scripted/manual test classification and every matrix result.
- Proof denied requests never construct/call service-role upload.
- Authorized non-production private/public bucket counts and `gallery_photos` side-effect evidence where available.
- Exact diff-check, lint, typecheck, build, and status results.
- Explicit statement that database, RLS, storage policy, environment, dependency, UI, report, payment, and prototype were unchanged.
- Residual SEC-005, SEC-007, SEC-012, and SEC-016 risks.

## Handoff sequence

```text
Approved contract checkpoint
  -> Billing/Security Agent
  -> verify active report upload callers
  -> implement fail-closed allowlist
  -> produce implementation evidence
  -> stop before QA
```

After a separate Lead Orchestrator handoff: QA/Red-Team independently tests; implementation owner remediates findings; QA reruns; Release Agent validates; human approves merge/release.

## Stop conditions

- Branch/baseline differs from the approved checkpoint.
- Prototype or any unrelated dirty path is touched, staged, restored, moved, or stashed.
- Any active report caller does not explicitly send `kind=report-photo`; stop without UI/API changes and return evidence for human review.
- A helper, schema, migration, RLS, storage policy, environment, dependency, shared auth contract, or UI change appears necessary.
- A trusted admin authority is required to satisfy a request to enable homepage upload.
- A secret, production payload, bucket object, or sensitive session value appears in output.
- Deployed state differs materially, a new homepage consumer is found, or denied-call absence cannot be proven.
- QA finds another category/bucket/path bypass or cross-user write.
- Rollback would reopen homepage upload.

## Open questions

Only implementation-evidence questions remain:

1. Does the mandatory caller search reveal any additional active upload caller or external homepage bucket consumer absent from the current static evidence?
2. Can dependency-free tooling prove that denial paths never construct/call service role, or must this be documented as scripted/manual evidence?
3. Does separately authorized read-only storage inspection reveal deployed drift, existing homepage objects, or access evidence that requires a separate incident review?
4. What credential-free denial logging is already supported without a dependency or attacker-controlled payload exposure?

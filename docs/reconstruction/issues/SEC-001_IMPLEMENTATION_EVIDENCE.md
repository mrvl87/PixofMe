# SEC-001 Implementation Evidence

## Status

Remediated — Awaiting Independent Re-QA

## Agent

Billing/Security Agent

## Branch

`fix/sec-001-homepage-upload`

## Baseline contract commit

`8f3c7620d907c221e683e893ecb7e81b6b091fcd`

Foundation commit: `71176a59dd1e4b7c00e554065e596752800cd054`.

## Problem fixed

`POST /api/storage/upload` no longer maps authenticated client-controlled upload categories to homepage/public buckets. The route authenticates first, requires an explicit upload kind, denies every `homepage-*` kind, rejects every non-report kind, rejects client target fields, and permits only `report-photo` to continue to normal report validation.

## Active caller verification

Repository search found one active production caller:

| File and symbol | Upload type | Multipart fields | `kind` | Sends `bucket` | Sends `path` | Response consumption |
|---|---|---|---|---|---|---|
| `app/pixforme.tsx`, `uploadFiles` | Report photos, one request per prepared image | `kind`, optional `projectId`, `file`, `originalName`, `originalSizeBytes`, `resized`, `width`, `height` | `report-photo` | No | No | Requires an OK response and `payload.photo.url`, then appends the returned photo data to the gallery/report state. |

Searches across active `app/` and `lib/` code found no second caller and no active homepage uploader. References in `docs/` are documentation, while `prototype/` is archived and was excluded as implementation authority.

## Files changed

- `app/api/storage/upload/route.ts`
- `app/api/storage/upload/verify-SEC-001.mjs`
- `docs/reconstruction/issues/SEC-001_IMPLEMENTATION_EVIDENCE.md`

The pre-existing unstaged user change in `prototype/wizard-step4.html` was not read for implementation, edited, staged, restored, moved, or deleted.

## Authorization behavior

| Request | Result |
|---|---|
| No authenticated user | `401` before multipart body parsing, category evaluation, or service-role construction |
| Authenticated, missing/empty/non-string `kind` | `400` |
| Authenticated, any `homepage-*` kind | `403` |
| Authenticated, unknown/marketing/public kind | `400` |
| Authenticated, `report-photo` plus `bucket` or `path` field | `400` |
| Authenticated, explicit `report-photo` | Continues through file, MIME, size, ownership, server target, upload, URL, and metadata checks |

## Server-side allowlist

The only accepted category is the exact string `report-photo`. The implementation has no negative-list fallback and no homepage exception.

## Bucket selection

The route selects the report bucket only through `getSupabaseStorageBucket()`. Homepage bucket mapping and public URL generation were removed from this endpoint. Multipart and query values cannot select a bucket.

## Path construction

The route builds the object path from authenticated `ownerId`, the fixed `report-photos` segment, an optional ownership-verified `projectId`, the server date, a server UUID, a sanitized basename, and a MIME-derived extension. Multipart and query values cannot supply the complete path.

## Ownership enforcement

The existing project query remains owner-bound with both `.eq("id", projectId)` and `.eq("owner_id", ownerId)`. A non-owned project remains a non-enumerating `404`. Ownership is checked before service-role construction.

## MIME and size validation

The existing declared MIME allowlist remains `image/jpeg`, `image/png`, and `image/webp` with `415` for other declared types. The existing 15 MB application limit remains with `413` for oversized files. Magic-byte/decode/pixel validation remains deferred to SEC-007.

## Failure cleanup

`upsert:false` and UUID object names remain. If signed-URL creation fails or returns no URL, the uploaded object is removed. If metadata insertion fails, the uploaded object is removed. Cleanup failures are not exposed to the client.

## Error response behavior

The response shape remains `{ error }` for failures and `{ photo }` for success. Project lookup, storage upload, metadata insertion, and unexpected failures now return generic credential-free messages. Responses do not include raw Supabase errors, bucket internals, object paths, stack traces, filesystem paths, or credentials.

## Logging decision

No structured server logging facility was found in active `app/` or `lib/` code. SEC-001 therefore adds no denial logging and no new logging framework. No file content, token, session, credential, or multipart body is logged.

## Verification method

- Automated compile gates: ESLint, TypeScript no-emit, and Next.js production build.
- Scripted static verification: 15 dependency-free Node built-in assertions over the route and its active caller. These prove authorization ordering, explicit statuses, the report-only server target, caller compatibility, preserved validations, generic errors, and cleanup branches.
- Manual/runtime classification: no manual Step 3 upload and no live storage/database mutation was performed because no separately authorized non-production actor/storage environment was provided. Scripted static verification is not represented as an HTTP integration test.
- Independent QA must execute the HTTP and side-effect matrix in an authorized non-production environment.

## Test matrix results

| Scenario | Result | Evidence type |
|---|---|---|
| Anonymous + `report-photo` | Pass: `401` branch precedes body parsing/kind/service role | Scripted static |
| Anonymous + `homepage-*` | Pass: same authentication-first `401` branch | Scripted static |
| Authenticated + missing kind | Pass: explicit `400`, no fallback | Scripted static |
| Authenticated + unknown kind | Pass: exact report allowlist rejects with `400` | Scripted static |
| Authenticated + `homepage-*` | Pass: prefix denial returns `403` | Scripted static |
| Authenticated + forged marketing kind | Pass: returns `400` | Scripted static |
| Authenticated + arbitrary bucket field | Pass: field presence returns `400`; target is not forwarded | Scripted static |
| Authenticated + arbitrary path field | Pass: field presence returns `400`; target is not forwarded | Scripted static |
| Authenticated + valid `report-photo` | Pass: reaches preserved report validation gate; no live upload performed | Scripted static + compile |
| Valid report photo + invalid MIME | Pass: existing `415` check remains before service role | Scripted static |
| Valid report photo + oversized file | Pass: existing `413` check remains before service role | Scripted static |
| Malformed multipart payload | Pass: body parse failure returns generic `400` | Scripted static |
| Storage failure | Pass: generic `502` without raw provider message or target | Scripted static |
| Signed URL failure after upload | Pass: generic `502` plus object removal | Scripted static |
| Metadata failure after upload | Pass: generic `502` plus object removal | Scripted static |
| Cross-owner project ID | Pass: owner-bound lookup remains before service role; runtime actor matrix deferred to QA | Scripted static |
| Traversal filename | Pass: sanitized basename follows fixed owner/report prefix and UUID | Scripted static |

The dependency-free route-local verification completed `PASS 15 scripted static assertions`. No third-party test dependency was added.

## Commands executed

```powershell
git branch --show-current
git status --short
git log -2 --oneline
rg -n -F '/api/storage/upload' app lib docs
rg -n 'storage/upload|report-photo|homepage-|FormData|formData|kind|bucket|storage_path' app lib
rg -n 'logger|structured log|console\.(warn|error|info)|pino|winston' app lib
git diff --check
npm run lint
npx tsc --noEmit --pretty false
npm run build
node app/api/storage/upload/verify-SEC-001.mjs
git diff -- app/api/storage/upload/route.ts
git diff -- docs/reconstruction/issues/SEC-001_IMPLEMENTATION_EVIDENCE.md
git diff --stat
git status --short
```

The first restricted `npm run build` compiled successfully and then failed while spawning a Next.js worker with `Error: spawn EPERM`. Following the repository-documented procedure, the out-of-sandbox retry passed. The final source was rechecked with lint, TypeScript, build, and the 15 assertions after the last route edit.

## Lint result

Pass: exit code 0, 0 errors, 11 pre-existing warnings outside the SEC-001 route (nine `@next/next/no-img-element` warnings and two `react-hooks/exhaustive-deps` warnings).

## TypeScript result

Pass: `npx tsc --noEmit --pretty false` exited 0 with no diagnostics.

## Build result

Pass on the documented out-of-sandbox retry: Next.js 16.2.9 compiled, completed TypeScript, generated 29 routes/pages, and included dynamic route `/api/storage/upload`.

## Security limitations

Homepage upload remains disabled because no trusted administrator authority exists.

Residual risks remain tracked separately: broad service-role usage (SEC-005), declared-MIME-only validation without magic-byte/decode/pixel checks (SEC-007), non-durable rate limiting (SEC-012), and no explicit origin/CSRF policy (SEC-016). The static implementation phase did not inspect deployed bucket contents, deployed policies, logs, or incident history.

## Deferred dependencies

- Define a trusted server-side administrator authority before any homepage upload can be re-enabled.
- Independently execute the HTTP actor/category/side-effect matrix in an authorized non-production environment.
- Complete SEC-005, SEC-007, SEC-012, and SEC-016 under separate approved contracts.
- No schema, migration, RLS, storage-policy, environment, dependency, UI, renderer, payment, or prototype change was made.

## Rollback instructions

With explicit authorization, revert only `app/api/storage/upload/route.ts` and remove only this implementation evidence file while preserving all unrelated user work. Do not touch `prototype/wizard-step4.html`. A rollback must never restore homepage/public upload; if report upload is impaired, keep homepage kinds disabled and return to human review.

## Git diff summary

Task-owned diff is limited to one upload route, one dependency-free route-local verification file, and this implementation evidence document. The only additional working-tree entry is the pre-existing unstaged `prototype/wizard-step4.html` user change. No file is staged.

## Handoff to QA

Open a new Codex chat
→ QA/Red-Team Agent
→ independently inspect SEC-001 diff
→ independently execute negative matrix
→ create SEC-001_QA_REPORT.md
→ do not modify implementation code

QA must use an authorized non-production environment, verify zero privileged calls and zero storage/database side effects on every denial, test a user-A/user-B project boundary, force storage/signed-URL/metadata failures, and confirm cleanup before reporting approval or findings.
## QA Remediation

### QA finding

`QA-SEC001-001`

### Root cause

The route trimmed the untrusted multipart `kind` before exact comparison. That normalization allowed leading/trailing ASCII space, trailing tab, and trailing non-breaking-space variants of `report-photo` to cross the category gate.

### Change made

Authorization now reads `rawKindEntry` from `FormData`, rejects missing, non-string, and empty values, assigns the string directly to `rawKind`, and compares the unmodified value. No `trim()`, `trimStart()`, `trimEnd()`, `toLowerCase()`, `normalize()`, or `replace()` is applied to the authorization value.

### Exact-kind behavior

Only raw exact `report-photo` passes the category gate. Raw `homepage-*` remains `403`; every other raw string remains `400`. Authentication ordering, service-role ordering, bucket selection, path construction, ownership validation, file validation, cleanup, success response shape, and the active caller are unchanged.

### Verifier additions

The route-local verifier is labeled and implemented as dependency-free route-policy/static verification, not an HTTP integration test. It now:

- mirrors the raw classification policy and executes a 20-case in-memory matrix;
- asserts exact `report-photo` passes;
- rejects `report-photo ` and ` report-photo`;
- rejects tab-only and `report-photo\t`;
- rejects `report-photo` followed by U+00A0 non-breaking space;
- rejects `REPORT-PHOTO` and `report_photo`;
- preserves `403` for raw `homepage-hero`, `homepage-`, and `homepage-report-photo`;
- preserves `400` for missing, null, empty, whitespace-only, unknown, marketing, public, and padded homepage values;
- inspects the production policy source for direct raw assignment and `rawKind === "report-photo"`;
- fails if `trim`, `trimStart`, `trimEnd`, `toLowerCase`, `normalize`, or `replace` is called on the authorization variable;
- confirms the active caller still sends exact `report-photo` without `bucket` or `path`.

### Exact-kind matrix results

| Raw value | Result |
|---|---|
| `undefined` | `400` |
| `null` | `400` |
| empty string | `400` |
| single space | `400` |
| tab only | `400` |
| `report-photo` | `PASS_GATE` |
| `report-photo ` | `400` |
| ` report-photo` | `400` |
| `report-photo\t` | `400` |
| `report-photo` + U+00A0 | `400` |
| `REPORT-PHOTO` | `400` |
| `report_photo` | `400` |
| `homepage-hero` | `403` |
| `homepage-` | `403` |
| `homepage-report-photo` | `403` |
| `homepage` | `400` |
| ` homepage-hero` | `400` |
| `marketing-hero` | `400` |
| `public-asset` | `400` |
| arbitrary string | `400` |

### Validation results

| Command | Exit | Result |
|---|---:|---|
| `git diff --check` | 0 | Pass; only the preserved prototype LF-to-CRLF warning was emitted. |
| `node app/api/storage/upload/verify-SEC-001.mjs` | 0 | Pass: 39 dependency-free route-policy/static assertions (20 matrix, 19 source/caller). |
| `npm run lint` | 0 | Pass: 0 errors, 11 pre-existing warnings outside the SEC-001 files. |
| `npx tsc --noEmit` | 0 | Pass: no TypeScript diagnostics. |
| `npm run build` in restricted sandbox | 1 | Compiled successfully, then hit the known environment exception `Error: spawn EPERM`. |
| `npm run build` through the approved out-of-sandbox procedure | 0 | Pass: Next.js 16.2.9, TypeScript completed, static generation reached 29/29, and `/api/storage/upload` was included. |

`tsconfig.tsbuildinfo` was absent before validation, generated by the gates, and removed afterward. `.next/` was not deleted.

### Remaining limitations

All previously accepted limitations remain:

- no live production or non-production storage/database mutation was performed;
- no live authenticated HTTP actor matrix, user-A/user-B runtime test, forced provider failure, or browser Step 3 smoke test was performed;
- the repository still has no trusted administrator authority, so homepage upload remains disabled for every authenticated actor;
- draft schema and documented storage policies do not prove deployed Supabase state;
- SEC-005, SEC-007, SEC-012, SEC-013, and SEC-016 remain residual risks as previously documented.

`QA-SEC001-002`, `QA-SEC001-003`, and `QA-SEC001-004` remain deferred and unchanged.

### Re-QA requirement

Independent QA must be performed in a new Codex chat. The QA/Red-Team Agent must rerun the full SEC-001 negative matrix, verify the non-blocking findings were not modified, update or replace `SEC-001_QA_REPORT.md`, make no implementation change, and stop for human review.

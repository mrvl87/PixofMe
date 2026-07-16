# SEC-001 Release Evidence

## Release status

READY - Awaiting Human Approval

## Agent

Release Agent - SEC-001 Release Review

## Review date

2026-07-16 (Asia/Jayapura)

## Branch

`fix/sec-001-homepage-upload`

## HEAD

`8f3c7620d907c221e683e893ecb7e81b6b091fcd`

## Foundation checkpoint

`71176a59dd1e4b7c00e554065e596752800cd054` - `chore: establish agentic reconstruction foundation`

## Approved contract checkpoint

`8f3c7620d907c221e683e893ecb7e81b6b091fcd` - `docs: approve SEC-001 execution contract`. The tracked contract is visible and approves Option C, fail-closed homepage upload.

## Workflow evidence sequence

PASS. The preserved sequence is:

```text
Foundation checkpoint
-> Approved SEC-001 contract
-> Implementation evidence
-> Recovery checkpoint
-> Initial QA FAIL
-> Billing/Security remediation
-> Independent re-QA PASS
-> Release review
```

The contract predates implementation. The original QA failure remains preserved in `SEC-001_QA_REPORT.md`; remediation is recorded in `SEC-001_IMPLEMENTATION_EVIDENCE.md`; re-QA marks only `QA-SEC001-001` resolved. Deferred findings remain open. No release evidence existed before this review.

## Files reviewed

- `AGENTS.md`
- `.ai/agents/release-agent.md`
- `.ai/workflows/SECURITY_FIX_WORKFLOW.md`
- `.ai/workflows/RELEASE_WORKFLOW.md`
- `.ai/skills/release-evidence/SKILL.md`
- `.ai/skills/security-threat-model/SKILL.md`
- `docs/reconstruction/QUALITY_GATES.md`
- `docs/reconstruction/SECURITY_REGISTER.md`
- `docs/reconstruction/issues/SEC-001_EXECUTION_CONTRACT.md`
- `docs/reconstruction/issues/SEC-001_IMPLEMENTATION_EVIDENCE.md`
- `docs/reconstruction/issues/SEC-001_RECOVERY_CHECKPOINT.md`
- `docs/reconstruction/issues/SEC-001_QA_REPORT.md`
- `app/api/storage/upload/route.ts`
- `app/api/storage/upload/verify-SEC-001.mjs`
- `app/pixforme.tsx`
- Git branch, HEAD, log, tracked files, staged state, dirty paths, diff, and diff statistics

## Final implementation summary

PASS by direct code inspection and supporting static verification. Authentication occurs before multipart parsing and before service-role construction. Anonymous requests return `401`. The unmodified raw multipart `kind` is classified without trimming, case conversion, Unicode normalization, or replacement. Only exact raw `report-photo` proceeds. Raw `homepage-*` returns `403`; missing, empty, padded, case-changed, Unicode-whitespace, marketing, public, and unknown values return `400`.

MIME allowlisting, the 15 MB limit, owner-bound project lookup, UUID object names, `upsert:false`, generic provider errors, cleanup attempts, metadata insertion, and the successful `{ photo }` response remain present.

## Final authorization behavior

| Actor/input | Final behavior |
|---|---|
| Anonymous request | `401 Unauthorized` before body parsing and privileged client construction |
| Authenticated exact raw `report-photo` | Continues to file, ownership, server target, upload, URL, and metadata validation |
| Authenticated raw `homepage-*` | `403 Forbidden` |
| Missing, empty, padded, normalized variant, marketing, public, or unknown kind | `400 Bad Request` |
| Client multipart `bucket` or `path` | `400 Bad Request` |

## Active caller compatibility

PASS. The only active production caller found is `uploadFiles` in `app/pixforme.tsx`. It sends exact `kind=report-photo`, sends neither `bucket` nor `path`, posts to `/api/storage/upload`, and consumes `payload.photo.url` plus the returned photo data. No second active caller or homepage uploader was found in `app/` or `lib/`.

## Bucket and path authority

PASS. The route selects the private report bucket through `getSupabaseStorageBucket()` only. The object path is constructed server-side from the authenticated owner ID, fixed `report-photos` segment, optional ownership-verified project ID, server date, server UUID, sanitized basename, and MIME-derived extension. Client `bucket` and `path` fields are rejected and cannot select the destination.

## Ownership enforcement

PASS by code/static evidence. The authenticated session supplies `ownerId`. Optional project ownership is checked with both project ID and `owner_id` before service-role construction. Non-owned or missing projects follow the non-enumerating `404` path. A live user-A/user-B runtime test was not performed and is an accepted limitation.

## Scope integrity

PASS. Every dirty path was classified:

| Path | Classification |
|---|---|
| `app/api/storage/upload/route.ts` | SEC-001 implementation |
| `app/api/storage/upload/verify-SEC-001.mjs` | SEC-001 verifier |
| `docs/reconstruction/issues/SEC-001_IMPLEMENTATION_EVIDENCE.md` | SEC-001 evidence |
| `docs/reconstruction/issues/SEC-001_RECOVERY_CHECKPOINT.md` | SEC-001 evidence |
| `docs/reconstruction/issues/SEC-001_QA_REPORT.md` | SEC-001 evidence |
| `docs/reconstruction/issues/SEC-001_RELEASE_EVIDENCE.md` | SEC-001 evidence |
| `prototype/wizard-step4.html` | Known user-owned change; explicitly excluded |

No unexpected application, UI, schema, migration, RLS, storage-policy, auth, payment, dependency, environment, or report-renderer drift was found. Nothing is staged.

## QA result

PASS - Ready for Release Review. Current re-QA status is PASS, blocking findings are none, and the original FAIL record remains preserved below the current re-QA record.

## Resolved blocking findings

- `QA-SEC001-001` - Resolved. Authorization compares the unmodified raw kind, and padded/case/Unicode-whitespace regression cases are covered.

## Deferred non-blocking findings

- `QA-SEC001-002` - Open and deferred: declared MIME/content and zero-byte validation.
- `QA-SEC001-003` - Open and deferred: persisted/display filename sanitation.
- `QA-SEC001-004` - Open and deferred: cleanup observability and upload idempotency.

These findings were not modified, silently fixed, removed, or described as resolved.

## Accepted limitations

- No live production storage mutation.
- No live database mutation.
- No live authenticated HTTP actor matrix.
- No live user-A/user-B test.
- No forced provider failure.
- No browser Step 3 smoke test.
- No proof of deployed Supabase schema or policy state.

These limitations were explicitly accepted by the repository owner for SEC-001 and are not represented as executed evidence.

## Residual risks

- `SEC-005` - Broad service-role use remains.
- `SEC-007` - Declared-MIME-only validation and missing decode/magic-byte/pixel enforcement remain.
- `SEC-012` - Durable rate limiting remains absent.
- `SEC-013` - Seven-day signed URL exposure remains.
- `SEC-016` - Explicit origin/CSRF policy remains absent.

## Verifier assessment

`node app/api/storage/upload/verify-SEC-001.mjs` passed 39/39 assertions: 20 exact-kind matrix assertions and 19 route/source/caller assertions. It checks padded ASCII, tab, case, Unicode non-breaking-space, normalization regressions, authorization ordering, server target authority, cleanup branches, and active caller compatibility. Assertions throw and produce a non-zero exit on failure.

Accurate classification: **Dependency-free route-policy/static verification**. It is not an HTTP integration test. It remains limited supporting evidence, supplemented by independent direct code inspection.

## Final validation commands

| Command | Exit | Result | Assertions/warnings/diagnostics/routes | Environment exception |
|---|---:|---|---|---|
| `git diff --check` | 0 | PASS | No whitespace error; one LF-to-CRLF warning for the preserved prototype file | None |
| `node app/api/storage/upload/verify-SEC-001.mjs` | 0 | PASS | 39/39 assertions: 20 matrix, 19 source/caller | None |
| `npm run lint` | 0 | PASS | 0 errors, 11 pre-existing warnings | None |
| `npx tsc --noEmit` | 0 | PASS | No diagnostics | None |
| `npm run build` in restricted environment | 1 | Environment failure after successful compile | Compile succeeded; TypeScript phase started | `Error: spawn EPERM` |
| Approved out-of-sandbox `npm run build` retry | 0 | PASS | Next.js 16.2.9; TypeScript completed; static generation 29/29; `/api/storage/upload` included | Approved retry procedure used |

`tsconfig.tsbuildinfo` was absent before validation, generated by the gates, and removed afterward. `.next/` was not deleted.

## Lint result

PASS, exit 0: 0 errors and 11 pre-existing warnings (nine `@next/next/no-img-element` and two `react-hooks/exhaustive-deps`). No warning is in the SEC-001 route or verifier.

## TypeScript result

PASS, exit 0: `npx tsc --noEmit` completed with no diagnostics.

## Build result

PASS through the approved procedure. The restricted build compiled and then failed with the known environment exception `Error: spawn EPERM`. The approved out-of-sandbox retry exited 0, finished TypeScript, generated 29/29 static pages, and included dynamic route `/api/storage/upload`.

## Proposed commit manifest

Only these files may be staged in a future human-approved commit:

```text
app/api/storage/upload/route.ts
app/api/storage/upload/verify-SEC-001.mjs
docs/reconstruction/issues/SEC-001_IMPLEMENTATION_EVIDENCE.md
docs/reconstruction/issues/SEC-001_RECOVERY_CHECKPOINT.md
docs/reconstruction/issues/SEC-001_QA_REPORT.md
docs/reconstruction/issues/SEC-001_RELEASE_EVIDENCE.md
```

## Explicitly excluded files

`prototype/wizard-step4.html` is a known user-owned change. It must remain modified, untouched, unstaged, excluded from the SEC-001 commit, and excluded from rollback.

## Proposed commit message

```text
fix: restrict storage upload to report photos

- fail closed for homepage and public asset categories
- allow only exact raw report-photo
- keep bucket, path, and ownership decisions server-side
- add dependency-free SEC-001 regression verification
- include implementation, recovery, QA, and release evidence
```

## Rollback plan

Fail-closed rollback unit and procedure:

1. Do not restore the old client-controlled homepage bucket mapping.
2. If SEC-001 must be withdrawn, replace the upload route with a fail-closed endpoint that rejects every upload category, or preserve only the verified `report-photo` path.
3. Never restore `homepage-*` support without trusted server-side administrator authority and a separately approved contract.
4. Re-run caller compatibility, exact-kind, and negative authorization gates after rollback.

Files in the SEC-001 rollback unit are `app/api/storage/upload/route.ts`, `app/api/storage/upload/verify-SEC-001.mjs`, and the SEC-001 implementation, recovery, QA, and release evidence documents. `prototype/wizard-step4.html` is never part of rollback.

## Release blockers

None identified for human review. Production release, merge, push, and deployment remain unauthorized until human approval.

## Human approval checklist

- [ ] Approve SEC-001 final diff
- [ ] Approve accepted limitations
- [ ] Approve deferred findings
- [ ] Approve proposed commit manifest
- [ ] Confirm prototype/wizard-step4.html exclusion
- [ ] Approve local commit
- [ ] Decide whether branch should be pushed
- [ ] Decide whether a pull request should be opened

## Recommended next workflow

```text
Human reviews SEC-001 release evidence
-> approve or reject final diff, limitations, deferred risks, rollback, and commit manifest
-> if approved, open a new Codex chat as Lead Orchestrator
-> stage only the approved SEC-001 manifest
-> verify prototype exclusion
-> create one local SEC-001 commit
-> stop before push or pull request
```

Exact next agent: **Lead Orchestrator - Human Approval and Commit Preparation**.

## Final Git status

Expected after creating this release evidence:

```text
 M app/api/storage/upload/route.ts
 M prototype/wizard-step4.html
?? app/api/storage/upload/verify-SEC-001.mjs
?? docs/reconstruction/issues/SEC-001_IMPLEMENTATION_EVIDENCE.md
?? docs/reconstruction/issues/SEC-001_QA_REPORT.md
?? docs/reconstruction/issues/SEC-001_RECOVERY_CHECKPOINT.md
?? docs/reconstruction/issues/SEC-001_RELEASE_EVIDENCE.md
```

Nothing is staged. The Release Agent modified no implementation, verifier, prior evidence, prototype, schema, migration, RLS, auth, payment, dependency, environment, UI, or renderer file.

# SEC-001 Independent QA and Red-Team Report

## Current QA status

PASS - Ready for Release Review

## Re-QA summary

Independent re-QA confirms QA-SEC001-001 is resolved. Only unmodified raw report-photo passes; padded, case, Unicode-whitespace, and unknown variants are 400; raw homepage-* is 403.

## Re-QA identity and baseline

Role: QA/Red-Team Agent - SEC-001 Re-QA. Date: 2026-07-16 Asia/Jayapura. Branch: fix/sec-001-homepage-upload. HEAD/contract: 8f3c7620d907c221e683e893ecb7e81b6b091fcd. Foundation: 71176a59dd1e4b7c00e554065e596752800cd054.

## Handoff and scope integrity

PASS. Expected contract/files/dirty set present; nothing staged; no unexpected path. Remediation limited to raw-kind authorization, verifier, and implementation evidence. Auth/service-role order, bucket/path, ownership, MIME/size, cleanup, response, and caller unchanged. No schema, RLS, auth, UI, payment, dependency, environment, renderer, or unrelated drift. Prototype remained modified, untouched, and unstaged.

## QA-SEC001-001 re-test

Resolved. rawKindEntry is read from FormData, non-string/empty is rejected, rawKind is directly assigned without normalization, raw homepage-* is denied, only exact report-photo passes, and every rejection precedes service-role construction.

## Raw-kind matrix

Independent dependency-free policy matrix: 29/29 pass. Evidence for every row: Code/static plus Dependency-free policy matrix; not HTTP integration.

| Raw input | Expected | Actual | Result |
|---|---:|---:|---|
| missing | 400 | 400 | Pass |
| null/no field | 400 | 400 | Pass |
| non-string/File | 400 | 400 | Pass |
| empty | 400 | 400 | Pass |
| ASCII space | 400 | 400 | Pass |
| tab | 400 | 400 | Pass |
| newline | 400 | 400 | Pass |
| exact report-photo | PASS_GATE | PASS_GATE | Pass |
| report-photo trailing space | 400 | 400 | Pass |
| report-photo leading space | 400 | 400 | Pass |
| report-photo trailing tab | 400 | 400 | Pass |
| report-photo leading tab | 400 | 400 | Pass |
| report-photo trailing newline | 400 | 400 | Pass |
| report-photo trailing NBSP | 400 | 400 | Pass |
| report-photo leading NBSP | 400 | 400 | Pass |
| REPORT-PHOTO | 400 | 400 | Pass |
| Report-Photo | 400 | 400 | Pass |
| report_photo | 400 | 400 | Pass |
| report--photo | 400 | 400 | Pass |
| homepage-hero | 403 | 403 | Pass |
| homepage- | 403 | 403 | Pass |
| homepage-report-photo | 403 | 403 | Pass |
| homepage | 400 | 400 | Pass |
| homepage-hero leading space | 400 | 400 | Pass |
| homepage-hero trailing space | 403 | 403 | Pass |
| homepage Unicode hyphen lookalike | 400 | 400 | Pass |
| marketing-hero | 400 | 400 | Pass |
| public-asset | 400 | 400 | Pass |
| arbitrary string | 400 | 400 | Pass |

## Verifier quality

Limited supporting evidence. 39/39 pass (20 matrix, 19 source/caller) and the old direct trim regression is detected. Remaining non-blocking false positives: mirrored classifier, regex comments/dead code, alias normalization, textual-order limitations, and caller regex not bound to one FormData/fetch. Direct inspection of current executable route closes these for SEC-001.

## Regression reviews

Authorization order PASS; anonymous 401; all rejection paths terminate before privilege. Active caller PASS: app/pixforme.tsx uploadFiles sends exact report-photo, no bucket/path, consumes payload.photo.url; no second caller. Bucket/path PASS: server controlled, owner prefix, UUID, upsert:false. Ownership PASS: project id plus owner_id before service role, failures closed. File/cleanup PASS: MIME allowlist, 15 MB, MIME extension, sanitation, cleanup attempts, and generic errors unchanged.

## Commands and results

| Command | Exit | Result |
|---|---:|---|
| Git handoff checks and required rg | 0 | Expected state; one caller |
| Independent raw-kind matrix | 0 | 29/29 pass |
| Initial ad-hoc node -e matrix | 1 | PowerShell quoting SyntaxError; corrected; no repo change |
| git diff --check | 0 | Pass; prototype LF-to-CRLF warning only |
| SEC-001 verifier | 0 | 39/39 pass |
| npm run lint | 0 | 0 errors, 11 pre-existing warnings |
| npx tsc --noEmit | 0 | No diagnostics |
| npm run build restricted | 1 | Compiled, then known spawn EPERM |
| npm run build approved retry | 0 | Next.js 16.2.9; static generation 29/29; upload route included |

tsconfig.tsbuildinfo was absent before gates, generated, then removed. .next was not deleted.

## Findings disposition

QA-SEC001-001: Resolved. QA-SEC001-002, QA-SEC001-003, and QA-SEC001-004: Open - Non-blocking and deferred. New findings: none. Blocking findings: none.

## Accepted limitations and residual risks

No live storage/database mutation, HTTP actor matrix, user-A/user-B runtime test, forced provider-failure test, or browser Step 3 smoke test; human-approved. SEC-005, SEC-007, SEC-012, SEC-013, SEC-016, cleanup/idempotency, and static-verifier limits remain deferred.

## Re-QA conclusion

PASS - Ready for Release Review. Exact raw-kind authorization is enforced, QA-SEC001-001 is resolved, gates pass through the approved build procedure, scope is intact, and no new blocker exists.

## Recommended next workflow

Open a new Codex chat -> Release Agent -> inspect contract, implementation evidence, recovery checkpoint, and re-QA PASS -> verify final diff/evidence/gates/rollback -> create SEC-001_RELEASE_EVIDENCE.md -> do not modify implementation -> do not stage or commit -> stop for human approval.

## Git status

Expected dirty set unchanged: route and prototype modified; verifier, implementation evidence, QA report, and recovery checkpoint untracked. Nothing staged. Re-QA modified only this report. Implementation code was not modified. Prototype remains untouched and unstaged.

# Original QA Record

# SEC-001 Independent QA and Red-Team Report

## QA status

FAIL — Remediation Required

## Agent

QA/Red-Team Agent (independent reviewer; no implementation ownership)

## Audit date

2026-07-16 (Asia/Jayapura)

## Branch

`fix/sec-001-homepage-upload`

## HEAD

`8f3c7620d907c221e683e893ecb7e81b6b091fcd`

## Contract baseline

Approved Option C — Fail-closed homepage upload, committed at `8f3c7620d907c221e683e893ecb7e81b6b091fcd`. Foundation commit: `71176a59dd1e4b7c00e554065e596752800cd054`.

## Files reviewed

- `AGENTS.md`
- `.ai/agents/qa-red-team-agent.md`
- `.ai/workflows/SECURITY_FIX_WORKFLOW.md`
- `.ai/skills/security-threat-model/SKILL.md`
- `.ai/skills/api-contract/SKILL.md`
- `.ai/skills/media-storage-lifecycle/SKILL.md`
- `docs/reconstruction/QUALITY_GATES.md`
- `docs/reconstruction/SECURITY_REGISTER.md`
- `docs/reconstruction/issues/SEC-001_EXECUTION_CONTRACT.md`
- `docs/reconstruction/issues/SEC-001_IMPLEMENTATION_EVIDENCE.md`
- `docs/reconstruction/issues/SEC-001_RECOVERY_CHECKPOINT.md`
- `app/api/storage/upload/route.ts`
- `app/api/storage/upload/verify-SEC-001.mjs`
- Active production caller in `app/pixforme.tsx`
- Supporting server configuration/types in `lib/env.ts`, `lib/supabase/server.ts`, and `lib/supabase/database.types.ts`
- Relevant draft table/RLS/storage sections in `docs/SUPABASE_SCHEMA.sql`; these were treated as design evidence, not deployed-state proof.

`prototype/` was excluded from audit evidence and was not read or modified.

## Repository handoff state

Handoff was valid at audit start:

- branch exactly `fix/sec-001-homepage-upload`;
- HEAD exactly `8f3c7620d907c221e683e893ecb7e81b6b091fcd`;
- approved execution contract tracked and visible;
- no staged files;
- dirty set exactly matched the handoff: modified upload route, preserved modified prototype file, and the three expected untracked SEC-001 implementation/verifier/checkpoint files;
- no QA report existed before this audit.

## Scope integrity

The tracked implementation diff is localized to `app/api/storage/upload/route.ts`; the only other tracked diff is the known user-owned `prototype/wizard-step4.html`. No schema, migration, RLS, storage policy, auth, payment, report-renderer, dependency, environment, or unrelated application change was found. This QA task created only this report. No source was edited, staged, committed, or pushed.

## Implementation summary

The implementation removes homepage bucket selection, authenticates before multipart parsing, denies `homepage-*`, rejects unknown kinds and client `bucket`/`path`, preserves the owner-bound project lookup, selects the private report bucket server-side, builds an owner-prefixed UUID path, keeps `upsert:false`, maps dependency failures to generic responses, and attempts cleanup after signed-URL or metadata failure.

The implementation is not contract-complete because it trims the untrusted `kind` before comparison. Padded values such as `report-photo `, ` report-photo`, `report-photo\t`, and `report-photo` followed by non-breaking space become `report-photo` and pass the security gate. The contract and mandatory negative matrix require only the exact raw value `report-photo` to pass.

## Active caller verification

| File | Symbol | Upload purpose | `kind` | Bucket sent | Path sent | Response consumed | Reachable production code |
|---|---|---|---|---|---|---|---|
| `app/pixforme.tsx` | `uploadFiles` | One report-photo upload per prepared Step 3 image | exact `report-photo` | No | No | Requires HTTP OK and `payload.photo.url`, then spreads `payload.photo` into gallery/report state | Yes |

Repository search across `app/` and `lib/` found no second caller and no active homepage uploader. The active caller is compatible.

## Authorization-order review

- `createSupabaseServerClient()` and `auth.getUser()` run before content-type checking, body parsing, kind evaluation, or service-role construction.
- Missing authenticated identity returns `401`; anonymous report and homepage attempts cannot reach the service-role client by code order.
- Multipart parse failure returns `400` and stops.
- Kind, client target fields, file presence, declared MIME, size, and optional project ownership are evaluated before `createSupabaseServiceRoleClient()`.
- Homepage denial is server-side and independent of UI behavior.
- Unknown categories have no permissive fallback.
- Every error branch returns immediately.
- A non-string `kind` (including a File entry) becomes invalid and returns `400`.
- For duplicate multipart `kind` entries, WHATWG `FormData.get()` uses the first entry. A first `homepage-*` is denied; a first exact/padded report kind can pass and later duplicate values are ignored. Duplicate values do not influence bucket/path selection, but the verifier does not test this ambiguity.
- Blocking deviation: trimming occurs before equality, so the raw allowlist is not exact.

## Kind allowlist red-team review

| Raw input | Code conclusion | Expected | Result |
|---|---:|---:|---|
| missing / `undefined` / `null` | 400 | 400 | Pass |
| empty string | 400 | 400 | Pass |
| whitespace-only | 400 | 400 | Pass |
| `homepage-hero` | 403 | 403 | Pass |
| `homepage-` | 403 | 403 | Pass |
| `homepage-report-photo` | 403 | 403 | Pass |
| `homepage` | 400 | 400 | Pass |
| exact `report-photo` | passes security gate | passes security gate | Pass |
| `report-photo ` | passes security gate after trim | 400 | **Fail** |
| ` report-photo` | passes security gate after trim | 400 | **Fail** |
| `report-photo\t` / Unicode trailing whitespace | passes security gate after trim | 400 | **Fail** |
| `REPORT-PHOTO` | 400 | 400 | Pass |
| `report_photo` | 400 | 400 | Pass |
| `marketing-hero` | 400 | 400 | Pass |
| `public-asset` | 400 | 400 | Pass |
| arbitrary string | 400 | 400 | Pass |
| Unicode lookalike `homepage‐hero` | 400 | 400 unknown category | Pass |

The code uses equality after normalization, not equality against the exact raw multipart value. No homepage or marketing category reaches a public bucket, but the approved exact allowlist is bypassable.

## Bucket and path control review

- Multipart fields named exactly `bucket` or `path` are rejected with `400` for an otherwise eligible report kind, even if empty or duplicated.
- Query parameters, request headers, and unrelated multipart fields (`folder`, `directory`, `object`, `filename`, `owner`, `userId`, privilege markers) are not read as upload authority.
- The bucket comes only from `getSupabaseStorageBucket()`.
- The object path is built from authenticated `ownerId`, fixed `report-photos`, optional ownership-verified `projectId`, server date, server UUID, sanitized/capped basename, and MIME-derived extension.
- `../../homepage/hero.png`, Windows separators, absolute paths, encoded traversal text, slash-containing names, dot names, empty names, long names, and Unicode slash-like characters cannot escape the fixed owner prefix because separators/non-allowlisted characters are replaced and a UUID-prefixed leaf is used.
- `upsert:false` remains enabled; filenames are not the sole identifier; the client cannot select the owner prefix.

Result: Pass by code/static evidence. No live storage write was performed.

## Ownership review

- Identity is taken only from the verified Supabase session.
- Request fields cannot supply `ownerId`.
- Optional `projectId` is checked with both `.eq("id", projectId)` and `.eq("owner_id", ownerId)` before service-role construction.
- Missing/empty project ID retains the existing projectless upload behavior.
- Another user's or nonexistent project resolves to the same `404` path when no matching row is returned.
- Database lookup error returns generic `502`; malformed UUID input therefore fails closed rather than falling back to allow.
- Metadata uses the same session-derived owner and verified project ID; the object path remains under the session owner's prefix.
- The draft schema shows an owner-bound composite foreign key for `gallery_photos`, but deployed enforcement was not claimed or tested.

Result: Pass by code/static evidence. No live user-A/user-B actor test was performed under the accepted limitation.

## File validation review

Proven by code: selected entry must be a `File`; declared MIME must be JPEG/PNG/WebP; selected file size must not exceed 15 MB; object extension comes from the MIME map; path basename is sanitized and capped; unsupported MIME and oversized selected files are rejected before service-role use.

Not proven or absent: binary magic-byte/decode/pixel validation; a minimum non-zero size; total multipart request-size enforcement; rejection of extra file fields; sanitation/length capping of the persisted/display `originalName || file.name`. A double extension cannot control the object extension, but declared-MIME spoofing remains possible. Multiple file fields use the first `file`; a non-File first value returns `400`.

These are pre-existing media-validation risks and were not introduced by SEC-001. They are classified below as non-blocking/out of scope for this authorization fix.

## Failure and cleanup review

- Storage upload error: generic `502`; metadata is not attempted.
- Missing/malformed signed URL or signed-URL error: object removal is awaited, then generic `502` is returned.
- Metadata insert error: object removal is awaited, then generic `502` is returned.
- Cleanup return errors are ignored and cleanup exceptions fall into the generic `500`; an orphan can remain if compensation fails.
- Ambiguous provider outcomes can still produce object/row inconsistency because storage and metadata are not atomic.
- UUID plus `upsert:false` prevents overwrite but repeated requests create separate objects/rows; no idempotency key is present.
- Unexpected failure after successful metadata persistence can return `500`, prompting a duplicate retry even though state exists.

Required SEC-001 cleanup branches are present and were not regressed. Cleanup-failure recovery and upload idempotency remain non-blocking residual risks.

## Error and information-leakage review

| Scenario | Status/response conclusion |
|---|---|
| Unauthenticated | 401, generic login-required message |
| Homepage attempt | 403, generic denial |
| Missing/unknown kind | 400, generic category error |
| Malformed multipart / missing file | 400, generic payload/file error |
| Invalid declared MIME | 415, fixed allowlist message |
| Oversized selected file | 413, fixed size message |
| Project lookup failure | 502 generic; no provider detail |
| Project absent or owned by another user | 404, same non-enumerating path |
| Storage failure | 502 generic |
| Signed URL failure | 502 generic after cleanup attempt |
| Metadata failure | 502 generic after cleanup attempt |
| Unexpected exception | 500 generic |

Error responses do not expose service-role keys, tokens, cookies, raw provider messages, bucket targets, object paths, database details, stack traces, filesystem paths, or environment values. The preserved successful `{ photo }` response still includes bucket/storage path fields for caller compatibility; this is not an error leak and was not changed by SEC-001.

## Verification-script quality

**Limited supporting evidence.** The verifier reads current route/caller text and supplies useful regression signals for auth ordering, status branches, server bucket/path indicators, validations, cleanup occurrence, and caller compatibility. It is not an HTTP integration test and uses string indexes/regular expressions that can pass on dead, reordered, or unrelated text. In particular:

- it does not test raw padded/Unicode-whitespace report kinds and passes despite the exact-allowlist bypass;
- its `unknown-kind-400` assertion sees a comparison to `report-photo` but does not detect preceding normalization;
- it does not prove every authorization/target branch precedes service-role construction;
- caller matching is not bound to the same FormData instance and endpoint call;
- cleanup checks count two calls but do not prove cleanup success or correct failure execution;
- no bucket/path query/header behavior, duplicate fields, ownership outcomes, provider failures, or side effects are executed.

The verifier's 15 passing assertions therefore provide false confidence if described as proof of an exact allowlist.

## Negative test matrix

| Scenario | Expected | Evidence type | Actual conclusion | Pass/Fail |
|---|---:|---|---|---|
| Anonymous + report-photo | 401 | Code/static | Auth return precedes body and service role | Pass |
| Anonymous + homepage-* | 401 | Code/static | Same auth-first return | Pass |
| Auth user + missing kind | 400 | Code/static | Empty normalized kind rejected | Pass |
| Auth user + empty kind | 400 | Code/static | Rejected | Pass |
| Auth user + unknown kind | 400 | Code/static | Rejected by comparison | Pass |
| Auth user + homepage-* | 403 | Code/static | Prefix denied | Pass |
| Auth user + forged homepage-report-photo | 403 | Code/static | Prefix denied | Pass |
| Auth user + marketing kind | 400 | Code/static | Rejected | Pass |
| Auth user + arbitrary bucket | Cannot control destination | Code/static | Multipart field rejected; other channels unused | Pass |
| Auth user + arbitrary path | Cannot control destination | Code/static | Multipart field rejected; other channels unused | Pass |
| Auth user + valid exact report-photo | Passes security gate | Code/static | Reaches file/ownership validation | Pass |
| Auth user + `report-photo ` | 400 | Code/static | Trimmed and reaches report gate | **Fail** |
| User + another user's project | Denied | Code/static | Owner-bound lookup; no permissive fallback | Pass |
| Valid kind + invalid MIME | Rejected | Code/static | 415 before service role | Pass |
| Valid kind + oversized file | Rejected | Code/static | 413 before service role | Pass |
| Traversal filename | Cannot escape owner prefix | Code/static | Sanitized UUID leaf under fixed owner path | Pass |
| Signed URL failure | Cleanup attempted | Code/static | Removal awaited | Pass |
| Metadata failure | Cleanup attempted | Code/static | Removal awaited | Pass |
| Storage failure | Safe error | Code/static | Generic 502, no metadata attempt | Pass |
| Active caller | Sends exact report-photo | Repository search | One compatible caller found | Pass |

No row is labeled Integration PASS.

## Commands executed

| Command | Exit | Result |
|---|---:|---|
| `git branch --show-current` | 0 | `fix/sec-001-homepage-upload` |
| `git rev-parse HEAD` | 0 | Expected contract commit |
| `git status --short` | 0 | Expected handoff set; no staged files |
| `git log -3 --oneline` | 0 | Contract, foundation, prior report-header commits |
| `git ls-files docs/reconstruction/issues/SEC-001_EXECUTION_CONTRACT.md` | 0 | Contract tracked |
| `git diff -- app/api/storage/upload/route.ts` | 0 | Localized SEC-001 route diff |
| `git diff --stat` / `git diff --name-status` | 0 | Route plus preserved prototype tracked diff |
| Required `rg -n "/api/storage/upload|storage/upload|report-photo|homepage-|FormData|kind|bucket|path" app lib` | 0 | One active endpoint caller found |
| `git diff --check` | 0 | Pass; LF-to-CRLF warnings for route and preserved prototype only |
| `node app/api/storage/upload/verify-SEC-001.mjs` | 0 | 15/15 scripted static assertions pass |
| `npm run lint` | 0 | 0 errors, 11 warnings |
| `npx tsc --noEmit` | 0 | No diagnostics |
| `npm run build` (restricted sandbox) | 1 | Compiled, then failed verbatim: `Error: spawn EPERM` |
| `npm run build` (approved out-of-sandbox retry) | 0 | Next.js 16.2.9; 29 routes/pages generated; `/api/storage/upload` included |
| Corrected in-memory kind matrix | 0 | Confirmed padded/Unicode-whitespace report kinds pass after trim |
| Corrected duplicate-FormData probe | 0 | Confirmed `FormData.get()` returns first duplicate value |

Three initial ad-hoc inspection one-liners had shell-quoting failures (two Node `SyntaxError` exits and one composite `rg` Windows path-parsing exit). They made no repository changes and were corrected/re-run successfully. `tsconfig.tsbuildinfo` was absent before QA, generated by the TypeScript/build gates, and removed afterward as instructed. `.next/` was not deleted.

## Lint result

PASS, exit 0: 0 errors and 11 warnings outside the upload route (nine `@next/next/no-img-element`, two `react-hooks/exhaustive-deps`).

## TypeScript result

PASS, exit 0: `npx tsc --noEmit` produced no diagnostics.

## Build result

PASS through the documented environment procedure. The restricted run compiled then failed with `Error: spawn EPERM` (exit 1). The approved out-of-sandbox retry exited 0, generated 29 routes/pages, and included `/api/storage/upload`.

## Findings

### QA-SEC001-001

- **Severity:** Medium
- **Title:** Raw kind normalization bypasses the exact `report-photo` allowlist and is missed by the verifier
- **Evidence:** `app/api/storage/upload/route.ts:54-65` trims the multipart value before equality. The independent matrix showed padded ASCII, tab, and Unicode-whitespace variants reach `PASS_GATE`. `app/api/storage/upload/verify-SEC-001.mjs:17-19` passes without testing this behavior, while implementation evidence states the value is exact.
- **Attack or failure scenario:** An authenticated client submits `kind=report-photo%20`, a leading space, a tab suffix, or a non-breaking-space suffix. The route normalizes it to `report-photo`, continues through privileged private upload processing, and contradicts the approved raw allowlist.
- **Impact:** No homepage/public bucket becomes reachable, but a non-exact category crosses the only approved category gate. This weakens the security contract and makes future category parsing/authorization changes more error-prone. The supporting verifier can report PASS while the mandatory negative case fails.
- **Contract requirement affected:** Only exact `report-photo` may pass; `report-photo ` must return `400`; verifier/evidence must not conceal a material failure.
- **Blocking status:** Blocking. The explicit QA blocking rule says any kind other than exact `report-photo` passing requires failure.
- **Required remediation:** Compare authorization against the unmodified string value; keep missing/empty/whitespace-only invalid; add padded ASCII/tab/Unicode-whitespace negative assertions; update implementation evidence; rerun all gates and a new independent QA.
- **Allowed remediation owner:** Billing/Security Agent.

### QA-SEC001-002

- **Severity:** High
- **Title:** Content validation still trusts declared MIME and accepts zero-byte payloads
- **Evidence:** `app/api/storage/upload/route.ts:73-90` checks File type, declared `file.type`, and only a maximum size; there is no `file.size > 0`, magic-byte, decode, or pixel validation before `arrayBuffer()` and upload.
- **Attack or failure scenario:** A client labels an empty, polyglot, corrupt, or non-image payload as an allowed MIME type and submits it as an otherwise authorized report photo.
- **Impact:** Invalid or malicious content can enter private media storage and metadata, with downstream decode/resource risk.
- **Contract requirement affected:** Media lifecycle/file validation guidance; tracked separately as SEC-007. Full content verification is explicitly out of SEC-001 scope.
- **Blocking status:** Non-blocking for SEC-001 because it is a documented pre-existing risk, was not worsened by this diff, and does not reopen homepage upload.
- **Required remediation:** Handle only under a separately approved SEC-007 contract: non-empty check, magic-byte/decode verification, pixel cap, safe re-encode/checksum, and adversarial tests.
- **Allowed remediation owner:** Billing/Security Agent under the future SEC-007 workflow, not this QA task.

### QA-SEC001-003

- **Severity:** Low
- **Title:** Persisted/display filename is not sanitized or length-capped
- **Evidence:** The object basename is sanitized/capped, but `app/api/storage/upload/route.ts:136` persists `originalName || file.name` unchanged into metadata and returns it.
- **Attack or failure scenario:** A client supplies control characters, separators, misleading Unicode, or an extremely long `originalName` while the safe object path remains unaffected.
- **Impact:** Metadata/UI/log confusion or dependency failure is possible; no owner-prefix or bucket escape was found.
- **Contract requirement affected:** File-validation request to review sanitized display filenames; not the SEC-001 category authorization control.
- **Blocking status:** Non-blocking/out of scope; behavior predates and is not worsened by SEC-001.
- **Required remediation:** Define and test a display-filename normalization/length contract in the media validation issue without changing object-path authority.
- **Allowed remediation owner:** Future media/storage implementation owner under a separate approved issue.

### QA-SEC001-004

- **Severity:** Medium
- **Title:** Cleanup and retries remain best-effort and non-idempotent
- **Evidence:** `app/api/storage/upload/route.ts:130,159` awaits removal but ignores returned cleanup errors; UUID paths at lines 111/137 create new object/row identities on every retry. Storage and metadata are separate provider operations.
- **Attack or failure scenario:** Cleanup fails after signed-URL/metadata failure, or a provider returns an ambiguous error after committing. An object can remain orphaned, a row can reference a removed object, or a client retry can create duplicates.
- **Impact:** Storage leakage, inconsistent metadata, and duplicate cost/state.
- **Contract requirement affected:** Cleanup/retry lifecycle. SEC-001 requires cleanup attempts, which are present; general idempotency and recovery are explicitly deferred.
- **Blocking status:** Non-blocking because required compensation is attempted, the risk predates this authorization change, and no SEC-001 cleanup regression was found.
- **Required remediation:** Future idempotency key/state-machine/reconciliation work plus observable cleanup failure handling.
- **Allowed remediation owner:** Future media/storage implementation owner under a separate approved contract.

## Blocking findings

- `QA-SEC001-001`: padded/Unicode-whitespace variants of `report-photo` pass despite the exact raw allowlist requirement; the verifier misses the failure.

## Non-blocking findings

- `QA-SEC001-002`: declared-MIME/zero-byte content validation gap, tracked with SEC-007.
- `QA-SEC001-003`: unsanitized/unbounded display filename metadata.
- `QA-SEC001-004`: best-effort cleanup and non-idempotent retries.

## Accepted limitations

- Per repository-owner disposition, no live production or non-production storage/database mutation was required or performed.
- No live authenticated HTTP actor matrix, user-A/user-B runtime test, forced provider failure, or browser Step 3 smoke test was performed. Conclusions are explicitly Code/static, repository search, and compile-gate evidence.
- The repository has no trusted administrator authority; homepage upload remains disabled for every authenticated actor.
- Draft schema/policies do not prove deployed Supabase state.

## Residual risks

- SEC-005: broad service-role use remains after application-layer authorization.
- SEC-007: declared-MIME-only validation, no decode/magic-byte/pixel check, and zero-byte acceptance.
- SEC-012: no durable upload quota/rate control.
- SEC-013: seven-day signed URL exposure remains.
- SEC-016: no explicit origin/CSRF policy for multipart mutation.
- Total multipart body size and duplicate fields are not independently bounded/rejected before body parsing.
- Cleanup failure is not observable/reconciled; report upload retries can duplicate state.
- No structured denial/security logging was added.

## Required remediation

For SEC-001 closure, remediate only `QA-SEC001-001`:

1. Enforce equality on the unmodified multipart string so only raw exact `report-photo` passes.
2. Keep missing, empty, whitespace-only, padded, differently cased, Unicode-whitespace, marketing, public, and homepage variants rejected with the contract statuses.
3. Extend the route-local verifier to cover padded ASCII, tab, and Unicode-whitespace report values and ensure the assertion cannot pass through normalization.
4. Update `SEC-001_IMPLEMENTATION_EVIDENCE.md`, rerun all gates, stop, and open another independent QA chat.

Do not remediate non-blocking findings inside SEC-001 without a separate approved contract.

## QA conclusion

**FAIL — Remediation Required.** Homepage/public bucket access is fail-closed, anonymous actors cannot reach privileged operations by code order, the active caller is compatible, bucket/path/owner authority is server-controlled, and all compile gates pass. Release review is nevertheless blocked because the mandatory exact-kind negative case fails and the verifier incorrectly reports complete success.

## Recommended next workflow

Open a new Codex chat
→ Billing/Security Agent
→ remediate only blocking finding `QA-SEC001-001`
→ update `SEC-001_IMPLEMENTATION_EVIDENCE.md`
→ rerun validation
→ stop
→ open another independent QA chat

## Git status

Expected final unstaged/untracked paths after this report:

```text
 M app/api/storage/upload/route.ts
 M prototype/wizard-step4.html
?? app/api/storage/upload/verify-SEC-001.mjs
?? docs/reconstruction/issues/SEC-001_IMPLEMENTATION_EVIDENCE.md
?? docs/reconstruction/issues/SEC-001_RECOVERY_CHECKPOINT.md
?? docs/reconstruction/issues/SEC-001_QA_REPORT.md
```

Nothing is staged. Implementation source was not modified. `prototype/wizard-step4.html` remains untouched and unstaged.

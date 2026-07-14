---
name: media-storage-lifecycle
description: Design and verify Pixforme image upload authorization, validation, metadata, storage paths, signed URLs, derivatives, retention, and deletion.
---
# Purpose
Make each media object safe, tenant-owned, traceable, and lifecycle-managed.
# Trigger conditions
Use for upload/list/delete, bucket policy, public homepage assets, AI derivatives, or signed URLs.
# Required inputs
Actor/role, project/media contract, formats/limits, retention/derivative rules.
# Files that must be read
`app/api/storage/**`, `lib/env.ts`, storage migrations/policies, media types, security register.
# Allowed write scope
Assigned storage/media server paths, coordinated migrations, tests.
# Procedure
Authorize kind/project; verify magic bytes/decode; cap bytes/pixels; re-encode/checksum; write immutable owner path; persist metadata atomically or compensate; issue short URL; define deletion/retention/lineage.
# Non-negotiable rules
Homepage kinds are admin-only. Never trust client MIME/dimensions. Signed URLs are not canonical state.
# Verification commands
Test anonymous/user/admin, wrong tenant, malformed/polyglot/oversized pixels, duplicates, URL expiry and cleanup.
# Required artifacts
Lifecycle diagram, authorization matrix, validation limits, cleanup/recovery evidence.
# Handoff contract
List buckets/paths, owner checks, TTL, lineage, compensation and migration dependencies.
# Failure and rollback procedure
Delete object if metadata fails; quarantine/reject unverifiable files; use scoped reconciliation runbook.

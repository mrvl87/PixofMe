---
name: geospatial-cost-control
description: Control Pixforme Esri and Geoapify usage through validated coordinates, durable quotas, cache policy, provenance, and cost evidence.
---
# Purpose
Make geospatial enrichment reliable and financially bounded.
# Trigger conditions
Use for maps, forward/reverse geocoding, coordinate editing, provider/cache/quota changes.
# Required inputs
Actor/project, provider limits/terms, accuracy/privacy and fallback requirements.
# Files that must be read
`lib/maps.ts`, `lib/map-cost-control.ts`, `app/api/maps/**`, geotag schema, `.env.example`.
# Allowed write scope
Assigned map/geospatial modules, usage schema via database owner, tests/docs.
# Procedure
Validate WGS84; distinguish provider/manual address provenance; key quotas by authenticated actor/project; normalize reverse-cache keys; call reverse only on committed movement; persist usage/cache; expose attribution and safe failures.
# Non-negotiable rules
Never expose server provider key. IP is not the sole production identity. Manual address never changes coordinates silently.
# Verification commands
Boundary coordinates, cache hit/miss/expiry, quota rollover/concurrency, provider timeout/error and browser attribution tests.
# Required artifacts
Cost model, quota/cache policy, provenance contract, usage evidence.
# Handoff contract
State provider/mode, cache keys/TTL, quota identity, privacy and fallback behavior.
# Failure and rollback procedure
Fail without losing selected coordinates; degrade to manual display address; disable provider calls if budget/credentials are unsafe.

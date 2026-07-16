---
name: nextjs-boundary-review
description: Review Pixforme Next.js App Router client/server boundaries, routing, auth checks, route handlers, build safety, and component coupling.
---
# Purpose
Keep Pixforme secrets/authorization/server work out of client code and reduce unsafe coupling.
# Trigger conditions
Use for `app/`, route handlers, Server/Client Components, proxy/auth, or splitting `app/pixforme.tsx`.
# Required inputs
Approved behavior/API contract and affected routes.
# Files that must be read
`package.json`, `next.config.ts`, `proxy.ts`, affected `app/**`, server `lib/**`, `AGENTS.md`.
# Allowed write scope
Assigned Next.js/UI/server paths and tests only.
# Procedure
Map imports/runtime; locate `use client`; keep secrets/service clients server-only; make route auth authoritative; choose route/action contract; shrink clients; verify build-time env safety.
# Non-negotiable rules
Do not rely on proxy as sole auth. Do not expose server env. Preserve `.html` URLs unless contract changes.
# Verification commands
`rg -n "use client|process.env|serviceRole|createSupabase" app lib`; `npx tsc --noEmit --pretty false`; `npm run lint`; `npm run build`.
# Required artifacts
Boundary map, violations/fixes, route evidence, build results.
# Handoff contract
List client/server files, contract changes, security impact and browser scenarios.
# Failure and rollback procedure
If a split changes behavior/contracts, stop and propose ADR; revert scoped refactor if gates regress.

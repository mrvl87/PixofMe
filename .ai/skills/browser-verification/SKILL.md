---
name: browser-verification
description: Verify Pixforme routes and end-to-end UI behavior in a real browser, including auth, workspace, upload, maps, wizard, preview, and export states.
---
# Purpose
Use runtime DOM/network/console evidence rather than static confidence.
# Trigger conditions
Use after UI behavior changes, route/auth fixes, integration wiring, or before release.
# Required inputs
Acceptance criteria, dev/deploy URL, test actor/data, safe provider mode.
# Files that must be read
Changed pages/routes, test instructions, API contract, relevant quality gates.
# Allowed write scope
Browser test specs, screenshots/evidence; no production data mutation beyond approved test scope.
# Procedure
Start verified server; check route/status; exercise loading/empty/error/success; inspect DOM/focus/keyboard/responsive; inspect network and console; verify persistence/refresh; capture reproducible evidence and clean test state.
# Non-negotiable rules
Do not claim success from server startup alone. Do not use production payment/AI without explicit authority. Mask secrets/PII.
# Verification commands
`npm run dev`; HTTP smoke checks; browser suite command when available; `npm run build`.
# Required artifacts
Scenario matrix, screenshots/recording, console/network results, failed steps.
# Handoff contract
State commit/URL/browser/viewport/data, exact scenarios, artifacts and residual gaps.
# Failure and rollback procedure
Stop destructive/external flow; capture state/logs; reset only test data you created; hand reproducible failure to owner.

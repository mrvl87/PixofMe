# Title
Treat prototype as an archived historical reference

## Status
Proposed

## Context
`prototype/` contains independent HTML/CSS/JS, localStorage state, a standalone Midtrans server, and a currently dirty user edit in `prototype/wizard-step4.html`. Existing docs sometimes call it the visual source of truth, while the reconstruction request makes Next.js primary.

## Decision
Next.js production code and approved product contracts govern behavior. Freeze a named prototype-v1 snapshot after preserving existing user work. Production must not import or execute prototype assets. Prototype may inform visual history only when an approved criterion explicitly references it.

## Alternatives considered
- Keep prototype as production source of truth: creates dual implementation and stale decisions.
- Delete prototype: loses useful design/history and violates preservation requirements.
- Continuously sync both: doubles change/test surface.

## Consequences
Historical docs must be labeled, prototype changes do not imply production changes, and visual decisions move into approved criteria/design artifacts.

## Risks
Valuable prototype details can be overlooked; duplicate assets remain; contributors may still edit the archive accidentally.

## Follow-up actions
Complete ARCH-001, capture manifest/hash after resolving current dirty change, add dependency check, update stale historical docs later.

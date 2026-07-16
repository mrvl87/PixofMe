# Title
Use a modular monolith for Pixforme reconstruction

## Status
Proposed

## Context
The current Next.js application places public UI, auth, workspace, authoring, maps, and rendering in `app/pixforme.tsx`, while APIs and the draft schema already imply multiple domains. There is no operational evidence requiring distributed services.

## Decision
Keep one deployable Next.js application and Postgres database, but enforce the domain boundaries in `docs/reconstruction/DOMAIN_BOUNDARIES.md` through modules, contracts, ownership, and tests. Background workers may be separate execution processes while sharing versioned contracts.

## Alternatives considered
- Preserve the current coupled client module: cheapest now, unsafe change surface.
- Microservices now: stronger deployment isolation but premature operational and transaction complexity.
- Separate repositories by domain: weakens atomic reconstruction and increases coordination cost.

## Consequences
Cross-domain calls are explicit but can remain in-process. Database transactions can protect key invariants. Module discipline and CI become mandatory.

## Risks
The monolith can regress into coupling; worker/runtime boundaries may be blurred; later extraction requires telemetry and stable contracts.

## Follow-up actions
Approve domain contracts, split `app/pixforme.tsx` without behavior change, add dependency checks and ownership review.

# Feature Workflow

1. **Issue:** define actor, problem, scope, risk, owner, skills, acceptance and evidence.
2. **Product contract:** product-contract-agent defines all UI/API states and non-goals; human/lead approves.
3. **Architecture/data contract:** required for shared types, persistence, cross-domain behavior, external effects, or new dependency. ADR remains Proposed until approved.
4. **Implementation:** one owner per path. Frontend/backend may work in parallel only after API fixtures and contract version are frozen.
5. **QA/red-team:** independent agent tests acceptance, negative, regression, accessibility and tenant cases; reports findings without patching.
6. **Security:** mandatory for auth, tenant data, upload, secrets, payment, AI, public API or PII.
7. **Release evidence:** release agent verifies commit, gates, migrations/env, smoke and rollback.
8. **Human approval -> merge.**

Wait when product behavior, API payload, schema, RLS, ledger, snapshot, or template version is unresolved. Required handoff follows `AGENTS.md`.

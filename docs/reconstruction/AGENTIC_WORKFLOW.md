# Agentic Workflow

## Standard path

```text
Issue -> Product contract -> Architecture/data contract -> Implementation
      -> Independent QA/red-team -> Security review when applicable
      -> Release evidence -> Human approval -> Merge
```

The lead orchestrator assigns bounded ownership and keeps one canonical handoff record. Chat may coordinate work but must not hold permanent decisions; approved contracts, ADRs, migrations, and repository artifacts do.

## Required artifacts

1. Issue with problem, scope, acceptance criteria, risk, owner agent, and skills.
2. Product contract defining user-visible behavior and out-of-scope.
3. ADR and/or data/API contract for boundary or irreversible decisions.
4. Implementation diff with tests and verification logs.
5. Independent QA findings; implementation agent resolves them in a new pass.
6. Security review for auth, tenant data, upload, payment, AI, secrets, or public APIs.
7. Release evidence and human approval.

## Parallel work

Agents may work in parallel only after the product contract and shared interface are approved, on non-overlapping owned paths. Examples: frontend consumes an approved API fixture while backend implements the same frozen contract; golden test fixtures can be prepared after a snapshot schema is fixed.

Agents must wait when work changes migrations, RLS, shared types, API payloads, report snapshot/template versions, ledger semantics, or authorization. Those contracts land first. Two agents must not edit `app/pixforme.tsx`, the same migration, or the same contract concurrently.

## Separation of duties

- Implementation agents cannot provide final QA approval.
- QA reports findings and does not silently patch them.
- Security approval is independent for sensitive scopes.
- Release agent verifies evidence and deployment mechanics without changing product behavior.
- Human approval is mandatory before merge/release.

## Handoff record

Each handoff states issue/branch/commit, owned and modified paths, contracts used, decisions and unresolved questions, commands/results, risks, migrations/env changes, rollback, and next responsible agent. Failed verification is recorded verbatim and never hidden by unrelated fixes.

## Escalation

Stop and escalate when acceptance criteria conflict, authority is missing, live schema differs from migrations, a P0 is discovered, secrets appear, provider behavior is ambiguous, rollback is unsafe, or required contract changes would invalidate parallel work.

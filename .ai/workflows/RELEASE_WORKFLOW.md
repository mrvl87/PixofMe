# Release Workflow

1. Freeze reviewed release commit and enumerate included issues/contracts/ADRs.
2. Confirm independent QA and applicable security approval; unresolved P0 blocks release.
3. Run `git diff --check`, lint, typecheck, build, tests/goldens and approved browser scenarios.
4. Verify migrations/order/backups/generated types; verify environment variable names, provider mode, domains and secret presence without exposing values.
5. Confirm artifact/commit identity, deployment steps, observability, smoke checks, rollback trigger/owner.
6. Human gives go/no-go. Release agent deploys only with explicit authority and does not change behavior.
7. Run post-deploy auth/workspace/report/API smoke, monitor, document state, and roll back only through approved plan.

No parallel code changes after freeze. Any fix creates a new commit and repeats QA/security/release evidence.

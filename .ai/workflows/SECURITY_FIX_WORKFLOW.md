# Security Fix Workflow

1. Create private/public issue appropriate to disclosure risk; record severity, exposure, affected files and safe reproduction.
2. Security agent threat-models and recommends containment. For P0, fail closed or disable the path only with authority.
3. Product contract defines acceptable user-visible failure and compatibility.
4. Architecture/database/API contract fixes the control; security reviewer must not be the implementation owner.
5. Implementation adds regression tests first where safe, then minimal scoped fix.
6. Independent QA and a different security pass reproduce the original attack and adjacent bypasses.
7. Release evidence includes secret rotation/data review/monitoring/rollback as applicable; human approves.

Parallel work is limited to non-overlapping containment, test fixture, and incident evidence after the control is agreed. Do not publish exploit details, weaken RLS, or use service role as a shortcut.

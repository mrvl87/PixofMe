---
name: report-golden-testing
description: Create and verify Pixforme golden report fixtures, page images/PDFs, physical dimensions, and controlled visual tolerances.
---
# Purpose
Detect report-layout regressions with reproducible evidence.
# Trigger conditions
Use for report renderer, templates, fonts, header, pagination, geotag overlay, or export changes.
# Required inputs
Accepted fixtures, renderer/template versions, baseline artifacts and tolerance policy.
# Files that must be read
Pagination/snapshot contracts, renderer code, report CSS/fonts, prior golden manifests.
# Allowed write scope
Golden fixtures/manifests/artifacts and test harness assigned to report scope.
# Procedure
Use deterministic local media/fonts/time; render twice; assert page count/size; rasterize; compare geometry/pixels under documented tolerance; inspect diffs; approve baseline changes separately.
# Non-negotiable rules
Never overwrite goldens merely to make tests pass. Exclude signatures/timestamps or freeze them. Human approves material visual changes.
# Verification commands
Renderer test command; PDF metadata/page-size inspection; two-run hash/diff; visual snapshots at agreed DPI.
# Required artifacts
Fixture, baseline, diff image/report, metrics and approval note.
# Handoff contract
List versions, platform/fonts, tolerance, changed pages and approval needed.
# Failure and rollback procedure
Keep old baseline and fail test; roll back renderer/template or version the intentional change.

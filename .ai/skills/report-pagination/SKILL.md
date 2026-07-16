---
name: report-pagination
description: Design deterministic Pixforme report pagination for A4/F4, portrait/landscape templates, headers, captions, geotags, and page footers.
---
# Purpose
Turn a versioned report snapshot into predictable page assignments and geometry.
# Trigger conditions
Use for template capacity, header/footer layout, overflow, page break, or report renderer changes.
# Required inputs
Snapshot/template version, physical dimensions, font metrics, content limits.
# Files that must be read
Report snapshot contract, current `WizardStep4Page`/render helpers, print CSS, relevant prototype only as archive evidence.
# Allowed write scope
Assigned pagination/render modules and tests/fixtures.
# Procedure
Normalize mm/px/DPI; reserve header/period/footer geometry; define template capacity; paginate stable ordered items; handle empty/final slots and long text explicitly; emit warnings/errors; freeze version.
# Non-negotiable rules
Do not read mutable UI state during render. Never silently clip mandatory content. Same input/version must yield same pages.
# Verification commands
Golden cases for 0/1/capacity/capacity+1 items, A4/F4, orientations, first/all headers, long captions/geotags/fonts.
# Required artifacts
Pagination contract, page metrics, fixtures, overflow policy.
# Handoff contract
Name snapshot/template versions, dimensions, tolerances, warnings and renderer consumer.
# Failure and rollback procedure
Reject unsupported overflow with actionable error; retain prior template version for existing snapshots.

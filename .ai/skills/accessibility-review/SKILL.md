---
name: accessibility-review
description: Review Pixforme public pages, auth, workspace, wizard, modals, maps, and report controls for keyboard, focus, semantics, contrast, and assistive technology.
---
# Purpose
Make core reporting workflow operable without pointer-only or visual-only assumptions.
# Trigger conditions
Use for UI/component changes, modals, icon buttons, upload, map picker, and release review.
# Required inputs
Acceptance criteria, routes/states/viewports, target WCAG level.
# Files that must be read
Changed TSX/CSS, UI contract, browser tests and relevant design tokens.
# Allowed write scope
Accessibility findings/tests; UI fixes only when assigned to frontend owner.
# Procedure
Inspect landmarks/headings/names; keyboard order and traps; focus entry/return; labels/errors/status announcements; contrast/zoom/reflow; pointer alternatives for maps/drag; reduced motion; export control semantics.
# Non-negotiable rules
Color/icon alone cannot convey state. Every icon button needs an accessible name. QA reviewer does not silently fix.
# Verification commands
Keyboard walkthrough; browser accessibility tree; automated scanner when configured; 200% zoom and mobile reflow checks.
# Required artifacts
Route/state checklist, findings with WCAG mapping, screenshots/tree evidence and priority.
# Handoff contract
List affected component, reproduction, user impact, expected behavior and retest criteria.
# Failure and rollback procedure
Block critical workflow regressions; restore prior accessible behavior or hand finding to frontend owner.

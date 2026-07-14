# Report Engine Workflow

1. Issue defines physical output, templates, content cases and visual acceptance.
2. Product/architecture contract freezes immutable report snapshot and template version.
3. Report agent specifies page geometry, capacity, overflow, fonts, warnings and artifact metadata.
4. Pagination implementation and deterministic fixtures proceed; media delivery may work in parallel only against frozen IDs/URL contract.
5. Golden tests cover A4/F4, orientation, headers, page boundaries, long text, geotags, missing media/fonts and repeated-run stability.
6. Independent QA reviews page metrics and visual diffs; security reviews export authorization/storage.
7. Release evidence identifies renderer/template versions and rollback; human approves baseline changes.

Do not render from mutable live UI state or update goldens just to pass. Wait if snapshot, font, geometry or tolerance is unresolved.

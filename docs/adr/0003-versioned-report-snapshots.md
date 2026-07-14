# Title
Render from versioned immutable report snapshots

## Status
Proposed

## Context
`WizardStep4Page` currently renders directly from mutable client state and calls `window.print()`. The schema contains report/export concepts but no immutable render input or template version.

## Decision
Create a complete immutable report snapshot containing project/report text, ordered media references and resolved metadata, geotags, preview settings, template ID/version, and render schema version. Export jobs consume a snapshot ID and never query mutable authoring rows for content.

## Alternatives considered
- Render live rows: simpler but non-repeatable.
- Save PDF only: preserves output but cannot explain/re-render it.
- Snapshot only selected fields: risks hidden dependencies and drift.

## Consequences
Exports are auditable and retryable; template evolution can preserve old results. Snapshot storage and compatibility policy are required.

## Risks
Snapshot size, sensitive data retention, media URL expiry, schema-version migration, and orphan cleanup.

## Follow-up actions
Define snapshot JSON schema/storage/retention, media resolution contract, golden fixtures and backward compatibility.

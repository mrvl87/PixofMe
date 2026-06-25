# New Document Workflow - Free Tier First User

Status: product workflow decision, synced with current prototype on 2026-06-25.
Target: future Next.js implementation. Do not implement until approved.

## Goal

First-time users must log in or start free, land in a workspace, create/select a project, then enter the wizard. The workspace is intentionally simple and only shows project cards plus a create-project entry.

## User Flow

1. User opens `login` or clicks public `Mulai Gratis`.
2. App creates/uses a free-tier account session.
3. User is redirected to `workspace`.
4. Workspace displays project cards only:
   - Existing projects as cards.
   - One `Create Project` card/button.
5. User clicks an existing project or creates a new project.
6. Create project opens a dialog with one required field: `Nama Project`.
7. On valid create, project is saved and becomes active.
8. User is redirected to wizard step 1.
9. Wizard step 1 is the project setting surface for:
   - Nama instansi.
   - Nama pekerjaan.
   - Lokasi kegiatan.
   - Header laporan.
   - Item pekerjaan from pasted RAB text.

## Workspace Rule

Workspace must not contain project settings forms. It should only contain project cards and the create-project dialog.

Project settings belong inside the wizard/project-setting flow.

## Free Tier Rule

Free tier should prove the core workflow:

- Create project.
- Fill project settings.
- Upload/select photos.
- Arrange report.
- Preview/export.

AI-costly actions should stay capped or credit-gated in production.

## Suggested Next.js Route Shape

- `/login`
- `/workspace`
- `/wizard/project` or `/wizard/step-1`
- `/wizard/report`
- `/wizard/photos`
- `/wizard/preview`

The current prototype preserves `.html` routes for parity:

- `prototype/login.html`
- `prototype/workspace.html`
- `prototype/wizard-step1.html`
- `prototype/wizard-step2.html`
- `prototype/wizard-step3.html`
- `prototype/wizard-step4.html`

## Suggested Data Model

User:

- `id`
- `email`
- `plan`: `free | paid`
- `createdAt`

Workspace:

- `id`
- `userId`
- `name`

Project:

- `id`
- `workspaceId`
- `name`
- `instansi`
- `namaPekerjaan`
- `lokasiKegiatan`
- `rabText`
- `items[]`
- `status`: `draft | active | archived`
- `createdAt`
- `updatedAt`

## Prototype Mapping

- `prototype/login.html` redirects login/free-start actions to `prototype/workspace.html`.
- `prototype/workspace.html` shows project cards only and a create-project modal.
- On create, state is saved in localStorage and page redirects to `wizard-step1.html`.
- `wizard-step1.html` owns project settings and RAB item parsing.

## Current Next.js Delta

- `app/pixforme.tsx` still has the older workspace with project list plus settings form.
- `TopNav` still routes `Mulai Gratis` directly to wizard.
- Next implementation should update login/workspace routing only after approval.
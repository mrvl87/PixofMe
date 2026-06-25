# Pixforme Prototype UI Specification

Status: synced to current `prototype/` on 2026-06-25.
Scope: documents the prototype as visual and interaction source of truth. Do not use this as permission to edit the Next.js implementation before approval.

## 1. Source Files

The current prototype does not contain `prototype/styles.css` or `prototype/app.js`. The active source is split across:

- `prototype/index.html` for the public landing page and its page-level styles/script.
- `prototype/assets/css/tokens.css` for shared public tokens, base components, topnav, buttons, fields, and cards.
- `prototype/assets/css/wizard.css` for wizard, workspace, preview, modals, photo picker, and export styles.
- `prototype/assets/js/pixel-icons.js` for 7x7 pixel icons and logo rendering.
- `prototype/assets/js/topnav.js` for public top navigation injection.
- `prototype/assets/js/wizard-state.js` for local prototype state, project/workspace defaults, RAB parser, gallery/report photo utilities, and wizard chrome.
- `prototype/login.html`, `prototype/workspace.html`, `prototype/wizard-step1.html` to `prototype/wizard-step4.html` for the app flow.

## 2. Product Shape

Pixforme is a document-centric report generation product for Indonesian construction/project documentation.

Primary flows:

- Public marketing: landing, product placeholder, AI tools placeholder, pricing, login.
- First user flow: login or start free, workspace, create project, wizard step 1.
- Workspace: project cards only, with a create-project dialog.
- Wizard: four steps for project setting, report detail, photo/caption, preview/export.
- Preview/export: five report templates, A4/F4 paper sizes, print-based PDF export.
- Payment sandbox: pricing page Midtrans Snap test for AI credit package.

Visible brand text remains `PIXFORME`.

## 3. Visual System

Core direction:

- Pixel-art identity with `Press Start 2P`, inline 7x7 SVG icons, and block pixel logo.
- Heavy black outlines, small radii, and hard offset shadows.
- Warm orange/red accent system on off-white backgrounds.
- Dense operational layouts for wizard/editor surfaces.
- Landing page is more editorial and animated, but still uses the same pixel system.

Do not replace the system with soft SaaS cards, blurred shadows, rounded pill-heavy UI, or another icon set.

## 4. Tokens

Core variables are defined in `prototype/assets/css/tokens.css`:

- `--black`: `#0A0A0A`
- `--orange`: `#FF6B1A`
- `--red`: `#E8331C`
- `--amber`: `#FFA41B`
- `--bg`: `#FBFBF8`
- `--card`: `#FFFFFF`
- `--accent-bg`: `#F4F4F1`
- `--text-primary`: `#0A0A0A`
- `--text-muted`: `#6B6B68`
- `--border`: `#E5E5E0`
- `--success`: `#2E9E5B`
- `--success-bg`: `#EAFAF1`
- `--warn-bg`: `#FFF7E8`

Frequent local values:

- Active orange tint: `#FFF1E8`
- Preview secondary text: `#52524F`
- Preview accent swatches: `#2563EB`, `#0F766E`, `#7C3AED`
- Grid coordinate swatches: `#FFFFFF`, `#0A0A0A`, `#FFD600`, `#20E82A`

Fonts:

- Pixel: `Press Start 2P`
- Body: `Inter`
- Mono: `Space Mono`

## 5. Public Landing Page

File: `prototype/index.html`

Current landing structure:

- Sticky public `TopNav` injected by `topnav.js`.
- Hero with two-column layout, mock report page stack, pixel CTA, and floating badges.
- Black problem marquee strip.
- `solutions-section` fills a near viewport and uses four compact problem cards in a 4-column desktop grid.
- `workflow-section` fills a near viewport and centers four image-backed step cards.
- `template-showcase` is a sticky scroll section with canvas pixel animation and five rich template thumbnails.
- AI Fix Tools section has three cards, first card featured black.
- Orange CTA banner.
- Multi-column footer.

Important latest landing details:

- `solutions-section` uses `min-height: calc(100vh - 48px)` / `100svh`, compact card height, layered offset shadows, and hover movement.
- `workflow-section` uses real/generated representative images from `prototype/cssstyleassets/#3/img/`, not gray placeholders.
- `step-card` uses image frame `.step-visual`, slight rotations through CSS vars, hover lift, and responsive image height.
- `template-showcase` uses sticky scroll, a canvas `templatePixelCanvas`, CSS variable `--tpl-progress`, rich `.tpl-preview` mini-layouts, and `picsum.photos` photo backgrounds.
- Motion must respect `prefers-reduced-motion`.

## 6. Top Navigation and Entry Flow

TopNav actions:

- `Masuk` links to `login.html`.
- `Mulai Gratis` currently links to `wizard-step1.html` in shared `topnav.js`; production should route first-time users through login/workspace.

Login page:

- Centered 360px login box.
- Copy says login creates free-tier documentation access.
- Login button and signup link route to `workspace.html` in prototype.

Free-tier first-use flow:

1. User logs in or clicks start free.
2. User lands on workspace.
3. User creates a project from the create-project dialog.
4. Project is saved and activated.
5. User is redirected to `wizard-step1.html`.

## 7. Workspace Page

File: `prototype/workspace.html`

Current rule: workspace contains project cards only. It must not show project setting forms.

Structure:

- Wizard shell and workspace title.
- Summary chips: `Free Tier`, project count.
- `.workspace-card-grid` with project cards and one create card.
- `.workspace-project-card` for existing project cards.
- `.create-card` for create-project entry.
- `createProjectModal` with one required input: `Nama Project`.

Behavior:

- Clicking an existing project activates it, syncs project state, and routes to `wizard-step1.html`.
- Clicking create opens the modal.
- Creating with a non-empty name creates an active project, clears editable project metadata, saves localStorage, and routes to `wizard-step1.html`.
- Detailed project settings live in wizard step 1.

## 8. Wizard Step 1 - Project Setting

File: `prototype/wizard-step1.html`

Collects:

- Project/job name.
- Institution/client.
- Location.
- RAB pasted item text.
- Logo visibility.
- Header text.
- Header mode: all pages or first page.

Behavior:

- Project name is required.
- RAB text is parsed into clean, deduplicated item names.
- Active workspace project is kept in sync.
- Reset clears prototype localStorage and reloads defaults.

## 9. Wizard Step 2 - Report Detail

File: `prototype/wizard-step2.html`

Collects:

- Report name.
- Report period.

Rules:

- Report name is required.
- Template selection is not in step 2.
- Next routes to step 3 only after valid state is saved.

## 10. Wizard Step 3 - Photo and Caption

File: `prototype/wizard-step3.html`

Latest step 3 model:

- The visible left gallery panel has been removed from the page layout.
- The page shows report photo cards/slots only.
- A fixed floating `Add Foto` button sits at the bottom-right viewport.
- Adding a slot creates an empty placeholder card and scrolls to it.
- Every card has Add/Ganti, move, fit, AI, geo, and delete controls.
- Photo selection happens through `photoPickerModal`, not through a persistent left gallery.

Card states:

- Filled card shows 4:3 image frame, aspect/AI badge, index badge, optional geotag overlay, icon tool row, metadata fields, and progress controls.
- Empty card uses `.photo-card.is-empty` and `.photo-frame-empty` with large plus placeholder and `EMPTY` status.

Photo picker modal:

- Shows gallery photos in `.photo-picker-grid`.
- Used photos are grayscale/disabled-looking and marked with a green check.
- The current selected photo can be clicked again to unselect, leaving the card as a placeholder.
- Upload in modal reads multiple files and adds them to gallery.

Preview guard:

- Step 3 `Preview` button validates that at least one card exists and all cards have photos.
- If not complete, `emptyWarningModal` appears.

Card toolbar:

- Uses solid pixel icons and short labels: `ADD` or `GANTI`, `NAIK`, `TURUN`, `FIT`, `AI`, `GEO`, `HAPUS`.
- Disabled controls are dimmed on empty cards.

Bulk controls:

- Bulk item and bulk progress remain in the workbar.
- Apply updates all report-photo rows.

Fit modal:

- Crop 4:3, contain, and AI Extend options.
- Crop range controls vertical object-position.
- AI Extend remains a prototype state marker only.

Geotag modal:

- Fake map and metadata fields remain.
- Saved geotag is non-destructive and used in preview/export.

## 11. Wizard Step 4 - Preview and Export

File: `prototype/wizard-step4.html`

Core layout:

- 250px preview sidebar.
- `TEMPLATE` and `GAYA` tabs.
- Main preview area with paginated paper pages.

Paper:

- A4 portrait: `300 x 424px`, print `210 x 297mm`.
- F4 portrait: `300 x 472px`, print `210 x 330mm`.
- A4 landscape: `424 x 300px`.
- F4 landscape: `472 x 300px`.

Templates:

- `STACK + TEKS`: A4 2 photos/page, F4 3 photos/page, caption right, border-grid table style.
- `GRID EQUAL`: A4 4 photos/page, F4 6 photos/page, caption bottom.
- `GRID BORDER`: A4 4 photos/page, F4 6 photos/page, visual numbering.
- `FULL PAGE`: 1 photo/page.
- `LANDSCAPE SPLIT`: A4 2 photos/page, F4 3 photos/page.

Grid template refinements:

- Progress appears as text in a compact right-aligned box area, without progress bar.
- Coordinates overlay directly over photos.
- Coordinate overlay is left aligned: coordinates on top, location in the middle, date/time below.
- Coordinate text has selected color plus automatic contrasting stroke/shadow for print readability.
- Gaya tab exposes coordinate color and coordinate font size controls for grid templates.

Stack template refinements:

- Uses border-table layout with customizable accent/border color.
- Last page must not render empty bordered rows; it should shrink to actual row count and leave clean whitespace.

Export:

- `Export PDF` injects dynamic `@page` print rules, sets a print title, adds `export-pdf-mode`, calls `window.print()`, and restores state after print.
- Print mode hides topbar, sidebar, title row, and page labels.
- Print output must not be half-page; preview dimensions are scaled to real paper millimeters.

## 12. State Model

Storage key: `pixforme.prototype.wizard.v3`

Top-level objects:

- `workspace`: name, activeProjectId, projects.
- `project`: name/client/location/header/logo/RAB/items.
- `report`: report name and period.
- `gallery`: available photo objects.
- `reportPhotos`: card/slot rows with `photoId`, metadata, fit, AI flag, and geotag.
- `preview`: template, paper, color, spacing, font, border, and export settings.

Important behavior:

- State is merged with defaults on load.
- Invalid localStorage JSON falls back to defaults.
- Project aliases stay synchronized: `name/pekerjaan`, `client/instansi`, `location/lokasi`.
- Report photos reference gallery photos by `photoId`, but step 3 now also supports empty slots with `photoId: null`.

## 13. Current Next.js Delta

Do not implement these before approval. These are the observed gaps versus `app/pixforme.tsx` and `app/globals.css`:

- `HomePage`, `TemplatesSection`, and related CSS need the latest landing design: compact solution cards, image-backed workflow cards, sticky canvas template showcase, and rich template thumbnails.
- `TopNav` still sends `Mulai Gratis` directly to wizard; production flow should route through login/workspace for first-time users.
- `WorkspacePage` still uses the older split project-list plus settings form. It must become project-card-only with create-project modal.
- `LoginPage` should route login/signup actions to workspace in the prototype-equivalent flow.
- `WizardStep3Page` still uses persistent gallery sidebar and old six text buttons. It must move to slot-based cards, floating Add Foto, photo picker modal, empty-card validation, and solid icon toolbar.
- `PhotoCard` must support empty slots, add/ganti photo, disabled tools for empty rows, solid icons, and short labels.
- `PixelIcon` in Next is missing newer icon names used by the prototype: `chevU`, `chevD`, `plus`, and solid toolbar icons.
- `globals.css` lacks latest workspace card grid, photo picker, floating add button, icon toolbar, and updated landing/template showcase CSS.

## 14. Implementation Plan After Approval

1. Port token/icon additions first: update `PixelIcon`, global CSS variables/classes, and shared route helpers.
2. Port public landing sections from `prototype/index.html` into React components without redesign.
3. Update login and workspace flow to match free-tier project creation.
4. Replace Step 3 with slot/photo-picker behavior and keep existing state model compatible.
5. Re-check Step 4 against prototype and only patch remaining deltas.
6. Run lint/build and browser checks against `/`, `/login.html`, `/workspace.html`, `/wizard-step3.html`, and `/wizard-step4.html`.
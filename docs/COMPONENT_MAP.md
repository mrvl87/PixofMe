# Pixforme Prototype Component Map

Status: synced to current `prototype/` on 2026-06-25.
Scope: component inventory and prototype-to-Next delta. Do not implement Next.js changes until approved.

## 1. Active Prototype Sources

The files requested as `prototype/styles.css` and `prototype/app.js` are not present in the current tree. Use the actual split source:

| Area | Source |
| --- | --- |
| Public landing | `prototype/index.html` |
| Shared public CSS | `prototype/assets/css/tokens.css` |
| Wizard/workspace CSS | `prototype/assets/css/wizard.css` |
| Pixel icons | `prototype/assets/js/pixel-icons.js` |
| Public topnav | `prototype/assets/js/topnav.js` |
| Wizard state/utilities | `prototype/assets/js/wizard-state.js` |
| Login/workspace/wizard pages | `prototype/login.html`, `prototype/workspace.html`, `prototype/wizard-step*.html` |

## 2. Page Map

| Prototype page | Purpose | Key components |
| --- | --- | --- |
| `index.html` | Marketing home | TopNav, HomeHero, MockReportStack, ProblemMarquee, SolutionCard, WorkflowStepCard, TemplateShowcase, ToolCard, CTABanner, Footer |
| `login.html` | Free-tier login/start | LoginBox, LogoRow, AuthFields, LoginCTA |
| `workspace.html` | Project-card workspace | WorkspaceProjectCard, CreateProjectCard, CreateProjectModal, StateChip |
| `wizard-step1.html` | Project settings | WizardChrome, ProjectForm, RABTextarea, ItemChipList, HeaderSettings |
| `wizard-step2.html` | Report details | WizardChrome, ReportForm, SummaryPanel |
| `wizard-step3.html` | Photo slots and captions | PhotoWorkbar, FloatingAddPhoto, PhotoCard, EmptyPhotoSlot, PhotoPickerModal, EmptyWarningModal, FitModal, GeoModal |
| `wizard-step4.html` | Preview/export | PreviewSidebar, TemplatePanel, StylePanel, A4Page, StackGridTable, GridCard, GridGeoOverlay, PrintExportMode |
| `pricing.html` | Pricing and sandbox payment | PricingCard, PaymentStatus, SnapTestButton |
| `product.html` | Placeholder product page | TopNav, PageHero, PlaceholderBox |
| `tools.html` | Placeholder tools page | TopNav, ToolRouteCard, StatusBadge |

## 3. Shared Components

### TopNav

Source: `prototype/assets/js/topnav.js`, `prototype/assets/css/tokens.css`

- Injected into `#topnav`.
- Links: Produk, AI Fix Tools, Harga.
- Actions: Masuk, Mulai Gratis.
- Active route from `data-active`.
- Links hidden under 720px.

Next delta:

- `TopNav` in `app/pixforme.tsx` exists, but `Mulai Gratis` still routes directly to wizard. Future implementation should route first-time users through login/workspace.

### PixelIcon and PixelLogo

Source: `prototype/assets/js/pixel-icons.js`

- 7x7 inline SVG grid icons.
- Pixel logo rendered from fixed rectangles.
- Newer icon set includes `chevU`, `chevD`, `plus`, and solid toolbar icons: `solidPlus`, `solidReplace`, `solidUp`, `solidDown`, `solidFit`, `solidAi`, `solidGeo`, `solidTrash`.

Next delta:

- Next `IconName` and `PIXEL_GRIDS` are missing these newer icon names.

### PixelButton

Source: `prototype/assets/css/tokens.css`

- `.pixel-btn`, `.pixel-btn-primary`, `.pixel-btn-accent`, `.pixel-btn-success`, `.pixel-btn-ghost`, `.pixel-btn-lg`.
- Hard shadows and 3px active press.

### Modal

Source: `prototype/assets/css/wizard.css`

- `.modal-overlay`, `.modal-box`, `.modal-head`, `.modal-title`, `.modal-sub`, `.modal-close`.
- Used by create project, photo picker, empty warning, fit, and geotag flows.

## 4. Landing Components

### HomeHero

Source: `prototype/index.html`

- Two-column hero.
- Pixel heading with orange highlighted phrase.
- Mock A4 page stack with floating badges.

Next delta:

- Next hero broadly matches, but verify copy and CTA route after workflow update.

### SolutionsSection

Source: `prototype/index.html`

- `.solutions-section` near viewport height.
- `.solutions-grid` is 4 columns desktop.
- `.solution-card` uses layered offset shadows and hover motion.
- Cards are compact, around 246px minimum height.

Next delta:

- Next CSS still uses older 2-column solution grid and simpler card shadow. Needs update.

### WorkflowSection

Source: `prototype/index.html`

- `.workflow-section` near viewport height, centered vertically.
- `.steps-row` has four cards with slight rotations through CSS vars.
- `.step-visual` contains representative images from `prototype/cssstyleassets/#3/img/`.
- Hover normalizes row rotation and lifts hovered card.

Next delta:

- Next `HowItWorksSection` still renders text-only step cards. Needs image-backed cards and section sizing.

### TemplateShowcase

Source: `prototype/index.html`

- `.template-showcase` is a long scroll/sticky section.
- `templatePixelCanvas` draws pixel blocks based on scroll progress.
- `.template-sticky`, `.template-stage`, `.template-copy`, `.tpl-row`, `.tpl-thumb`, `.tpl-preview` build rich previews.

Next delta:

- Next `TemplatesSection` is still static gray swatches. Needs sticky showcase, canvas effect, and rich thumbnails.

## 5. Workspace Components

### WorkspaceProjectCard

Source: `prototype/workspace.html`, `prototype/assets/css/wizard.css`

- `.workspace-card-grid` lays cards as `repeat(auto-fill, minmax(240px, 1fr))`.
- `.workspace-project-card` is a button card with id/status/title/meta/CTA.
- Active card uses orange border/shadow.
- `create-card` is dashed/accent background with square plus mark.

Behavior:

- Clicking a project activates it and routes to wizard step 1.
- Workspace does not render settings forms.

Next delta:

- Next `WorkspacePage` still uses `.workspace-layout`, `ProjectListItem`, and a settings form. Replace with card-only workspace and create modal.

### CreateProjectModal

Source: `prototype/workspace.html`

- One field: `Nama Project`.
- Confirm creates project, activates it, clears project setting fields, saves state, routes to `wizard-step1.html`.

Next delta:

- Needs React state/modal implementation. Keep data compatible with existing `workspace.projects` and `project` state.

## 6. Wizard Components

### WizardChrome

Source: `prototype/assets/js/wizard-state.js`

- Four steps: Project, Laporan, Foto & Caption, Preview.
- Previous steps are links with check icon.
- Current step is orange.
- Future steps are inactive.

### Project and Report Forms

Source: `prototype/wizard-step1.html`, `prototype/wizard-step2.html`

- Step 1 contains project settings and RAB item parser.
- Step 2 contains report name and period only.

Next delta:

- Existing Next step 1/2 are mostly aligned; recheck after workspace routing changes.

## 7. Step 3 Components

### PhotoWorkbar

Source: `prototype/wizard-step3.html`

- Shows selected slot count and empty placeholder count.
- Bulk item and bulk progress controls remain.

### FloatingAddPhoto

Source: `prototype/wizard-step3.html`, `prototype/assets/css/wizard.css`

- Fixed bottom-right button.
- Adds an empty report-photo slot.
- After add, the page scrolls to the new card and updates hash.

Next delta:

- Not implemented in Next.

### PhotoCard and EmptyPhotoSlot

Source: `prototype/wizard-step3.html`

Filled card:

- 4:3 image frame.
- Aspect/AI badge.
- Index badge.
- Optional geotag overlay.
- Solid icon tool row.
- Metadata fields.
- Progress quick controls.

Empty card:

- `.photo-card.is-empty`.
- `.photo-frame-empty` with large plus, `EMPTY`, and help text.
- Fit/AI/GEO disabled until a photo is selected.

Next delta:

- Next `PhotoCard` accepts only filled report items and uses old text buttons. Needs empty-slot support and solid toolbar.

### PhotoPickerModal

Source: `prototype/wizard-step3.html`

- `.photo-picker-box`, `.picker-actions`, `.photo-picker-grid`, `.picker-photo`.
- Gallery photos appear in a modal grid.
- Used photos are grayscale and checked.
- Current photo can be clicked to unselect.
- Upload button in modal adds photos to gallery.

Next delta:

- Next still has persistent `GalleryPanel`. Replace with modal picker.

### EmptyWarningModal

Source: `prototype/wizard-step3.html`

- Blocks preview navigation if there are no report slots or any empty slots.
- Message says how many cards remain empty.

Next delta:

- Next `Preview` link routes directly to step 4. Needs guard button.

### SolidPhotoTools

Source: `prototype/wizard-step3.html`, `prototype/assets/css/wizard.css`, `prototype/assets/js/pixel-icons.js`

- 7 columns.
- Tool labels: ADD/GANTI, NAIK, TURUN, FIT, AI, GEO, HAPUS.
- Icons are boxed 24px with 17px pixel icon.

Next delta:

- Needs CSS and icon port.

## 8. Step 4 Components

### TemplatePanel and StylePanel

Source: `prototype/wizard-step4.html`

- Template list dynamically shows photos per page based on paper size.
- Gaya panel includes paper size, accent color, grid coordinate color, grid coordinate size, spacing, text size, border, radius, and header mode.

### StackGridTable

- Stack + Teks uses bordered rows with image left and caption right.
- Border color is accent color.
- Last page table height is proportional to actual item count; no empty bordered rows.

### GridCard and GridGeoOverlay

- Grid Equal/Grid Border use bottom caption row.
- Progress appears as text, no progress bar.
- Geotag is an overlay over the image, no background box.
- Overlay has automatic contrasting stroke/shadow.

### PrintExportMode

- Dynamic `@page` style.
- `export-pdf-mode` body class.
- Hides chrome/sidebar/title/page labels.
- Scales preview to real paper size.

Next delta:

- Next Step 4 is mostly close to current prototype. Recheck after global CSS and state model changes; do not assume parity without browser validation.

## 9. State Utilities

Source: `prototype/assets/js/wizard-state.js`

Important public functions:

- `loadState`, `saveState`, `resetState`
- `parseRabItems`, `getProjectItems`
- `findGalleryPhoto`, `getReportItems`
- `addToReport`, `removeFromReport`, `moveReportPhoto`, `updateReportPhoto`
- `addGalleryPhoto`, `readImageFile`
- `imageFitStyle`, `arLabel`
- `renderWizardChrome`, `projectSummary`

Important state compatibility note:

- Step 3 now supports empty report-photo slots with `photoId: null`; any Next types and helper functions must allow that.

## 10. Current Next.js Components To Change

Files to change later, after approval:

- `app/pixforme.tsx`
  - `IconName` and `PIXEL_GRIDS`
  - `TopNav`
  - `HomePage`, `SolutionsSection`, `HowItWorksSection`, `TemplatesSection`
  - `LoginPage`
  - `WorkspacePage`
  - `WizardStep3Page`
  - `PhotoCard`
  - Step 3 helper state/types for nullable `photoId`
- `app/globals.css`
  - Landing section CSS for solutions/workflow/template showcase.
  - Workspace card-only CSS.
  - Photo picker, empty slots, floating add, and solid toolbar CSS.
  - Any missing prototype CSS from `prototype/assets/css/wizard.css`.
- Route pages in `app/*.html/page.tsx` likely stay as wrappers unless exports change.

## 11. Short Implementation Plan

1. Update icon types/grids and global CSS classes.
2. Port landing page visual changes section by section.
3. Update login/workspace flow to free-tier project creation.
4. Port Step 3 slot/photo-picker workflow.
5. Re-check Step 4 print/export and patch only verified deltas.
6. Run lint/build and browser validation before claiming parity.
# Pixforme Prototype Component Map

This map names the visual/components found in `prototype/`. It describes current behavior and source locations only. It does not prescribe a framework implementation.

## 1. Source Pages

| Prototype page | Purpose | Primary components |
| --- | --- | --- |
| `prototype/index.html` | Marketing home | TopNav, Hero, MockReportStack, ProblemMarquee, SolutionCard, StepCard, TemplateThumb, ToolCard, CTABanner, Footer |
| `prototype/product.html` | Product placeholder | TopNav, PageHero, PlaceholderBox, Footer |
| `prototype/tools.html` | AI tools placeholder | TopNav, PageHero, ToolRouteCard, StatusBadge, Footer |
| `prototype/pricing.html` | Pricing and Midtrans sandbox test | TopNav, PageHero, PricingCard, PaymentStatus, Footer |
| `prototype/login.html` | Login | LogoRow, Card, Field, PixelButton |
| `prototype/workspace.html` | Multi-project workspace | WizardChrome, StateChip, WorkspaceLayout, ProjectListItem, ProjectForm, ItemChipList |
| `prototype/wizard-step1.html` | Project setting | WizardChrome, WizardTitleRow, Card, Field, ToggleButton, InfoPanel, ItemChipList |
| `prototype/wizard-step2.html` | Report details | WizardChrome, Card, Field, PrototypeBanner, InfoPanel |
| `prototype/wizard-step3.html` | Photo and caption editing | WizardChrome, GalleryPanel, GalleryItem, PhotoCard, PhotoTools, FitModal, GeoModal, BulkBar |
| `prototype/wizard-step4.html` | Preview and export | WizardChrome, PreviewSidebar, SidebarTabs, TemplateOption, StyleControls, A4Page, PreviewPhotoCard, StackGridTable, GridPreviewCard |

## 2. Shared Foundation

### TopNav

Source:

- `prototype/assets/js/topnav.js`
- `prototype/assets/css/tokens.css`

Used by:

- `index.html`, `product.html`, `tools.html`, `pricing.html`

Structure:

- Logo link to `index.html`
- Link group: Produk, AI Fix Tools, Harga
- Actions: Masuk, Mulai Gratis

States:

- Active link from `data-active`
- Link hover changes text to black and background to accent background
- Active link uses orange text and orange-tinted background

Responsive:

- Navigation links hidden under 720px.
- Actions remain visible.

### PixelIcon / PixelLogo

Source:

- `prototype/assets/js/pixel-icons.js`

Inputs:

- `data-pixel-icon`
- `data-pixel-size`
- `data-pixel-color`
- `data-pixel-logo`

Behavior:

- Replaces matching elements with inline SVG.
- Icons use `shape-rendering="crispEdges"`.
- Logo is generated from fixed black/orange/red rectangles.

### PixelButton

Source:

- `prototype/assets/css/tokens.css`

Classes:

- `.pixel-btn`
- `.pixel-btn-primary`
- `.pixel-btn-accent`
- `.pixel-btn-success`
- `.pixel-btn-ghost`
- `.pixel-btn-lg`

Behavior:

- Active press translates by 3px and removes shadow.
- Disabled state is gray, no shadow, cursor not allowed.

Used for:

- Navigation actions
- Wizard actions
- Upload/add/apply buttons
- CTA links
- Payment test button
- Modal actions

### Card

Source:

- `prototype/assets/css/tokens.css`

Classes:

- `.card`
- `.card-accent`

Used for:

- Login box
- Wizard forms
- Workspace form

Visual:

- White surface, black border, hard shadow.
- Accent variant uses orange shadow.

### Field

Source:

- `prototype/assets/css/tokens.css`
- `prototype/assets/css/wizard.css`

Classes:

- `.field-label`
- `.field-input`
- `.field-textarea`
- `.mini-label`
- `.mini-input`

States:

- Focus border orange.
- Required empty state uses `.required-empty` amber border.

Used for:

- Project/report forms
- Login form
- Photo metadata fields
- Geotag modal fields
- Preview controls where native range/select/input appears.

### ToggleButton

Source:

- `prototype/assets/css/wizard.css`

Classes:

- `.toggle-row`
- `.toggle-btn`
- `.toggle-btn.active`

Used for:

- Logo display toggles
- Header mode toggles
- Paper size selection
- Border toggle

### StateChip

Source:

- `prototype/assets/css/wizard.css`

Classes:

- `.state-chip-row`
- `.state-chip`

Used for:

- Workspace summary
- Wizard project summary
- Preview paper/template/photo summary

## 3. Marketing Components

### HomeHero

Source:

- `prototype/index.html`

Subcomponents:

- `.hero`
- `.hero-inner`
- `.hero-eyebrow`
- `.hero-ctas`
- `.hero-meta`
- `.hero-visual`

Behavior:

- Desktop two-column grid.
- Collapses to one column under 900px.
- H1 size reduces under 600px.

### MockReportStack

Source:

- `prototype/index.html`

Subcomponents:

- `.mock-page`
- `.mock-header`
- `.mock-photo`
- `.mock-progress`
- `.floating-badge`

Role:

- Hero visual only.
- Represents generated report pages, geotag, and page count.

### ProblemMarquee

Source:

- `prototype/index.html`

Classes:

- `.problem-strip`
- `.marquee`

Behavior:

- Horizontal scrolling text with 28s linear animation.
- Disabled under reduced motion preference.

### SolutionCard

Source:

- `prototype/index.html`

Subcomponents:

- `.solution-card`
- `.solution-icon-box`
- `.solution-num`
- `.solution-tag`

Layout:

- Two columns desktop.
- One column under 600px.

### StepCard

Source:

- `prototype/index.html`

Class:

- `.step-card`

Layout:

- Four columns desktop.
- Two columns under 900px.
- One column under 600px.

### TemplateThumb

Source:

- `prototype/index.html`

Classes:

- `.tpl-row`
- `.tpl-thumb`
- `.swatch`

Role:

- Static visual preview of five report template families.

### ToolCard / ToolRouteCard

Sources:

- `prototype/index.html`
- `prototype/tools.html`

Variants:

- Home `ToolCard` can be `.featured` black card.
- Tools page `ToolRouteCard` can be `.coming` with opacity.

## 4. Workspace Components

### WorkspaceLayout

Source:

- `prototype/workspace.html`
- `prototype/assets/css/wizard.css`

Structure:

- Left `InfoPanel` with project list.
- Right accent `Card` with editable project fields.

Responsive:

- Two columns desktop.
- One column under 900px.

### ProjectListItem

Source:

- `prototype/workspace.html`

Class:

- `.project-list-item`

States:

- Default: white surface, neutral shadow.
- Active: orange-tinted background and orange shadow.

Behavior:

- Selecting a project persists current project, switches active project id, syncs active project data into main project state, saves localStorage, and rerenders.

### ItemChipList

Sources:

- `prototype/workspace.html`
- `prototype/wizard-step1.html`

Classes:

- `.project-items-preview`
- `.item-chip-list`
- `.item-chip`
- `.item-chip.muted`

Behavior:

- Renders parsed RAB items.
- Step 1 caps visible preview at 12 items and shows a muted `+n lainnya` chip.

## 5. Wizard Components

### WizardChrome

Source:

- `prototype/assets/js/wizard-state.js`
- `renderWizardChrome(step, actionsHtml)`

Structure:

- Logo link.
- Four-step wizard nav.
- Action slot.

Step states:

- Done: previous steps show success check and are links.
- Active: orange step.
- Future: non-link inactive step.

Responsive:

- Stacks under 900px.

### WizardTitleRow

Source:

- Wizard and workspace pages.

Elements:

- `.wizard-kicker`
- `.wizard-title`
- `.wizard-subtitle`
- Optional `.state-chip-row`

### InfoPanel

Source:

- `prototype/assets/css/wizard.css`

Used for:

- Project UX notes.
- Current project/report data.
- Gallery sidebar.
- Workspace project list.

### PrototypeBanner

Source:

- `prototype/assets/css/wizard.css`

Class:

- `.prototype-banner`

Used for:

- Notes inside prototype about non-final behavior.
- Step 2 template note.
- Fit modal AI Extend note.
- Step 4 F4 capacity note.

## 6. Step 3 Photo Components

### GalleryPanel

Source:

- `prototype/wizard-step3.html`

Structure:

- Info panel wrapper.
- Upload button and hidden file input.
- `.gallery-list`

Behavior:

- Upload button triggers hidden file input.
- Multiple image files are read through FileReader and added to gallery as data URLs.

### GalleryItem

Class:

- `.gallery-item`

Structure:

- 72px thumbnail.
- Filename.
- Badge containing source type and aspect ratio label.
- Add button.

Button states:

- Not selected: ghost button, label "Tambah ke laporan".
- Selected: success button, label "Sudah dipilih".

### PhotoCard

Class:

- `.photo-card`

Structure:

- `.photo-frame`
- `.photo-badge`
- `.photo-index`
- optional `.geo-overlay`
- `.photo-tools`
- `.photo-fields`

Photo tool buttons:

- UP
- DOWN
- FIT
- AI
- GEO
- DEL

States:

- FIT button active when fit mode is present.
- AI button done when `aiExtended` is true.
- GEO button active when geotag exists.

Behavior:

- UP/DOWN reorders report photos.
- FIT opens FitModal.
- AI marks `aiExtended: true`, `fitMode: crop`, `cropY: 50`.
- GEO opens GeoModal.
- DEL removes photo from report.

### ProgressQuick

Class:

- `.progress-quick`

Behavior:

- Four buttons: 25, 50, 75, 100.
- Active button matches current progress string.
- Click updates selected report photo progress.

### BulkBar

Source:

- `prototype/wizard-step3.html`

Inputs:

- Bulk item select.
- Bulk progress number.
- Apply button.

Behavior:

- Applies provided item and/or progress to every report photo.

### FitModal

Source:

- `prototype/wizard-step3.html`

Classes:

- `.modal-overlay`
- `.modal-box`
- `.crop-stage`
- `.fit-options`

Controls:

- Crop 4:3
- Contain
- AI Extend
- Vertical crop range 0-100

Behavior:

- Modal opens with current image and fit state.
- Crop range live-updates preview image object-position.
- Selecting an option saves state and closes modal.
- Overlay click or close button closes modal.

### GeoModal

Source:

- `prototype/wizard-step3.html`

Classes:

- `.map-fake`
- `.map-pin-center`
- `.map-coords`

Controls:

- Address
- Latitude
- Longitude
- Date
- Time
- Fake map
- Hapus
- Simpan Geotag

Behavior:

- Defaults to Jayapura coordinates.
- Clicking fake map adjusts lat/lng by click position.
- Save persists geotag metadata.
- Remove clears geotag.
- Geotag appears as overlay in Step 3 and in preview/export.

## 7. Step 4 Preview Components

### PreviewSidebar

Source:

- `prototype/wizard-step4.html`

Classes:

- `.preview-sidebar`
- `.sidebar-tabs`

Tabs:

- TEMPLATE
- GAYA

Behavior:

- Tab buttons swap sidebar content and active state.

### TemplateOption

Class:

- `.template-option`

Structure:

- `.tpl-swatch`
- label and description.

Behavior:

- Shows photos-per-page dynamically based on active paper size.
- Click updates `state.preview.templateId`.
- Active option uses orange tint and orange shadow.

### StyleControls

Source:

- `prototype/wizard-step4.html`

Controls:

- Paper size: A4/F4.
- Accent color swatches.
- Grid coordinate color swatches.
- Grid coordinate size range.
- Photo spacing range.
- Text size range.
- Photo border toggle.
- Corner radius range.
- Header mode all/first.

Behavior:

- Every change saves preview state and rerenders sidebar and pages.

### A4Page

Classes:

- `.a4-page`
- `.a4-header`
- `.a4-content`
- `.a4-footer`

Behavior:

- Width/height depend on active paper and template orientation.
- Header visibility follows project header mode.
- Footer displays project name and page count.

### StackGridTable

Template:

- `t1` Stack + Teks

Classes:

- `.stack-grid-table`
- `.stack-grid-row`
- `.stack-grid-photo`
- `.stack-grid-text`

Behavior:

- Uses accent-color borders.
- A4 renders 2 rows per page.
- F4 renders 3 rows per page.
- Last page height is proportional to filled rows so empty slots become whitespace.

### GridPreviewCard

Templates:

- `t2` Grid Equal
- `t3` Grid Border

Classes:

- `.preview-grid-card`
- `.grid-photo-frame`
- `.grid-caption-row`
- `.grid-progress-box`
- `.grid-geo-overlay`

Behavior:

- A4 uses 4 cards per page.
- F4 uses 6 cards per page.
- `t3` adds a numbered marker in accent color.
- Grid geotag overlay uses selected color and automatic contrasting stroke.

### FullPagePreview

Template:

- `t4` Full Page

Behavior:

- One photo per page.
- Photo and caption stack vertically.

### LandscapeSplitPreview

Template:

- `t5` Landscape Split

Behavior:

- Uses landscape page orientation.
- A4 uses 2 columns.
- F4 uses 3 columns.

### PrintExportMode

Source:

- `prototype/wizard-step4.html`
- print CSS in `prototype/assets/css/wizard.css`

Behavior:

- Export button calls `window.print()`.
- Before print, dynamic `@page` and print variables are injected.
- Body gets `export-pdf-mode`.
- Topbar, sidebar, title row, and page labels are hidden.
- Preview page scales to real A4/F4 millimeters.
- After print, title and body class are restored.

## 8. Pricing Components

### PricingCard

Source:

- `prototype/pricing.html`

Classes:

- `.price-card`
- `.price-card.featured`

States:

- Normal card: white with neutral hard shadow.
- Featured card: black with orange shadow and orange price text.

### PaymentStatus

Source:

- `prototype/pricing.html`

Classes:

- `.payment-status`
- `.payment-status.active`
- `.payment-status.error`
- `.payment-status.success`

Behavior:

- Hidden by default.
- Shows messages during config fetch, Snap token creation, Snap open, success, pending, error, and popup close.

## 9. State and Data Utilities

Source:

- `prototype/assets/js/wizard-state.js`

Global namespace:

- `window.PixWizard`

Public functions used by pages:

- `loadState`
- `saveState`
- `resetState`
- `parseRabItems`
- `getProjectItems`
- `escapeHtml`
- `findGalleryPhoto`
- `getReportItems`
- `addToReport`
- `removeFromReport`
- `moveReportPhoto`
- `updateReportPhoto`
- `addGalleryPhoto`
- `readImageFile`
- `imageFitStyle`
- `arLabel`
- `renderWizardChrome`
- `projectSummary`

Stored state key:

- `pixforme.prototype.wizard.v3`

Core data objects:

- `workspace`
- `project`
- `report`
- `gallery`
- `reportPhotos`
- `preview`

## 10. Optional Notes

None.

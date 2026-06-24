# Pixforme Prototype UI Specification

Source analyzed: `prototype/` HTML, CSS, and JavaScript files. This document captures the existing prototype only. It is not a redesign brief and does not define Next.js implementation details.

## 1. Product Shape

The prototype is a report-generation product for Indonesian project documentation. The UI language is functional, pixel-styled, and document-centric.

Primary flows:

- Public marketing shell: home, product placeholder, tools placeholder, pricing, login.
- Workspace: manage multiple projects and reusable RAB item lists.
- Wizard: four-step report creation flow.
- Preview/export: template selection, report styling, A4/F4 page preview, browser print export.
- Sandbox payment test: pricing page Midtrans Snap test for AI credit package.

Prototype brand text is `PIXFORME`. The repository/project name may be PixofMe, but the visible prototype branding is Pixforme.

## 2. Visual System

### 2.1 Style Direction

The visual system uses:

- Pixel-art identity through `Press Start 2P` headings, 7x7 inline SVG icons, and a blocky pixel logo.
- Heavy black outlines.
- Offset hard shadows instead of soft shadows.
- Small border radii.
- Warm orange/red accent palette.
- Off-white document/workspace background.
- Dense operational layouts for the wizard and workspace.

The main visual contract is "professional document tool with pixel-style interface", not a modern soft SaaS redesign.

### 2.2 Color Roles

Core CSS variables are defined in `prototype/assets/css/tokens.css`.

- Page background: `#FBFBF8`
- Surface/card: `#FFFFFF`
- Accent background: `#F4F4F1`
- Primary text/outline: `#0A0A0A`
- Muted text: `#6B6B68`
- Border: `#E5E5E0`
- Primary accent: `#FF6B1A`
- Red accent/shadow: `#E8331C`
- Amber warning: `#FFA41B`
- Success: `#2E9E5B`
- Success background: `#EAFAF1`
- Warning/accent tint: `#FFF7E8`
- Active orange tint used repeatedly: `#FFF1E8`

### 2.3 Typography

Font imports:

- Pixel headings/logo: `Press Start 2P`
- Body/UI: `Inter`
- Mono labels/data: `Space Mono`

Typography rules observed:

- Pixel headings use high line-height, commonly `1.7` to `1.8`.
- Body text uses `Inter` with compact sizes from 10px to 16px.
- Uppercase micro labels use 8.5px to 11px, bold weights, and letter spacing.
- Numeric/status values often use `Space Mono`.
- Preview document text is intentionally tiny: 6px to 12px depending on preview controls.

### 2.4 Border, Radius, Shadow

Common shapes:

- Main cards: `2px solid #0A0A0A`, radius 6px, shadow `4px 4px 0 #E5E5E0`.
- Accent cards: same border with orange shadow `4px 4px 0 #FF6B1A`.
- CTA banner: black border, radius 8px, black shadow `6px 6px 0 #0A0A0A`.
- Buttons: radius 4px, hard shadow, active state translates by 3px and removes shadow.
- A4 preview page: `2px solid #0A0A0A`, radius 3px, shadow `5px 5px 0 #E5E5E0`.
- Modals: `3px solid #0A0A0A`, radius 8px, orange shadow `6px 6px 0 #FF6B1A`.

Do not replace hard shadows with blurred elevation.

### 2.5 Iconography

Icons are generated from 7x7 grid data in `prototype/assets/js/pixel-icons.js`.

Available icon names include:

- `folder`, `upload`, `check`, `chevR`, `chevL`, `download`, `mapPin`, `sparkle`
- `crop`, `replace`, `trash`, `x`, `layout`, `sliders`, `bulk`, `clock`
- `search`, `move`, `camera`, `geo`, `watermark`, `wand`, `image`, `arrowRight`
- `star`, `grid`, `lock`

Icons are injected through:

- `data-pixel-icon`
- `data-pixel-size`
- `data-pixel-color`
- `data-pixel-logo`

The logo is an inline block pixel mark with black, orange, and red rectangles.

## 3. Global Layout Rules

### 3.1 Containers

Shared containers:

- `.container`: max width 1100px, horizontal padding 24px.
- `.container-narrow`: max width 900px, horizontal padding 24px.
- Mobile padding under 720px becomes 16px.

### 3.2 Public Top Navigation

`topnav.js` injects the marketing nav.

Desktop:

- Height 64px.
- Sticky top.
- White background.
- Bottom border 3px black.
- Padding 0 24px.
- Logo left.
- Links center/left with flex growth.
- Actions right: "Masuk", "Mulai Gratis".

Mobile under 720px:

- `.topnav-links` are hidden.
- Logo and actions remain visible.

Active links:

- Active background `#FFF1E8`.
- Active text orange.

### 3.3 Wizard Shell

Wizard pages use `.wizard-shell`:

- Min height 100vh.
- Off-white background with subtle 24px grid lines.
- Sticky wizard topbar at top.

Wizard topbar:

- White background.
- Bottom border 3px black.
- Min height 60px.
- Desktop layout is logo left, step nav center, actions right.
- Under 900px it stacks vertically, aligns left, and wraps nav/actions.

Wizard step nav:

- Four steps: Project, Laporan, Foto & Caption, Preview.
- Previous steps become links and use success green check icon.
- Current step uses orange background/number.
- Future steps are non-link divs.

### 3.4 Main Wizard Page Layouts

Step 1 and Step 2:

- `.wizard-page.container-narrow`
- `.wizard-grid-2`: main card plus 330px aside.
- Desktop columns: `minmax(0, 1fr) 330px`.
- Under 900px: single column.

Step 3:

- `.gallery-layout`: 300px gallery sidebar plus flexible report photo grid.
- Gallery sidebar is sticky at top 82px on desktop.
- Under 900px: single column and sidebar becomes static.

Step 4:

- `.preview-layout`: 250px sidebar plus flexible preview area.
- Sidebar is sticky, full viewport height minus topbar.
- Under 900px: single column and sidebar becomes static.

Workspace:

- `.workspace-layout`: 270px project list plus flexible project form.
- Under 900px: single column.

## 4. Responsive Behavior

Breakpoints observed:

- `900px`: landing two-column/three-column sections reduce; wizard, gallery, preview, workspace collapse to one column; topbar wraps.
- `800px`: pricing grid and tools route grid collapse to one column.
- `720px`: shared topnav links hide and container padding reduces to 16px.
- `600px`: landing grids collapse to one column; hero headline font reduces from 26px to 19px; CTA stacks centered; footer becomes one column.

Responsive behavior must preserve the same order:

- Wizard topbar stays first.
- Page title remains above content.
- Main form/content precedes supporting aside when columns collapse.
- Preview sidebar controls appear above preview pages when collapsed.

## 5. Core Components

### 5.1 Pixel Button

Base class: `.pixel-btn`

Default:

- Inline-flex.
- Gap 8px.
- Padding 10px 20px.
- Radius 4px.
- Font size 12px, weight 700.
- No soft shadow.
- `white-space: nowrap`.

Variants:

- Primary: black background, white text, orange shadow.
- Accent: orange background, white text, red shadow.
- Success: success green background, darker green shadow.
- Ghost: white background, black border, border-color shadow.
- Large: padding 14px 28px, font size 14px.
- Disabled: gray background/text, no shadow, not-allowed cursor.

Interaction:

- On active press, translate `3px, 3px` and remove shadow.

### 5.2 Card

Base class: `.card`

- White background.
- 2px black border.
- Radius 6px.
- Padding 26px.
- Shadow 4px 4px 0 border color.
- Column flex with 18px gap.

Accent variant uses orange shadow.

### 5.3 Fields

Labels:

- `.field-label`
- 10px uppercase.
- Bold.
- 0.05em letter spacing.
- Required marker uses red.

Inputs/textareas:

- Full width.
- Padding 10px 13px.
- Radius 4px.
- Font size 14px.
- 2px border using neutral border token.
- Focus border orange.
- `.required-empty` border amber.
- Textareas resize vertically and line-height 1.6.

Mini inputs:

- Used inside photo cards.
- 11px font.
- 1.5px border.
- Radius 3px.
- Padding 7px 8px.

### 5.4 Toggle Button

Base class: `.toggle-btn`

- Flex row with icon/text gap.
- Min width 160px.
- 2px black border.
- White background.
- Font size 11px, weight 800.
- Active state: orange background, white text, red 3px shadow.

Used for logo selection, header display mode, paper size, and preview border toggle.

### 5.5 State Chips

`.state-chip-row` wraps small chips.

Chip:

- Pill radius 999px.
- Accent background.
- 1.5px neutral border.
- 11px bold muted text.
- Padding 5px 9px.

Used for project/report summary, item count, page size, template, photos per page, and selected photo count.

### 5.6 Info Panel

`.info-panel`

- White background.
- 2px black border.
- Radius 6px.
- Neutral hard shadow.
- Padding 18px.

Text is small, muted, and line-height 1.65.

### 5.7 Modal

`.modal-overlay`

- Fixed full-screen.
- Dark translucent background.
- Hidden by default.
- `.show` displays flex centered.
- z-index 3000.

`.modal-box`

- Max width 460px.
- White surface.
- 3px black border.
- Radius 8px.
- Orange hard shadow.
- Padding 22px.

Close buttons use pixel `x` icon.

## 6. Page Specifications

### 6.1 Home Page

File: `prototype/index.html`

Hero:

- Two-column desktop grid: `1.1fr 0.9fr`.
- Padding top 64px.
- H1 pixel font, 26px, line-height 1.7.
- Orange highlighted phrase.
- Lead text max width 480px.
- CTA row wraps.
- Right visual is a stack of mock A4 pages with rotated transforms.
- Floating badges use black/success background with orange/green hard shadows.

Sections:

- Problem strip uses black marquee with mono text.
- Solution grid: 2 columns desktop, 1 column under 600px.
- How-it-works: 4 columns desktop, 2 under 900px, 1 under 600px.
- Template showcase: 5 columns desktop, 3 under 900px, 1 under 600px.
- AI tools: 3 columns desktop, 2 under 900px, 1 under 600px.
- CTA banner: orange block with black shadow.
- Footer: 4-column desktop, 2 under 900px, 1 under 600px.

Motion:

- Marquee animates left over 28s linear.
- Animation disabled under `prefers-reduced-motion: reduce`.

### 6.2 Product Page

File: `prototype/product.html`

- Centered hero with 22px pixel heading.
- Placeholder dashed box, max width 700px.
- Icon wrapper 56px square.
- CTA links to wizard step 1.

### 6.3 Tools Page

File: `prototype/tools.html`

- Centered hero with 22px pixel heading.
- Tool route grid max width 1000px, 3 columns desktop, 1 under 800px.
- Tool route cards use 2px black border, radius 8px, neutral shadow.
- Tool statuses use small uppercase badges.
- Current buttons are disabled and cards are marked coming soon through opacity.

### 6.4 Pricing Page

File: `prototype/pricing.html`

- Centered hero.
- Pricing grid max width 1000px, 3 columns desktop, 1 under 800px.
- Price cards use black border, radius 8px, neutral hard shadow.
- Featured Pro card is black with orange price text and orange shadow.
- AI Credit card includes sandbox payment button and status box.

Payment behavior:

- `Uji Bayar` button calls `/api/midtrans/config`, loads sandbox Snap JS, then calls `/api/midtrans/snap-token`.
- Status box is hidden by default and becomes visible through `.active`.
- Error state uses orange tint and red border.
- Success state uses success background and success border.
- If endpoint returns HTML instead of JSON, the prototype displays a message instructing use of the local Node server origin.

### 6.5 Login Page

File: `prototype/login.html`

- Full-height centered login layout.
- Login box width 360px.
- Centered logo row above accent card.
- Card contains email, password, full-width accent button, and signup link.

### 6.6 Workspace Page

File: `prototype/workspace.html`

- Wizard shell with workspace title and state chips.
- Two-column layout: 270px project list and project form.
- Project list items are buttons with black border, radius 5px, and hard shadow.
- Active project uses orange tint and orange shadow.
- `Tambah` creates a new draft project, activates it, clears active project fields, saves state.
- Editing fields persists active project data to localStorage.
- RAB item preview renders chips from parsed item list.

### 6.7 Wizard Step 1 - Project Setting

File: `prototype/wizard-step1.html`

Purpose:

- Collect project/job name, client/institution, location, RAB item list, logo visibility, report header text, and header mode.

Required behavior:

- Project name is required.
- On next without project name, input gets `.required-empty` and focus.
- RAB textarea is parsed into reusable project items.
- Project aliases are synchronized: `name/pekerjaan`, `client/instansi`, `location/lokasi`.
- Active workspace project summary updates as fields change.
- Reset removes stored demo state and reloads page.

### 6.8 Wizard Step 2 - Report Details

File: `prototype/wizard-step2.html`

Purpose:

- Collect report name and report period/date.

Required behavior:

- Report name is required.
- On next without report name, input gets `.required-empty` and focus.
- Template is intentionally not selected here.
- Summary aside reflects current project and photo state.

### 6.9 Wizard Step 3 - Photo & Caption

File: `prototype/wizard-step3.html`

Purpose:

- Manage gallery photos, choose photos for the report, edit per-report photo metadata, adjust fit, mark AI extend, add geotag overlay, reorder, remove, and bulk-apply item/progress.

Desktop layout:

- Sticky left gallery panel width 300px.
- Right report area uses auto-fill grid with minimum photo-card width 250px.

Gallery:

- Gallery item uses 72px thumbnail plus metadata.
- Each photo shows filename, source type, aspect ratio label, and add/select button.
- Source labels: `LAPORAN` or `BUKTI LAPANGAN`.
- Aspect labels include `PORTRAIT`, `4:3 OK`, or numeric ratio.
- Upload reads local image files into data URLs and prepends to gallery.

Report photo card:

- 4:3 photo frame.
- Top-left aspect/AI badge.
- Bottom-right index badge.
- Optional geotag overlay in orange.
- Tool row has six buttons: UP, DOWN, FIT, AI, GEO, DEL.
- Fields: Nama Pekerjaan, Item Pekerjaan select, Progress input plus quick buttons 25/50/75/100.

Fit modal:

- Opens from FIT button.
- Shows 4:3 crop stage.
- Options: Crop 4:3, Contain, AI Extend.
- Crop mode supports vertical crop range 0 to 100.
- Contain mode hides crop control.
- AI Extend only marks state in prototype; it does not call a production AI API.

Geotag modal:

- Opens from GEO button.
- Inputs: address, latitude, longitude, date, time.
- Fake map changes coordinates by click position.
- Save stores geotag on report photo.
- Remove clears geotag.
- Geotag metadata is non-destructive and is rendered in Step 3 and Step 4.

Bulk behavior:

- Bulk item dropdown is sourced from project RAB items.
- Bulk progress accepts 0 to 100 number.
- Apply updates all selected report photos where values are provided.

### 6.10 Wizard Step 4 - Preview & Export

File: `prototype/wizard-step4.html`

Purpose:

- Choose template, tune report style, preview paginated paper output, and export through browser print.

Layout:

- Sidebar width 250px.
- Main preview scroll area.
- Pages wrap in rows with 24px gap.

Tabs:

- Template tab renders template options.
- Gaya tab renders paper size, color, grid coordinate color/size, spacing, font size, photo border, corner radius, and header mode.

Paper sizes:

- A4 portrait preview: 300 x 424px.
- A4 landscape preview: 424 x 300px.
- F4 portrait preview: 300 x 472px.
- F4 landscape preview: 472 x 300px.

Templates:

- `t1` Stack + Teks: portrait, A4 2 photos/page, F4 3 photos/page.
- `t2` Grid Equal: portrait, A4 4 photos/page, F4 6 photos/page.
- `t3` Grid Border: portrait, A4 4 photos/page, F4 6 photos/page, numbered visual marker.
- `t4` Full Page: portrait, 1 photo/page.
- `t5` Landscape Split: landscape, A4 2 photos/page, F4 3 photos/page.

Preview styling controls:

- Accent colors: black, orange, red, amber, blue, teal, purple.
- Grid coordinate colors: white, black, yellow, green.
- Grid coordinate size range: 6 to 12px.
- Spacing range: 2 to 18px.
- Font size range: 6 to 12px.
- Photo border toggle.
- Border radius range: 0 to 8px.
- Header mode: all pages or first page only.

Pagination:

- Pages are chunks of selected report photos based on active template and paper size.
- If no photos exist, one empty page still renders.
- Last page keeps the template layout; empty slots stay whitespace without placeholders.

Document preview:

- Header shows selected logos, header text with line breaks, and report period.
- Header bottom border uses accent color.
- Footer shows project name and page number/total using accent color.
- Report card captions include name, item, progress, and optional geotag.
- Grid templates use coordinate overlay directly over image with automatic contrasting stroke.

Export:

- Export button builds print styles, sets document title from project/report/paper, adds `export-pdf-mode`, and calls `window.print()`.
- Print mode hides topbar, sidebar, title row, and page labels.
- Print mode sets `@page` size and scales preview dimensions to millimeters.
- After print, export mode is removed and original title restored.

## 7. State Model

Storage key:

- `pixforme.prototype.wizard.v3`

Top-level state:

- `workspace`: workspace name, active project id, project list.
- `project`: name/client/location/header/logo/RAB/item settings.
- `report`: report name and period.
- `gallery`: available images.
- `reportPhotos`: selected gallery-photo relations with metadata.
- `preview`: template, paper, color, spacing, font, border, and export style settings.

Important behavior:

- State is loaded from localStorage and merged with defaults.
- Invalid/missing stored state falls back to default demo state.
- Project aliases are normalized so older field names still work.
- RAB items are cleaned, normalized, de-duplicated, and filtered.
- Report photos reference gallery photos by `photoId`.

## 8. Optional Notes

None.

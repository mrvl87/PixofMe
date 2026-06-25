# Pixforme Prototype Acceptance Criteria

Status: synced to current `prototype/` on 2026-06-25.
Scope: verification criteria for prototype parity. Do not implement Next.js changes before approval.

## 1. Global Visual Criteria

- Visible brand text must remain `PIXFORME`.
- UI must preserve pixel headings, 7x7 pixel icons, heavy black outlines, small radii, and hard offset shadows.
- Primary colors must match `docs/DESIGN_TOKENS.json`.
- Cards, panels, modals, buttons, and page previews must use hard shadows, not blurred elevation.
- Body text must use Inter or equivalent token.
- Pixel headings/logo text must use Press Start 2P or equivalent token.
- Numeric/status/coordinate text must use Space Mono or equivalent token.
- Focus-visible controls must show a 3px orange outline with 2px offset.
- Reduced motion preference must disable animations/transitions.

## 2. Source Criteria

- Treat `prototype/index.html`, `prototype/assets/css/tokens.css`, `prototype/assets/css/wizard.css`, `prototype/assets/js/pixel-icons.js`, `prototype/assets/js/topnav.js`, and `prototype/assets/js/wizard-state.js` as the current prototype sources.
- Do not rely on non-existent `prototype/styles.css` or `prototype/app.js` unless those files are later added.

## 3. Responsive Criteria

- Under 720px, public topnav links must hide while logo and actions remain visible.
- Under 900px, wizard topbar must stack/wrap without overflow.
- Under 900px, landing grids reduce appropriately and wizard layouts collapse to one column.
- Under 800px, pricing/tools route grids collapse to one column.
- Under 600px, landing grids become one column and hero heading uses smaller mobile size.
- No fixed-width component may cause horizontal page overflow.

## 4. Public Navigation and Login Criteria

- Public topnav must render logo, Produk, AI Fix Tools, Harga, Masuk, and Mulai Gratis.
- Active public route must use orange active styling.
- Login page must render centered 360px login box with logo, email, password, full-width login button, and signup/free-start link.
- Prototype login button and signup/free-start link must route to `workspace.html`.

## 5. Home Page Criteria

- Hero must render two columns on desktop with CTA copy and mock report stack visual.
- Mock pages must retain rotated stacked-paper appearance and floating badges.
- Problem strip must use black background and scrolling marquee unless reduced motion is enabled.
- Solutions section must render four compact cards in a 4-column desktop grid.
- Solution cards must use layered offset shadows and hover motion.
- Workflow section must render four image-backed step cards using the images in `prototype/cssstyleassets/#3/img/`.
- Workflow cards must keep image frame, step number, title, copy, slight rotation, and hover lift.
- Template showcase must render sticky scroll behavior, canvas pixel background, section copy, and five rich template thumbnails.
- Template thumbnails must use photo-based mini-previews, not gray placeholders.
- AI tools section must render three tool cards with the featured black card first.
- CTA banner must be orange with black hard shadow.
- Footer must preserve multi-column desktop layout and responsive collapse.

## 6. Workspace Criteria

- Workspace page must contain project cards only plus create-project entry.
- Workspace must not show project setting forms.
- Workspace summary chips must include `Free Tier` and project count.
- Existing project cards must show id, status, title, institution/location metadata, and `Buka Wizard` CTA text.
- Active project card must use orange border/shadow styling.
- Create card must be visually distinct with dashed border/accent background and plus mark.
- Clicking existing project must activate it, sync project state, save localStorage, and navigate to `wizard-step1.html`.
- Clicking create must open `CreateProjectModal`.
- Create modal must contain one required text field: `Nama Project`.
- Empty create submission must focus the input and not create a project.
- Valid create submission must create/activate project, clear detail fields, save state, and navigate to `wizard-step1.html`.

## 7. Wizard Step 1 Criteria

- Step 1 must render project name, institution/client, location, RAB textarea, logo toggles, header text, and header mode toggles.
- Project name must be required.
- Empty project name on next must set required-empty styling and focus the input.
- RAB textarea must parse pasted lines into deduplicated item names.
- Parsed RAB items must be available for Step 3 dropdowns.
- Logo Instansi and Logo Perusahaan toggles must persist boolean state.
- Header mode must support all pages and first page only.
- Reset must remove prototype localStorage and reload defaults.
- Next must save state and navigate to Step 2 when valid.

## 8. Wizard Step 2 Criteria

- Step 2 must render report name and period fields.
- Report name must be required.
- Empty report name on next must set required-empty styling and focus the input.
- Step 2 must not include template selection.
- Summary panel must reflect current project/report state.
- Next must save state and navigate to Step 3 when valid.

## 9. Wizard Step 3 Layout Criteria

- Step 3 must not show a persistent left gallery panel.
- Step 3 must show report slot/card area only, with workbar and bulk controls.
- `Add Foto` must be a fixed floating button at bottom-right.
- Clicking `Add Foto` must create an empty card/slot and scroll to it.
- Workbar counter must show total cards and empty placeholders.
- Bulk item/progress controls must remain available.

## 10. Wizard Step 3 Photo Card Criteria

- Filled card must show image, aspect/AI badge, index badge, optional geotag overlay, solid icon toolbar, fields, and progress quick buttons.
- Empty card must use gray placeholder frame with large plus, `EMPTY`, and help text.
- Every card must have Add/Ganti photo control.
- Empty cards must disable FIT, AI, and GEO controls.
- Toolbar must use solid pixel icons and short labels: ADD/GANTI, NAIK, TURUN, FIT, AI, GEO, HAPUS.
- UP/DOWN must reorder cards.
- HAPUS must remove the card.
- Metadata field edits must persist per card.
- Progress quick buttons 25, 50, 75, and 100 must update progress and active state.
- AI button must mark a filled card as AI extended and reset fit mode to crop with cropY 50.

## 11. Photo Picker Modal Criteria

- Add/Ganti or empty frame click must open `photoPickerModal`.
- Modal must render gallery photos in a responsive grid.
- Used photos must appear grayscale/disabled-looking and show a green check marker.
- The current card photo can be clicked to unselect, leaving the card as an empty placeholder.
- Photos used by other cards must not replace the active card.
- Upload button in modal must trigger hidden multi-image file input.
- Uploaded images must be read as data URLs and prepended to gallery.

## 12. Step 3 Preview Guard Criteria

- Step 3 Preview action must be a button, not a direct link.
- If there are no cards, preview navigation must be blocked and warning modal shown.
- If any card is empty, preview navigation must be blocked and warning modal shown.
- Warning copy must indicate the missing/empty card condition.
- With all cards filled, Preview must navigate to Step 4.

## 13. Fit Modal Criteria

- FIT opens the fit modal for filled cards only.
- Modal must show selected image in a 4:3 crop stage.
- Crop 4:3, Contain, and AI Extend options must be available.
- Crop range must run from 0 to 100 and update preview object-position immediately.
- Contain mode must hide the crop range.
- Selecting a fit option must save state, close modal, and rerender.
- Close button and overlay click must close modal without saving a new option.

## 14. Geotag Modal Criteria

- GEO opens the geotag modal for filled cards only.
- Modal must render address, latitude, longitude, date, and time fields.
- Default coordinates must be Jayapura coordinates when no geotag exists.
- Fake map click must update latitude/longitude and coordinate readout.
- Save must persist geotag metadata and rerender overlay.
- Hapus must clear geotag metadata.
- Geotag metadata must remain non-destructive.

## 15. Wizard Step 4 Controls Criteria

- Step 4 must render preview sidebar and page preview area.
- Sidebar must have TEMPLATE and GAYA tabs.
- TEMPLATE tab must list five template options.
- Template options must update photos-per-page text based on selected paper size.
- GAYA tab must include paper size, accent color, grid coordinate color, grid coordinate size, spacing, font size, photo border, radius, and header mode.
- Every GAYA control change must persist state and rerender preview.
- Summary chips must show paper, template, photos per page, and total photos.

## 16. Preview Template Criteria

- A4 portrait preview dimensions must be 300 x 424px.
- A4 landscape preview dimensions must be 424 x 300px.
- F4 portrait preview dimensions must be 300 x 472px.
- F4 landscape preview dimensions must be 472 x 300px.
- Stack + Teks must render 2 photos per A4 page and 3 per F4 page.
- Grid Equal must render 4 photos per A4 page and 6 per F4 page.
- Grid Border must render 4 photos per A4 page and 6 per F4 page with visual numbering.
- Full Page must render 1 photo per page.
- Landscape Split must render 2 photos per A4 landscape page and 3 per F4 landscape page.
- If no photos exist, one empty page must still render.
- Last page must leave empty slots as whitespace without placeholder cards.
- Stack + Teks last page must not show extra empty bordered rows.
- Header must respect all-pages versus first-page header mode.
- Header border and progress/accent details must use selected accent color.
- Footer must show project name and page number/total.

## 17. Grid Caption and Coordinate Criteria

- Grid Equal and Grid Border must place caption below each photo.
- Progress must appear as text in the caption/progress area without progress bar.
- Geotag coordinates must overlay directly over the photo without background box.
- Overlay text must be left aligned.
- Overlay line order must be: coordinates, location/address, date/time.
- Overlay must use selected grid coordinate color.
- Overlay must apply automatic contrasting stroke/shadow so text remains readable on light or dark images.
- Grid coordinate font size control must affect overlay size.

## 18. Export Criteria

- Export PDF button must render current pages before printing.
- Export must inject `@page` print sizing for active paper and orientation.
- Export must set document title from project name, report name, and paper label.
- Export must add `export-pdf-mode` before calling `window.print()`.
- Print mode must hide wizard topbar, preview sidebar, title row, and page labels.
- Print mode must remove preview page shadow and radius.
- Print scaling must fill the target page, not export a half-page layout.
- After print, body must leave export mode and document title must be restored.

## 19. Payment Sandbox Criteria

- Pricing `Uji Bayar` must request `/api/midtrans/config`.
- Snap JS must load from the Midtrans sandbox URL with client key.
- Token request must post to `/api/midtrans/snap-token` with SKU `ai_starter`.
- Status box must show transaction progress messages.
- Success callback must show success state.
- Pending callback must show pending/status guidance.
- Error callback must show error state.
- Close callback must show popup-closed message.
- If API endpoint returns non-JSON HTML, UI must show local-server-origin guidance.

## 20. State Criteria

- State must use storage key `pixforme.prototype.wizard.v3`.
- Loading state must merge saved state with defaults.
- Invalid stored JSON must fall back to defaults.
- Project aliases must remain synchronized: `name/pekerjaan`, `client/instansi`, `location/lokasi`.
- RAB parser must trim, clean numbering, deduplicate, filter non-work rows, and preserve useful item labels.
- Report cards must support both filled rows with `photoId` and empty slots with `photoId: null`.
- Image fit style must support crop, contain, AI-extended crop, and cropY object-position.

## 21. Next.js Delta Criteria Before Implementation

These are review findings only:

- Next landing must be updated to the latest solutions/workflow/template showcase design.
- Next workspace must change from settings form to project-card-only workspace.
- Next login/free-start flow must route through workspace.
- Next Step 3 must change from persistent gallery sidebar to slot/photo-picker modal workflow.
- Next icons must include new solid toolbar icons.
- Next CSS must include workspace cards, photo picker, floating Add Foto, solid toolbar, and latest landing section styles.

## 22. Non-Goals

- Do not redesign the visual system.
- Do not replace the pixel icon system with another icon family.
- Do not move template selection into Step 2.
- Do not implement production AI calls from prototype-only AI Extend state.
- Do not edit Next.js implementation until explicitly approved.
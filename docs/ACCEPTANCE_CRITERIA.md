# Pixforme Prototype Acceptance Criteria

These criteria preserve the current prototype behavior and visual system. They are written for future implementation verification, but they do not require or describe Next.js code.

## 1. Global Visual Criteria

- The UI must preserve the prototype brand text `PIXFORME` where visible.
- The visual system must keep pixel-style headings, pixel icons, heavy black outlines, small radii, and hard offset shadows.
- Primary color tokens must match the extracted values in `docs/DESIGN_TOKENS.json`.
- Cards, panels, modals, buttons, and page previews must use hard shadows, not blurred shadows.
- Interactive controls must keep compact operational sizing and spacing.
- Body text must use Inter or the matching body token.
- Pixel headings and logo text must use Press Start 2P or the matching pixel token.
- Numeric/status/coordinate text must use Space Mono or the matching mono token.
- Focus-visible controls must show a 3px orange outline with 2px offset.
- Reduced motion preference must disable animations and transitions.

## 2. Responsive Criteria

- At widths under 720px, public top navigation links must hide while logo and action buttons remain available.
- At widths under 900px, wizard topbar content must stack/wrap instead of overflowing.
- At widths under 900px, wizard form layouts, gallery layout, preview layout, and workspace layout must collapse to a single column.
- At widths under 800px, pricing and tools grids must collapse to one column.
- At widths under 600px, landing-page grids must become one column and the hero heading must use the smaller mobile size.
- Collapsed layouts must keep the same content order as the prototype.
- No fixed-width component may cause horizontal page overflow on mobile.

## 3. Navigation Criteria

- Public topnav must render logo, Produk, AI Fix Tools, Harga, Masuk, and Mulai Gratis.
- Public topnav must highlight the active route from page state.
- Wizard chrome must show four steps: Project, Laporan, Foto & Caption, Preview.
- Completed wizard steps must be clickable and show a check indicator.
- Current wizard step must be highlighted orange.
- Future wizard steps must be inactive/non-clickable.

## 4. Home Page Criteria

- Hero must render the two-column layout on desktop with CTA copy and mock report stack visual.
- Hero mock pages must retain rotated stacked-paper appearance and floating badges.
- Problem strip must use a black background and scrolling marquee text unless reduced motion is enabled.
- Solution cards must render four problem/solution items.
- How-it-works must render four step cards.
- Template showcase must render five template thumbnails.
- AI tools section must render three tool cards with the featured black card first.
- CTA banner must be orange with black hard shadow.
- Footer must preserve multi-column layout on desktop and collapse responsively.

## 5. Product, Tools, Pricing, Login Criteria

- Product page must render centered page hero and dashed placeholder box.
- Tools page must render three tool route cards with disabled buttons and coming-soon badges.
- Pricing page must render three pricing cards: Gratis, Pro, Kredit AI.
- Pro pricing card must be the featured black card.
- Kredit AI card must show the Rp29.000 sandbox test package and `Uji Bayar` button.
- Login page must render a centered 360px login box with logo, accent card, email field, password field, full-width login button, and signup link.

## 6. Workspace Criteria

- Workspace page must load and save state through the same localStorage state model.
- Workspace summary chips must show workspace name, project count, and active item count.
- Project list must show at least the default active project and draft project from default state.
- Active project list item must use orange-tinted active styling.
- Clicking `Tambah` must create a new draft project, activate it, clear active project fields, save state, and rerender.
- Editing project fields must persist name, institution/client, location, RAB text, and parsed item list.
- RAB item preview must render parsed item chips.

## 7. Wizard Step 1 Criteria

- Step 1 must render project name, institution/client, location, RAB textarea, logo toggles, header text, and header mode toggles.
- Project name must be required.
- If user clicks Lanjut with empty project name, the project name input must receive amber required-empty styling and focus.
- RAB textarea must parse pasted lines into de-duplicated item names.
- Parsed RAB items must be available for Step 3 dropdowns.
- Logo Instansi and Logo Perusahaan toggles must persist boolean state.
- Header mode must support `Semua Halaman` and `Halaman Pertama`.
- Reset must remove prototype state and reload defaults.
- Lanjut must save state and navigate to Step 2 when valid.

## 8. Wizard Step 2 Criteria

- Step 2 must render report name and period/date fields.
- Report name must be required.
- If user clicks Lanjut with empty report name, report name input must receive amber required-empty styling and focus.
- Step 2 must not include template selection.
- Summary panel must reflect current project and report state.
- Lanjut must save state and navigate to Step 3 when valid.

## 9. Wizard Step 3 Criteria

- Step 3 must render a gallery panel and report photo area on desktop.
- Gallery panel must stay sticky on desktop and become static on mobile.
- Upload button must trigger hidden multi-image file input.
- Uploaded images must be read as data URLs and prepended to gallery.
- Gallery items must show thumbnail, filename, source label, aspect ratio label, and selection button.
- Selecting a gallery photo must create a report-photo relation and change its button to selected/success state.
- Duplicate selected gallery photos must not be added again.
- Report photo grid must auto-fill cards with minimum width 250px.
- Empty report state must show a dashed empty message.
- Each photo card must show image, aspect/AI badge, index badge, tools row, metadata fields, and progress quick buttons.
- UP/DOWN must reorder report photos.
- DEL must remove a report photo.
- Metadata field edits must persist per report photo.
- Progress quick buttons 25, 50, 75, and 100 must update progress and active state.
- Bulk apply must update all report photos for item and/or progress when values are provided.
- AI button must mark the photo as AI extended and reset fit mode to crop with cropY 50.

## 10. Fit Modal Criteria

- FIT button must open the fit modal for the selected report photo.
- Modal must show the selected image in a 4:3 crop stage.
- Crop 4:3, Contain, and AI Extend options must be available.
- Crop range must run from 0 to 100 and default to current cropY or 50.
- Moving crop range must update preview image object-position immediately.
- Contain mode must hide the crop range control.
- Selecting a fit option must save state, close modal, and rerender the report grid.
- Close button and overlay click must close the modal without saving a new option.

## 11. Geotag Modal Criteria

- GEO button must open the geotag modal for the selected report photo.
- Modal must render address, latitude, longitude, date, and time fields.
- Default coordinates must be Jayapura coordinates when no geotag exists.
- Fake map click must update latitude/longitude and map coordinate text.
- Simpan Geotag must save geotag metadata and rerender overlay.
- Hapus must clear geotag metadata.
- Geotag overlay must appear in Step 3 photo card and Step 4 preview where the selected template supports it.

## 12. Wizard Step 4 Criteria

- Step 4 must render preview sidebar and page preview area.
- Sidebar must have TEMPLATE and GAYA tabs.
- TEMPLATE tab must list five template options from prototype state.
- Template options must update photos-per-page text based on selected paper size.
- Selecting a template must save state and rerender pages.
- GAYA tab must include controls for paper size, accent color, grid coordinate color, grid coordinate size, spacing, font size, photo border, radius, and header mode.
- Every GAYA control change must persist state and rerender preview.
- Summary chips must show paper, template, photos per page, and total photos.

## 13. Preview Template Criteria

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
- Last page must preserve template structure and leave empty slots blank/white, without placeholder cards.
- Header must respect `all` versus `first` header mode.
- Header border and progress/accent details must use selected accent color.
- Footer must show project name and page number/total.
- Grid geotag overlay must use selected grid coordinate color with automatic contrasting stroke.

## 14. Export Criteria

- Export PDF button must render current pages before printing.
- Export must inject `@page` print sizing for active paper and orientation.
- Export must set document title from project name, report name, and paper label.
- Export must add `export-pdf-mode` before calling `window.print()`.
- Print mode must hide wizard topbar, preview sidebar, title row, and page labels.
- Print mode must remove preview page shadow and radius.
- After print, body must leave export mode and document title must be restored.

## 15. Payment Sandbox Criteria

- Pricing `Uji Bayar` must request `/api/midtrans/config`.
- Snap JS must load from the Midtrans sandbox URL with client key.
- Token request must post to `/api/midtrans/snap-token` with SKU `ai_starter`.
- Status box must show transaction progress messages.
- Success callback must show success state.
- Pending callback must show pending/status guidance.
- Error callback must show error state.
- Close callback must show popup-closed message.
- If API endpoint returns non-JSON HTML, UI must show the local-server-origin guidance from the prototype.

## 16. State Criteria

- State must use storage key `pixforme.prototype.wizard.v3`.
- Loading state must merge saved state with defaults.
- Invalid stored JSON must fall back to defaults.
- Project aliases must remain synchronized: `name/pekerjaan`, `client/instansi`, `location/lokasi`.
- RAB parser must trim, clean numbering, de-duplicate, filter non-work rows, and preserve useful item labels.
- Report photos must reference gallery photos by `photoId`.
- Image fit style must support crop, contain, AI-extended crop, and cropY object-position.

## 17. Non-Goals

- Do not redesign the visual system.
- Do not replace the pixel icon system with a different icon style.
- Do not move template selection into Step 2.
- Do not convert prototype notes into production claims unless implemented later.
- Do not write or infer Next.js code from this document.

## 18. Optional Notes

None.

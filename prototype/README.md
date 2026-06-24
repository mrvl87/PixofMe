# Pixforme Prototype

Folder ini adalah ruang desain UI/UX sementara untuk Pixforme.io.

Tujuan:

- Menguji wizard laporan 4 langkah dalam HTML, CSS, dan JS murni.
- Menjaga bentuk visual awal sebelum diterjemahkan ke framework production.
- Memantau alur project, laporan, galeri foto, caption, geotag, template, dan preview PDF.

Halaman utama wizard:

- wizard-step1.html - Project dan header.
- wizard-step2.html - Detail laporan.
- wizard-step3.html - Galeri, foto laporan, caption, reorder, fit, AI flag, geotag.
- wizard-step4.html - Template, gaya, preview A4, simulasi export.

Aset aktif:

- assets/css/tokens.css
- assets/css/wizard.css
- assets/js/pixel-icons.js
- assets/js/wizard-state.js

Catatan:

- State prototype disimpan di localStorage browser.
- Folder ini bukan implementasi production.
- Setelah flow final, desain ini baru dipindahkan ke framework production.
## Uji Midtrans Snap Sandbox

Penawaran test ada di `pricing.html`: Kredit AI Starter Rp29.000.

Jalankan server lokal dengan kredensial sandbox Midtrans:

```powershell
$env:MIDTRANS_SERVER_KEY="SB-Mid-server-..."
$env:MIDTRANS_CLIENT_KEY="SB-Mid-client-..."
node prototype/midtrans-snap-test-server.js
```

Buka `http://localhost:4173/pricing.html`, lalu klik `Uji Bayar`.

Metode yang diaktifkan di payload Snap:

- GoPay
- QRIS
- BCA VA
- BNI VA
- BRI VA
- Permata VA
- Mandiri Bill Payment (`echannel`)

Endpoint lokal:

- `GET /api/midtrans/config`
- `POST /api/midtrans/snap-token`
- `POST /api/midtrans/notification`

Untuk webhook dari Midtrans, expose server lokal dengan tunnel publik lalu arahkan Payment Notification URL ke `/api/midtrans/notification`.

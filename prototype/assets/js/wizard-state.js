(function () {
  var STORAGE_KEY = "pixforme.prototype.wizard.v3";

  var defaultProjectItems = [
    "Galian dan pembesian pondasi",
    "Pengecoran kolom lantai 1",
    "Plester dinding sisi utara",
    "Pemasangan rangka atap",
    "Pekerjaan finishing",
    "Instalasi listrik"
  ];

  var defaultState = {
    project: {
      name: "Pembangunan Gedung Kantor Dinas A",
      client: "Dinas Pekerjaan Umum Kota X",
      location: "Jl. Sudirman No. 10",
      headerText: "DINAS PEKERJAAN UMUM\nLaporan Dokumentasi Proyek",
      headerMode: "all",
      logoInstansi: true,
      logoPerusahaan: true,
      instansi: "Dinas Pekerjaan Umum Kota X",
      pekerjaan: "Pembangunan Gedung Kantor Dinas A",
      lokasi: "Jl. Sudirman No. 10",
      rabText: defaultProjectItems.join("\n"),
      items: defaultProjectItems.slice()
    },
    workspace: {
      name: "Workspace Utama",
      activeProjectId: "project_1",
      projects: [
        { id: "project_1", name: "Pembangunan Gedung Kantor Dinas A", instansi: "Dinas Pekerjaan Umum Kota X", location: "Jl. Sudirman No. 10", status: "Aktif" },
        { id: "project_2", name: "Project Berikutnya", instansi: "Belum diatur", location: "-", status: "Draft" }
      ]
    },
    report: {
      name: "Laporan Mingguan Ke-3",
      period: "1 - 7 Juni 2026"
    },
    gallery: [
      { id: "g1", url: "https://picsum.photos/seed/pixforme-pondasi/900/650", filename: "pondasi.jpg", w: 900, h: 650, sourceType: "laporan" },
      { id: "g2", url: "https://picsum.photos/seed/pixforme-beton/1000/750", filename: "beton.jpg", w: 1000, h: 750, sourceType: "laporan" },
      { id: "g3", url: "https://picsum.photos/seed/pixforme-plester/650/980", filename: "portrait-plester.jpg", w: 650, h: 980, sourceType: "laporan" },
      { id: "g4", url: "https://picsum.photos/seed/pixforme-atap/900/640", filename: "atap.jpg", w: 900, h: 640, sourceType: "laporan" },
      { id: "g5", url: "https://picsum.photos/seed/pixforme-finishing/900/650", filename: "finishing.jpg", w: 900, h: 650, sourceType: "laporan" },
      { id: "g6", url: "https://picsum.photos/seed/pixforme-listrik/900/650", filename: "listrik.jpg", w: 900, h: 650, sourceType: "laporan" },
      { id: "g7", url: "https://picsum.photos/seed/pixforme-bukti/900/650", filename: "bukti-lapangan-ai.jpg", w: 900, h: 650, sourceType: "bukti_lapangan" }
    ],
    reportPhotos: [
      { id: "rp1", photoId: "g1", nama: "Pekerjaan Pondasi", item: "Galian dan pembesian pondasi", progress: 30, fitMode: "crop", cropY: 50, aiExtended: false, geotag: null },
      { id: "rp2", photoId: "g2", nama: "Pekerjaan Struktur Beton", item: "Pengecoran kolom lantai 1", progress: 55, fitMode: "crop", cropY: 50, aiExtended: false, geotag: null },
      { id: "rp3", photoId: "g3", nama: "Pekerjaan Plesteran", item: "Plester dinding sisi utara", progress: 70, fitMode: "crop", cropY: 50, aiExtended: false, geotag: { address: "Kota Jayapura", lat: -2.5916, lng: 140.6690, date: "2026-06-21", time: "09:00" } },
      { id: "rp4", photoId: "g4", nama: "Pekerjaan Atap", item: "Pemasangan rangka atap", progress: 45, fitMode: "crop", cropY: 50, aiExtended: false, geotag: null }
    ],
    preview: {
      templateId: "t1",
      paperSize: "a4",
      gridGeoColor: "#FFFFFF",
      gridGeoSize: 7,
      gridGeoContrastApplied: true,
      accentColor: "#FF6B1A",
      spacing: 8,
      fontSize: 8,
      border: false,
      borderWidth: 1,
      borderRadius: 3
    }
  };

  var templates = [
    { id: "t1", label: "STACK + TEKS", desc: "2 foto per halaman, caption kanan", ppp: 2, orientation: "portrait" },
    { id: "t2", label: "GRID EQUAL", desc: "4 foto per halaman, caption bawah", ppp: 4, orientation: "portrait" },
    { id: "t3", label: "GRID BORDER", desc: "4 foto dengan nomor visual", ppp: 4, orientation: "portrait" },
    { id: "t4", label: "FULL PAGE", desc: "1 foto besar per halaman", ppp: 1, orientation: "portrait" },
    { id: "t5", label: "LANDSCAPE SPLIT", desc: "2 foto dalam A4 landscape", ppp: 2, orientation: "landscape" }
  ];

  var presets = defaultProjectItems.slice();

  function normalizeItemList(items) {
    var seen = {};
    return (items || [])
      .map(function (item) { return String(item || "").trim(); })
      .filter(function (item) {
        var key = item.toLowerCase();
        if (!item || item.length < 3 || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function cleanRabLine(line) {
    var value = String(line || "").replace(/\t+/g, "  ").trim();
    if (!value) return "";
    var parts = value.split(/\s{2,}/).map(function (part) { return part.trim(); }).filter(Boolean);
    var candidate = parts.find(function (part) { return /[A-Za-zÀ-ÿ]/.test(part) && !/^\d+([.,]\d+)?$/.test(part); }) || value;
    candidate = candidate
      .replace(/^[-•]+\s*/, "")
      .replace(/^[A-Z]\.?\s+/, "")
      .replace(/^\d+(?:[.)]|(?:\.\d+)*\.?)\s*/, "")
      .replace(/\s+(LS|M2|M3|M|KG|UNIT|BH|BUAH|SET)\s+.*$/i, "")
      .replace(/\s+/g, " ")
      .trim();
    if (/^(no|uraian|pekerjaan|volume|satuan|harga|jumlah)$/i.test(candidate)) return "";
    if (!/[A-Za-zÀ-ÿ]/.test(candidate)) return "";
    return candidate;
  }

  function parseRabItems(text) {
    return normalizeItemList(String(text || "").split(/\r?\n/).map(cleanRabLine));
  }

  function getProjectItems(state) {
    var items = state && state.project && Array.isArray(state.project.items) ? state.project.items : [];
    return normalizeItemList(items.length ? items : presets);
  }

  function syncProjectAliases(project) {
    project.name = project.name || project.pekerjaan || "";
    project.pekerjaan = project.pekerjaan || project.name;
    project.client = project.client || project.instansi || "";
    project.instansi = project.instansi || project.client;
    project.location = project.location || project.lokasi || "";
    project.lokasi = project.lokasi || project.location;
    if (!Array.isArray(project.items) || !project.items.length) project.items = defaultProjectItems.slice();
    if (!project.rabText) project.rabText = project.items.join("\n");
    return project;
  }
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeState(base, saved) {
    saved = saved || {};
    var project = syncProjectAliases(Object.assign({}, base.project, saved.project || {}));
    var workspace = Object.assign({}, base.workspace, saved.workspace || {});
    workspace.projects = Array.isArray(saved.workspace && saved.workspace.projects) && saved.workspace.projects.length ? saved.workspace.projects : base.workspace.projects;
    return {
      workspace: workspace,
      project: project,
      report: Object.assign({}, base.report, saved.report || {}),
      preview: Object.assign({}, base.preview, saved.preview || {}),
      gallery: Array.isArray(saved.gallery) && saved.gallery.length ? saved.gallery : base.gallery,
      reportPhotos: Array.isArray(saved.reportPhotos) && saved.reportPhotos.length ? saved.reportPhotos : base.reportPhotos
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(defaultState);
      return mergeState(clone(defaultState), JSON.parse(raw));
    } catch (error) {
      return clone(defaultState);
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    return loadState();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function uid(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function findGalleryPhoto(state, id) {
    return state.gallery.find(function (photo) { return photo.id === id; });
  }

  function getReportItems(state) {
    return state.reportPhotos
      .map(function (item, index) {
        var photo = findGalleryPhoto(state, item.photoId);
        return Object.assign({}, item, { index: index, photo: photo });
      })
      .filter(function (item) { return item.photo; });
  }

  function addToReport(state, photoId) {
    if (state.reportPhotos.some(function (item) { return item.photoId === photoId; })) return state;
    var photo = findGalleryPhoto(state, photoId);
    if (!photo) return state;
    state.reportPhotos.push({
      id: uid("rp"),
      photoId: photoId,
      nama: "",
      item: "",
      progress: "",
      fitMode: "crop",
      cropY: 50,
      aiExtended: false,
      geotag: null
    });
    saveState(state);
    return state;
  }

  function removeFromReport(state, reportPhotoId) {
    state.reportPhotos = state.reportPhotos.filter(function (item) { return item.id !== reportPhotoId; });
    saveState(state);
    return state;
  }

  function moveReportPhoto(state, reportPhotoId, direction) {
    var idx = state.reportPhotos.findIndex(function (item) { return item.id === reportPhotoId; });
    var next = idx + direction;
    if (idx < 0 || next < 0 || next >= state.reportPhotos.length) return state;
    var temp = state.reportPhotos[idx];
    state.reportPhotos[idx] = state.reportPhotos[next];
    state.reportPhotos[next] = temp;
    saveState(state);
    return state;
  }

  function updateReportPhoto(state, reportPhotoId, changes) {
    var item = state.reportPhotos.find(function (row) { return row.id === reportPhotoId; });
    if (!item) return state;
    Object.assign(item, changes);
    saveState(state);
    return state;
  }

  function addGalleryPhoto(state, data) {
    state.gallery.unshift({
      id: uid("g"),
      url: data.url,
      filename: data.filename || "foto-baru.jpg",
      w: data.w || 900,
      h: data.h || 650,
      sourceType: data.sourceType || "laporan"
    });
    saveState(state);
    return state;
  }

  function readImageFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          resolve({ url: reader.result, filename: file.name, w: img.naturalWidth, h: img.naturalHeight });
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function imageFitStyle(item) {
    if (!item || !item.photo) return "";
    if (item.aiExtended) return "width:100%;height:100%;object-fit:cover;object-position:center center;";
    if (item.fitMode === "contain") return "width:100%;height:100%;object-fit:contain;background:#0A0A0A;object-position:center center;";
    var cropY = typeof item.cropY === "number" ? item.cropY : 50;
    return "width:100%;height:100%;object-fit:cover;object-position:center " + cropY + "%;";
  }

  function arLabel(photo) {
    if (!photo) return "NO PHOTO";
    if (photo.h > photo.w) return "PORTRAIT";
    var ratio = photo.w / photo.h;
    if (Math.abs(ratio - 4 / 3) < 0.08) return "4:3 OK";
    return ratio.toFixed(1) + ":1";
  }

  function wizardTopbar(step) {
    var steps = [
      { n: 1, label: "Project", href: "wizard-step1.html" },
      { n: 2, label: "Laporan", href: "wizard-step2.html" },
      { n: 3, label: "Foto & Caption", href: "wizard-step3.html" },
      { n: 4, label: "Preview", href: "wizard-step4.html" }
    ];
    return steps.map(function (row, idx) {
      var stateClass = row.n < step ? "done" : row.n === step ? "active" : "";
      var num = row.n < step ? "<span data-pixel-icon=\"check\" data-pixel-size=\"9\" data-pixel-color=\"#fff\"></span>" : row.n;
      var inner = "<div class=\"num\">" + num + "</div>" + row.label;
      var item = row.n < step
        ? "<a href=\"" + row.href + "\" class=\"wizard-step " + stateClass + "\">" + inner + "</a>"
        : "<div class=\"wizard-step " + stateClass + "\">" + inner + "</div>";
      var chev = idx < steps.length - 1 ? "<span class=\"wizard-chevron\" data-pixel-icon=\"chevR\" data-pixel-size=\"11\" data-pixel-color=\"#C9C9C5\"></span>" : "";
      return item + chev;
    }).join("");
  }

  function renderWizardChrome(step, actionsHtml) {
    var mount = document.getElementById("wizardChrome");
    if (!mount) return;
    mount.innerHTML = "<a href=\"index.html\" class=\"wizard-logo\"><span data-pixel-logo data-pixel-size=\"24\"></span><span>PIXFORME</span></a>" +
      "<div class=\"wizard-nav-center\">" + wizardTopbar(step) + "</div>" +
      "<div class=\"wizard-actions\">" + (actionsHtml || "") + "</div>";
    if (typeof renderPixelIcons === "function") renderPixelIcons();
  }

  function projectSummary(state) {
    return "<div class=\"state-chip-row\">" +
      "<span class=\"state-chip\">Project: " + escapeHtml(state.project.name || "Belum diisi") + "</span>" +
      "<span class=\"state-chip\">Instansi: " + escapeHtml(state.project.client || state.project.instansi || "-") + "</span>" +
      "<span class=\"state-chip\">Item: " + getProjectItems(state).length + "</span>" +
      "<span class=\"state-chip\">Foto laporan: " + state.reportPhotos.length + "</span>" +
      "</div>";
  }

  window.PixWizard = {
    templates: templates,
    presets: presets,
    parseRabItems: parseRabItems,
    getProjectItems: getProjectItems,
    loadState: loadState,
    saveState: saveState,
    resetState: resetState,
    escapeHtml: escapeHtml,
    uid: uid,
    findGalleryPhoto: findGalleryPhoto,
    getReportItems: getReportItems,
    addToReport: addToReport,
    removeFromReport: removeFromReport,
    moveReportPhoto: moveReportPhoto,
    updateReportPhoto: updateReportPhoto,
    addGalleryPhoto: addGalleryPhoto,
    readImageFile: readImageFile,
    imageFitStyle: imageFitStyle,
    arLabel: arLabel,
    renderWizardChrome: renderWizardChrome,
    projectSummary: projectSummary
  };
})();

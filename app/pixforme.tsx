"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type IconName =
  | "folder" | "upload" | "check" | "chevR" | "chevL" | "download" | "mapPin" | "sparkle"
  | "crop" | "replace" | "trash" | "x" | "layout" | "sliders" | "bulk" | "clock"
  | "search" | "move" | "camera" | "geo" | "watermark" | "wand" | "image" | "arrowRight"
  | "star" | "grid" | "lock";

const PIXEL_GRIDS: Record<IconName, [number, number][]> = {
  folder: [[0,1],[1,1],[2,0],[3,0],[4,1],[5,1],[6,1],[0,2],[6,2],[0,3],[6,3],[0,4],[6,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]],
  upload: [[3,0],[2,1],[3,1],[4,1],[1,2],[3,2],[5,2],[3,3],[3,4],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
  check: [[1,4],[2,5],[3,6],[4,5],[5,4],[6,3],[6,2]],
  chevR: [[2,1],[3,2],[4,3],[3,4],[2,5]],
  chevL: [[4,1],[3,2],[2,3],[3,4],[4,5]],
  download: [[3,0],[3,1],[3,2],[3,3],[1,4],[3,4],[5,4],[2,5],[3,5],[4,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
  mapPin: [[3,0],[2,1],[4,1],[1,2],[5,2],[1,3],[3,3],[5,3],[2,4],[4,4],[3,5],[3,6]],
  sparkle: [[1,0],[1,2],[0,1],[2,1],[5,3],[5,5],[4,4],[6,4],[3,1],[3,2]],
  crop: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[6,5],[6,4],[6,3],[6,2],[6,1],[6,0]],
  replace: [[1,1],[1,2],[1,3],[2,0],[3,0],[5,5],[5,4],[5,3],[3,6],[4,6]],
  trash: [[1,1],[2,1],[3,1],[4,1],[5,1],[2,0],[3,0],[4,0],[1,2],[2,2],[3,2],[4,2],[5,2],[1,3],[2,3],[3,3],[4,3],[5,3],[1,4],[2,4],[3,4],[4,4],[5,4],[2,5],[3,5],[4,5]],
  x: [[0,0],[6,0],[1,1],[5,1],[2,2],[4,2],[3,3],[2,4],[4,4],[1,5],[5,5],[0,6],[6,6]],
  layout: [[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[4,0],[5,0],[6,0],[4,1],[6,1],[4,2],[5,2],[6,2],[0,4],[1,4],[2,4],[0,5],[2,5],[0,6],[1,6],[2,6],[4,4],[5,4],[6,4],[4,5],[6,5],[4,6],[5,6],[6,6]],
  sliders: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[0,3],[2,3],[4,0],[4,1],[4,2],[3,1],[5,1],[6,1],[6,3],[6,4],[6,5],[6,6]],
  bulk: [[0,0],[1,0],[2,0],[3,0],[0,1],[3,1],[0,2],[3,2],[0,3],[1,3],[2,3],[3,3],[4,4],[5,4],[6,4],[4,5],[6,5],[4,6],[5,6],[6,6],[5,5]],
  clock: [[3,0],[1,1],[5,1],[0,3],[6,3],[1,5],[5,5],[3,6],[3,1],[3,2],[3,3],[4,3],[5,3]],
  search: [[2,0],[3,0],[1,1],[4,1],[1,2],[4,2],[1,3],[4,3],[2,4],[3,4],[4,5],[5,5],[5,6],[6,6]],
  move: [[3,0],[2,1],[4,1],[0,3],[1,2],[1,4],[6,3],[5,2],[5,4],[3,6],[2,5],[4,5],[3,1],[3,2],[3,3],[3,4],[3,5],[1,3],[2,3],[4,3],[5,3]],
  camera: [[1,1],[2,1],[3,1],[4,1],[5,1],[0,2],[6,2],[0,3],[6,3],[0,4],[6,4],[1,5],[2,5],[3,5],[4,5],[5,5],[2,2],[3,2],[4,2],[2,3],[4,3],[3,4]],
  geo: [[3,0],[2,1],[4,1],[1,2],[5,2],[2,3],[4,3],[3,3],[3,4],[3,5],[3,6]],
  watermark: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[2,2],[2,3],[2,4],[4,2],[4,3],[4,4],[3,3]],
  wand: [[0,6],[1,5],[2,4],[3,3],[4,2],[5,1],[6,0],[5,0],[6,1],[1,1],[2,2]],
  image: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[0,1],[6,1],[0,2],[6,2],[0,3],[6,3],[0,4],[6,4],[0,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[2,2],[1,4],[2,4],[3,3],[4,4],[5,4],[3,5],[4,5],[5,5]],
  arrowRight: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[3,1],[4,2],[5,3],[4,4],[3,5]],
  star: [[3,0],[3,1],[2,2],[3,2],[4,2],[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[1,4],[3,4],[5,4],[0,5],[6,5],[2,6],[4,6]],
  grid: [[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[4,0],[5,0],[6,0],[4,1],[6,1],[4,2],[5,2],[6,2],[0,4],[1,4],[2,4],[0,5],[2,5],[0,6],[1,6],[2,6],[4,4],[5,4],[6,4],[4,5],[6,5],[4,6],[5,6],[6,6]],
  lock: [[2,1],[3,1],[4,1],[1,2],[5,2],[1,3],[5,3],[1,4],[2,4],[3,4],[4,4],[5,4],[1,5],[5,5],[1,6],[2,6],[3,6],[4,6],[5,6]],
};

function PixelIcon({ name, size = 16, color = "#0A0A0A" }: { name: IconName; size?: number; color?: string }) {
  return (
    <svg className="pixel-icon" width={size} height={size} viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true">
      {PIXEL_GRIDS[name].map(([x, y], index) => <rect key={`${x}-${y}-${index}`} x={x} y={y} width="1" height="1" fill={color} />)}
    </svg>
  );
}

function PixelLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="6" y="1" width="4" height="3" fill="#0A0A0A" />
      <rect x="4" y="4" width="4" height="3" fill="#FF6B1A" />
      <rect x="2" y="7" width="4" height="3" fill="#E8331C" />
      <rect x="4" y="10" width="4" height="3" fill="#FF6B1A" />
      <rect x="6" y="13" width="4" height="2" fill="#0A0A0A" />
    </svg>
  );
}

function route(path: string) {
  return path === "index.html" ? "/" : `/${path}`;
}

function TopNav({ active }: { active: "home" | "product" | "tools" | "pricing" }) {
  const links = [
    { id: "product", label: "Produk", href: "product.html" },
    { id: "tools", label: "AI Fix Tools", href: "tools.html" },
    { id: "pricing", label: "Harga", href: "pricing.html" },
  ] as const;
  return (
    <nav className="topnav">
      <Link href="/" className="topnav-logo"><PixelLogo size={26} /><span>PIXFORME</span></Link>
      <div className="topnav-links">
        {links.map((link) => <Link key={link.id} href={route(link.href)} className={active === link.id ? "active" : ""}>{link.label}</Link>)}
      </div>
      <div className="topnav-actions">
        <Link href={route("login.html")} className="pixel-btn pixel-btn-ghost" style={{ padding: "8px 16px" }}>Masuk</Link>
        <Link href={route("wizard-step1.html")} className="pixel-btn pixel-btn-accent" style={{ padding: "8px 16px" }}>Mulai Gratis</Link>
      </div>
    </nav>
  );
}

function Footer({ full = true }: { full?: boolean }) {
  return (
    <footer className="site-footer">
      {full ? (
        <div className="footer-inner">
          <div className="footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <PixelLogo size={24} /><span style={{ fontFamily: "var(--font-pixel)", fontSize: 12 }}>PIXFORME</span>
            </div>
            <p>Tool laporan dokumentasi proyek untuk kontraktor dan instansi di Indonesia. Dibuat supaya laporan pertanggungjawaban tidak lagi memakan waktu berhari-hari.</p>
          </div>
          <div className="footer-col"><h5>Produk</h5><Link href={route("product.html")}>Cara Kerja</Link><Link href={route("wizard-step1.html")}>Buat Laporan</Link><Link href={route("pricing.html")}>Harga</Link></div>
          <div className="footer-col"><h5>Tools</h5><Link href={route("tools.html")}>AI Geotag Burn-in</Link><Link href={route("tools.html")}>Watermark Manager</Link><Link href={route("tools.html")}>Galeri Foto</Link></div>
          <div className="footer-col"><h5>Perusahaan</h5><a href="#">Tentang</a><a href="#">Kontak</a><a href="#">Kebijakan Privasi</a></div>
        </div>
      ) : null}
      <div className="footer-bottom">(c) 2026 PIXFORME.IO{full ? " - DIBUAT UNTUK KONTRAKTOR INDONESIA" : ""}</div>
    </footer>
  );
}

type Project = {
  name: string; client: string; location: string; headerText: string; headerMode: "all" | "first";
  logoInstansi: boolean; logoPerusahaan: boolean; instansi: string; pekerjaan: string; lokasi: string; rabText: string; items: string[];
};
type WorkspaceProject = { id: string; name: string; instansi: string; location: string; status: string; items?: string[]; rabText?: string };
type GalleryPhoto = { id: string; url: string; filename: string; w: number; h: number; sourceType: "laporan" | "bukti_lapangan" };
type Geotag = { address: string; lat: number; lng: number; date: string; time: string };
type ReportPhoto = { id: string; photoId: string; nama: string; item: string; progress: string | number; fitMode: "crop" | "contain"; cropY: number; aiExtended: boolean; geotag: Geotag | null };
type Preview = { templateId: string; paperSize: "a4" | "f4"; gridGeoColor: string; gridGeoSize: number; gridGeoContrastApplied: boolean; accentColor: string; spacing: number; fontSize: number; border: boolean; borderWidth: number; borderRadius: number };
type WizardState = { project: Project; workspace: { name: string; activeProjectId: string; projects: WorkspaceProject[] }; report: { name: string; period: string }; gallery: GalleryPhoto[]; reportPhotos: ReportPhoto[]; preview: Preview };

const STORAGE_KEY = "pixforme.prototype.wizard.v3";
const defaultProjectItems = ["Galian dan pembesian pondasi", "Pengecoran kolom lantai 1", "Plester dinding sisi utara", "Pemasangan rangka atap", "Pekerjaan finishing", "Instalasi listrik"];
const defaultState: WizardState = {
  project: { name: "Pembangunan Gedung Kantor Dinas A", client: "Dinas Pekerjaan Umum Kota X", location: "Jl. Sudirman No. 10", headerText: "DINAS PEKERJAAN UMUM\nLaporan Dokumentasi Proyek", headerMode: "all", logoInstansi: true, logoPerusahaan: true, instansi: "Dinas Pekerjaan Umum Kota X", pekerjaan: "Pembangunan Gedung Kantor Dinas A", lokasi: "Jl. Sudirman No. 10", rabText: defaultProjectItems.join("\n"), items: [...defaultProjectItems] },
  workspace: { name: "Workspace Utama", activeProjectId: "project_1", projects: [{ id: "project_1", name: "Pembangunan Gedung Kantor Dinas A", instansi: "Dinas Pekerjaan Umum Kota X", location: "Jl. Sudirman No. 10", status: "Aktif", items: [...defaultProjectItems], rabText: defaultProjectItems.join("\n") }, { id: "project_2", name: "Project Berikutnya", instansi: "Belum diatur", location: "-", status: "Draft", items: [], rabText: "" }] },
  report: { name: "Laporan Mingguan Ke-3", period: "1 - 7 Juni 2026" },
  gallery: [
    { id: "g1", url: "https://picsum.photos/seed/pixforme-pondasi/900/650", filename: "pondasi.jpg", w: 900, h: 650, sourceType: "laporan" },
    { id: "g2", url: "https://picsum.photos/seed/pixforme-beton/1000/750", filename: "beton.jpg", w: 1000, h: 750, sourceType: "laporan" },
    { id: "g3", url: "https://picsum.photos/seed/pixforme-plester/650/980", filename: "portrait-plester.jpg", w: 650, h: 980, sourceType: "laporan" },
    { id: "g4", url: "https://picsum.photos/seed/pixforme-atap/900/640", filename: "atap.jpg", w: 900, h: 640, sourceType: "laporan" },
    { id: "g5", url: "https://picsum.photos/seed/pixforme-finishing/900/650", filename: "finishing.jpg", w: 900, h: 650, sourceType: "laporan" },
    { id: "g6", url: "https://picsum.photos/seed/pixforme-listrik/900/650", filename: "listrik.jpg", w: 900, h: 650, sourceType: "laporan" },
    { id: "g7", url: "https://picsum.photos/seed/pixforme-bukti/900/650", filename: "bukti-lapangan-ai.jpg", w: 900, h: 650, sourceType: "bukti_lapangan" },
  ],
  reportPhotos: [
    { id: "rp1", photoId: "g1", nama: "Pekerjaan Pondasi", item: "Galian dan pembesian pondasi", progress: 30, fitMode: "crop", cropY: 50, aiExtended: false, geotag: null },
    { id: "rp2", photoId: "g2", nama: "Pekerjaan Struktur Beton", item: "Pengecoran kolom lantai 1", progress: 55, fitMode: "crop", cropY: 50, aiExtended: false, geotag: null },
    { id: "rp3", photoId: "g3", nama: "Pekerjaan Plesteran", item: "Plester dinding sisi utara", progress: 70, fitMode: "crop", cropY: 50, aiExtended: false, geotag: { address: "Kota Jayapura", lat: -2.5916, lng: 140.669, date: "2026-06-21", time: "09:00" } },
    { id: "rp4", photoId: "g4", nama: "Pekerjaan Atap", item: "Pemasangan rangka atap", progress: 45, fitMode: "crop", cropY: 50, aiExtended: false, geotag: null },
  ],
  preview: { templateId: "t1", paperSize: "a4", gridGeoColor: "#FFFFFF", gridGeoSize: 7, gridGeoContrastApplied: true, accentColor: "#FF6B1A", spacing: 8, fontSize: 8, border: false, borderWidth: 1, borderRadius: 3 },
};

const templates = [
  { id: "t1", label: "STACK + TEKS", desc: "2 foto per halaman, caption kanan", orientation: "portrait" },
  { id: "t2", label: "GRID EQUAL", desc: "4 foto per halaman, caption bawah", orientation: "portrait" },
  { id: "t3", label: "GRID BORDER", desc: "4 foto dengan nomor visual", orientation: "portrait" },
  { id: "t4", label: "FULL PAGE", desc: "1 foto besar per halaman", orientation: "portrait" },
  { id: "t5", label: "LANDSCAPE SPLIT", desc: "2 foto dalam A4 landscape", orientation: "landscape" },
];

function cloneState(value: WizardState) {
  return JSON.parse(JSON.stringify(value)) as WizardState;
}

function cleanRabLine(line: string) {
  let value = String(line || "").replace(/\t+/g, "  ").trim();
  if (!value) return "";
  const parts = value.split(/\s{2,}/).map((part) => part.trim()).filter(Boolean);
  value = parts.find((part) => /[A-Za-zÀ-ÿ]/.test(part) && !/^\d+([.,]\d+)?$/.test(part)) || value;
  value = value
    .replace(/^[-•]+\s*/, "")
    .replace(/^[A-Z]\.?\s+/, "")
    .replace(/^\d+(?:[.)]|(?:\.\d+)*\.?)\s*/, "")
    .replace(/\s+(LS|M2|M3|M|KG|UNIT|BH|BUAH|SET)\s+.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  if (/^(no|uraian|pekerjaan|volume|satuan|harga|jumlah)$/i.test(value)) return "";
  return /[A-Za-zÀ-ÿ]/.test(value) ? value : "";
}

function parseRabItems(text: string) {
  const seen = new Set<string>();
  return String(text || "").split(/\r?\n/).map(cleanRabLine).filter((item) => {
    const key = item.toLowerCase();
    if (!item || item.length < 3 || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getProjectItems(state: WizardState) {
  return state.project.items.length ? state.project.items : defaultProjectItems;
}

function mergeState(saved: Partial<WizardState>) {
  const base = cloneState(defaultState);
  const project = { ...base.project, ...(saved.project || {}) };
  project.name = project.name || project.pekerjaan || "";
  project.pekerjaan = project.pekerjaan || project.name;
  project.client = project.client || project.instansi || "";
  project.instansi = project.instansi || project.client;
  project.location = project.location || project.lokasi || "";
  project.lokasi = project.lokasi || project.location;
  if (!project.items?.length) project.items = [...defaultProjectItems];
  if (!project.rabText) project.rabText = project.items.join("\n");
  return {
    ...base,
    ...saved,
    project,
    workspace: { ...base.workspace, ...(saved.workspace || {}), projects: saved.workspace?.projects?.length ? saved.workspace.projects : base.workspace.projects },
    report: { ...base.report, ...(saved.report || {}) },
    gallery: saved.gallery?.length ? saved.gallery : base.gallery,
    reportPhotos: saved.reportPhotos?.length ? saved.reportPhotos : base.reportPhotos,
    preview: { ...base.preview, ...(saved.preview || {}) },
  } as WizardState;
}

function loadStoredState() {
  if (typeof window === "undefined") return cloneState(defaultState);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? mergeState(JSON.parse(raw) as Partial<WizardState>) : cloneState(defaultState);
  } catch {
    return cloneState(defaultState);
  }
}

function useWizardState() {
  const [state, setState] = useState<WizardState>(() => cloneState(defaultState));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    queueMicrotask(() => {
      setState(loadStoredState());
      setReady(true);
    });
  }, []);
  const save = (next: WizardState) => {
    setState(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };
  const reset = () => {
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    setState(cloneState(defaultState));
  };
  return { state, save, reset, ready };
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function findPhoto(state: WizardState, id: string) {
  return state.gallery.find((photo) => photo.id === id);
}

function getReportItems(state: WizardState) {
  return state.reportPhotos.map((item, index) => ({ ...item, index, photo: findPhoto(state, item.photoId) })).filter((item): item is ReportPhoto & { index: number; photo: GalleryPhoto } => Boolean(item.photo));
}

function arLabel(photo?: GalleryPhoto) {
  if (!photo) return "NO PHOTO";
  if (photo.h > photo.w) return "PORTRAIT";
  const ratio = photo.w / photo.h;
  if (Math.abs(ratio - 4 / 3) < 0.08) return "4:3 OK";
  return `${ratio.toFixed(1)}:1`;
}

function imageFitStyle(item: ReportPhoto & { photo?: GalleryPhoto }): React.CSSProperties {
  if (item.aiExtended) return { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" };
  if (item.fitMode === "contain") return { width: "100%", height: "100%", objectFit: "contain", background: "#0A0A0A", objectPosition: "center center" };
  return { width: "100%", height: "100%", objectFit: "cover", objectPosition: `center ${typeof item.cropY === "number" ? item.cropY : 50}%` };
}

function StateChips({ items }: { items: string[] }) {
  return <div className="state-chip-row">{items.map((item) => <span className="state-chip" key={item}>{item}</span>)}</div>;
}

function WizardChrome({ step, actions }: { step: number; actions: React.ReactNode }) {
  const steps = [
    { n: 1, label: "Project", href: "wizard-step1.html" },
    { n: 2, label: "Laporan", href: "wizard-step2.html" },
    { n: 3, label: "Foto & Caption", href: "wizard-step3.html" },
    { n: 4, label: "Preview", href: "wizard-step4.html" },
  ];
  return (
    <div className="wizard-topbar">
      <Link href="/" className="wizard-logo"><PixelLogo size={24} /><span>PIXFORME</span></Link>
      <div className="wizard-nav-center">
        {steps.map((row, index) => {
          const className = `wizard-step ${row.n < step ? "done" : row.n === step ? "active" : ""}`;
          const inner = <><div className="num">{row.n < step ? <PixelIcon name="check" size={9} color="#fff" /> : row.n}</div>{row.label}</>;
          return <span key={row.n} style={{ display: "contents" }}>{row.n < step ? <Link href={route(row.href)} className={className}>{inner}</Link> : <div className={className}>{inner}</div>}{index < steps.length - 1 ? <span className="wizard-chevron"><PixelIcon name="chevR" size={11} color="#C9C9C5" /></span> : null}</span>;
        })}
      </div>
      <div className="wizard-actions">{actions}</div>
    </div>
  );
}

function ProjectSummary({ state }: { state: WizardState }) {
  return <StateChips items={[`Project: ${state.project.name || "Belum diisi"}`, `Instansi: ${state.project.client || state.project.instansi || "-"}`, `Item: ${getProjectItems(state).length}`, `Foto laporan: ${state.reportPhotos.length}`]} />;
}

export function HomePage() {
  return (
    <>
      <TopNav active="home" />
      <section className="hero"><div className="hero-inner"><div>
        <div className="hero-eyebrow"><PixelIcon name="sparkle" size={12} color="#FF6B1A" />DIBUAT UNTUK KONTRAKTOR INDONESIA</div>
        <h1>LAPORAN DOKUMENTASI<br />PROYEK, <span className="hi-orange">BUKAN<br />PEKERJAAN BERHARI-HARI.</span></h1>
        <p className="lead">Susun foto progres lapangan jadi laporan pertanggungjawaban siap cetak - rapi, terstruktur, dan konsisten - tanpa drag-drop manual di Word atau Excel.</p>
        <div className="hero-ctas"><Link href={route("wizard-step1.html")} className="pixel-btn pixel-btn-accent pixel-btn-lg"><PixelIcon name="arrowRight" size={14} color="#fff" />Buat Laporan Pertama</Link><Link href={route("product.html")} className="pixel-btn pixel-btn-ghost pixel-btn-lg">Lihat Cara Kerja</Link></div>
        <div className="hero-meta"><PixelIcon name="check" size={12} color="#2E9E5B" />Tidak perlu kartu kredit - Export PDF gratis untuk laporan pertama</div>
      </div><MockReportStack /></div></section>
      <ProblemMarquee />
      <SolutionsSection />
      <HowItWorksSection />
      <TemplatesSection />
      <HomeToolsSection />
      <section className="section"><div className="cta-banner"><div><h2>SIAP BUAT LAPORAN<br />PERTAMA ANDA?</h2><p>Gratis untuk laporan pertama. Tidak perlu kartu kredit.</p></div><Link href={route("wizard-step1.html")} className="pixel-btn pixel-btn-primary pixel-btn-lg"><PixelIcon name="arrowRight" size={14} color="#fff" />Mulai Sekarang</Link></div></section>
      <Footer />
    </>
  );
}

function MockReportStack() {
  return <div className="hero-visual"><div className="floating-badge b1"><PixelIcon name="mapPin" size={11} color="#fff" />Geotag aktif</div><div className="floating-badge b2"><PixelIcon name="check" size={11} color="#fff" />4 halaman siap</div><div className="mock-page p1"><MockHeader /><div className="mock-photo"><div className="pin">Jayapura</div></div><div className="mock-cap-line w60" /><div className="mock-cap-line w40" /><div className="mock-progress"><span className="pct">45%</span><div className="bar"><div className="bar-fill" style={{ width: "45%" }} /></div></div></div><div className="mock-page p2"><MockHeader /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 6 }}><div className="mock-photo" style={{ height: 50, marginBottom: 0, background: "linear-gradient(135deg,#B8E0D2,#6FC3A0)" }} /><div className="mock-photo" style={{ height: 50, marginBottom: 0 }} /></div><div className="mock-cap-line w60" /><div className="mock-progress"><span className="pct">80%</span><div className="bar"><div className="bar-fill" style={{ width: "80%" }} /></div></div></div></div>;
}

function MockHeader() {
  return <div className="mock-header"><div style={{ width: 18, height: 18, background: "#0A0A0A", borderRadius: 2, flexShrink: 0 }} /><div><div className="mock-header-text">DINAS PEKERJAAN UMUM</div><div className="mock-header-sub">Laporan Dokumentasi Proyek</div></div></div>;
}

function ProblemMarquee() {
  const items = ["SEBELUM: susun foto satu-satu di Word", "SESUDAH: upload semua, layout otomatis", "SEBELUM: foto portrait merusak estetika", "SESUDAH: AI rapikan rasio dalam 1 klik", "SEBELUM: watermark tanggal berantakan", "SESUDAH: bersihkan bulk dalam hitungan detik"];
  return <div className="problem-strip"><div className="marquee">{[...items, ...items].map((item, index) => { const [lead, text] = item.split(": "); return <span key={`${item}-${index}`}><b>{lead}:</b> {text} -</span>; })}</div></div>;
}

function SolutionsSection() {
  const rows = [
    ["layout" as IconName, "MASALAH 01", "Susun foto manual di Word/Excel", "Drag satu-satu, atur keterangan di samping, ulangi puluhan kali. Pixforme menyusun otomatis dari template yang sudah profesional.", "Wizard 4 langkah"],
    ["crop" as IconName, "MASALAH 02", "Aspek rasio foto tidak seragam", "Foto portrait di tengah deretan landscape merusak estetika laporan. Sesuaikan posisi manual atau AI Extend otomatis.", "AI Extend - per foto"],
    ["watermark" as IconName, "MASALAH 03", "Watermark tanggal berantakan", "Foto dari berbagai sumber datang dengan watermark tanggal yang tidak konsisten. Bersihkan, ganti, atau tambahkan secara massal.", "AI Fix Tools"],
    ["geo" as IconName, "MASALAH 04", "Foto butuh geotag tapi tidak ada GPS", "Tambahkan koordinat, tanggal, dan jam secara manual lewat peta - non-destructive, tidak mengubah foto asli.", "Geotag overlay"],
  ];
  return <section className="section"><div className="section-head"><span className="section-eyebrow">Masalah yang kami selesaikan</span><h2>EMPAT HAL YANG<br />MEMBUANG WAKTU ANDA</h2><p>Setiap fitur Pixforme dibangun dari keluhan nyata penyusun laporan lapangan - bukan asumsi.</p></div><div className="solutions-grid">{rows.map(([icon, num, title, text, tag]) => <div className="solution-card" key={num}><div className="solution-icon-box"><PixelIcon name={icon as IconName} size={22} color="#fff" /></div><span className="solution-num">{num}</span><h3>{title}</h3><p>{text}</p><span className="solution-tag">{tag}</span></div>)}</div></section>;
}

function HowItWorksSection() {
  const rows = [["01", "Buat Project", "Isi nama kontrak, klien, dan header laporan - logo instansi atau perusahaan Anda."], ["02", "Detail Laporan", "Nama laporan dan periode pelaporan. Satu project bisa punya banyak laporan."], ["03", "Foto & Caption", "Upload puluhan hingga ratusan foto. Isi item pekerjaan dan progres - manual atau massal."], ["04", "Preview & Export", "Pilih template, sesuaikan gaya, lihat hasil real-time, lalu export PDF siap cetak."]];
  return <section className="section" style={{ background: "var(--accent-bg)" }}><div className="section-head"><span className="section-eyebrow">Cara kerja</span><h2>EMPAT LANGKAH,<br />SATU LAPORAN SIAP CETAK</h2></div><div className="steps-row">{rows.map(([num, title, text]) => <div className="step-card" key={num}><div className="step-num">{num}</div><h4>{title}</h4><p>{text}</p></div>)}</div></section>;
}

function TemplatesSection() {
  return <section className="section"><div className="section-head"><span className="section-eyebrow">Template siap pakai</span><h2>LIMA GAYA LAYOUT,<br />SEMUA BISA DIKUSTOMISASI</h2><p>Warna aksen, spacing, border, dan tampilan header - sesuaikan tanpa perlu desainer.</p></div><div className="tpl-row">{[["g2", "Stack + Teks"], ["g4", "Grid Equal"], ["g4", "Grid Border"], ["g1", "Full Page"], ["g2", "Landscape Split"]].map(([gridName, label]) => <div className="tpl-thumb" key={label}><div className={`swatch ${gridName}`}>{Array.from({ length: gridName === "g1" ? 1 : gridName === "g2" ? 2 : 4 }).map((_, i) => <div key={i} style={label === "Stack + Teks" && i === 0 ? { gridColumn: "1/3" } : label === "Grid Border" ? { border: "1.5px solid #0A0A0A" } : undefined} />)}</div><span>{label}</span></div>)}</div></section>;
}

function HomeToolsSection() {
  return <section className="section" style={{ background: "var(--accent-bg)" }}><div className="section-head"><span className="section-eyebrow">Di luar wizard laporan</span><h2>AI FIX TOOLS UNTUK<br />KEBUTUHAN LAPANGAN</h2><p>Tool terpisah untuk foto bukti lapangan real-time - tidak tercampur dengan foto laporan resmi Anda.</p></div><div className="tools-grid"><ToolCard featured icon="geo" title="AI Geotag Burn-in" text="Bakar koordinat, tanggal, dan jam langsung ke piksel foto untuk bukti lapangan real-time - dengan kontrol prompt presisi." cta="Buka Tool" /><ToolCard icon="watermark" title="Watermark Manager" text="Hapus, ganti, atau tambahkan watermark tanggal secara massal ke puluhan foto sekaligus." cta="Buka Tool" /><ToolCard icon="image" title="Galeri Foto" text="Semua foto Anda - asli maupun hasil AI Fix - tersimpan rapi dan bisa dipakai ulang di project manapun." cta="Buka Galeri" /></div></section>;
}

function ToolCard({ featured, icon, title, text, cta }: { featured?: boolean; icon: IconName; title: string; text: string; cta: string }) {
  return <div className={`tool-card ${featured ? "featured" : ""}`}><div className="tool-icon-box"><PixelIcon name={icon} size={22} color={featured ? "#fff" : "#0A0A0A"} /></div><h3>{title}</h3><p>{text}</p><Link href={route("tools.html")} className={`pixel-btn ${featured ? "pixel-btn-accent" : "pixel-btn-ghost"}`} style={{ marginTop: 8, alignSelf: "flex-start" }}>{cta}</Link></div>;
}

export function ProductPage() {
  return <><TopNav active="product" /><section className="ph-hero"><h1>EMPAT LANGKAH<br />MENUJU LAPORAN SIAP CETAK</h1><p>Detail lengkap proses Pixforme - dari upload foto pertama sampai PDF yang siap dikirim ke klien.</p></section><div className="placeholder-box"><span className="icon-wrap"><PixelIcon name="layout" size={28} color="#FF6B1A" /></span><h3>Halaman ini sedang disusun</h3><p>Detail tiap langkah wizard, video demo, dan studi kasus akan tampil di sini. Untuk sekarang, langsung coba wizard-nya.</p><Link href={route("wizard-step1.html")} className="pixel-btn pixel-btn-accent">Coba Wizard Sekarang</Link></div><Footer full={false} /></>;
}

export function ToolsPage() {
  const tools = [["geo" as IconName, "#0A0A0A", "AI Geotag Burn-in", "Bakar koordinat, tanggal, dan jam langsung ke piksel foto - untuk bukti lapangan real-time saat GPS tidak presisi atau tidak ada jaringan. Pilih lokasi lewat Google Maps, kontrol prompt ketat di sisi client."], ["watermark" as IconName, "#FF6B1A", "Watermark Manager", "Hapus, ganti, atau tambahkan watermark tanggal secara massal ke puluhan foto sekaligus - cocok untuk foto dari berbagai sumber dengan format watermark berbeda-beda."], ["image" as IconName, "#2563EB", "Galeri Foto", "Semua foto Anda - asli maupun hasil AI Fix - tersimpan rapi per project. Pilih foto dari galeri kapan saja untuk dipakai di laporan manapun, tanpa upload ulang."]];
  return <><TopNav active="tools" /><section className="ph-hero"><h1>AI FIX TOOLS</h1><p>Tool terpisah dari wizard laporan - untuk bukti lapangan real-time dan pengelolaan foto massal. Hasilnya tersimpan di galeri Anda, terpisah dari foto laporan resmi.</p></section><div className="tool-route-grid">{tools.map(([icon, bg, title, text]) => <div className="tool-route-card coming" key={title}><div className="tool-route-icon" style={{ background: bg }}><PixelIcon name={icon as IconName} size={24} color="#fff" /></div><span className="badge-status badge-soon">SEGERA HADIR</span><h3>{title}</h3><p>{text}</p><button className="pixel-btn pixel-btn-ghost" disabled style={{ alignSelf: "flex-start" }}>Buka Tool</button></div>)}</div><Footer full={false} /></>;
}

export function LoginPage() {
  return <div className="login-page"><div className="login-wrap"><div className="login-box"><Link href="/" className="logo-row"><PixelLogo size={26} /><span className="brand">PIXFORME</span></Link><div className="card card-accent"><h1>Masuk ke akun Anda</h1><p className="sub">Project dan laporan Anda menunggu.</p><div><label className="field-label">Email</label><input className="field-input" type="email" placeholder="nama@perusahaan.com" /></div><div><label className="field-label">Kata Sandi</label><input className="field-input" type="password" placeholder="********" /></div><button className="pixel-btn pixel-btn-accent" style={{ justifyContent: "center", width: "100%", padding: 12 }}>Masuk</button><div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>Belum punya akun? <Link href={route("wizard-step1.html")} style={{ color: "var(--orange)", fontWeight: 700 }}>Mulai gratis</Link></div></div></div></div></div>;
}

export function PricingPage() {
  const [status, setStatus] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [busy, setBusy] = useState(false);
  async function fetchJson(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) throw new Error("Endpoint mengembalikan HTML. Jalankan app dari origin Next.js dan pastikan API Midtrans tersedia.");
    const payload = await response.json() as { error?: string };
    if (!response.ok) throw new Error(payload.error || "Request gagal.");
    return payload;
  }
  async function openSnap() {
    setBusy(true);
    setStatus({ message: "Membuat transaksi sandbox..." });
    try {
      const config = await fetchJson("/api/midtrans/config") as { clientKey: string };
      if (!config.clientKey) throw new Error("MIDTRANS_CLIENT_KEY belum diisi.");
      await new Promise<void>((resolve, reject) => {
        if ("snap" in window) return resolve();
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", config.clientKey);
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Gagal memuat Snap JS sandbox."));
        document.body.appendChild(script);
      });
      const transaction = await fetchJson("/api/midtrans/snap-token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sku: "ai_starter" }) }) as { orderId: string; token: string };
      setStatus({ message: `Order ${transaction.orderId} siap. Membuka Snap...` });
      const snapWindow = window as Window & { snap?: { pay: (token: string, callbacks: { onSuccess: () => void; onPending: () => void; onError: () => void; onClose: () => void }) => void } };
      snapWindow.snap?.pay(transaction.token, {
        onSuccess: () => setStatus({ message: "Pembayaran sukses di sandbox.", type: "success" }),
        onPending: () => setStatus({ message: "Pembayaran pending. Cek webhook/status Midtrans." }),
        onError: () => setStatus({ message: "Pembayaran gagal dari Snap.", type: "error" }),
        onClose: () => setStatus({ message: "Popup Snap ditutup sebelum pembayaran selesai." }),
      });
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : "Pembayaran gagal.", type: "error" });
    } finally {
      setBusy(false);
    }
  }
  return <><TopNav active="pricing" /><section className="ph-hero"><h1>HARGA YANG SEPADAN<br />DENGAN WAKTU YANG ANDA HEMAT</h1><p>Subscription untuk pemakaian rutin, kredit untuk fitur AI sesuai kebutuhan. Detail final masih disusun - berikut gambaran strukturnya.</p></section><div className="pricing-grid"><PriceCard title="Gratis" amount="Rp0" period="/bulan" features={["1 laporan aktif", "Hingga 30 foto", "Export PDF dengan watermark"]} button="Mulai Gratis" /><PriceCard featured title="Pro" amount="Segera" features={["Project & laporan tanpa batas", "Ratusan foto per laporan", "Export PDF tanpa watermark", "Kredit AI bulanan termasuk"]} button="Segera Hadir" disabled /><div className="price-card"><h3>Kredit AI</h3><div><span className="price-amount">Rp29.000</span> <span className="price-period">/paket test</span></div><ul className="price-features">{["50 kredit AI", "AI Extend aspek rasio", "AI Geotag Burn-in", "Sandbox Snap: GoPay, QRIS, VA"].map((feature) => <li key={feature}><PixelIcon name="check" size={12} color="#2E9E5B" />{feature}</li>)}</ul><button id="snapPayBtn" className="pixel-btn pixel-btn-ghost" style={{ marginTop: "auto", justifyContent: "center" }} onClick={openSnap} disabled={busy}>Uji Bayar</button><div className={`payment-status ${status ? "active" : ""} ${status?.type || ""}`} role="status" aria-live="polite">{status?.message}</div></div></div><div className="payment-note">Token Snap dibuat di server agar server key Midtrans tidak bocor ke browser.</div><Footer full={false} /></>;
}

function PriceCard({ title, amount, period, features, button, featured, disabled }: { title: string; amount: string; period?: string; features: string[]; button: string; featured?: boolean; disabled?: boolean }) {
  return <div className={`price-card ${featured ? "featured" : ""}`}><h3 style={featured ? { color: "var(--orange)" } : undefined}>{title}</h3><div><span className="price-amount">{amount}</span> {period ? <span className="price-period">{period}</span> : null}</div><ul className="price-features">{features.map((feature) => <li key={feature}><PixelIcon name="check" size={12} color={featured ? "#FF6B1A" : "#2E9E5B"} />{feature}</li>)}</ul><button className={`pixel-btn ${featured ? "pixel-btn-accent" : "pixel-btn-ghost"}`} style={{ marginTop: "auto", justifyContent: "center" }} disabled={disabled}>{button}</button></div>;
}

export function WorkspacePage() {
  const { state, save } = useWizardState();
  const activeId = state.workspace.activeProjectId || "project_1";
  function persistProject(next: WizardState, projectId = activeId) {
    const project = next.workspace.projects.find((row) => row.id === projectId) || next.workspace.projects[0];
    project.name = next.project.name || project.id;
    project.instansi = next.project.client || "-";
    project.location = next.project.location || "-";
    project.items = [...next.project.items];
    project.rabText = next.project.rabText;
    project.status = "Aktif";
    save({ ...next });
  }
  function updateProject(changes: Partial<Project>) {
    const next = cloneState(state);
    next.project = { ...next.project, ...changes };
    next.project.pekerjaan = next.project.name;
    next.project.instansi = next.project.client;
    next.project.lokasi = next.project.location;
    if (changes.rabText !== undefined) next.project.items = parseRabItems(changes.rabText);
    persistProject(next);
  }
  function activateProject(id: string) {
    const next = cloneState(state);
    next.workspace.activeProjectId = id;
    next.workspace.projects = next.workspace.projects.map((row) => ({ ...row, status: row.id === id ? "Aktif" : row.status === "Aktif" ? "Draft" : row.status }));
    const project = next.workspace.projects.find((row) => row.id === id);
    if (project) next.project = { ...next.project, name: project.name || "", pekerjaan: project.name || "", client: project.instansi || "", instansi: project.instansi || "", location: project.location || "", lokasi: project.location || "", items: project.items?.length ? [...project.items] : [], rabText: project.rabText || project.items?.join("\n") || "" };
    save(next);
  }
  function addProject() {
    const next = cloneState(state);
    const id = `project_${next.workspace.projects.length + 1}`;
    next.workspace.projects.unshift({ id, name: `Project ${next.workspace.projects.length + 1}`, instansi: "Belum diatur", location: "-", status: "Draft", items: [], rabText: "" });
    next.workspace.activeProjectId = id;
    next.project = { ...next.project, name: `Project ${next.workspace.projects.length}`, pekerjaan: `Project ${next.workspace.projects.length}`, client: "", instansi: "", location: "", lokasi: "", items: [], rabText: "" };
    save(next);
  }
  return <div className="wizard-shell"><WizardChrome step={0} actions={<Link className="pixel-btn pixel-btn-accent" href={route("wizard-step1.html")}>Mulai Wizard</Link>} /><main className="wizard-page container"><div className="wizard-title-row"><div><div className="wizard-kicker">WORKSPACE</div><h1 className="wizard-title">USER WORKSPACE</h1><p className="wizard-subtitle">Workspace menyimpan banyak project. Setiap project membawa atribut instansi, pekerjaan, lokasi kegiatan, dan item pekerjaan untuk dipakai dalam wizard laporan.</p></div><StateChips items={[`Workspace: ${state.workspace.name}`, `Project: ${state.workspace.projects.length}`, `Item aktif: ${getProjectItems(state).length}`]} /></div><div className="workspace-layout"><aside className="info-panel"><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}><h3 style={{ margin: 0 }}>Project</h3><button className="pixel-btn pixel-btn-ghost" onClick={addProject} style={{ padding: "7px 10px", fontSize: 10, boxShadow: "none" }}>Tambah</button></div><div className="project-list-card">{state.workspace.projects.map((project) => <button className={`project-list-item ${project.id === activeId ? "active" : ""}`} key={project.id} onClick={() => activateProject(project.id)} type="button"><div style={{ fontSize: 11, fontWeight: 900, lineHeight: 1.35 }}>{project.name || project.id}</div><div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 5, lineHeight: 1.35 }}>{project.instansi || "-"}</div><div className="mono" style={{ fontSize: 9, color: "var(--orange)", marginTop: 7 }}>{project.id} / {project.status || "Draft"}</div></button>)}</div></aside><section className="card card-accent"><div className="form-grid"><div><label className="field-label">Nama Instansi</label><input className="field-input" value={state.project.client} onChange={(e) => updateProject({ client: e.target.value })} /></div><div><label className="field-label">Lokasi Kegiatan</label><input className="field-input" value={state.project.location} onChange={(e) => updateProject({ location: e.target.value })} /></div><div className="span-2"><label className="field-label">Nama Pekerjaan</label><input className="field-input" value={state.project.name} onChange={(e) => updateProject({ name: e.target.value })} /></div><div className="span-2"><label className="field-label">Paste Item Pekerjaan dari RAB</label><textarea className="field-textarea mono" rows={9} value={state.project.rabText} onChange={(e) => updateProject({ rabText: e.target.value })} /><ItemPreview items={getProjectItems(state)} /></div></div><div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}><Link className="pixel-btn pixel-btn-accent" href={route("wizard-step1.html")}>Buka Project Setting</Link><Link className="pixel-btn pixel-btn-ghost" href={route("wizard-step3.html")}>Cek Dropdown Step 3</Link></div></section></div></main></div>;
}

function ItemPreview({ items, max = Infinity }: { items: string[]; max?: number }) {
  const visible = items.slice(0, max);
  return <div className="project-items-preview"><div className="mini-label">{items.length} item tersimpan untuk dropdown Step 3</div><div className="item-chip-list">{visible.map((item) => <span className="item-chip" key={item}>{item}</span>)}{items.length > visible.length ? <span className="item-chip muted">+{items.length - visible.length} lainnya</span> : null}</div></div>;
}

export function WizardStep1Page() {
  const { state, save, reset } = useWizardState();
  const [required, setRequired] = useState(false);
  function updateProject(changes: Partial<Project>) {
    const next = cloneState(state);
    next.project = { ...next.project, ...changes };
    next.project.pekerjaan = next.project.name;
    next.project.instansi = next.project.client;
    next.project.lokasi = next.project.location;
    if (changes.rabText !== undefined) next.project.items = parseRabItems(changes.rabText);
    const activeId = next.workspace.activeProjectId;
    const activeProject = next.workspace.projects.find((project) => project.id === activeId);
    if (activeProject) Object.assign(activeProject, { name: next.project.name || "-", instansi: next.project.client || "-", location: next.project.location || "-", status: "Aktif", items: [...next.project.items], rabText: next.project.rabText });
    save(next);
  }
  function nextStep() {
    if (!state.project.name.trim()) {
      setRequired(true);
      document.getElementById("projectName")?.focus();
      return;
    }
    window.location.href = route("wizard-step2.html");
  }
  return <div className="wizard-shell"><WizardChrome step={1} actions={<><Link className="pixel-btn pixel-btn-ghost" href={route("workspace.html")}>Workspace</Link><button className="pixel-btn pixel-btn-ghost" onClick={() => { reset(); window.location.reload(); }}>Reset</button><button className="pixel-btn pixel-btn-accent" onClick={nextStep}>Lanjut</button></>} /><main className="wizard-page container-narrow"><div className="wizard-title-row"><div><div className="wizard-kicker">STEP 01</div><h1 className="wizard-title">PROJECT SETTING</h1><p className="wizard-subtitle">Satu workspace dapat menyimpan banyak project. Data instansi, pekerjaan, lokasi, dan item pekerjaan disimpan di level project agar bisa dipakai ulang pada laporan berikutnya.</p></div></div><div className="wizard-grid-2"><section className="card card-accent"><div className="form-grid"><div className="span-2"><label className="field-label">Nama Pekerjaan / Project <span className="req">*</span></label><input id="projectName" className={`field-input ${required ? "required-empty" : ""}`} value={state.project.name} placeholder="mis. Pembangunan Gedung Kantor Dinas A" onChange={(e) => updateProject({ name: e.target.value })} /></div><div><label className="field-label">Nama Instansi</label><input className="field-input" value={state.project.client} placeholder="mis. Dinas Pekerjaan Umum Kota X" onChange={(e) => updateProject({ client: e.target.value })} /></div><div><label className="field-label">Lokasi Kegiatan</label><input className="field-input" value={state.project.location} placeholder="mis. Jl. Sudirman No. 10" onChange={(e) => updateProject({ location: e.target.value })} /></div><div className="span-2"><label className="field-label">Paste Item Pekerjaan dari RAB</label><textarea className="field-textarea mono" rows={7} value={state.project.rabText} placeholder={"Paste baris RAB di sini. Contoh:\n1. Pekerjaan Persiapan\n2. Galian dan pembesian pondasi\n3. Pengecoran kolom lantai 1"} onChange={(e) => updateProject({ rabText: e.target.value })} /><ItemPreview items={getProjectItems(state)} max={12} /></div><div className="span-2"><label className="field-label">Logo yang ditampilkan</label><div className="toggle-row"><button className={`toggle-btn ${state.project.logoInstansi ? "active" : ""}`} type="button" onClick={() => updateProject({ logoInstansi: !state.project.logoInstansi })}>Logo Instansi</button><button className={`toggle-btn ${state.project.logoPerusahaan ? "active" : ""}`} type="button" onClick={() => updateProject({ logoPerusahaan: !state.project.logoPerusahaan })}>Logo Perusahaan</button></div></div><div className="span-2"><label className="field-label">Teks Header</label><textarea className="field-textarea" rows={4} value={state.project.headerText} placeholder={"DINAS PEKERJAAN UMUM\nLaporan Dokumentasi Proyek"} onChange={(e) => updateProject({ headerText: e.target.value })} /></div><div className="span-2"><label className="field-label">Tampilkan Header</label><div className="toggle-row"><button className={`toggle-btn ${state.project.headerMode === "all" ? "active" : ""}`} type="button" onClick={() => updateProject({ headerMode: "all" })}>Semua Halaman</button><button className={`toggle-btn ${state.project.headerMode === "first" ? "active" : ""}`} type="button" onClick={() => updateProject({ headerMode: "first" })}>Halaman Pertama</button></div></div></div></section><aside className="info-panel"><h3>Arah UX</h3><ul><li>Workspace menjadi rumah untuk project_1, project_2, dan seterusnya.</li><li>Project Setting menyimpan atribut utama project.</li><li>Item RAB otomatis menjadi dropdown di Step 3.</li></ul><ProjectSummary state={state} /></aside></div></main></div>;
}

export function WizardStep2Page() {
  const { state, save } = useWizardState();
  const [required, setRequired] = useState(false);
  function updateReport(changes: Partial<WizardState["report"]>) { save({ ...state, report: { ...state.report, ...changes } }); }
  function nextStep() {
    if (!state.report.name.trim()) {
      setRequired(true);
      document.getElementById("reportName")?.focus();
      return;
    }
    window.location.href = route("wizard-step3.html");
  }
  return <div className="wizard-shell"><WizardChrome step={2} actions={<><Link className="pixel-btn pixel-btn-ghost" href={route("wizard-step1.html")}>Kembali</Link><button className="pixel-btn pixel-btn-accent" onClick={nextStep}>Lanjut</button></>} /><main className="wizard-page container-narrow"><div className="wizard-title-row"><div><div className="wizard-kicker">STEP 02</div><h1 className="wizard-title">DETAIL LAPORAN</h1><p className="wizard-subtitle">Step ini sengaja ringkas. Layout, jumlah foto per halaman, dan gaya dokumen diputuskan di Preview agar tidak ada pilihan yang dobel.</p></div></div><div className="wizard-grid-2"><section className="card card-accent"><div><label className="field-label">Nama Laporan <span className="req">*</span></label><input id="reportName" className={`field-input ${required ? "required-empty" : ""}`} value={state.report.name} placeholder="mis. Laporan Mingguan Ke-3" onChange={(e) => updateReport({ name: e.target.value })} /></div><div><label className="field-label">Periode / Tanggal</label><input className="field-input" value={state.report.period} placeholder="mis. 1 - 7 Juni 2026" onChange={(e) => updateReport({ period: e.target.value })} /></div><div className="prototype-banner">Template belum dipilih di sini. User akan mencoba template di Step 4 dan melihat pagination langsung dari foto yang sudah dipilih.</div></section><aside className="info-panel"><h3>Data Saat Ini</h3><p>{state.project.name || "Project belum diisi"} - {state.project.location || "Lokasi belum diisi"}</p><ProjectSummary state={state} /></aside></div></main></div>;
}

export function WizardStep3Page() {
  const { state, save } = useWizardState();
  const [fitId, setFitId] = useState<string | null>(null);
  const [geoId, setGeoId] = useState<string | null>(null);
  const [cropY, setCropY] = useState(50);
  const [geoPos, setGeoPos] = useState({ lat: -2.5916, lng: 140.669 });
  const [geoForm, setGeoForm] = useState<Geotag>({ address: "", lat: -2.5916, lng: 140.669, date: "2026-06-23", time: "09:00" });
  const fileRef = useRef<HTMLInputElement>(null);
  const items = getReportItems(state);
  const selected = new Set(state.reportPhotos.map((row) => row.photoId));
  function updateReportPhoto(id: string, changes: Partial<ReportPhoto>) { save({ ...state, reportPhotos: state.reportPhotos.map((row) => row.id === id ? { ...row, ...changes } : row) }); }
  function addToReport(photoId: string) {
    if (selected.has(photoId)) return;
    save({ ...state, reportPhotos: [...state.reportPhotos, { id: uid("rp"), photoId, nama: "", item: "", progress: "", fitMode: "crop", cropY: 50, aiExtended: false, geotag: null }] });
  }
  function movePhoto(id: string, direction: number) {
    const next = [...state.reportPhotos];
    const idx = next.findIndex((row) => row.id === id);
    const target = idx + direction;
    if (idx < 0 || target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    save({ ...state, reportPhotos: next });
  }
  function removePhoto(id: string) { save({ ...state, reportPhotos: state.reportPhotos.filter((row) => row.id !== id) }); }
  function openFit(id: string) {
    const item = state.reportPhotos.find((row) => row.id === id);
    setFitId(id);
    setCropY(item?.cropY ?? 50);
  }
  function openGeo(id: string) {
    const item = state.reportPhotos.find((row) => row.id === id);
    const geo = item?.geotag || { address: "", lat: -2.5916, lng: 140.669, date: new Date().toISOString().slice(0, 10), time: "09:00" };
    setGeoId(id);
    setGeoForm(geo);
    setGeoPos({ lat: geo.lat, lng: geo.lng });
  }
  async function uploadFiles(files: FileList | null) {
    if (!files) return;
    const uploaded = await Promise.all(Array.from(files).map((file) => new Promise<GalleryPhoto>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Gagal membaca file."));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => resolve({ id: uid("g"), url: String(reader.result), filename: file.name, w: img.naturalWidth || 900, h: img.naturalHeight || 650, sourceType: "laporan" });
        img.onerror = () => reject(new Error("Gagal membaca gambar."));
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    })));
    save({ ...state, gallery: [...uploaded, ...state.gallery] });
    if (fileRef.current) fileRef.current.value = "";
  }
  function itemOptions(selectedItem = "", includeEmpty = false) {
    const projectItems = getProjectItems(state);
    return <>{includeEmpty ? <option value="">Pilih item pekerjaan</option> : null}{selectedItem && !projectItems.some((item) => item.toLowerCase() === selectedItem.toLowerCase()) ? <option value={selectedItem}>{selectedItem} (custom)</option> : null}{projectItems.map((item) => <option key={item} value={item}>{item}</option>)}</>;
  }
  function applyBulk() {
    const item = (document.getElementById("bulkItem") as HTMLSelectElement | null)?.value || "";
    const progress = (document.getElementById("bulkProgress") as HTMLInputElement | null)?.value || "";
    save({ ...state, reportPhotos: state.reportPhotos.map((row) => ({ ...row, ...(item ? { item } : {}), ...(progress !== "" ? { progress } : {}) })) });
  }
  const fitItem = fitId ? items.find((row) => row.id === fitId) : null;
  return <div className="wizard-shell"><WizardChrome step={3} actions={<><Link className="pixel-btn pixel-btn-ghost" href={route("wizard-step2.html")}>Kembali</Link><Link className="pixel-btn pixel-btn-accent" href={route("wizard-step4.html")}>Preview</Link></>} /><main className="wizard-page container"><div className="wizard-title-row"><div><div className="wizard-kicker">STEP 03</div><h1 className="wizard-title">FOTO & CAPTION</h1><p className="wizard-subtitle">Foto masuk dari galeri dulu, lalu dipilih ke laporan. Caption, urutan, fit, AI extend, dan geotag tersimpan per relasi foto-laporan.</p></div><StateChips items={[`Project: ${state.project.name}`, `Foto laporan: ${state.reportPhotos.length}`]} /></div><div className="gallery-layout"><aside className="gallery-panel info-panel"><h3>Galeri Foto</h3><p>Upload baru masuk galeri. Foto bukti lapangan tidak masuk laporan kecuali dipilih eksplisit.</p><div style={{ margin: "12px 0", display: "grid", gap: 8 }}><button className="pixel-btn pixel-btn-accent" style={{ justifyContent: "center" }} onClick={() => fileRef.current?.click()}>Upload Foto</button><input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => void uploadFiles(e.target.files)} /></div><div className="gallery-list">{state.gallery.map((photo) => <div className="gallery-item" key={photo.id}><div className="gallery-thumb"><img src={photo.url} alt="" /></div><div className="gallery-meta"><div className="gallery-name">{photo.filename}</div><div className="gallery-badge">{photo.sourceType === "bukti_lapangan" ? "BUKTI LAPANGAN" : "LAPORAN"} / {arLabel(photo)}</div><button className={`pixel-btn ${selected.has(photo.id) ? "pixel-btn-success" : "pixel-btn-ghost"}`} style={{ padding: "6px 9px", fontSize: 10, justifyContent: "center", boxShadow: "none" }} onClick={() => addToReport(photo.id)}>{selected.has(photo.id) ? "Sudah dipilih" : "Tambah ke laporan"}</button></div></div>)}</div></aside><section><div className="photo-workbar"><div><div className="pixel-heading" style={{ fontSize: 13 }}>FOTO DALAM LAPORAN</div><div className="text-muted" style={{ fontSize: 12, marginTop: 6 }}>{items.length} foto dipilih dari galeri</div></div><div className="bulk-box"><div><label className="mini-label">BULK ITEM</label><select className="field-input" id="bulkItem">{itemOptions("", true)}</select></div><div><label className="mini-label">BULK PROGRESS</label><input className="field-input mono" id="bulkProgress" type="number" min="0" max="100" placeholder="75" /></div><button className="pixel-btn pixel-btn-ghost" onClick={applyBulk}>Terapkan</button></div></div><div className="report-grid">{items.length ? items.map((item) => <PhotoCard key={item.id} item={item} itemOptions={itemOptions} update={updateReportPhoto} move={movePhoto} remove={removePhoto} openFit={openFit} openGeo={openGeo} />) : <div className="empty-state">Belum ada foto dalam laporan. Pilih foto dari galeri di sebelah kiri.</div>}</div></section></div></main><div className={`modal-overlay ${fitId ? "show" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) setFitId(null); }}><div className="modal-box"><div className="modal-head"><div><div className="modal-title">Posisi Foto</div><div className="modal-sub">Pilih cara foto masuk ke frame 4:3.</div></div><button className="modal-close" onClick={() => setFitId(null)}><PixelIcon name="x" size={16} color="#6B6B68" /></button></div><div className="crop-stage">{fitItem ? <img src={fitItem.photo.url} style={imageFitStyle({ ...fitItem, cropY })} alt="Preview" /> : null}</div><div className="fit-options">{(["crop", "contain", "ai"] as const).map((mode) => <button key={mode} className={(mode === "ai" && fitItem?.aiExtended) || mode === fitItem?.fitMode ? "active" : ""} onClick={() => { if (!fitId) return; updateReportPhoto(fitId, mode === "ai" ? { fitMode: "crop", cropY, aiExtended: true } : { fitMode: mode, cropY, aiExtended: false }); setFitId(null); }}>{mode === "crop" ? "Crop 4:3" : mode === "contain" ? "Contain" : "AI Extend"}</button>)}</div>{fitItem?.fitMode !== "contain" ? <div className="style-row" style={{ marginTop: 12, marginBottom: 0 }}><div className="style-label">POSISI CROP VERTIKAL: <span className="mono">{cropY}%</span></div><input type="range" min="0" max="100" value={cropY} onChange={(e) => setCropY(Number(e.target.value))} /></div> : null}<div className="prototype-banner" style={{ marginTop: 12 }}>AI Extend di prototype hanya menandai state. Di production nanti memanggil Image Edit API setelah user konfirmasi kredit.</div></div></div><div className={`modal-overlay ${geoId ? "show" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) setGeoId(null); }}><div className="modal-box"><div className="modal-head"><div><div className="modal-title">Geotag Overlay</div><div className="modal-sub">Metadata ini non-destructive dan ikut tampil di preview/export.</div></div><button className="modal-close" onClick={() => setGeoId(null)}><PixelIcon name="x" size={16} color="#6B6B68" /></button></div><label className="field-label">Alamat / Lokasi</label><input className="field-input" value={geoForm.address} placeholder="mis. Kota Jayapura" onChange={(e) => setGeoForm({ ...geoForm, address: e.target.value })} /><div className="map-fake" onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); const xFrac = (event.clientX - rect.left) / rect.width; const yFrac = (event.clientY - rect.top) / rect.height; const next = { lat: geoPos.lat + (0.5 - yFrac) * 0.01, lng: geoPos.lng + (xFrac - 0.5) * 0.01 }; setGeoPos(next); setGeoForm({ ...geoForm, lat: next.lat, lng: next.lng }); }}><svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}><path d="M0,80 Q150,40 460,94" stroke="#fff" strokeWidth="6" fill="none" opacity="0.7" /><rect x="110" y="96" width="48" height="30" fill="#FFC299" opacity="0.65" rx="2" /><rect x="250" y="52" width="64" height="42" fill="#FFA41B" opacity="0.35" rx="2" /></svg><div className="map-pin-center"><PixelIcon name="mapPin" size={30} color="#E8331C" /></div><div className="map-coords">{geoForm.lat.toFixed(5)}, {geoForm.lng.toFixed(5)}</div></div><div className="form-grid" style={{ marginTop: 12 }}><div><label className="field-label">Latitude</label><input className="field-input mono" value={geoForm.lat.toFixed(5)} onChange={(e) => setGeoForm({ ...geoForm, lat: Number(e.target.value) })} /></div><div><label className="field-label">Longitude</label><input className="field-input mono" value={geoForm.lng.toFixed(5)} onChange={(e) => setGeoForm({ ...geoForm, lng: Number(e.target.value) })} /></div><div><label className="field-label">Tanggal</label><input className="field-input mono" type="date" value={geoForm.date} onChange={(e) => setGeoForm({ ...geoForm, date: e.target.value })} /></div><div><label className="field-label">Jam</label><input className="field-input mono" type="time" value={geoForm.time} onChange={(e) => setGeoForm({ ...geoForm, time: e.target.value })} /></div></div><div style={{ display: "flex", gap: 8, marginTop: 16 }}><button className="pixel-btn pixel-btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => { if (geoId) updateReportPhoto(geoId, { geotag: null }); setGeoId(null); }}>Hapus</button><button className="pixel-btn pixel-btn-accent" style={{ flex: 2, justifyContent: "center" }} onClick={() => { if (geoId) updateReportPhoto(geoId, { geotag: { ...geoForm, address: geoForm.address || "Lokasi dipilih" } }); setGeoId(null); }}>Simpan Geotag</button></div></div></div></div>;
}

function PhotoCard({ item, itemOptions, update, move, remove, openFit, openGeo }: { item: ReportPhoto & { index: number; photo: GalleryPhoto }; itemOptions: (selectedItem?: string, includeEmpty?: boolean) => React.ReactNode; update: (id: string, changes: Partial<ReportPhoto>) => void; move: (id: string, direction: number) => void; remove: (id: string) => void; openFit: (id: string) => void; openGeo: (id: string) => void }) {
  return <article className="photo-card"><div className="photo-frame"><img src={item.photo.url} style={imageFitStyle(item)} alt="" /><div className="photo-badge">{arLabel(item.photo)}{item.aiExtended ? " / AI" : ""}</div><div className="photo-index">#{String(item.index + 1).padStart(2, "0")}</div>{item.geotag ? <GeoOverlay geo={item.geotag} /> : null}</div><div className="photo-tools"><button onClick={() => move(item.id, -1)}>UP</button><button onClick={() => move(item.id, 1)}>DOWN</button><button className={item.fitMode ? "active" : ""} onClick={() => openFit(item.id)}>FIT</button><button className={item.aiExtended ? "done" : ""} onClick={() => update(item.id, { aiExtended: true, fitMode: "crop", cropY: 50 })}>AI</button><button className={item.geotag ? "active" : ""} onClick={() => openGeo(item.id)}>GEO</button><button onClick={() => remove(item.id)}>DEL</button></div><div className="photo-fields"><div><div className="mini-label">NAMA PEKERJAAN</div><input className="mini-input" value={item.nama} onChange={(e) => update(item.id, { nama: e.target.value })} /></div><div><div className="mini-label">ITEM PEKERJAAN</div><select className="mini-input item-dropdown" value={item.item} onChange={(e) => update(item.id, { item: e.target.value })}>{itemOptions(item.item, false)}</select></div><div><div className="mini-label">PROGRESS</div><div className="progress-row"><input className="mini-input" type="number" min="0" max="100" value={item.progress} onChange={(e) => update(item.id, { progress: e.target.value })} /><span className="mono" style={{ fontSize: 10 }}>%</span><div className="progress-quick">{[25, 50, 75, 100].map((value) => <button key={value} className={String(item.progress) === String(value) ? "active" : ""} onClick={() => update(item.id, { progress: value })}>{value}</button>)}</div></div></div></div></article>;
}

function GeoOverlay({ geo }: { geo: Geotag }) {
  return <div className="geo-overlay"><div>{geo.address}</div><div className="mono">{geo.lat.toFixed(5)}, {geo.lng.toFixed(5)}</div><div className="mono">{geo.date} {geo.time}</div></div>;
}

const PAPER_SIZES = {
  a4: { label: "A4", portrait: { w: 300, h: 424 }, landscape: { w: 424, h: 300 }, print: { w: 210, h: 297 } },
  f4: { label: "F4", portrait: { w: 300, h: 472 }, landscape: { w: 472, h: 300 }, print: { w: 210, h: 330 } },
};

export function WizardStep4Page() {
  const { state, save } = useWizardState();
  const [panel, setPanel] = useState<"template" | "style">("template");
  const tpl = templates.find((row) => row.id === state.preview.templateId) || templates[0];
  const reportItems = getReportItems(state);
  function photosPerPage(templateId = tpl.id) {
    const paper = state.preview.paperSize;
    if (templateId === "t1") return paper === "f4" ? 3 : 2;
    if (templateId === "t2" || templateId === "t3") return paper === "f4" ? 6 : 4;
    if (templateId === "t5") return paper === "f4" ? 3 : 2;
    return 1;
  }
  function updatePreview(changes: Partial<Preview>) { save({ ...state, preview: { ...state.preview, ...changes } }); }
  function updateProject(changes: Partial<Project>) { save({ ...state, project: { ...state.project, ...changes } }); }
  const paper = PAPER_SIZES[state.preview.paperSize];
  const dim = tpl.orientation === "landscape" ? paper.landscape : paper.portrait;
  const pages: (ReportPhoto & { index: number; photo: GalleryPhoto })[][] = [];
  const ppp = photosPerPage();
  for (let i = 0; i < reportItems.length; i += ppp) pages.push(reportItems.slice(i, i + ppp));
  if (!pages.length) pages.push([]);
  function exportPdf() {
    const landscape = tpl.orientation === "landscape";
    const widthMm = landscape ? paper.print.h : paper.print.w;
    const heightMm = landscape ? paper.print.w : paper.print.h;
    const widthPx = widthMm * 96 / 25.4;
    const scale = widthPx / dim.w;
    let style = document.getElementById("pdfPrintStyle");
    if (!style) {
      style = document.createElement("style");
      style.id = "pdfPrintStyle";
      document.head.appendChild(style);
    }
    style.textContent = `@page { size: ${state.preview.paperSize === "a4" ? `A4 ${landscape ? "landscape" : "portrait"}` : `${widthMm}mm ${heightMm}mm`}; margin: 0; } @media print { :root { --print-page-width: ${widthMm}mm; --print-page-height: ${heightMm}mm; --print-preview-width: ${dim.w}px; --print-preview-height: ${dim.h}px; --print-scale: ${scale.toFixed(4)}; } }`;
    const previousTitle = document.title;
    document.title = [state.project.name, state.report.name, paper.label].filter(Boolean).join(" - ").replace(/[\\/:*?"<>|]+/g, "-");
    document.body.classList.add("export-pdf-mode", "wizard-shell");
    window.setTimeout(() => window.print(), 80);
    window.addEventListener("afterprint", () => {
      document.body.classList.remove("export-pdf-mode", "wizard-shell");
      document.title = previousTitle;
    }, { once: true });
  }
  return <div className="wizard-shell"><WizardChrome step={4} actions={<><Link className="pixel-btn pixel-btn-ghost" href={route("wizard-step3.html")}>Kembali</Link><button className="pixel-btn pixel-btn-success" onClick={exportPdf}><PixelIcon name="download" size={13} color="#fff" />Export PDF</button></>} /><div className="preview-layout"><aside className="preview-sidebar"><div className="sidebar-tabs"><button className={panel === "template" ? "active" : ""} onClick={() => setPanel("template")}>TEMPLATE</button><button className={panel === "style" ? "active" : ""} onClick={() => setPanel("style")}>GAYA</button></div>{panel === "template" ? <TemplatePanel state={state} photosPerPage={photosPerPage} updatePreview={updatePreview} /> : <StylePanel state={state} updatePreview={updatePreview} updateProject={updateProject} />}</aside><main className="preview-main"><div className="wizard-title-row"><div><div className="wizard-kicker">STEP 04</div><h1 className="wizard-title">PREVIEW & EXPORT</h1><p className="wizard-subtitle">Template menentukan jumlah foto per halaman. Halaman terakhir tetap memakai layout template, slot kosong dibiarkan sebagai whitespace tanpa placeholder.</p></div><StateChips items={[`Kertas: ${paper.label}`, `Template: ${tpl.label}`, `Foto/hal: ${ppp}`, `Foto: ${state.reportPhotos.length}`]} /></div><div className="pages-wrap">{pages.map((pageItems, index) => <div className="page-col" key={index}><div className="page-label">HAL. {index + 1}</div><div className="a4-page" style={{ width: dim.w, height: dim.h }}><HeaderPreview state={state} pageIndex={index} /><div className="a4-content">{renderPageContent(state, tpl.id, ppp, pageItems)}</div><div className="a4-footer"><span>{state.project.name || "-"}</span><span className="mono" style={{ color: state.preview.accentColor, fontWeight: 900 }}>{index + 1}/{pages.length}</span></div></div></div>)}</div></main></div></div>;
}

function TemplatePanel({ state, photosPerPage, updatePreview }: { state: WizardState; photosPerPage: (id: string) => number; updatePreview: (changes: Partial<Preview>) => void }) {
  return <>{templates.map((tpl) => { const count = photosPerPage(tpl.id); const spec = gridSpec(count); return <button key={tpl.id} className={`template-option ${state.preview.templateId === tpl.id ? "active" : ""}`} onClick={() => updatePreview({ templateId: tpl.id })}><div className="tpl-swatch" style={{ gridTemplateColumns: `repeat(${spec.cols},1fr)`, gridTemplateRows: `repeat(${spec.rows},1fr)` }}>{Array.from({ length: count }).map((_, index) => <div key={index} />)}</div><div><div style={{ fontSize: 10, fontWeight: 900 }}>{tpl.label}</div><div style={{ fontSize: 9, color: "var(--text-muted)", lineHeight: 1.35 }}>{tpl.desc} / {count} foto per halaman</div></div></button>; })}</>;
}

function StylePanel({ state, updatePreview, updateProject }: { state: WizardState; updatePreview: (changes: Partial<Preview>) => void; updateProject: (changes: Partial<Project>) => void }) {
  const colors = ["#0A0A0A", "#FF6B1A", "#E8331C", "#FFA41B", "#2563EB", "#0F766E", "#7C3AED"];
  return <><div className="style-row"><div className="style-label">UKURAN KERTAS</div><div className="toggle-row"><button className={`toggle-btn ${state.preview.paperSize === "a4" ? "active" : ""}`} onClick={() => updatePreview({ paperSize: "a4" })}>A4</button><button className={`toggle-btn ${state.preview.paperSize === "f4" ? "active" : ""}`} onClick={() => updatePreview({ paperSize: "f4" })}>F4</button></div></div><div className="prototype-banner" style={{ marginBottom: 14 }}>Kapasitas foto mengikuti ukuran kertas. F4 memberi ruang ekstra: stack bisa 3 foto, grid bisa 6 foto.</div><Swatches label="WARNA AKSEN" colors={colors} value={state.preview.accentColor} onChange={(accentColor) => updatePreview({ accentColor })} /><Swatches label="KOORDINAT GRID - OUTLINE OTOMATIS" colors={["#FFFFFF", "#0A0A0A", "#FFD600", "#20E82A"]} value={state.preview.gridGeoColor} onChange={(gridGeoColor) => updatePreview({ gridGeoColor })} /><RangeControl label="UKURAN KOORDINAT GRID" value={state.preview.gridGeoSize} min={6} max={12} onChange={(gridGeoSize) => updatePreview({ gridGeoSize })} /><RangeControl label="JARAK FOTO" value={state.preview.spacing} min={2} max={18} onChange={(spacing) => updatePreview({ spacing })} /><RangeControl label="UKURAN TEKS" value={state.preview.fontSize} min={6} max={12} onChange={(fontSize) => updatePreview({ fontSize })} /><div className="style-row"><div className="style-label">BORDER FOTO</div><button className={`toggle-btn ${state.preview.border ? "active" : ""}`} onClick={() => updatePreview({ border: !state.preview.border })}>{state.preview.border ? "Aktif" : "Nonaktif"}</button></div><RangeControl label="RADIUS SUDUT" value={state.preview.borderRadius} min={0} max={8} onChange={(borderRadius) => updatePreview({ borderRadius })} /><div className="style-row"><div className="style-label">HEADER</div><div className="toggle-row"><button className={`toggle-btn ${state.project.headerMode === "all" ? "active" : ""}`} onClick={() => updateProject({ headerMode: "all" })}>Semua</button><button className={`toggle-btn ${state.project.headerMode === "first" ? "active" : ""}`} onClick={() => updateProject({ headerMode: "first" })}>Hal. 1</button></div></div></>;
}

function Swatches({ label, colors, value, onChange }: { label: string; colors: string[]; value: string; onChange: (color: string) => void }) {
  return <div className="style-row"><div className="style-label">{label}</div><div className="swatch-row">{colors.map((color) => <button key={color} className={`swatch-btn ${value === color ? "active" : ""}`} style={{ background: color }} onClick={() => onChange(color)} />)}</div>{label.startsWith("KOORDINAT") ? <div className="mini-label">Stroke otomatis menjaga teks tetap terbaca di latar terang/gelap.</div> : null}</div>;
}

function RangeControl({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <div className="style-row"><div className="style-label">{label}: <span className="mono">{value}px</span></div><input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>;
}

function gridSpec(count: number) {
  if (count <= 1) return { cols: 1, rows: 1 };
  if (count === 2 || count === 3) return { cols: count, rows: 1 };
  return { cols: 2, rows: Math.ceil(count / 2) };
}

function HeaderPreview({ state, pageIndex }: { state: WizardState; pageIndex: number }) {
  const shouldShow = state.project.headerMode === "all" || (state.project.headerMode === "first" && pageIndex === 0);
  if (!shouldShow) return null;
  return <div className="a4-header" style={{ borderBottomColor: state.preview.accentColor }}>{state.project.logoInstansi ? <div className="logo-box">INS</div> : null}{state.project.logoPerusahaan ? <div className="logo-box">PT</div> : null}<div className="a4-header-text">{state.project.headerText.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</div><div className="mono" style={{ fontSize: 6.5, color: "var(--text-muted)" }}>{state.report.period}</div></div>;
}

function renderPageContent(state: WizardState, templateId: string, ppp: number, pageItems: (ReportPhoto & { index: number; photo: GalleryPhoto })[]) {
  const gap = state.preview.spacing;
  if (templateId === "t1") {
    const tableHeight = Math.max(0, Math.min(100, (pageItems.length / ppp) * 100));
    return <div className="stack-grid-table" style={{ "--stack-border-color": state.preview.accentColor, borderColor: state.preview.accentColor, height: `${tableHeight}%` } as React.CSSProperties}>{pageItems.map((item) => <StackRow key={item.id} item={item} state={state} />)}</div>;
  }
  if (templateId === "t2" || templateId === "t3") {
    const spec = gridSpec(ppp);
    return <div style={{ display: "grid", gridTemplateColumns: `repeat(${spec.cols},1fr)`, gridTemplateRows: `repeat(${spec.rows},minmax(0,1fr))`, gap, height: "100%", minHeight: 0 }}>{Array.from({ length: ppp }).map((_, index) => pageItems[index] ? <div className="preview-cell" style={{ position: "relative" }} key={pageItems[index].id}><GridCard item={pageItems[index]} state={state} withNumber={templateId === "t3"} numberText={String(index + 1).padStart(2, "0")} /></div> : <div key={index} />)}</div>;
  }
  if (templateId === "t4") {
    const one = pageItems[0];
    return one ? <div style={{ display: "flex", flexDirection: "column", gap, height: "100%" }}><PhotoBox item={one} /><Caption item={one} state={state} /></div> : <div />;
  }
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${ppp},1fr)`, gap, height: "100%", minHeight: 0 }}>{Array.from({ length: ppp }).map((_, index) => pageItems[index] ? <PreviewCard key={pageItems[index].id} item={pageItems[index]} state={state} /> : <div key={index} />)}</div>;
}

function PhotoBox({ item }: { item: ReportPhoto & { photo: GalleryPhoto } }) {
  return <div className="preview-photo-box"><img src={item.photo.url} style={imageFitStyle(item)} alt="" /></div>;
}

function PhotoFrame43({ item }: { item: ReportPhoto & { photo: GalleryPhoto } }) {
  return <div className="preview-photo-frame43"><img src={item.photo.url} style={imageFitStyle(item)} alt="" /></div>;
}

function geoCaption(item: ReportPhoto, state: WizardState) {
  if (!item.geotag) return null;
  return <div className="mono" style={{ marginTop: 3, fontSize: Math.max(5, state.preview.fontSize - 2), color: state.preview.accentColor, lineHeight: 1.25 }}>KOORD: {item.geotag.address} / {item.geotag.lat.toFixed(5)}, {item.geotag.lng.toFixed(5)} / {item.geotag.date} {item.geotag.time}</div>;
}

function Caption({ item, state }: { item: ReportPhoto; state: WizardState }) {
  const f = state.preview.fontSize;
  return <div className="preview-caption"><div style={{ fontSize: f, fontWeight: 900 }}>{item.nama || "-"}</div><div style={{ fontSize: Math.max(6, f - 1), color: "#52524F" }}>{item.item || "-"}</div><div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><span className="mono" style={{ fontSize: f, color: state.preview.accentColor, fontWeight: 900 }}>{item.progress || 0}%</span><div style={{ flex: 1, height: 2, background: "var(--border)" }}><div style={{ width: `${item.progress || 0}%`, height: "100%", background: state.preview.accentColor }} /></div></div>{geoCaption(item, state)}</div>;
}

function PreviewCard({ item, state }: { item: ReportPhoto & { photo: GalleryPhoto }; state: WizardState }) {
  const border = state.preview.border ? `${state.preview.borderWidth}px solid ${state.preview.accentColor}` : "none";
  return <div className="preview-photo-card" style={{ border, borderRadius: state.preview.borderRadius }}><PhotoBox item={item} /><Caption item={item} state={state} /></div>;
}

function StackRow({ item, state }: { item: ReportPhoto & { photo: GalleryPhoto }; state: WizardState }) {
  return <div className="stack-grid-row"><div className="stack-grid-photo"><PhotoFrame43 item={item} /></div><div className="stack-grid-text"><div style={{ fontSize: state.preview.fontSize + 2, fontWeight: 900, lineHeight: 1.25 }}>{item.nama || "-"}</div><div style={{ fontSize: state.preview.fontSize + 1, color: "#52524F", lineHeight: 1.25, marginTop: 2 }}>{item.item || "-"}</div><div className="mono" style={{ fontSize: state.preview.fontSize + 5, color: "#0A0A0A", fontWeight: 900, marginTop: 5, lineHeight: 1 }}>{item.progress || 0}%</div>{geoCaption(item, state)}</div></div>;
}

function gridGeoStrokeColor(color: string) {
  const normalized = color.toUpperCase();
  return normalized === "#0A0A0A" || normalized === "#000000" ? "#FFFFFF" : "#0A0A0A";
}

function GridGeoOverlay({ item, state }: { item: ReportPhoto; state: WizardState }) {
  if (!item.geotag) return null;
  return <div className="grid-geo-overlay mono" style={{ fontSize: state.preview.gridGeoSize, color: state.preview.gridGeoColor, "--grid-geo-stroke": gridGeoStrokeColor(state.preview.gridGeoColor) } as React.CSSProperties}><div>{item.geotag.lat.toFixed(5)}, {item.geotag.lng.toFixed(5)}</div><div>{item.geotag.address || "Lokasi dipilih"}</div><div>{item.geotag.date} {item.geotag.time}</div></div>;
}

function GridCard({ item, state, withNumber, numberText }: { item: ReportPhoto & { photo: GalleryPhoto }; state: WizardState; withNumber: boolean; numberText: string }) {
  const border = state.preview.border ? `${state.preview.borderWidth}px solid ${state.preview.accentColor}` : "none";
  return <div className="preview-grid-card" style={{ border, borderRadius: state.preview.borderRadius }}>{withNumber ? <div style={{ position: "absolute", zIndex: 2, top: 0, left: 0, background: state.preview.accentColor, color: "#fff", fontSize: 6, fontFamily: "var(--font-mono)", fontWeight: 900, padding: "2px 5px" }}>{numberText}</div> : null}<div className={`preview-photo-frame43 grid-photo-frame ${item.geotag ? "has-grid-geo" : ""}`}><img src={item.photo.url} style={imageFitStyle(item)} alt="" /><GridGeoOverlay item={item} state={state} /></div><div className="grid-caption-row"><div className="grid-caption-text"><div style={{ fontSize: state.preview.fontSize, fontWeight: 900, lineHeight: 1.15 }}>{item.nama || "-"}</div><div style={{ fontSize: Math.max(6, state.preview.fontSize - 1), color: "#52524F", lineHeight: 1.15 }}>{item.item || "-"}</div></div><div className="grid-progress-box"><span className="mono">{item.progress || 0}%</span></div></div></div>;
}

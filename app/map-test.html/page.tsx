"use client";

import { useEffect, useMemo, useState } from "react";

type TileConfig = {
  provider: string;
  tileUrl: string;
  attribution: string;
  maxZoom: number;
};

type GeocodeResult = {
  address: string;
  location: { lat: number; lng: number };
};

const zoom = 15;
const fallback = { lat: -2.5387539, lng: 140.7037389 };

function lonToTileX(lng: number, z: number) {
  return Math.floor(((lng + 180) / 360) * 2 ** z);
}

function latToTileY(lat: number, z: number) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z);
}

function tileUrl(template: string, z: number, x: number, y: number) {
  return template.replace("{z}", String(z)).replace("{x}", String(x)).replace("{y}", String(y));
}

export default function MapTestPage() {
  const [config, setConfig] = useState<TileConfig | null>(null);
  const [query, setQuery] = useState("Jayapura");
  const [center, setCenter] = useState(fallback);
  const [status, setStatus] = useState("Loading map config...");
  const [results, setResults] = useState<GeocodeResult[]>([]);

  useEffect(() => {
    fetch("/api/maps/config")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setStatus("Map config loaded.");
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : "Failed to load map config."));
  }, []);

  async function search() {
    setStatus("Searching Geoapify...");
    const response = await fetch(`/api/maps/geocode?address=${encodeURIComponent(query)}`);
    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.error || "Geocode failed.");
      return;
    }
    const rows = (payload.results || []) as GeocodeResult[];
    setResults(rows);
    if (rows[0]) setCenter(rows[0].location);
    setStatus(rows[0] ? `Found: ${rows[0].address}` : "No result.");
  }

  const tiles = useMemo(() => {
    const x = lonToTileX(center.lng, zoom);
    const y = latToTileY(center.lat, zoom);
    return [-1, 0, 1].flatMap((dy) => [-1, 0, 1].map((dx) => ({ x: x + dx, y: y + dy, dx, dy })));
  }, [center]);

  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f1", padding: 24, fontFamily: "Inter, Arial, sans-serif" }}>
      <section style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "end", marginBottom: 16 }}>
          <div>
            <div style={{ color: "#ff6b1a", fontWeight: 800, letterSpacing: 1, fontSize: 12 }}>MAP TEST</div>
            <h1 style={{ margin: "6px 0", fontSize: 28 }}>Esri World Imagery + Geoapify</h1>
            <p style={{ margin: 0, color: "#666" }}>{status}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void search(); }} style={{ height: 42, width: 240, padding: "0 12px", border: "2px solid #111", borderRadius: 6 }} />
            <button onClick={() => void search()} style={{ height: 42, padding: "0 16px", border: "2px solid #111", borderRadius: 6, background: "#ff6b1a", color: "white", fontWeight: 800, cursor: "pointer" }}>Search</button>
          </div>
        </div>

        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", overflow: "hidden", border: "3px solid #111", borderRadius: 10, background: "#ddd", boxShadow: "8px 8px 0 rgba(0,0,0,.12)" }}>
          {config ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", width: "100%", height: "100%" }}>
              {tiles.map((tile) => <img key={`${tile.x}-${tile.y}`} src={tileUrl(config.tileUrl, zoom, tile.x, tile.y)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />)}
            </div>
          ) : null}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -100%)", width: 22, height: 22, borderRadius: "50% 50% 50% 0", background: "#e8331c", border: "3px solid #fff", rotate: "-45deg", boxShadow: "0 2px 10px rgba(0,0,0,.4)" }} />
          <div style={{ position: "absolute", left: 12, bottom: 12, background: "rgba(255,255,255,.86)", padding: "8px 10px", borderRadius: 6, fontFamily: "monospace", fontWeight: 800 }}>{center.lat.toFixed(6)}, {center.lng.toFixed(6)}</div>
          {config ? <div style={{ position: "absolute", right: 12, bottom: 12, background: "rgba(255,255,255,.86)", padding: "8px 10px", borderRadius: 6, fontSize: 11 }}>{config.attribution}</div> : null}
        </div>

        {results.length ? <div style={{ marginTop: 14, display: "grid", gap: 8 }}>{results.map((row) => <button key={`${row.location.lat}-${row.location.lng}`} onClick={() => setCenter(row.location)} style={{ textAlign: "left", padding: 12, border: "2px solid #111", borderRadius: 6, background: "white", cursor: "pointer" }}><strong>{row.address}</strong><br /><span style={{ fontFamily: "monospace", color: "#666" }}>{row.location.lat}, {row.location.lng}</span></button>)}</div> : null}
      </section>
    </main>
  );
}
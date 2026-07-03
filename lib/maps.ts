import { getGeoapifyApiKey, getMapBudgetEnv, getMapProviderEnv } from "./env";

export type LatLng = {
  lat: number;
  lng: number;
};

export type GeocodeResult = {
  address: string;
  location: LatLng;
  placeId?: string;
  components?: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
};

type GeoapifyRow = {
  formatted?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  place_id?: string;
  lat?: number | string;
  lon?: number | string;
};

type GeoapifyPayload = {
  results?: GeoapifyRow[];
  message?: string;
  error?: string;
};

export function getMapTileConfig() {
  getMapProviderEnv();
  const budget = getMapBudgetEnv();
  const tileCountPerViewport = (budget.tileGridRadius * 2 + 1) ** 2;

  return {
    provider: "esri-world-imagery",
    type: "raster",
    tileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles (C) Esri - Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    maxZoom: budget.maxZoom,
    defaultZoom: budget.defaultZoom,
    tileGridRadius: budget.tileGridRadius,
    estimatedTilesPerViewport: tileCountPerViewport,
    costControl: {
      reverseGeocodeDecimals: budget.reverseGeocodeDecimals,
      geocodePerMinute: budget.geocodePerMinute,
      geocodePerDay: budget.geocodePerDay,
      reverseGeocodeOnDragEndOnly: true,
    },
  } as const;
}

async function callGeoapify(path: "search" | "reverse", params: URLSearchParams): Promise<GeocodeResult[]> {
  const { language } = getMapProviderEnv();
  params.set("apiKey", getGeoapifyApiKey());
  params.set("format", "json");
  params.set("lang", language);

  const response = await fetch(`https://api.geoapify.com/v1/geocode/${path}?${params.toString()}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as GeoapifyPayload;

  if (!response.ok) {
    throw new Error(payload.message || payload.error || "Geoapify geocode request failed.");
  }

  return (payload.results || []).flatMap((row) => {
    const lat = Number(row.lat);
    const lng = Number(row.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];

    return [{
      address: row.formatted || [row.address_line1, row.address_line2].filter(Boolean).join(", "),
      location: { lat, lng },
      placeId: row.place_id,
      components: {
        city: row.city,
        state: row.state,
        country: row.country,
        postcode: row.postcode,
      },
    }];
  });
}

export function geocodeAddress(address: string) {
  const { countryCode } = getMapProviderEnv();
  const params = new URLSearchParams({ text: address, limit: "5" });
  if (countryCode && countryCode !== "none") params.set("filter", `countrycode:${countryCode}`);
  return callGeoapify("search", params);
}

export function reverseGeocode(location: LatLng) {
  const params = new URLSearchParams({
    lat: String(location.lat),
    lon: String(location.lng),
    limit: "1",
  });
  return callGeoapify("reverse", params);
}

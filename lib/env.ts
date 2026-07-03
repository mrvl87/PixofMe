export type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

export type HomepageStorageBuckets = {
  hero: string;
  workflow: string;
  templates: string;
};

export type MapProviderEnv = {
  mapProvider: "esri-world-imagery";
  geocodingProvider: "geoapify";
  language: string;
  countryCode: string;
};

export type MapBudgetEnv = {
  defaultZoom: number;
  maxZoom: number;
  tileGridRadius: number;
  reverseGeocodeDecimals: number;
  geocodePerMinute: number;
  geocodePerDay: number;
};

export function hasSupabasePublicEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && getSupabasePublishableKey(false));
}

export function getSupabasePublishableKey(required = true) {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (required && !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  return key;
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const publishableKey = getSupabasePublishableKey();
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  return { url, publishableKey };
}

export function getSupabaseServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  return key;
}

export function getSupabaseStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || "pixforme-photos";
}

export function getHomepageStorageBuckets(): HomepageStorageBuckets {
  return {
    hero: process.env.SUPABASE_HOMEPAGE_HERO_BUCKET || "pixforme-homepage-hero",
    workflow: process.env.SUPABASE_HOMEPAGE_WORKFLOW_BUCKET || "pixforme-homepage-workflow",
    templates: process.env.SUPABASE_HOMEPAGE_TEMPLATE_BUCKET || "pixforme-homepage-templates",
  };
}

export function getMapProviderEnv(): MapProviderEnv {
  const mapProvider = process.env.NEXT_PUBLIC_MAP_PROVIDER || "esri-world-imagery";
  const geocodingProvider = process.env.NEXT_PUBLIC_GEOCODING_PROVIDER || "geoapify";
  if (mapProvider !== "esri-world-imagery") throw new Error("Unsupported NEXT_PUBLIC_MAP_PROVIDER.");
  if (geocodingProvider !== "geoapify") throw new Error("Unsupported NEXT_PUBLIC_GEOCODING_PROVIDER.");
  return {
    mapProvider,
    geocodingProvider,
    language: process.env.MAPS_DEFAULT_LANGUAGE || "id",
    countryCode: (process.env.MAPS_DEFAULT_COUNTRY_CODE || "id").toLowerCase(),
  };
}

function readNumberEnv(name: string, fallback: number, min: number, max: number) {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function getMapBudgetEnv(): MapBudgetEnv {
  const maxZoom = readNumberEnv("MAPS_MAX_ZOOM", 18, 3, 19);
  return {
    defaultZoom: Math.min(maxZoom, readNumberEnv("MAPS_DEFAULT_ZOOM", 16, 3, 19)),
    maxZoom,
    tileGridRadius: readNumberEnv("MAPS_TILE_GRID_RADIUS", 2, 1, 3),
    reverseGeocodeDecimals: readNumberEnv("MAPS_REVERSE_GEOCODE_DECIMALS", 4, 3, 6),
    geocodePerMinute: readNumberEnv("MAPS_GEOCODE_PER_MINUTE", 30, 1, 500),
    geocodePerDay: readNumberEnv("MAPS_GEOCODE_PER_DAY", 1000, 1, 100000),
  };
}
export function getGeoapifyApiKey() {
  const key = process.env.GEOAPIFY_API_KEY || process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "";
  if (!key) throw new Error("Missing GEOAPIFY_API_KEY.");
  return key;
}

export function isAuthGuardEnabled() {
  return process.env.NEXT_PUBLIC_AUTH_GUARD_ENABLED === "true";
}

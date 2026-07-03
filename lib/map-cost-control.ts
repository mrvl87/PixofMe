import { getMapBudgetEnv } from "./env";
import type { GeocodeResult, LatLng } from "./maps";

export type MapUsageKind = "forward_geocode" | "reverse_geocode";

export type MapBudgetDecision = {
  allowed: boolean;
  reason?: string;
  minuteRemaining: number;
  dailyRemaining: number;
  retryAfterSeconds?: number;
};

type Bucket = {
  minuteWindow: number;
  minuteCount: number;
  dayWindow: string;
  dayCount: number;
};

type CachedReverse = {
  createdAt: number;
  results: GeocodeResult[];
};

const buckets = new Map<string, Bucket>();
const reverseCache = new Map<string, CachedReverse>();
const REVERSE_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function dayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function getMapClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwarded || realIp || "local-dev";
}

export function checkMapBudget(clientKey: string, kind: MapUsageKind): MapBudgetDecision {
  const budget = getMapBudgetEnv();
  const now = Date.now();
  const minuteWindow = Math.floor(now / 60000);
  const today = dayKey();
  const bucketKey = `${clientKey}:${kind}`;
  const bucket = buckets.get(bucketKey) || { minuteWindow, minuteCount: 0, dayWindow: today, dayCount: 0 };

  if (bucket.minuteWindow !== minuteWindow) {
    bucket.minuteWindow = minuteWindow;
    bucket.minuteCount = 0;
  }
  if (bucket.dayWindow !== today) {
    bucket.dayWindow = today;
    bucket.dayCount = 0;
  }

  const minuteRemaining = Math.max(0, budget.geocodePerMinute - bucket.minuteCount);
  const dailyRemaining = Math.max(0, budget.geocodePerDay - bucket.dayCount);
  if (minuteRemaining <= 0) {
    buckets.set(bucketKey, bucket);
    return { allowed: false, reason: "minute_limit", minuteRemaining: 0, dailyRemaining, retryAfterSeconds: 60 - Math.floor((now % 60000) / 1000) };
  }
  if (dailyRemaining <= 0) {
    buckets.set(bucketKey, bucket);
    return { allowed: false, reason: "daily_limit", minuteRemaining, dailyRemaining: 0, retryAfterSeconds: 60 * 60 };
  }

  bucket.minuteCount += 1;
  bucket.dayCount += 1;
  buckets.set(bucketKey, bucket);

  return {
    allowed: true,
    minuteRemaining: Math.max(0, budget.geocodePerMinute - bucket.minuteCount),
    dailyRemaining: Math.max(0, budget.geocodePerDay - bucket.dayCount),
  };
}

export function roundedReverseKey(location: LatLng) {
  const decimals = getMapBudgetEnv().reverseGeocodeDecimals;
  return `${location.lat.toFixed(decimals)},${location.lng.toFixed(decimals)}`;
}

export function getCachedReverseGeocode(location: LatLng) {
  const key = roundedReverseKey(location);
  const cached = reverseCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.createdAt > REVERSE_CACHE_TTL_MS) {
    reverseCache.delete(key);
    return null;
  }
  return cached.results;
}

export function setCachedReverseGeocode(location: LatLng, results: GeocodeResult[]) {
  reverseCache.set(roundedReverseKey(location), { createdAt: Date.now(), results });
}

export function mapBudgetHeaders(decision: Pick<MapBudgetDecision, "minuteRemaining" | "dailyRemaining">, cacheStatus: "hit" | "miss" | "none", kind: MapUsageKind) {
  return {
    "Cache-Control": "no-store",
    "X-Pixforme-Map-Kind": kind,
    "X-Pixforme-Map-Cache": cacheStatus,
    "X-Pixforme-Map-Minute-Remaining": String(decision.minuteRemaining),
    "X-Pixforme-Map-Day-Remaining": String(decision.dailyRemaining),
  };
}
export function mapCachedHeaders(kind: MapUsageKind) {
  return {
    "Cache-Control": "no-store",
    "X-Pixforme-Map-Kind": kind,
    "X-Pixforme-Map-Cache": "hit",
    "X-Pixforme-Map-Minute-Remaining": "cached",
    "X-Pixforme-Map-Day-Remaining": "cached",
  };
}

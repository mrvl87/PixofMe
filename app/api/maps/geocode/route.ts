import { NextResponse } from "next/server";
import { geocodeAddress, reverseGeocode } from "../../../../lib/maps";
import {
  checkMapBudget,
  getCachedReverseGeocode,
  getMapClientKey,
  mapCachedHeaders,
  mapBudgetHeaders,
  setCachedReverseGeocode,
} from "../../../../lib/map-cost-control";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address")?.trim();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const clientKey = getMapClientKey(request);

  try {
    if (address) {
      const budget = checkMapBudget(clientKey, "forward_geocode");
      if (!budget.allowed) {
        return NextResponse.json(
          { error: "Map geocoding limit reached.", reason: budget.reason },
          { status: 429, headers: { ...mapBudgetHeaders(budget, "none", "forward_geocode"), "Retry-After": String(budget.retryAfterSeconds || 60) } },
        );
      }
      const results = await geocodeAddress(address);
      return NextResponse.json({ results }, { headers: mapBudgetHeaders(budget, "none", "forward_geocode") });
    }

    if (lat && lng) {
      const parsedLat = Number(lat);
      const parsedLng = Number(lng);
      if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
        return NextResponse.json({ error: "Invalid lat/lng." }, { status: 400 });
      }

      const location = { lat: parsedLat, lng: parsedLng };
      const cached = getCachedReverseGeocode(location);
      if (cached) {
        return NextResponse.json(
          { results: cached, cache: "hit" },
          { headers: mapCachedHeaders("reverse_geocode") },
        );
      }

      const budget = checkMapBudget(clientKey, "reverse_geocode");
      if (!budget.allowed) {
        return NextResponse.json(
          { error: "Map reverse geocoding limit reached.", reason: budget.reason },
          { status: 429, headers: { ...mapBudgetHeaders(budget, "miss", "reverse_geocode"), "Retry-After": String(budget.retryAfterSeconds || 60) } },
        );
      }

      const results = await reverseGeocode(location);
      setCachedReverseGeocode(location, results);
      return NextResponse.json({ results, cache: "miss" }, { headers: mapBudgetHeaders(budget, "miss", "reverse_geocode") });
    }

    return NextResponse.json({ error: "Provide either ?address=... or ?lat=...&lng=..." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Geocode failed." }, { status: 502 });
  }
}
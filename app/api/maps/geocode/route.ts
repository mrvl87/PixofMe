import { NextResponse } from "next/server";
import { geocodeAddress, reverseGeocode } from "../../../../lib/maps";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address")?.trim();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  try {
    if (address) {
      const results = await geocodeAddress(address);
      return NextResponse.json({ results });
    }

    if (lat && lng) {
      const parsedLat = Number(lat);
      const parsedLng = Number(lng);
      if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
        return NextResponse.json({ error: "Invalid lat/lng." }, { status: 400 });
      }

      const results = await reverseGeocode({ lat: parsedLat, lng: parsedLng });
      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: "Provide either ?address=... or ?lat=...&lng=..." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Geocode failed." }, { status: 502 });
  }
}

import { NextResponse } from "next/server";
import { getMapTileConfig } from "../../../../lib/maps";

export async function GET() {
  return NextResponse.json(getMapTileConfig());
}
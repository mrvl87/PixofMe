import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
  });
}

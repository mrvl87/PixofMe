import { NextResponse } from "next/server";

const OFFER = {
  sku: "ai_starter",
  name: "Pixforme Kredit AI Starter",
  amount: 29000,
};

function createOrderId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function POST(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    return NextResponse.json({ error: "MIDTRANS_SERVER_KEY belum diisi." }, { status: 500 });
  }

  const body = await request.json().catch(() => ({})) as { sku?: string };
  if (body.sku !== OFFER.sku) {
    return NextResponse.json({ error: "SKU tidak dikenal." }, { status: 400 });
  }

  const orderId = createOrderId("PXF-AI");
  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: OFFER.amount,
    },
    item_details: [
      {
        id: OFFER.sku,
        price: OFFER.amount,
        quantity: 1,
        name: OFFER.name,
      },
    ],
    enabled_payments: ["gopay", "qris", "bca_va", "bni_va", "bri_va", "permata_va", "echannel"],
    callbacks: {
      finish: "http://localhost:3000/pricing.html?payment=finish",
    },
  };

  const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
    },
    body: JSON.stringify(payload),
  });

  const transaction = await response.json().catch(() => ({})) as { token?: string; redirect_url?: string; error_messages?: string[] };
  if (!response.ok || !transaction.token) {
    return NextResponse.json(
      { error: transaction.error_messages?.join(", ") || "Gagal membuat Snap token." },
      { status: response.status || 502 },
    );
  }

  return NextResponse.json({
    orderId,
    amount: OFFER.amount,
    token: transaction.token,
    redirectUrl: transaction.redirect_url,
  });
}

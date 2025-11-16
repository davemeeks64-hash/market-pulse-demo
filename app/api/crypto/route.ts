// app/api/crypto/route.ts

import { NextResponse } from "next/server";

/**
 * This API returns simple demo crypto data for MicroTrade 5.0.
 * No JSX allowed here — ONLY server-side JSON.
 */

export async function GET() {
  // Same demo crypto data used in the UI
  const demoCryptos = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 64320,
      changePct: 2.4,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 3420,
      changePct: 1.2,
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: 188.5,
      changePct: 5.7,
    },
    {
      symbol: "DOGE",
      name: "Dogecoin",
      price: 0.18,
      changePct: -3.4,
    },
    {
      symbol: "XRP",
      name: "XRP",
      price: 0.62,
      changePct: 0.9,
    },
    {
      symbol: "ADA",
      name: "Cardano",
      price: 0.52,
      changePct: -1.1,
    },
  ];

  return NextResponse.json({
    ok: true,
    updated: new Date().toISOString(),
    assets: demoCryptos,
  });
}

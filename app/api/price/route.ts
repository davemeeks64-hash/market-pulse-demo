import { NextResponse } from "next/server";

const API_KEY = "KGJY3SPL0MCPEP3A";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        { error: "No symbol provided." }, 
        { status: 400 }
      );
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Alpha Vantage request failed." },
        { status: res.status }
      );
    }

    const data = await res.json();
    const price = Number(data?.["Global Quote"]?.["05. price"]);

    if (!price) {
      return NextResponse.json(
        { error: "Symbol not found or no data returned." },
        { status: 404 }
      );
    }

    return NextResponse.json({ price });
  } catch (error) {
    return NextResponse.json(
      { error: "Server Error fetching price." }, 
      { status: 500 }
    );
  }
}

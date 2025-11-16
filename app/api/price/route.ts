import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol")?.toUpperCase() || "AAPL";

  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Missing AlphaVantage API key on server" },
      { status: 500 }
    );
  }

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch price data" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // AlphaVantage rate limit handler
    if (data.Note) {
      return NextResponse.json(
        { error: "API rate limit reached. Try again shortly." },
        { status: 429 }
      );
    }

    const quote = data["Global Quote"];
    if (!quote) {
      return NextResponse.json(
        { error: "Invalid symbol or no data available." },
        { status: 400 }
      );
    }

    const price = parseFloat(quote["05. price"] || "0");
    const change = parseFloat(quote["09. change"] || "0");
    const changePercent = parseFloat(
      (quote["10. change percent"] || "0%").replace("%", "")
    );

    return NextResponse.json({
      symbol,
      price,
      change,
      changePercent,
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}

"use client";

import { useEffect, useMemo, useState } from "react";
import MarketPulse from "@/components/MarketPulse";
import { LineChart, Line, ResponsiveContainer } from "recharts";

type Sentiment = "hot" | "watch" | "steady";

type CategoryId =
  | "favorites"
  | "hot"
  | "gainers"
  | "losers"
  | "watching"
  | "microcaps";

interface StockCardData {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  sparkline: number[];
  sentiment: Sentiment;
  sector: string;
  tags: string[];
  marketCapLabel: string; // just for display ("Mega", "Large", "Mid", etc.)
}

// -----------------------------
// DEMO STOCK DATA (local only)
// -----------------------------
const demoStocks: StockCardData[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 227.48,
    changePct: 0.96,
    sparkline: [220, 221, 223, 225, 227, 226.5, 227.48],
    sentiment: "hot",
    sector: "Technology",
    tags: ["mega-cap", "devices", "ecosystem"],
    marketCapLabel: "Mega",
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 248.91,
    changePct: -1.2,
    sparkline: [255, 253, 252, 250, 249, 248.91],
    sentiment: "watch",
    sector: "EV",
    tags: ["ev", "growth", "volatile"],
    marketCapLabel: "Large",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 982.34,
    changePct: 2.4,
    sparkline: [930, 945, 955, 970, 982.34],
    sentiment: "hot",
    sector: "Semiconductors",
    tags: ["ai", "chips", "momentum"],
    marketCapLabel: "Mega",
  },
  {
    symbol: "SOFI",
    name: "SoFi Technologies",
    price: 7.12,
    changePct: -0.8,
    sparkline: [7.4, 7.3, 7.2, 7.15, 7.12],
    sentiment: "watch",
    sector: "Fintech",
    tags: ["fintech", "micro-trade friendly"],
    marketCapLabel: "Mid",
  },
  {
    symbol: "PLTR",
    name: "Palantir Technologies",
    price: 24.88,
    changePct: 3.1,
    sparkline: [22.8, 23.2, 23.9, 24.3, 24.88],
    sentiment: "hot",
    sector: "AI",
    tags: ["ai", "software", "gov"],
    marketCapLabel: "Large",
  },
  {
    symbol: "RIOT",
    name: "Riot Platforms",
    price: 9.45,
    changePct: -4.2,
    sparkline: [10.5, 10.1, 9.9, 9.7, 9.45],
    sentiment: "steady",
    sector: "Crypto",
    tags: ["mining", "crypto", "high-vol"],
    marketCapLabel: "Small",
  },
  {
    symbol: "NIO",
    name: "NIO Inc.",
    price: 4.32,
    changePct: 1.9,
    sparkline: [4.0, 4.05, 4.1, 4.2, 4.32],
    sentiment: "watch",
    sector: "EV",
    tags: ["ev", "china", "speculative"],
    marketCapLabel: "Mid",
  },
  {
    symbol: "MARA",
    name: "Marathon Digital",
    price: 18.73,
    changePct: 5.2,
    sparkline: [16.5, 17.1, 17.9, 18.4, 18.73],
    sentiment: "hot",
    sector: "Crypto",
    tags: ["mining", "crypto", "momentum"],
    marketCapLabel: "Mid",
  },
];

// -----------------------------
// LITTLE HELPERS
// -----------------------------
const categoryConfig: { id: CategoryId; label: string }[] = [
  { id: "favorites", label: "⭐ Favorites" },
  { id: "hot", label: "🔥 Hot" },
  { id: "gainers", label: "📈 Gainers" },
  { id: "losers", label: "📉 Losers" },
  { id: "watching", label: "👀 Watching" },
  { id: "microcaps", label: "🧬 MicroCaps" },
];

const sentimentColors: Record<Sentiment, string> = {
  hot: "bg-red-500/20 text-red-300 border-red-400/40",
  watch: "bg-yellow-500/20 text-yellow-200 border-yellow-400/40",
  steady: "bg-blue-500/20 text-blue-200 border-blue-400/40",
};

// -----------------------------
// MAIN PAGE
// -----------------------------
export default function ResearchPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("hot");
  const [searchQuery, setSearchQuery] = useState("");
    const [selectedStock, setSelectedStock] = useState<StockCardData | null>(null);
const [favorites, setFavorites] = useState<string[]>([]);
const [watching, setWatching] = useState<string[]>([]);

// Load from storage on first render
useEffect(() => {
  if (typeof window === "undefined") return;

  try {
    const f = localStorage.getItem("microtrade_favorites_v1");
    const w = localStorage.getItem("microtrade_watchlist_v1");
    if (f) setFavorites(JSON.parse(f));
    if (w) setWatching(JSON.parse(w));
  } catch {
    // ignore parse errors
  }
}, []);

// Save whenever favorites change
useEffect(() => {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    "microtrade_favorites_v1",
    JSON.stringify(favorites)
  );
}, [favorites]);

// Save whenever watchlist changes
useEffect(() => {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    "microtrade_watchlist_v1",
    JSON.stringify(watching)
  );
}, [watching]);

  // -----------------------------
  // FILTER / CATEGORY LOGIC
  // -----------------------------
  const filteredByCategory = useMemo(() => {
    let stocks = [...demoStocks];

    switch (activeCategory) {
      case "favorites":
        stocks = stocks.filter((s) => favorites.includes(s.symbol));
        break;
      case "hot":
        stocks = stocks.filter((s) => s.sentiment === "hot");
        break;
      case "gainers":
        stocks = stocks.filter((s) => s.changePct > 0);
        break;
      case "losers":
        stocks = stocks.filter((s) => s.changePct < 0);
        break;
      case "watching":
        stocks = stocks.filter((s) => watching.includes(s.symbol));
        break;
      case "microcaps":
        stocks = stocks.filter((s) => s.price < 15);
        break;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      stocks = stocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q)
      );
    }

    return stocks;
  }, [activeCategory, favorites, watching, searchQuery]);

  // -----------------------------
  // “AI” DISCOVERY – KEYWORDS
  // -----------------------------
  const trendingKeywords = useMemo(() => {
    // Simple fake-AI: pull top tags from hot + watching stocks
    const tagCounts: Record<string, number> = {};
    const relevant = demoStocks.filter(
      (s) => s.sentiment === "hot" || watching.includes(s.symbol)
    );
    relevant.forEach((s) => {
      s.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 4).map(([tag]) => tag);
  }, [watching]);

  // -----------------------------
  // “AI” RECOMMENDED FOR YOU
  // -----------------------------
  const recommendedForYou = useMemo(() => {
    if (watching.length === 0 && favorites.length === 0) return [];

    const focusSymbols = [...new Set([...watching, ...favorites])];
    const focusStocks = demoStocks.filter((s) =>
      focusSymbols.includes(s.symbol)
    );
    if (!focusStocks.length) return [];

    // Pick the most common sector in what you're watching
    const sectorCount: Record<string, number> = {};
    focusStocks.forEach((s) => {
      sectorCount[s.sector] = (sectorCount[s.sector] || 0) + 1;
    });

    const topSector = Object.entries(sectorCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    if (!topSector) return [];

    // Suggest other stocks in that sector that are NOT already watched/fav'd
    const held = new Set(focusSymbols);
    return demoStocks
      .filter((s) => s.sector === topSector && !held.has(s.symbol))
      .slice(0, 3);
  }, [favorites, watching]);

  // -----------------------------
  // WATCHLIST TOGGLES
  // -----------------------------
  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const toggleWatching = (symbol: string) => {
    setWatching((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // -----------------------------
  // SMALL SPARKLINE COMPONENT
  // -----------------------------
  const Sparkline = ({ data }: { data: number[] }) => {
    const points = data.map((v, idx) => ({ idx, value: v }));
    if (!points.length) return null;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#60A5FA"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#050814] to-blue-600 text-white p-4">
      <section className="max-w-6xl mx-auto space-y-4">
        {/* HEADER */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Research</h1>
            <p className="text-sm text-gray-300">
              Scan the market, track your watchlist, and let MicroTrade surface
              ideas — no noise, just signal.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-2 sm:mt-0 w-full sm:w-64">
            <label className="text-xs text-gray-400">Search symbols or names</label>
            <input
              type="text"
              placeholder="AAPL, AI, EV, Fintech…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 text-white rounded-xl p-2.5 border border-white/20 mt-1 focus:border-blue-400 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* AI DISCOVERY STRIP */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-wrap gap-2 items-center text-xs">
          <span className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-100 font-semibold">
            AI Discovery
          </span>
          <span className="text-gray-300">Trending themes based on what traders watch:</span>
          {trendingKeywords.map((kw) => (
            <span
              key={kw}
              className="px-2 py-1 rounded-full bg-white/5 border border-white/20 text-gray-100"
            >
              #{kw}
            </span>
          ))}
          {trendingKeywords.length === 0 && (
            <span className="text-gray-500">
              Start adding symbols to your watchlist to see smart themes here.
            </span>
          )}
        </div>

        {/* LAYOUT: LEFT = WATCHLIST / CARDS, RIGHT = PULSE / RECS */}
        <div className="grid gap-4 lg:grid-cols-[2.1fr,1.2fr]">
          {/* LEFT SIDE */}
          <div className="space-y-4">
            {/* CATEGORY BAR (glassy, like Dashboard tabs) */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-2xl flex gap-3 overflow-x-auto whitespace-nowrap">
              {categoryConfig.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition border ${
                    activeCategory === cat.id
                      ? "bg-blue-600 border-blue-300 text-white shadow-[0_0_15px_rgba(59,130,246,0.7)]"
                      : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* STOCK CARDS GRID */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm sm:text-base font-semibold">
                  {categoryConfig.find((c) => c.id === activeCategory)?.label}{" "}
                  <span className="text-xs text-gray-400">• Watchlist view</span>
                </h2>
                <p className="text-[11px] text-gray-500">
                  Tap a card for deeper research.
                </p>
              </div>

              {filteredByCategory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredByCategory.map((stock) => {
                    const isFav = favorites.includes(stock.symbol);
                    const isWatch = watching.includes(stock.symbol);
                    const isUp = stock.changePct >= 0;

                    return (
                     <button
  key={stock.symbol}
  onClick={() => setSelectedStock(stock)}
  className="text-left bg-black/40 border border-white/10 rounded-2xl p-3 hover:border-blue-400/70 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition flex flex-col gap-2"
>
  {/* Top row: symbol + fav/watch */}
  <div className="flex items-start justify-between gap-2">

    {/* Symbol + name */}
    <div>
      <p className="text-sm font-semibold">{stock.symbol}</p>
      <p className="text-[11px] text-gray-400">{stock.name}</p>
    </div>

    {/* Favorite + Watch */}
    <div className="flex flex-col items-end gap-1">

      {/* Favorite */}
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(stock.symbol);
        }}
        className="cursor-pointer text-xs px-2 py-0.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
      >
        {isFav ? "★ Fav" : "☆ Fav"}
      </div>

      {/* Watching */}
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          toggleWatching(stock.symbol);
        }}
        className="cursor-pointer text-[11px] px-2 py-0.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-gray-200"
      >
        {isWatch ? "👀 Watching" : "＋ Watch"}
      </div>

    </div>
  </div>

  {/* Price + change */}
  <div className="flex items-end justify-between mt-2">
    <div>
      <p className="text-lg font-bold">${stock.price.toFixed(2)}</p>
      <p className={`text-xs ${isUp ? "text-green-400" : "text-red-400"}`}>
        {isUp ? "+" : ""}
        {stock.changePct.toFixed(2)}%
      </p>
    </div>
                          {/* Sentiment pill */}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              sentimentColors[stock.sentiment]
                            }`}
                          >
                            {stock.sentiment.toUpperCase()}
                          </span>
                        </div>

                        {/* Sparkline */}
                        <div className="h-10 mt-1">
                          <Sparkline data={stock.sparkline} />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                            {stock.sector}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                            {stock.marketCapLabel}-cap
                          </span>
                          {stock.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-gray-400">
                  <p>No stocks match this view yet.</p>
                  <p className="text-[11px] mt-1">
                    Try a different category or search term — or add favorites / watch
                    from the cards.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Market Pulse + Recommended */}
          <div className="space-y-4">
            {/* Market Pulse Block */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h2 className="text-lg font-semibold mb-2">Market Pulse</h2>
              <p className="text-xs text-gray-400 mb-2">
                Quick look at broader activity — complements your watchlist.
              </p>
              <MarketPulse />
            </div>

            {/* Recommended for You (AI-ish) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Recommended for You</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-100 border border-blue-400/40">
                  AI-inspired • Demo
                </span>
              </div>
              {recommendedForYou.length > 0 ? (
                <div className="space-y-2">
                  {recommendedForYou.map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => setSelectedStock(s)}
                      className="w-full text-left bg-black/40 border border-white/10 rounded-xl p-2.5 hover:border-blue-400/70 transition flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-sm font-semibold">{s.symbol}</p>
                        <p className="text-[11px] text-gray-400">{s.name}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Because you watch{" "}
                          <span className="font-semibold">{s.sector}</span> names.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          ${s.price.toFixed(2)}
                        </p>
                        <p
                          className={`text-[11px] ${
                            s.changePct >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {s.changePct >= 0 ? "+" : ""}
                          {s.changePct.toFixed(2)}%
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  Start adding stocks to your watchlist and favorites — we’ll surface
                  look-alikes and sector cousins here.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* STOCK RESEARCH MODAL */}
        {selectedStock && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70"
            onClick={() => setSelectedStock(null)}
          >
            <div
              className="bg-[#050814] border border-white/20 rounded-2xl p-4 sm:p-5 w-full max-w-lg mx-3 mb-6 sm:mb-0 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm text-gray-400">Research Snapshot</p>
                  <h3 className="text-xl font-bold">
                    {selectedStock.symbol}{" "}
                    <span className="text-sm text-gray-300">
                      • {selectedStock.name}
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedStock(null)}
                  className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20"
                >
                  Close
                </button>
              </div>

              {/* Price & movement */}
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold">
                    ${selectedStock.price.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs ${
                      selectedStock.changePct >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {selectedStock.changePct >= 0 ? "+" : ""}
                    {selectedStock.changePct.toFixed(2)}% today
                  </p>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full border ${
                    sentimentColors[selectedStock.sentiment]
                  }`}
                >
                  {selectedStock.sentiment.toUpperCase()}
                </span>
              </div>

              {/* Mini chart */}
              <div className="h-28 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={selectedStock.sparkline.map((v, idx) => ({
                      idx,
                      value: v,
                    }))}
                  >
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#93C5FD"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* AI-ish summary */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-blue-200 mb-1">
                  MicroTrade Research Note (Demo)
                </p>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {selectedStock.symbol} sits in the{" "}
                  <span className="font-semibold">
                    {selectedStock.sector}
                  </span>{" "}
                  space and currently trades around{" "}
                  <span className="font-semibold">
                    ${selectedStock.price.toFixed(2)}
                  </span>
                  . Recent action has been{" "}
                  <span className="font-semibold">
                    {selectedStock.changePct >= 0 ? "positive" : "choppy"}
                  </span>
                  , with a{" "}
                  <span className="font-semibold">
                    {selectedStock.changePct.toFixed(2)}%
                  </span>{" "}
                  move on the session. For micro-traders, this name fits the{" "}
                  <span className="font-semibold">
                    {selectedStock.marketCapLabel.toLowerCase()}-cap
                  </span>{" "}
                  profile and aligns with themes like{" "}
                  {selectedStock.tags.slice(0, 2).join(", ")}.
                  <br />
                  <br />
                  Remember: this is{" "}
                  <span className="font-semibold">educational only</span> — use this
                  page to explore, compare, and build your own plan before placing
                  any simulated orders.
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-200 border border-white/15">
                  Sector: {selectedStock.sector}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-200 border border-white/15">
                  {selectedStock.marketCapLabel}-cap
                </span>
                {selectedStock.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-200 border border-white/15"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <p className="text-[11px] text-gray-500 border-t border-white/10 pt-2">
                MicroTrade 5.0 — Research is simulated and for learning only. No
                real orders are routed from this screen.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

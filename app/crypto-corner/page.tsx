"use client";

import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useTrades } from "@/context/TradeContext";

type TradeType = "buy" | "sell";
type CryptoTab = "overview" | "watchlist" | "movers" | "news";

interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  sparkline: number[];
  tags: string[];
  category: string;
}

const FEE = 0.1;

// ------------------------------
// DEMO CRYPTO DATA
// ------------------------------
const demoCryptos: CryptoAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 64320,
    changePct: 2.4,
    sparkline: [62000, 62500, 63000, 63500, 64000, 64320],
    tags: ["store-of-value", "macro", "blue-chip"],
    category: "Layer 0",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 3420,
    changePct: 1.2,
    sparkline: [3300, 3340, 3360, 3390, 3420],
    tags: ["smart-contracts", "defi", "blue-chip"],
    category: "Layer 1",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 188.5,
    changePct: 5.7,
    sparkline: [170, 175, 178, 183, 188.5],
    tags: ["high-throughput", "defi", "nft"],
    category: "Layer 1",
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.18,
    changePct: -3.4,
    sparkline: [0.19, 0.195, 0.19, 0.185, 0.18],
    tags: ["meme", "elon", "high-vol"],
    category: "Meme",
  },
  {
    symbol: "XRP",
    name: "XRP",
    price: 0.62,
    changePct: 0.9,
    sparkline: [0.6, 0.605, 0.61, 0.62],
    tags: ["payments", "altcoin"],
    category: "Payments",
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: 0.52,
    changePct: -1.1,
    sparkline: [0.54, 0.53, 0.525, 0.52],
    tags: ["layer-1", "research-heavy"],
    category: "Layer 1",
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    price: 88.4,
    changePct: 0.3,
    sparkline: [86, 87, 87.5, 88.4],
    tags: ["payments", "legacy"],
    category: "Payments",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    price: 19.2,
    changePct: 4.1,
    sparkline: [17, 17.8, 18.5, 19.2],
    tags: ["oracle", "defi"],
    category: "Infrastructure",
  },
];

// ------------------------------
// SMART ENTRY ASSISTANT
// ------------------------------
const SmartEntryAssistantCrypto = ({
  symbol,
  dollars,
  tradeType,
}: {
  symbol: string;
  dollars: number;
  tradeType: TradeType;
}) => {
  if (!symbol || !dollars || dollars <= 0) return null;

  const sizeLabel =
    dollars < 25 ? "micro-sized" : dollars < 100 ? "small" : "larger for a microtrade";

  const riskHint =
    dollars < 25
      ? "Light risk — nice for testing the waters in crypto."
      : dollars < 100
      ? "Comfortable size for most microtraders."
      : "High for a microtrade — consider scaling in instead of all at once.";

  const directionText =
    tradeType === "buy"
      ? `You’re looking to BUY ${symbol}.`
      : `You’re looking to SELL ${symbol}.`;

  return (
    <div className="mt-3 rounded-2xl border border-white/15 bg-white/5 p-3 text-xs text-gray-200">
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-white">Smart Entry Assistant — Crypto</p>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-300">
          Beta • Educational Only
        </span>
      </div>
      <p className="mb-1">
        {directionText} A trade of <strong>${dollars.toFixed(2)}</strong> is considered{" "}
        <strong>{sizeLabel}</strong>.
      </p>
      <p className="mb-1">{riskHint}</p>
      <p className="text-[11px] text-gray-400 mt-2 border-t border-white/10 pt-2">
        Disclaimer: This is for learning and planning only.
      </p>
    </div>
  );
};

// ------------------------------
// MAIN CRYPTO CORNER PAGE
// ------------------------------
export default function CryptoCornerPage() {
  const { addTrade } = useTrades();

  const [activeTab, setActiveTab] = useState<CryptoTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [amountDollars, setAmountDollars] = useState("25");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);

  // Persist watchlist
  useEffect(() => {
    const saved = localStorage.getItem("microtrade_crypto_watchlist");
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("microtrade_crypto_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const allAssets = demoCryptos;

  const currentAsset =
    allAssets.find((c) => c.symbol === selectedSymbol) ?? allAssets[0];

  const amountNumber = parseFloat(amountDollars || "0");
  const effectivePrice = currentAsset.price;
  const quantity =
    effectivePrice > 0 ? amountNumber / effectivePrice : 0;
  const tradeDollars = amountNumber > 0 ? amountNumber : 0;
  const previewTotal = tradeDollars + FEE;

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const filteredAssets = useMemo(() => {
    let list = [...allAssets];

    if (activeTab === "watchlist") {
      list = list.filter((c) => watchlist.includes(c.symbol));
    } else if (activeTab === "movers") {
      list = list.sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.symbol.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTab, watchlist, searchQuery]);

  const Sparkline = ({ data }: { data: number[] }) => {
    const points = data.map((v, idx) => ({ idx, value: v }));
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const handleOpenConfirm = () => {
    setError("");
    if (!selectedSymbol) return setError("Choose a crypto to trade.");
    if (amountNumber <= 0) return setError("Enter a valid dollar amount.");

    setShowConfirm(true);
  };

  const handleConfirmTrade = () => {
    if (!currentAsset || quantity <= 0) {
      setShowConfirm(false);
      return;
    }

    setLoading(true);
    try {
      addTrade({
        symbol: currentAsset.symbol + "-USD",
        quantity,
        dollars: tradeDollars,
        price: effectivePrice,
        fee: FEE,
        orderType: "market",
        type: tradeType,
        timestamp: new Date().toLocaleString(),
        status: "filled",
      });

      setAmountDollars("25");
      setError("");
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const demoNews = [
    {
      id: 1,
      title: "Bitcoin holds above key level as micro-traders scale in",
      tag: "BTC",
      tone: "neutral",
    },
    {
      id: 2,
      title: "Layer 1 rotation continues: SOL, ETH see increased retail flows",
      tag: "SOL",
      tone: "bullish",
    },
    {
      id: 3,
      title: "Meme coins stay volatile — position sizing remains critical",
      tag: "Meme",
      tone: "caution",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "watchlist", label: "Watchlist" },
    { id: "movers", label: "Movers" },
    { id: "news", label: "News" },
  ] as const;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#050814] to-blue-600 text-white p-4">
      <section className="max-w-6xl mx-auto space-y-4">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Crypto Corner</h1>
            <p className="text-sm text-gray-300">
              Everything crypto — micro trades, watchlists, and clean signals.
            </p>
          </div>

          <div className="mt-2 sm:mt-0 w-full sm:w-72">
            <label className="text-xs text-gray-400">Search coins or categories</label>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="BTC, ETH, L1, meme…"
              className="w-full bg-white/10 text-white rounded-xl p-2.5 border border-white/20 mt-1 text-sm"
            />
          </div>
        </div>

        {/* TABS */}
        <div className="bg-black/40 border border-white/10 px-3 py-2 rounded-2xl flex gap-3 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                activeTab === t.id
                  ? "bg-blue-600 border-blue-300 text-white shadow"
                  : "bg-white/5 border-white/10 text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr,1.25fr]">

          {/* LEFT SIDE GRID */}
          <div className="space-y-4">
            {activeTab !== "news" ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">

                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold">
                    {activeTab === "overview" && "Top Crypto Watchlist"}
                    {activeTab === "watchlist" && "Your Crypto Watchlist"}
                    {activeTab === "movers" && "Biggest Movers"}
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Tap a card • Toggle watchlist
                  </p>
                </div>

                {filteredAssets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredAssets.map((asset) => {
                      const isWatch = watchlist.includes(asset.symbol);
                      const isUp = asset.changePct >= 0;

                      const accent =
                        asset.symbol === "BTC"
                          ? "from-orange-500 to-yellow-400"
                          : asset.symbol === "ETH"
                          ? "from-blue-500 to-indigo-400"
                          : asset.symbol === "SOL"
                          ? "from-purple-500 to-teal-400"
                          : asset.symbol === "DOGE"
                          ? "from-yellow-400 to-amber-500"
                          : "from-sky-500 to-blue-400";

                      return (
                        <button
                          key={asset.symbol}
                          onClick={() => setSelectedAsset(asset)}
                          className="text-left bg-black/40 border border-white/10 rounded-2xl p-3 hover:border-blue-400/70 hover:shadow transition flex flex-col gap-2"
                        >
                          {/* ROW 1 */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold flex items-center gap-1">
                                {asset.symbol}
                                <span
                                  className={`inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r ${accent}`}
                                ></span>
                              </p>
                              <p className="text-[11px] text-gray-400">{asset.name}</p>
                            </div>

                            {/* FIXED WATCHLIST BUTTON (no nested <button>) */}
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWatchlist(asset.symbol);
                              }}
                              className={`cursor-pointer text-[11px] px-2 py-0.5 rounded-full border ${
                                isWatch
                                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                                  : "border-white/15 bg-white/5 text-gray-200 hover:bg-white/10"
                              }`}
                            >
                              {isWatch ? "👁 Watching" : "＋ Watch"}
                            </div>
                          </div>

                          {/* ROW 2 */}
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-lg font-bold">
                                ${asset.price.toLocaleString()}
                              </p>
                              <p
                                className={`text-xs ${
                                  isUp ? "text-green-400" : "text-red-400"
                                }`}
                              >
                                {isUp ? "+" : ""}
                                {asset.changePct.toFixed(2)}%
                              </p>
                            </div>
                            <div className="text-right text-[11px] text-gray-400">
                              <p>{asset.category}</p>
                              <p>MicroTrade demo</p>
                            </div>
                          </div>

                          {/* Sparkline */}
                          <div className="h-10 mt-1">
                            <Sparkline data={asset.sparkline} />
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {asset.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-200 border border-white/10"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-400 py-10">
                    No coins match this view yet.
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Crypto Corner News (Demo)</h2>
                    <p className="text-xs text-gray-400">Educational layout</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-100 border border-blue-400/40">
                    Live feed soon
                  </span>
                </div>

                {demoNews.map((n) => (
                  <div
                    key={n.id}
                    className="bg-black/40 border border-white/10 rounded-xl p-3"
                  >
                    <p className="text-sm font-semibold">{n.title}</p>
                    <div className="flex items-center justify-between text-[11px] mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-200">
                        #{n.tag}
                      </span>
                      <span className="text-gray-400">Tone: {n.tone}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">

            {/* QUICK TRADE */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <h2 className="text-lg font-semibold">Quick Crypto Trade</h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-400">Crypto</label>
                  <select
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="w-full bg-white/10 text-white rounded-xl p-2.5 border border-white/20 mt-1 text-sm"
                  >
                    {allAssets.map((a) => (
                      <option key={a.symbol} value={a.symbol}>
                        {a.symbol} — {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2">
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="text-lg font-semibold">
                    ${currentAsset.price.toLocaleString()}
                  </p>
                  <p
                    className={`text-[11px] ${
                      currentAsset.changePct >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {currentAsset.changePct >= 0 ? "+" : ""}
                    {currentAsset.changePct.toFixed(2)}% today
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Amount (USD)</label>
                <input
                  type="number"
                  value={amountDollars}
                  onChange={(e) => setAmountDollars(e.target.value)}
                  className="w-full bg-white/10 text-white rounded-xl p-3 border border-white/20 mt-1"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Great for micro-sizing — $5, $10, $25 positions.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                <p className="text-xs text-gray-400">Est. size</p>
                <p className="text-lg font-semibold">
                  {quantity > 0 ? quantity.toFixed(6) : "—"}
                </p>
              </div>

              <SmartEntryAssistantCrypto
                symbol={currentAsset.symbol}
                dollars={tradeDollars}
                tradeType={tradeType}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setTradeType("buy")}
                  className={`flex-1 py-2 rounded-xl border ${
                    tradeType === "buy"
                      ? "bg-green-500/30 border-green-300"
                      : "bg-white/10 border-white/20"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType("sell")}
                  className={`flex-1 py-2 rounded-xl border ${
                    tradeType === "sell"
                      ? "bg-red-500/30 border-red-300"
                      : "bg-white/10 border-white/20"
                  }`}
                >
                  Sell
                </button>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-[11px] text-gray-500">
                  Educational only — no real execution.
                </p>
                <button
                  onClick={handleOpenConfirm}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm"
                >
                  Review Order
                </button>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            {/* SNAPSHOT */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <h2 className="text-lg font-semibold">Crypto Snapshot</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-black/40 border border-white/10 rounded-xl p-2">
                  <p className="text-[11px] text-gray-400">Coins watched</p>
                  <p className="text-lg font-semibold">
                    {watchlist.length}/{allAssets.length}
                  </p>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl p-2">
                  <p className="text-[11px] text-gray-400">Up / Down</p>
                  <p className="text-lg font-semibold">
                    {allAssets.filter((c) => c.changePct >= 0).length} ↑ /{" "}
                    {allAssets.filter((c) => c.changePct < 0).length} ↓
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 border-t border-white/10 pt-2">
                Demo data for layout and UX demonstration.
              </p>
            </div>
          </div>
        </div>

        {/* CONFIRMATION MODAL */}
        {showConfirm && quantity > 0 && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60">
            <div className="bg-[#050814] border border-white/20 rounded-2xl p-4 w-full max-w-md mx-4 shadow">
              <h3 className="text-lg font-semibold mb-2">Confirm Crypto Order</h3>
              <p className="text-sm text-gray-300 mb-3">
                {tradeType.toUpperCase()} {quantity.toFixed(6)} {currentAsset.symbol}-USD
                for ${tradeDollars.toFixed(2)}
              </p>

              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-sm space-y-1 mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Side</span>
                  <span className="font-semibold">{tradeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price</span>
                  <span className="font-semibold">
                    ${effectivePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size</span>
                  <span className="font-semibold">
                    {quantity.toFixed(6)} {currentAsset.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Notional</span>
                  <span className="font-semibold">${tradeDollars.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span className="font-semibold">${FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total</span>
                  <span className="font-semibold">${previewTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmTrade}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ASSET DETAILS */}
        {selectedAsset && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70"
            onClick={() => setSelectedAsset(null)}
          >
            <div
              className="bg-[#050814] border border-white/20 rounded-2xl p-5 w-full max-w-lg mx-3 shadow"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">Crypto Snapshot</p>
                  <h3 className="text-xl font-bold">
                    {selectedAsset.symbol}
                    <span className="text-sm text-gray-300"> • {selectedAsset.name}</span>
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20"
                >
                  Close
                </button>
              </div>

              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold">
                    ${selectedAsset.price.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs ${
                      selectedAsset.changePct >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {selectedAsset.changePct >= 0 ? "+" : ""}
                    {selectedAsset.changePct.toFixed(2)}% today
                  </p>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/15">
                  {selectedAsset.category}
                </span>
              </div>

              <div className="h-28 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={selectedAsset.sparkline.map((v, idx) => ({
                      idx,
                      value: v,
                    }))}
                  >
                    <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs text-gray-200 mb-3">
                {selectedAsset.symbol} lives in the{" "}
                <strong>{selectedAsset.category}</strong> corner of crypto. It currently trades at{" "}
                <strong>${selectedAsset.price.toLocaleString()}</strong> with a{" "}
                <strong>{selectedAsset.changePct.toFixed(2)}%</strong>{" "}
                {selectedAsset.changePct >= 0 ? "gain" : "loss"} today.
              </p>

              <div className="flex flex-wrap gap-1">
                {selectedAsset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/15"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <p className="text-[11px] text-gray-500 border-t border-white/10 pt-2 mt-3">
                Educational only — no live market data.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

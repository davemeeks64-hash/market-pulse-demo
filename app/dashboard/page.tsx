"use client";

import { useEffect, useState } from "react";
import { useTrades } from "@/context/TradeContext";
import MarketPulse from "@/components/MarketPulse";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import CoachButton from "@/components/CoachButton";
import CoachModal from "@/components/CoachModal";

type TradeType = "buy" | "sell";

interface SmartEntryAssistantProps {
  symbol: string;
  shares: number;
  tradeType: TradeType;
}

const SmartEntryAssistant: React.FC<SmartEntryAssistantProps> = ({
  symbol,
  shares,
  tradeType,
}) => {
  if (!symbol || !shares || shares <= 0) return null;

  const sizeLabel =
    shares < 1 ? "micro-sized" : shares < 5 ? "small" : "larger for a microtrade";

  const riskHint =
    shares < 1
      ? "Light risk — good for testing the waters."
      : shares < 5
      ? "Comfortable size for most microtraders."
      : "High for a microtrade — double-check your risk comfort.";

  const directionText =
    tradeType === "buy"
      ? `You’re looking to BUY ${symbol}.`
      : `You’re looking to SELL ${symbol}.`;

  return (
    <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-gray-200">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-white">Smart Entry Assistant</p>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-300">
          Beta • Educational Only
        </span>
      </div>

      <p className="mb-1">
        {directionText} A trade of{" "}
        <span className="font-semibold">
          {shares.toFixed(3)} share{shares === 1 ? "" : "s"}
        </span>{" "}
        is considered <span className="font-semibold">{sizeLabel}</span>.
      </p>

      <p className="mb-1">{riskHint}</p>

      <p className="text-xs text-gray-400 mt-2 border-t border-white/10 pt-2">
        Educational Only — Not Financial Advice
      </p>
    </div>
  );
};

/* ---------------------------------------------
   Types
--------------------------------------------- */

interface Holding {
  symbol: string;
  shares: number;
  avg: number;
  live: number;
  pl: number;
}

interface HistoryPoint {
  day: number;
  equity: number;
}

const FEE = 0.25;

/* ---------------------------------------------
   PAGE
--------------------------------------------- */

export default function DashboardPage() {
  const { trades, addTrade } = useTrades();

  const [activeTab, setActiveTab] = useState<
    "overview" | "holdings" | "performance" | "trades"
  >("overview");

  // Trade ticket state
  const [symbol, setSymbol] = useState("");
  const [sharesInput, setSharesInput] = useState("");
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [orderType, setOrderType] = useState<
    "market" | "limit" | "stop" | "takeprofit"
  >("market");
  const [limitPrice, setLimitPrice] = useState("");

  // Data & UI
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCoach, setShowCoach] = useState(false);

  // Portfolio states
  const [portfolio, setPortfolio] = useState({ invested: 0, current: 0, pl: 0 });
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  const Fade = ({ show, children }: any) =>
    show ? (
      <div className="transition-opacity duration-300 opacity-100">{children}</div>
    ) : null;

  /* ---------------------------------------------
     Derived Values
  --------------------------------------------- */
  const shares = parseFloat(sharesInput || "0");
  const previewPrice = livePrice ?? 0;
  const tradeDollars =
    previewPrice > 0 && shares > 0 ? shares * previewPrice : 0;
  const previewTotal = tradeDollars > 0 ? tradeDollars + FEE : 0;

  /* ---------------------------------------------
     Helpers
  --------------------------------------------- */

  const fetchLivePrice = async (sym: string) => {
    const res = await fetch(`/api/price?symbol=${sym}`);
    const data = await res.json();
    if (!res.ok || !data.price) throw new Error(data.error || "Failed to fetch price");
    return data.price as number;
  };

  const generatePerformanceHistory = (currentValue: number) => {
    const days = 30;
    const result: HistoryPoint[] = [];
    let value = currentValue || 0;

    for (let i = 0; i < days; i++) {
      const pct = (Math.random() - 0.5) * 0.02;
      value *= 1 + pct;
      result.push({ day: i + 1, equity: parseFloat(value.toFixed(2)) });
    }
    return result;
  };

  /* ---------------------------------------------
     Effect: Update price when symbol changes
  --------------------------------------------- */

  useEffect(() => {
    if (!symbol) {
      setLivePrice(null);
      return;
    }

    const load = async () => {
      try {
        const price = await fetchLivePrice(symbol.toUpperCase());
        setLivePrice(price);
      } catch {
        setLivePrice(null);
      }
    };

    load();
  }, [symbol]);

  /* ---------------------------------------------
     Effect: Build portfolio from trades
  --------------------------------------------- */

  useEffect(() => {
    if (!trades.length) {
      setHoldings([]);
      setHistory([]);
      setPortfolio({ invested: 0, current: 0, pl: 0 });
      return;
    }

    const map: Record<string, { shares: number; avg: number }> = {};

    trades.forEach((t) => {
      if (!map[t.symbol]) map[t.symbol] = { shares: 0, avg: t.price };

      if (t.type === "buy") map[t.symbol].shares += t.quantity;
      else if (t.type === "sell") map[t.symbol].shares -= t.quantity;
    });

    const symbols = Object.keys(map);

    const loadPortfolio = async () => {
      let invested = 0;
      let current = 0;
      const list: Holding[] = [];

      for (const s of symbols) {
        try {
          const live = await fetchLivePrice(s);
          const sharesHeld = map[s].shares;
          const avg = map[s].avg;

          invested += avg * sharesHeld;
          current += live * sharesHeld;

          list.push({
            symbol: s,
            shares: sharesHeld,
            avg,
            live,
            pl: live * sharesHeld - avg * sharesHeld,
          });
        } catch {}
      }

      setPortfolio({ invested, current, pl: current - invested });
      setHoldings(list);
      setHistory(generatePerformanceHistory(current));
    };

    loadPortfolio();
  }, [trades]);

  /* ---------------------------------------------
     Open Confirm Modal
  --------------------------------------------- */

  const handleOpenConfirm = async () => {
    setError("");

    if (!symbol) return setError("Enter a stock symbol.");
    if (shares <= 0) return setError("Enter a valid share amount.");

    const upperSymbol = symbol.toUpperCase();

    // SELL VALIDATION
    if (tradeType === "sell") {
      const totalBought = trades
        .filter((t) => t.symbol === upperSymbol && t.type === "buy")
        .reduce((sum, t) => sum + t.quantity, 0);

      const totalSold = trades
        .filter((t) => t.symbol === upperSymbol && t.type === "sell")
        .reduce((sum, t) => sum + t.quantity, 0);

      const sharesOwned = totalBought - totalSold;

      if (shares > sharesOwned) {
        return setError(
          `You only own ${sharesOwned.toFixed(3)} share${
            sharesOwned === 1 ? "" : "s"
          } of ${upperSymbol}`
        );
      }
    }

    setLoading(true);

    try {
      const price = await fetchLivePrice(upperSymbol);
      setLivePrice(price);
      setShowConfirm(true);
    } catch (err: any) {
      setError(err.message || "Failed to fetch live price.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     Confirm Trade
  --------------------------------------------- */

  const handleConfirmTrade = () => {
    if (!livePrice || shares <= 0 || !symbol) {
      setShowConfirm(false);
      return;
    }

    const upperSymbol = symbol.toUpperCase();

    addTrade({
      symbol: upperSymbol,
      quantity: shares,
      price: livePrice,
      fee: FEE,
      orderType,
      type: tradeType,
      timestamp: new Date().toLocaleString(),
      status: "filled",
    });

    setSymbol("");
    setSharesInput("");
    setLimitPrice("");
    setError("");
    setShowConfirm(false);
  };

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#050814] to-blue-600 text-white p-4">
      <section className="max-w-6xl mx-auto space-y-4">
        {/* Title + Tabs */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

          <div className="flex gap-4 overflow-x-auto whitespace-nowrap bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-2xl">
            {[
              { id: "overview", label: "Overview" },
              { id: "holdings", label: "Holdings" },
              { id: "performance", label: "Performance" },
              { id: "trades", label: "Trades" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-1 text-sm sm:text-base font-semibold transition ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Trade */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-semibold">Quick Trade</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400">Symbol</label>
              <input
                type="text"
                placeholder="AAPL"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="w-full bg-white/10 text-white rounded-xl p-3 border border-white/20 mt-1"
              />
            </div>

            <div className="flex-1">
              <label className="text-xs text-gray-400">Shares</label>
              <input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={sharesInput}
                onChange={(e) => setSharesInput(e.target.value)}
                className="w-full bg-white/10 text-white rounded-xl p-3 border border-white/20 mt-1"
              />
            </div>
          </div>

          {/* Buy/Sell */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setTradeType("buy")}
              className={`flex-1 py-2 rounded-xl border ${
                tradeType === "buy"
                  ? "bg-green-500/30 border-green-400"
                  : "bg-white/10 border-white/20"
              }`}
            >
              Buy
            </button>

            <button
              onClick={() => setTradeType("sell")}
              className={`flex-1 py-2 rounded-xl border ${
                tradeType === "sell"
                  ? "bg-red-500/30 border-red-400"
                  : "bg-white/10 border-white/20"
              }`}
            >
              Sell
            </button>
          </div>

          {/* Order Type */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mt-2">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "market", label: "Market" },
                { id: "limit", label: "Limit" },
                { id: "stop", label: "Stop" },
                { id: "takeprofit", label: "Take Profit" },
              ].map((o) => (
                <button
                  key={o.id}
                  onClick={() =>
                    setOrderType(o.id as "market" | "limit" | "stop" | "takeprofit")
                  }
                  className={`text-xs px-3 py-1 rounded-full border ${
                    orderType === o.id
                      ? "bg-blue-600 border-blue-400 text-white"
                      : "bg-transparent border-white/20 text-gray-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {orderType !== "market" && (
              <div className="flex-1">
                <label className="text-xs text-gray-400">
                  Price (
                  {orderType === "limit"
                    ? "Limit"
                    : orderType === "stop"
                    ? "Stop"
                    : "Target"}
                  )
                </label>
                <input
                  type="number"
                  placeholder="175.00"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full bg-white/10 text-white rounded-xl p-3 border border-white/20 mt-1"
                />
              </div>
            )}

            <button
              onClick={handleOpenConfirm}
              disabled={loading}
              className="px-6 py-2 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 ml-auto disabled:opacity-40"
            >
              {loading ? "Preparing..." : "Review Order"}
            </button>
          </div>

          {error && <p className="text-red-400 font-medium text-sm">{error}</p>}

          {/* Smart Entry Assistant */}
          <SmartEntryAssistant symbol={symbol} shares={shares} tradeType={tradeType} />

          {/* Smart Order Preview */}
          {symbol && shares > 0 && livePrice !== null && (
            <div className="mt-5 bg-white/5 border border-white/10 p-4 rounded-2xl shadow-xl text-sm">
              <p className="font-semibold mb-1">Smart Order Preview</p>

              <p className="text-gray-300">
                {tradeType.toUpperCase()} {shares.toFixed(3)} share
                {shares === 1 ? "" : "s"} of {symbol.toUpperCase()} for $
                {tradeDollars.toFixed(2)} as a{" "}
                {orderType === "market"
                  ? "Market"
                  : orderType === "limit"
                  ? "Limit"
                  : orderType === "stop"
                  ? "Stop"
                  : "Take Profit"}{" "}
                order.
              </p>

              <div className="mt-2 text-gray-300 space-y-1">
                <p>Price: ${livePrice.toFixed(2)}</p>
                <p>Fee: ${FEE.toFixed(2)}</p>
                <p className="font-semibold">Est Total: ${previewTotal.toFixed(2)}</p>
              </div>

              <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-white/10">
                Educational Only • Not Financial Advice
              </p>
            </div>
          )}
        </div>

        {/* Overview */}
        <Fade show={activeTab === "overview"}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h2 className="text-lg font-semibold mb-3">Portfolio Summary</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20">
                <p className="text-xs text-gray-400">Invested</p>
                <p className="text-xl font-bold">${portfolio.invested.toFixed(2)}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/20">
                <p className="text-xs text-gray-400">Current Value</p>
                <p className="text-xl font-bold">${portfolio.current.toFixed(2)}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/20">
                <p className="text-xs text-gray-400">Total P/L</p>
                <p
                  className={`text-xl font-bold ${
                    portfolio.pl >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {portfolio.pl >= 0 ? "+" : ""}${portfolio.pl.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </Fade>

        {/* Performance */}
        <Fade show={activeTab === "performance"}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
            <h2 className="text-lg font-semibold">Performance</h2>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <p className="text-gray-400 text-xs">High</p>
                <p className="text-green-400 font-semibold text-base">
                  $
                  {history.length
                    ? Math.max(...history.map((h) => h.equity)).toFixed(2)
                    : "0.00"}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <p className="text-gray-400 text-xs">Low</p>
                <p className="text-red-400 font-semibold text-base">
                  $
                  {history.length
                    ? Math.min(...history.map((h) => h.equity)).toFixed(2)
                    : "0.00"}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <p className="text-gray-400 text-xs">Avg</p>
                <p className="text-blue-300 font-semibold text-base">
                  $
                  {history.length
                    ? (
                        history.reduce((a, b) => a + b.equity, 0) / history.length
                      ).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <defs>
                    <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity={1} />
                      <stop offset="100%" stopColor="#1E3A8A" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>

                  <Line
                    type="monotone"
                    dataKey="equity"
                    stroke="url(#equityGradient)"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="text-gray-400 text-xs">
              Performance is simulated for demonstration and does not reflect real
              market data.
            </p>
          </div>
        </Fade>

        {/* Holdings */}
        <Fade show={activeTab === "holdings"}>
          {holdings.length > 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <h2 className="text-lg font-semibold mb-2">Holdings</h2>

              {holdings.map((h) => {
                const isUp = h.pl >= 0;
                const plPct =
                  h.avg > 0
                    ? (((h.live - h.avg) / h.avg) * 100).toFixed(2)
                    : "0.00";

                return (
                  <div
                    key={h.symbol}
                    className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
                  >
                    <div className="flex flex-col">
                      <p className="font-bold text-lg">{h.symbol}</p>
                      <p className="text-gray-400 text-sm">
                        {h.shares.toFixed(3)} shares
                      </p>
                    </div>

                    <div className="flex flex-col text-sm text-right sm:text-center flex-1">
                      <p className="text-gray-400">Avg: ${h.avg.toFixed(2)}</p>
                      <p className="text-gray-400">Now: ${h.live.toFixed(2)}</p>
                      <p className={`font-bold ${isUp ? "text-green-400" : "text-red-400"}`}>
                        {isUp ? "+" : "-"}${Math.abs(h.pl).toFixed(2)} (
                        {isUp ? "+" : ""}
                        {plPct}%)
                      </p>
                    </div>

                    <div className="w-full sm:w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full ${isUp ? "bg-green-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(Math.abs(Number(plPct)), 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h2 className="text-lg font-semibold mb-1">Holdings</h2>
              <p className="text-gray-400 text-sm">You have no holdings yet.</p>
            </div>
          )}
        </Fade>

        {/* Trades */}
        <Fade show={activeTab === "trades"}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h2 className="text-lg font-semibold">Recent Trades</h2>

            {trades.length ? (
              trades
                .slice()
                .reverse()
                .slice(0, 12)
                .map((t) => {
                  const isBuy = t.type === "buy";
                  const gross = t.quantity * t.price;
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10"
                    >
                      <div className="flex flex-col">
                        <p className="font-semibold">
                          {isBuy ? "BUY" : "SELL"} {t.symbol}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {t.quantity.toFixed(3)} @ ${t.price.toFixed(2)} •{" "}
                          {t.orderType.toUpperCase()}
                        </p>
                        <p className="text-gray-500 text-[11px]">{t.timestamp}</p>
                      </div>

                      <div className="text-right">
                        <p className={`font-semibold ${isBuy ? "text-green-400" : "text-red-400"}`}>
                          {isBuy ? "+" : "-"}${gross.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-[11px]">
                          Fee: ${t.fee.toFixed(2)} • {t.status}
                        </p>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-gray-400 text-sm">No trades yet.</p>
            )}
          </div>
        </Fade>

        {/* Market Pulse */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <h2 className="text-lg font-semibold mb-3">Market Pulse</h2>
          <MarketPulse />
        </div>

        {/* Confirmation Modal */}
        {showConfirm && livePrice !== null && shares > 0 && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60">
            <div className="bg-[#050814] border border-white/20 rounded-2xl p-4 w-full max-w-md mx-4 mb-6 sm:mb-0 shadow-xl">
              <h3 className="text-lg font-semibold mb-2">Confirm Order</h3>

              <p className="text-sm text-gray-300 mb-3">
                {tradeType.toUpperCase()} {shares.toFixed(3)} share
                {shares === 1 ? "" : "s"} of {symbol.toUpperCase()} for $
                {tradeDollars.toFixed(2)} as a{" "}
                {orderType === "market"
                  ? "Market"
                  : orderType === "limit"
                  ? "Limit"
                  : orderType === "stop"
                  ? "Stop"
                  : "Take Profit"}{" "}
                order.
              </p>

              <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order side</span>
                  <span className="font-semibold">
                    {tradeType === "buy" ? "Buy" : "Sell"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Price</span>
                  <span className="font-semibold">${livePrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Shares</span>
                  <span className="font-semibold">{shares.toFixed(3)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span className="font-semibold">${FEE.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated total</span>
                  <span className="font-semibold">${previewTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmTrade}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Floating AI Coach Button & Modal */}
      <div className="fixed bottom-20 right-5 z-50">
        <CoachButton onOpen={() => setShowCoach(true)} />
      </div>

      <CoachModal open={showCoach} onClose={() => setShowCoach(false)} />
    </main>
  );
}

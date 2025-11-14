"use client";

import { useEffect, useState } from "react";
import { useTrades } from "@/context/TradeContext";
import MarketPulse from "@/components/MarketPulse";
import { LineChart, Line, ResponsiveContainer } from "recharts";

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

export default function DashboardPage() {
  const { trades, addTrade } = useTrades();

  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // BUY / SELL toggle
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");

  // PORTFOLIO SUMMARY STATE
  const [portfolio, setPortfolio] = useState({
    invested: 0,
    current: 0,
    pl: 0,
  });

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  // Fetch live price through your API route
  const fetchLivePrice = async (sym: string) => {
    const res = await fetch(`/api/price?symbol=${sym}`);
    const data = await res.json();

    if (!res.ok || !data.price)
      throw new Error(data.error || "Failed to fetch price");

    return data.price as number;
  };

  // Generate 30-day portfolio performance history
  function generatePerformanceHistory(currentValue: number): HistoryPoint[] {
    const days = 30;
    const result: HistoryPoint[] = [];
    let value = currentValue || 0;

    for (let i = 0; i < days; i++) {
      const pct = (Math.random() - 0.5) * 0.02; // -1% to +1%
      value = value * (1 + pct);

      result.push({
        day: i + 1,
        equity: parseFloat(value.toFixed(2)),
      });
    }

    return result;
  }

  // Handle Buy / Sell Trade
  const handleTrade = async () => {
    setError("");

    if (!symbol) return setError("Enter a stock symbol.");
    if (!amount || Number(amount) <= 0)
      return setError("Enter a valid amount.");

    const upperSymbol = symbol.toUpperCase();
    const quantity = Number(amount);

    // SELL validation: make sure user owns enough shares
    if (tradeType === "sell") {
      const existing = trades
        .filter((t) => t.symbol === upperSymbol && t.type === "buy")
        .reduce((sum, t) => sum + t.quantity, 0);

      const sold = trades
        .filter((t) => t.symbol === upperSymbol && t.type === "sell")
        .reduce((sum, t) => sum + t.quantity, 0);

      const sharesOwned = existing - sold;

      if (quantity > sharesOwned) {
        return setError(
          `You only own ${sharesOwned} share${
            sharesOwned === 1 ? "" : "s"
          } of ${upperSymbol}`
        );
      }
    }

    setLoading(true);

    try {
      const livePrice = await fetchLivePrice(upperSymbol);

      addTrade({
        symbol: upperSymbol,
        type: tradeType,
        quantity,
        price: livePrice,
      });

      setSymbol("");
      setAmount("");
    } catch (err: any) {
      setError(err.message || "Failed to execute trade.");
    } finally {
      setLoading(false);
    }
  };

  // Build holdings + portfolio summary
  useEffect(() => {
    const map: Record<string, { shares: number; avg: number }> = {};

    for (const t of trades) {
      if (!map[t.symbol]) map[t.symbol] = { shares: 0, avg: 0 };

      const prev = map[t.symbol];

      // simple running average
      map[t.symbol].avg =
        (prev.avg * prev.shares + t.price * t.quantity) /
        (prev.shares + t.quantity);

      map[t.symbol].shares += t.quantity;
    }

    const symbols = Object.keys(map);

    async function loadPortfolio() {
      let invested = 0;
      let current = 0;
      const list: Holding[] = [];

      for (const s of symbols) {
        try {
          const live = await fetchLivePrice(s);
          const shares = map[s].shares;
          const avg = map[s].avg;

          invested += avg * shares;
          current += live * shares;

          list.push({
            symbol: s,
            shares,
            avg,
            live,
            pl: live * shares - avg * shares,
          });
        } catch {
          // ignore failed price loads
        }
      }

      setHoldings(list);
      setPortfolio({
        invested,
        current,
        pl: current - invested,
      });

      // Update performance history whenever portfolio current value changes
      setHistory(generatePerformanceHistory(current));
    }

    loadPortfolio();
  }, [trades]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-blue-500 text-white p-6">

      <section className="max-w-6xl mx-auto">
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* PORTFOLIO SUMMARY */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <h2 className="text-2xl font-semibold mb-3">Portfolio Summary</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-white/10 border border-white/20">
              <p className="text-sm text-gray-400">Invested</p>
              <p className="text-xl font-bold">
                ${portfolio.invested.toFixed(2)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/20">
              <p className="text-sm text-gray-400">Current Value</p>
              <p className="text-xl font-bold">
                ${portfolio.current.toFixed(2)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/20">
              <p className="text-sm text-gray-400">Total P/L</p>
              <p
                className={`text-xl font-bold ${
                  portfolio.pl >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {portfolio.pl >= 0 ? "+" : ""}
                ${portfolio.pl.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* PERFORMANCE CHART */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <h2 className="text-2xl font-semibold mb-3">
            Performance (30 Days)
          </h2>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <Line
                  type="monotone"
                  dataKey="equity"
                  stroke="white"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-gray-400 text-sm mt-2">
            Simulated 30-day performance trend
          </p>
        </div>

        {/* HOLDINGS */}
        {holdings.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
            <h2 className="text-2xl font-semibold mb-3">Holdings</h2>

            {holdings.map((h) => (
              <div
                key={h.symbol}
                className="flex justify-between items-center border-b border-white/10 py-3"
              >
                <div>
                  <p className="font-bold text-lg">{h.symbol}</p>
                  <p className="text-gray-400 text-sm">{h.shares} shares</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    Avg: ${h.avg.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Now: ${h.live.toFixed(2)}
                  </p>
                  <p
                    className={`font-bold ${
                      h.pl >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {h.pl >= 0 ? "+" : ""}
                    ${h.pl.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RECENT TRADES */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <h2 className="text-2xl font-semibold mb-3">Recent Trades</h2>

          {trades
            .slice(-3)
            .reverse()
            .map((t) => (
              <div
                key={t.id}
                className="border-b border-white/10 py-3 flex justify-between"
              >
                <div>
                  <p className="font-bold">
                    {t.type.toUpperCase()} {t.symbol}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {t.quantity} shares @ ${t.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-gray-500 text-sm">{t.timestamp}</div>
              </div>
            ))}

          {trades.length === 0 && (
            <p className="text-gray-400">No trades yet.</p>
          )}
        </div>

        {/* TRADE INPUT AREA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Symbol (AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="flex-1 bg-white/10 text-white rounded-xl p-3 border border-white/20"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-white/10 text-white rounded-xl p-3 border border-white/20"
          />

          <div className="flex items-center gap-3">
            {/* BUY / SELL Toggle */}
            <div className="flex bg-white/10 border border-white/20 rounded-xl overflow-hidden">
              <button
                className={`px-4 py-3 font-semibold ${
                  tradeType === "buy" ? "bg-green-600" : "bg-transparent"
                }`}
                onClick={() => setTradeType("buy")}
              >
                Buy
              </button>

              <button
                className={`px-4 py-3 font-semibold ${
                  tradeType === "sell" ? "bg-red-600" : "bg-transparent"
                }`}
                onClick={() => setTradeType("sell")}
              >
                Sell
              </button>
            </div>

            {/* Execute Trade Button */}
            <button
              onClick={handleTrade}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold transition disabled:opacity-40 ${
                tradeType === "buy"
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-red-600 hover:bg-red-500"
              }`}
            >
              {loading
                ? "Processing..."
                : tradeType === "buy"
                ? "Buy"
                : "Sell"}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 font-medium mb-4">{error}</p>
        )}

        {/* MARKET PULSE */}
        <MarketPulse />
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTrades } from "@/context/TradeContext";
import MarketPulse from "@/components/MarketPulse";
import { LineChart, Line, ResponsiveContainer } from "recharts";


type TradeType = "buy" | "sell";
type OrderType = "market" | "limit" | "stop" | "takeprofit";

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
        Disclaimer: This tool is for educational purposes only and does not provide
        personalized financial advice.
      </p>
    </div>
  );
};

const FEE = 0.25;

export default function TradePage() {
  const { trades, addTrade } = useTrades();

  const [symbol, setSymbol] = useState("");
  const [sharesInput, setSharesInput] = useState("");
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [limitPrice, setLimitPrice] = useState("");

  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [dayChange, setDayChange] = useState<number | null>(null);
  const [dayChangePct, setDayChangePct] = useState<number | null>(null);

  const [chartData, setChartData] = useState<Array<{ label: string; price: number }>>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const Fade = ({ show, children }: { show: boolean; children: React.ReactNode }) =>
    show ? (
      <div className="transition-opacity duration-300 opacity-100">{children}</div>
    ) : null;

  // -----------------------------
  // DERIVED VALUES
  // -----------------------------
  const shares = parseFloat(sharesInput || "0");
  const limitPriceNumber = parseFloat(limitPrice || "0");

  const effectivePrice =
    orderType === "market"
      ? livePrice ?? 0
      : limitPriceNumber > 0
      ? limitPriceNumber
      : livePrice ?? 0;

  const tradeDollars =
    effectivePrice > 0 && shares > 0 ? shares * effectivePrice : 0;
  const previewTotal = tradeDollars > 0 ? tradeDollars + FEE : 0;

  const sentiment =
    livePrice === null
      ? "—"
      : livePrice > 300
      ? "Hot"
      : livePrice > 100
      ? "Watch"
      : "Steady";

  // -----------------------------
  // HELPERS
  // -----------------------------
  const fetchLivePrice = async (sym: string) => {
    const res = await fetch(`/api/price?symbol=${sym}`);
    const data = await res.json();
    if (!res.ok || !data.price) {
      throw new Error(data.error || "Failed to fetch price");
    }
    return data.price as number;
  };

  // -----------------------------
  // EFFECT: FETCH QUOTE + CHART WHEN SYMBOL CHANGES
  // -----------------------------
  useEffect(() => {
    if (!symbol) {
      setLivePrice(null);
      setDayChange(null);
      setDayChangePct(null);
      setChartData([]);
      return;
    }

    const loadQuote = async () => {
      try {
        const upper = symbol.toUpperCase();
        const price = await fetchLivePrice(upper);

        setLivePrice(price);

        // Simple demo change values (since API route only returns price)
        const fakeChange = price * 0.01; // ~1%
        setDayChange(fakeChange);
        setDayChangePct((fakeChange / price) * 100);

        // Demo sparkline
        const points: Array<{ label: string; price: number }> = [];
        for (let i = 0; i < 24; i++) {
          const jitter = (Math.random() - 0.5) * 0.01; // ±1%
          const p = price * (1 + jitter);
          points.push({
            label: `${i}`,
            price: parseFloat(p.toFixed(2)),
          });
        }
        setChartData(points);
      } catch (err) {
        console.error("Failed to load quote:", err);
        setLivePrice(null);
        setChartData([]);
      }
    };

    loadQuote();
  }, [symbol]);

  // -----------------------------
  // OPEN CONFIRMATION (VALIDATE)
  // -----------------------------
  const handleOpenConfirm = async () => {
    setError("");

    if (!symbol) return setError("Enter a stock symbol.");
    if (!sharesInput || shares <= 0)
      return setError("Enter a valid share amount.");

    if (orderType !== "market") {
      if (!limitPrice || limitPriceNumber <= 0) {
        return setError("Enter a valid price for this order type.");
      }
    }

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

    if (!livePrice && orderType === "market") {
      return setError("Live price not available yet. Check symbol.");
    }

    setShowConfirm(true);
  };

  // -----------------------------
  // CONFIRM TRADE
  // -----------------------------
  const handleConfirmTrade = () => {
    if (!symbol || shares <= 0) {
      setShowConfirm(false);
      return;
    }

    const upperSymbol = symbol.toUpperCase();
    const executionPrice =
      orderType === "market"
        ? livePrice ?? 0
        : limitPriceNumber > 0
        ? limitPriceNumber
        : livePrice ?? 0;

    if (executionPrice <= 0) {
      setError("Execution price unavailable.");
      setShowConfirm(false);
      return;
    }
addTrade({
  symbol: upperSymbol,
  quantity: shares,
  price: executionPrice,
  fee: FEE,
  orderType,
  type: tradeType,
  timestamp: new Date().toLocaleString(),
  status: "filled",
  dollars: shares * executionPrice, // ✅ REQUIRED FIELD
});


    // Reset form
    setSymbol("");
    setSharesInput("");
    setLimitPrice("");
    setShowConfirm(false);
    setError("");
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#050814] to-blue-600 text-white p-4">
      <section className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Trade</h1>
          <p className="text-sm text-gray-300">
            One shot, one kill — build your micro positions with precision.
          </p>
        </div>

        {/* 2-column layout */}
        <div className="grid gap-4 lg:grid-cols-[2fr,1.3fr]">
          {/* LEFT COLUMN: Symbol + Ticket */}
          <div className="space-y-4">
            {/* SYMBOL / QUOTE CARD */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="flex-1">
                  <label className="text-xs text-gray-400">Symbol</label>
                  <input
                    type="text"
                    placeholder="AAPL"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="w-full bg-white/10 text-white rounded-xl p-3 border border-white/20 mt-1 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div className="flex-1 flex flex-col items-start sm:items-end justify-center">
                  <p className="text-xs text-gray-400 mb-1">Live Price</p>
                  {livePrice !== null ? (
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        ${livePrice.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${
                          dayChange && dayChange >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {dayChange !== null && dayChangePct !== null
                          ? `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(
                              2
                            )} (${dayChangePct.toFixed(2)}%)`
                          : "—"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Enter a symbol…</p>
                  )}
                </div>
              </div>

              {/* Sentiment + tag */}
              <div className="flex items-center justify-between mt-2 text-xs">
                <p className="text-gray-400">
                  Sentiment:{" "}
                  <span className="font-semibold text-blue-200">
                    {sentiment}
                  </span>
                </p>
                <p className="text-gray-500">
                  Demo data • Not real-time execution
                </p>
              </div>

              {/* Mini chart */}
              <div className="h-24 mt-3">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#60A5FA"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-gray-500">
                    Price chart will appear after a valid symbol loads.
                  </div>
                )}
              </div>
            </div>

            {/* TRADE TICKET */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
              <h2 className="text-lg font-semibold">One Shot Ticket</h2>

              {/* SHARE INPUT */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-400">Shares</label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="0.000"
                    value={sharesInput}
                    onChange={(e) => setSharesInput(e.target.value)}
                    className="w-full bg-white/10 text-white rounded-xl p-3 border border-white/20 mt-1 focus:border-blue-400 focus:outline-none"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Fractional shares allowed — great for microtrades.
                  </p>
                </div>

                <div className="flex-1 flex flex-col justify-center rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                  <p className="text-xs text-gray-400">Est. Notional (USD)</p>
                  <p className="text-lg font-semibold">
                    {livePrice && shares > 0
                      ? `$${tradeDollars.toFixed(2)}`
                      : "—"}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Based on{" "}
                    {orderType === "market"
                      ? "current market price"
                      : "your order price"}
                    .
                  </p>
                </div>
              </div>

              {/* SMART ENTRY ASSISTANT */}
              <SmartEntryAssistant
                symbol={symbol}
                shares={shares}
                tradeType={tradeType}
              />

              {/* BUY / SELL */}
              <div className="flex gap-3 mt-3">
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

              {/* ORDER TYPE + LIMIT PRICE */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mt-3">
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
                        setOrderType(
                          o.id as "market" | "limit" | "stop" | "takeprofit"
                        )
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
                      className="w-full bg-white/10 text-white rounded-xl p-3 border border-white/20 mt-1 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                )}

                <button
                  onClick={handleOpenConfirm}
                  disabled={loading}
                  className="px-6 py-2 rounded-xl font-semibold transition disabled:opacity-40 bg-blue-600 hover:bg-blue-500 ml-auto"
                >
                  {loading ? "Preparing..." : "Review Order"}
                </button>
              </div>

              {error && (
                <p className="text-red-400 font-medium text-sm mt-2">{error}</p>
              )}

              {/* SMART ORDER PREVIEW */}
              {symbol && shares > 0 && effectivePrice > 0 && (
                <div className="mt-4">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.3)] text-sm">
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
                      <p>Price: ${effectivePrice.toFixed(2)}</p>
                      <p>Fee: ${FEE.toFixed(2)}</p>
                      <p className="font-semibold">
                        Est Total: ${previewTotal.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-white/10">
                      Educational Only • Orders are simulated inside MicroTrade
                      5.0 — not live brokerage orders.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Market Pulse + Recent Trades */}
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h2 className="text-lg font-semibold mb-3">Market Pulse</h2>
              <MarketPulse />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <h2 className="text-lg font-semibold">Recent Trades</h2>
              {trades.length > 0 ? (
                trades
                  .slice()
                  .reverse()
                  .slice(0, 8)
                  .map((t) => {
                    const isBuy = t.type === "buy";
                    const gross = t.quantity * t.price;

                    return (
                      <div
                        key={t.id}
                        className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition"
                      >
                        <div className="flex flex-col">
                          <p className="font-semibold text-base">
                            {isBuy ? "BUY" : "SELL"} {t.symbol}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {t.quantity.toFixed(3)} @ ${t.price.toFixed(2)} •{" "}
                            {t.orderType.toUpperCase()}
                          </p>
                          <p className="text-gray-500 text-[11px]">
                            {t.timestamp}
                          </p>
                        </div>

                        <div className="text-right flex flex-col items-end">
                          <span
                            className={`text-sm font-semibold ${
                              isBuy ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {isBuy ? "+" : "-"}${gross.toFixed(2)}
                          </span>
                          <span className="text-gray-400 text-[11px]">
                            Fee: ${t.fee.toFixed(2)} • {t.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-gray-400 text-sm">
                  No trades yet. Your fills will show up here.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CONFIRMATION MODAL */}
        {showConfirm && shares > 0 && effectivePrice > 0 && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60">
            <div className="bg-[#050814] border border-white/20 rounded-2xl p-4 w-full max-w-md mx-4 mb-6 sm:mb-0 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
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
                  <span className="font-semibold">
                    ${effectivePrice.toFixed(2)}
                  </span>
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
                  <span className="font-semibold">
                    ${previewTotal.toFixed(2)}
                  </span>
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
    </main>
  );
}


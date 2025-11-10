"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TradeLog {
  id: number;
  action: string;
  symbol: string;
  amount: number;
  price: number;
  timestamp: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<TradeLog[]>([]);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  // ✅ Load once client is ready
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("tradeHistory");
    console.log("📦 Reading from localStorage:", stored);
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  // ✅ Keep it saved if you clear or modify anything
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("tradeHistory", JSON.stringify(history));
  }, [history]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("tradeHistory");
    console.log("🧹 History cleared");
  };

  const sorted = [...history].sort((a, b) =>
    sort === "newest"
      ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="p-6 flex flex-col gap-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Trade History</h1>
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as "newest" | "oldest")
            }
            className="bg-white/10 border border-white/10 text-sm rounded-lg p-2 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={clearHistory}
            className="bg-red-500/20 border border-red-500/40 rounded-lg px-3 text-sm text-red-300 hover:bg-red-500/30 transition-colors"
          >
            Clear
          </motion.button>
        </div>
      </div>

      {/* History Feed */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,180,0.1)]"
      >
        <AnimatePresence>
          {sorted.length > 0 ? (
            <div className="flex flex-col divide-y divide-white/10">
              {sorted.map((trade) => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center py-3"
                >
                  <div>
                    <p className="font-medium text-white/90">
                      {trade.action} {trade.symbol}
                    </p>
                    <p className="text-xs text-white/50">
                      {new Date(trade.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        trade.action === "BUY"
                          ? "text-emerald-300"
                          : "text-red-300"
                      }`}
                    >
                      {trade.amount} @ ${trade.price.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/40 text-sm py-6"
            >
              No trade history yet — make trades on the Dashboard or Trade page.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Summary */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white/60 backdrop-blur-md"
        >
          <p className="text-white/70 font-semibold mb-1">Summary</p>
          <p>Total Trades: {history.length}</p>
          <p>
            Net Volume:{" "}
            {history
              .reduce(
                (acc, t) =>
                  t.action === "BUY"
                    ? acc + t.amount
                    : acc - t.amount,
                0
              )
              .toFixed(2)}{" "}
            units
          </p>
        </motion.div>
      )}
    </div>
  );
}

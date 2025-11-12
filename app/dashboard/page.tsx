"use client";

import { useTrades } from "@/context/TradeContext";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { trades } = useTrades();

  // Get recent trades (last 5)
  const recent = [...trades].slice(-5).reverse();

  const totalBuys = trades
    .filter((t) => t.type === "buy")
    .reduce((sum, t) => sum + t.price * t.quantity, 0);

  const totalSells = trades
    .filter((t) => t.type === "sell")
    .reduce((sum, t) => sum + t.price * t.quantity, 0);

  return (
    <div className="space-y-10">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-white"
      >
        Dashboard
      </motion.h1>

      {/* Totals Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg"
        >
          <h2 className="text-sm text-white/60 mb-1">Total Buys</h2>
          <p className="text-emerald-400 text-xl font-semibold">
            ${totalBuys.toFixed(2)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg"
        >
          <h2 className="text-sm text-white/60 mb-1">Total Sells</h2>
          <p className="text-rose-400 text-xl font-semibold">
            ${totalSells.toFixed(2)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg"
        >
          <h2 className="text-sm text-white/60 mb-1">Net</h2>
          <p
            className={`text-xl font-semibold ${
              totalBuys - totalSells > 0
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            ${(totalBuys - totalSells).toFixed(2)}
          </p>
        </motion.div>
      </div>

      {/* Recent Trades */}
      <div>
        <h2 className="text-lg font-semibold text-white/90 mb-3">
          Recent Trades
        </h2>

        {recent.length === 0 ? (
          <p className="text-white/50">No trades yet.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center bg-white/5 border border-white/10 rounded-lg p-3"
              >
                <div>
                  <p className="text-white/90 font-semibold">{t.symbol}</p>
                  <p className="text-xs text-white/50">{t.timestamp}</p>
                </div>
                <p
                  className={`font-semibold ${
                    t.type === "buy" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {t.type.toUpperCase()} {t.quantity} @ ${t.price.toFixed(2)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

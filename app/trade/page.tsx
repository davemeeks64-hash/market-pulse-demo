"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function TradePage() {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [orderType, setOrderType] = useState("market");
  const [confirm, setConfirm] = useState("");

  const handleTrade = (action: "buy" | "sell") => {
    if (!symbol || !amount) {
      setConfirm("Please enter symbol & amount first.");
      return;
    }

    const upperSymbol = symbol.toUpperCase();
    const parsedAmount = parseFloat(amount);

    setConfirm(
      `${action === "buy" ? "Purchased" : "Sold"} ${parsedAmount} of ${upperSymbol} (${orderType})`
    );

    const trade = {
      id: Date.now(),
      action: action.toUpperCase(),
      symbol: upperSymbol,
      amount: parsedAmount,
      price: 100 + Math.random() * 50,
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("tradeHistory") || "[]");
    localStorage.setItem("tradeHistory", JSON.stringify([trade, ...existing]));
    console.log("Trade logged:", trade);
console.log("✅ Trade saved to localStorage");

    setSymbol("");
    setAmount("");
    setTimeout(() => setConfirm(""), 3000);
  };

  return (
    <div className="p-6 flex flex-col gap-6 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Trade Center</h1>
        <p className="text-sm text-white/40">Execute demo trades instantly</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,180,0.1)]"
      >
        <div className="flex flex-col gap-3 mb-4">
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Symbol (e.g. NVDA)"
            className="bg-white/10 rounded-lg p-2 text-sm focus:outline-none placeholder-white/40"
          />

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            type="number"
            className="bg-white/10 rounded-lg p-2 text-sm focus:outline-none placeholder-white/40"
          />

          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="bg-white/10 rounded-lg p-2 text-sm focus:outline-none"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
          </select>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTrade("buy")}
            className="flex-1 bg-emerald-500/20 border border-emerald-500/40 rounded-lg py-2 text-emerald-300 font-medium hover:bg-emerald-500/30 transition-colors"
          >
            Buy
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTrade("sell")}
            className="flex-1 bg-red-500/20 border border-red-500/40 rounded-lg py-2 text-red-300 font-medium hover:bg-red-500/30 transition-colors"
          >
            Sell
          </motion.button>
        </div>

        <AnimatePresence>
          {confirm && (
            <motion.p
              key={confirm}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-white/60 mt-4 text-center"
            >
              {confirm}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

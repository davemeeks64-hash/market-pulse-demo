"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HoloBackground from "./HoloBackground";

export default function SimulatorTile() {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(5000);
  const [status, setStatus] = useState("");

  const handleTrade = (type: "buy" | "sell") => {
    if (!symbol || !amount) {
      setStatus("Enter symbol & amount first!");
      return;
    }

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setStatus("Enter a valid amount");
      return;
    }

    const change = type === "buy" ? -amt : amt;
    const newBalance = Math.max(0, balance + change);
    setBalance(newBalance);

    const action = type === "buy" ? "BUY" : "SELL";
    const trade = {
      id: Date.now(),
      action,
      symbol: symbol.toUpperCase(),
      amount: amt,
      price: 100 + Math.random() * 50,
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("tradeHistory") || "[]");
    localStorage.setItem("tradeHistory", JSON.stringify([trade, ...existing]));

    setStatus(`${action} ${amt} ${symbol.toUpperCase()}`);
    setSymbol("");
    setAmount("");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 mt-8 flex flex-col gap-4 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,180,0.1)]"
    >
      <HoloBackground />
      <h2 className="text-lg font-semibold flex items-center gap-2">Simulator</h2>
      <motion.div
        key={balance}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-semibold text-emerald-300"
      >
        ${balance.toFixed(2)}
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbol (e.g. NVDA)"
          className="bg-white/10 text-sm rounded-lg p-2 text-white placeholder-white/40 focus:outline-none"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
          className="bg-white/10 text-sm rounded-lg p-2 text-white placeholder-white/40 focus:outline-none"
        />
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
        {status && (
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-white/60 mt-2 text-center"
          >
            {status}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

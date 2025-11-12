"use client";

import { useState } from "react";
import { useTrades } from "@/context/TradeContext";
import { motion } from "framer-motion";

export default function TradePage() {
  const { addTrade } = useTrades();
  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!symbol || quantity <= 0 || price <= 0) return;
    addTrade({ symbol, type, quantity, price });
    setSymbol("");
    setQuantity(0);
    setPrice(0);
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Trade Simulator</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
        <div>
          <label className="block text-sm text-white/70 mb-1">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="w-full bg-transparent border border-white/10 rounded-md p-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "buy" | "sell")}
            className="w-full bg-transparent border border-white/10 rounded-md p-2 text-white outline-none"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm text-white/70 mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-transparent border border-white/10 rounded-md p-2 text-white outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-white/70 mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-transparent border border-white/10 rounded-md p-2 text-white outline-none"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 bg-emerald-500/20 border border-emerald-400/20 text-emerald-300 font-semibold rounded-md py-2 hover:bg-emerald-500/30 transition"
        >
          Execute Trade
        </motion.button>
      </form>
    </div>
  );
}

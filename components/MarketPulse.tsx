"use client";

import { motion } from "framer-motion";
import StockCard from "@/components/StockCard";
import { Stock } from "@/types";

const stocks: Stock[] = [
  { symbol: "AAPL", name: "Apple", price: 227.48, changePct: 0.96, sentiment: "hot" },
  { symbol: "TSLA", name: "Tesla", price: 248.91, changePct: -0.42, sentiment: "watch" },
  { symbol: "AMZN", name: "Amazon", price: 171.14, changePct: 1.23, sentiment: "steady" },
  { symbol: "GOOG", name: "Google", price: 182.34, changePct: 0.54, sentiment: "buy" },
  { symbol: "MSFT", name: "Microsoft", price: 408.12, changePct: -0.33, sentiment: "hold" },
];

export default function MarketPulse() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Market Pulse</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((stock, idx) => (
          <motion.div
            key={idx}
            className="rounded-xl bg-white/5 border border-white/10 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <StockCard stock={stock} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

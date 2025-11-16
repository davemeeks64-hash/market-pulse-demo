"use client";

import { motion } from "framer-motion";
import StockCard from "@/components/StockCard";
import { Stock } from "@/types";

// Demo stock data — can replace with API feed later
const stocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple",
    price: 227.48,
    changePct: 0.96,
    sentiment: "hot",
    sparkline: [220, 222, 225, 227, 226, 227.48],
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    price: 248.91,
    changePct: -0.42,
    sentiment: "watch",
    sparkline: [250, 251, 249, 247, 248, 248.91],
  },
  {
    symbol: "AMZN",
    name: "Amazon",
    price: 171.14,
    changePct: 1.23,
    sentiment: "steady",
    sparkline: [165, 167, 169, 171, 170, 171.14],
  },
];

export default function MarketPulse() {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Market Pulse</h2>
        <span className="text-sm text-blue-300/80">Live • Updated</span>
      </div>

      {/* Stock grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stocks.map((stock, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="
              rounded-2xl
              bg-white/5
              border border-white/10
              hover:bg-white/10
              hover:border-white/20
              transition
              cursor-pointer
              shadow-[0_0_10px_rgba(0,0,0,0.3)]
            "
          >
            <StockCard stock={stock} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

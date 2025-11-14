"use client";

import { motion } from "framer-motion";
import StockCard from "@/components/StockCard";
import { Stock } from "@/types";

const stocks: Stock[] = [
  { symbol: "AAPL", name: "Apple", price: 227.48, changePct: 0.96, sentiment: "hot", sparkline: [220, 222, 225, 227, 226, 227.48] },
  { symbol: "TSLA", name: "Tesla", price: 248.91, changePct: -0.42, sentiment: "watch", sparkline: [250, 251, 249, 247, 248, 248.91] },
  { symbol: "AMZN", name: "Amazon", price: 171.14, changePct: 1.23, sentiment: "steady", sparkline: [165, 167, 169, 171, 170, 171.14] },
];

export default function MarketPulse() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white/90 mb-2">Market Pulse</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stocks.map((stock, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-white/5 border border-white/10 cursor-pointer"
          >
            <StockCard stock={stock} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

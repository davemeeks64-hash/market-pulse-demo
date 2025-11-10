"use client";

import { motion } from "framer-motion";
import StockCard from "./StockCard";

const MOCK_STOCKS = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corp",
    price: 119.42,
    changePct: 1.8,
    sentiment: "hot",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc",
    price: 202.14,
    changePct: -0.6,
    sentiment: "watch",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc",
    price: 226.03,
    changePct: 0.4,
    sentiment: "steady",
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 498.11,
    changePct: 2.1,
    sentiment: "hot",
  },
];

export default function MarketPulse() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Market Pulse</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_STOCKS.map((stock) => (
          <motion.div
            key={stock.symbol}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 25px rgba(0,255,180,0.2)",
            }}
            transition={{ duration: 0.25 }}
            className="rounded-xl bg-white/5 border border-white/10 cursor-pointer"
          >
            <StockCard stock={stock} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

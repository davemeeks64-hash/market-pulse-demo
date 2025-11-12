"use client";

import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Stock } from "@/types";

interface StockCardProps {
  stock: Stock;
}

export default function StockCard({ stock }: StockCardProps) {
  // Safety check
  if (!stock || !stock.symbol) {
    return (
      <motion.div
        className="p-4 rounded-xl bg-black/40 backdrop-blur-sm opacity-50"
        whileHover={{ scale: 1.03 }}
      >
        <p className="text-gray-500 text-sm">Loading...</p>
      </motion.div>
    );
  }

  // Glow style selection
  const glow =
    stock.sentiment === "hot" || stock.sentiment === "buy"
      ? "glow-hot"
      : stock.sentiment === "watch" || stock.sentiment === "hold"
      ? "glow-watch"
      : stock.sentiment === "steady" || stock.sentiment === "sell"
      ? "glow-steady"
      : "glow-neutral";

  // Chart data fallback
  const chartData =
    stock.sparkline && stock.sparkline.length > 1
      ? stock.sparkline.map((v, i) => ({ i, v }))
      : [
          { i: 0, v: stock.price },
          { i: 1, v: stock.price },
        ];

  return (
    <motion.div
      className={`p-4 rounded-xl bg-black/40 backdrop-blur-sm ${glow}`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">{stock.symbol}</h3>
        <p
          className={`text-sm ${
            stock.changePct >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {stock.changePct > 0 ? "+" : ""}
          {stock.changePct.toFixed(2)}%
        </p>
      </div>

      <p className="text-gray-300 text-sm mb-2">${stock.price.toFixed(2)}</p>

      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={stock.changePct >= 0 ? "#4ade80" : "#f87171"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

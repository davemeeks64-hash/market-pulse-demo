"use client";

import { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: string;
  sparkline: number[];
  watching: number;
}

const initialStocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 227.48,
    change: 2.15,
    changePct: 0.96,
    volume: "45.2M",
    watching: 3200,
    sparkline: [220, 222, 221, 225, 227, 226, 227.48],
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.91,
    change: -5.23,
    changePct: -2.06,
    volume: "89.1M",
    watching: 5100,
    sparkline: [250, 252, 251, 249, 248, 248.5, 248.91],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp",
    price: 135.67,
    change: 4.89,
    changePct: 3.74,
    volume: "67.3M",
    watching: 2800,
    sparkline: [130, 131, 132, 133, 134, 135, 135.67],
  },
];

export default function Home() {
  const [watchlist, setWatchlist] = useState<Stock[]>(initialStocks);

  const handleSwipe = (symbol: string) => (event: any, info: PanInfo) => {
    const { offset } = info;
    if (Math.abs(offset.x) > 100) {
      if (offset.x < 0) {
        // Swipe left → Remove
        setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
        console.log("Removed:", symbol);
      } else {
        // Swipe right → Alert
        alert(`Alert set for ${symbol}!`);
        console.log("Alert:", symbol);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-white p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">MicroTrade 5.0</h1>

      <div className="space-y-6 max-w-2xl mx-auto">
        {watchlist.map((stock) => {
          const isUp = stock.changePct > 0;
          return (
            <motion.div
              key={stock.symbol}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleSwipe(stock.symbol)}
              whileDrag={{ scale: 1.02 }}
              className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border ${
                isUp ? "border-green-500/30" : "border-red-500/30"
              } shadow-lg cursor-grab active:cursor-grabbing`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-lg font-bold">{stock.symbol}</p>
                  <p className="text-sm opacity-70">{stock.name}</p>
                </div>
                <p className="text-xs text-orange-400">3.2k watching</p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-mono font-bold">${stock.price.toFixed(2)}</p>
                  <p className={`text-lg font-medium ${isUp ? "text-green-400" : "text-red-400"}`}>
                    {isUp ? "+" : ""}{stock.change.toFixed(2)} ({isUp ? "+" : ""}{stock.changePct.toFixed(2)}%)
                  </p>
                </div>
                <div className="w-32 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stock.sparkline.map(p => ({ p }))}>
                      <Line
                        type="monotone"
                        dataKey="p"
                        stroke={isUp ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <p className="text-xs text-center mt-3 opacity-60">
                ← Swipe to Remove • Swipe → to Alert
              </p>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
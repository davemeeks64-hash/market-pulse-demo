"use client";

import { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Stock {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  sparkline: number[];
}

const initialStocks: Stock[] = [
  { symbol: "AAPL", price: 227.48, change: 2.15, changePct: 0.96, sparkline: [220, 222, 225, 227, 226, 227.48] },
  { symbol: "TSLA", price: 248.91, change: -5.23, changePct: -2.06, sparkline: [250, 252, 249, 248, 248.5, 248.91] },
  { symbol: "NVDA", price: 135.67, change: 4.89, changePct: 3.74, sparkline: [130, 132, 134, 135, 135, 135.67] },
];

export default function Home() {
  const [watchlist, setWatchlist] = useState<Stock[]>(initialStocks);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSwipe = (symbol: string) => (event: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
    } else if (info.offset.x > 100) {
      alert(`Alert set for ${symbol}`);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">MicroTrade</h1>
          <p className="text-xs opacity-70">{time.toLocaleTimeString()}</p>
        </div>

        <div className="space-y-4">
          {watchlist.map((stock) => {
            const isUp = stock.changePct > 0;
            return (
              <motion.div
                key={stock.symbol}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleSwipe(stock.symbol)}
                whileDrag={{ scale: 1.02 }}
                className="bg-gray-900 rounded-lg p-3 border border-gray-800 shadow-sm cursor-grab active:cursor-grabbing"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">{stock.symbol}</p>
                    <p className="text-xl font-mono">${stock.price.toFixed(2)}</p>
                  </div>
                  <p className={`text-sm font-medium ${isUp ? "text-green-400" : "text-red-400"}`}>
                    {isUp ? "+" : ""}{stock.changePct.toFixed(2)}%
                  </p>
                </div>

                <div className="h-10 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stock.sparkline.map(p => ({ p }))}>
                      <Line type="monotone" dataKey="p" stroke={isUp ? "#10b981" : "#ef4444"} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-2 overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-xs text-green-400 whitespace-nowrap"
          >
            AAPL: Apple AI chip launch | TSLA: Musk Mars tweet | NVDA: AI boom continues | BTC: $70k breakout | 
            AAPL: Apple AI chip launch | TSLA: Musk Mars tweet | NVDA: AI boom continues | BTC: $70k breakout
          </motion.div>
        </div>
      </div>
    </main>
  );
}

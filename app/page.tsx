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
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [time, setTime] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // PWA Install Prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
  };

  const handleSwipe = (symbol: string) => (event: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
    } else if (info.offset.x > 100) {
      alert(`Alert set for ${symbol}`);
    }
  };

  const addStock = () => {
    const s = input.trim().toUpperCase();
    if (s && !watchlist.some(st => st.symbol === s)) {
      setWatchlist(prev => [...prev, {
        symbol: s,
        price: Math.random() * 300 + 50,
        change: (Math.random() - 0.5) * 10,
        changePct: (Math.random() - 0.5) * 10,
        sparkline: Array.from({ length: 6 }, () => Math.random() * 300 + 50)
      }]);
      setInput("");
    }
  };

  return (
    <main className={`min-h-screen p-4 transition-colors ${dark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">MicroTrade</h1>
            <p className="text-xs opacity-70">{time.toLocaleTimeString()}</p>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Add Stock */}
        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && addStock()}
            placeholder="Add ticker..."
            className={`flex-1 px-3 py-2 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 ${
              dark ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
            }`}
          />
          <button
            onClick={addStock}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition"
          >
            Add
          </button>
        </div>

        {/* Stock Cards */}
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
                className={`bg-gray-900 rounded-lg p-3 border border-gray-800 shadow-sm cursor-grab active:cursor-grabbing ${
                  dark ? "" : "bg-white text-black border-gray-200"
                }`}
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

        {/* Install Button */}
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Install MicroTrade
          </button>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const API_URL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=demo&symbol=";

interface StockData {
  price: number;
  change: number;
  changePct: number;
  history: { time: number; price: number }[];
}

export default function Home() {
  const [watchlist, setWatchlist] = useState<string[]>(["AAPL", "TSLA", "NVDA"]);
  const [data, setData] = useState<Record<string, StockData>>({});
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Load watchlist from localStorage ONLY on client
  useEffect(() => {
    const saved = localStorage.getItem("microtrade-watchlist");
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem("microtrade-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const fetchStock = async (symbol: string): Promise<StockData | null> => {
    try {
      const res = await fetch(API_URL + symbol);
      const json = await res.json();
      const q = json["Global Quote"];
      if (!q) return null;

      const price = parseFloat(q["05. price"]);
      const change = parseFloat(q["09. change"]);
      const changePct = parseFloat(q["10. change percent"]);

      const history = Array.from({ length: 20 }, (_, i) => ({
        time: i,
        price: price * (1 + (Math.random() - 0.5) * 0.03),
      }));

      return { price, change, changePct, history };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const load = async () => {
      const results: Record<string, StockData> = {};
      for (const s of watchlist) {
        const stock = await fetchStock(s);
        if (stock) results[s] = stock;
      }
      setData(results);
      setLastUpdate(new Date());
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const add = () => {
    const s = input.trim().toUpperCase();
    if (s && !watchlist.includes(s)) {
      setWatchlist([...watchlist, s]);
      setInput("");
    }
  };

  return (
    <main className={`min-h-screen p-6 transition-all duration-300 ${dark ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-950 to-black text-white"}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold">MicroTrade 5.0</h1>
          {lastUpdate && (
            <p className="text-xs opacity-70 mt-1">
              Updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button onClick={() => setDark(!dark)} className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition">
          {dark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="flex gap-2 mb-8 max-w-md">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add symbol..."
          className="flex-1 p-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button onClick={add} className="p-3 bg-green-600 hover:bg-green-500 rounded-lg transition">
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlist.map((sym) => {
          const s = data[sym];
          const up = s?.changePct ? s.changePct > 0 : false;
          return (
            <div
              key={sym}
              className={`p-6 rounded-xl border-2 transition-all ${
                up ? "bg-green-900/30 border-green-500" : "bg-red-900/30 border-red-500"
              } backdrop-blur-sm shadow-lg`}
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-2xl font-bold">{sym}</h2>
                <button
                  onClick={() => setWatchlist(watchlist.filter((x) => x !== sym))}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {!s ? (
                <p className="text-gray-400 animate-pulse">Loading...</p>
              ) : (
                <>
                  <p className="text-3xl font-mono mb-2">${s.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {up ? <TrendingUp size={16} className="text-green-400" /> : <TrendingDown size={16} className="text-red-400" />}
                    <span className={up ? "text-green-400" : "text-red-400"}>
                      {up ? "+" : ""}{s.change.toFixed(2)} ({up ? "+" : ""}{s.changePct.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={s.history}>
                        <Line type="monotone" dataKey="price" stroke={up ? "#10b981" : "#ef4444"} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

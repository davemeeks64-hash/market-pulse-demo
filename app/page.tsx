cat > app/page.tsx << 'EOF'
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
        <h1 className="text-5xl md:text-6xl font-bold">MicroTrade 5.0</h1>
        <button onClick={() => setDark(!dark)} className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition">
          {dark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="flex gap-2 mb-8 max-w-md">
        <input
          value={input}

"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Free Alpha Vantage Demo (no key needed)
const API_URL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=demo&symbol=";

interface StockData {
  price: number;
  change: number;
  changePct: number;
  history: { time: string; price: number }[];
}

export default function Home() {
  const [watchlist, setWatchlist] = useState<string[]>(["AAPL", "TSLA", "NVDA"]);
  const [data, setData] = useState<Record<string, StockData>>({});
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStock = async (symbol: string) => {
    try {
      const res = await fetch(API_URL + symbol);
      const json = await res.json();
      const quote = json["Global Quote"];
      if (!quote) return null;

      const price = parseFloat(quote["05. price"]);
      const change = parseFloat(quote["09. change"]);
      const changePct = parseFloat(quote["10. change percent"]);

      // Generate fake history for sparkline (real API has TIME_SERIES)
      const history = Array.from({ length: 20 }, (_, i) => ({
        time: `${i}h`,
        price: price * (1 + (Math.random() - 0.5) * 0.05),
      }));

      return { price, change, changePct, history };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const results: Record<string, StockData> = {};
      for (const sym of watchlist) {
        const stock = await fetchStock(sym);
        if (stock) results[sym] = stock;
      }
      setData(results);
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [watchlist]);

  const add = () => {
    const sym = input.trim().toUpperCase();
    if (sym && !watchlist.includes(sym)) {
      setWatchlist([...watchlist, sym]);
      setInput("");
    }
  };

  const remove = (sym: string) => {
    setWatchlist(watchlist.filter(s => s !== sym));
  };

  return (
    <main className={`min-h-screen p-6 transition-all ${dark ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-950 to-black text-white"}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold animate-pulse">MicroTrade 5.0</h1>
        <button onClick={() => setDark(!dark)} className="p
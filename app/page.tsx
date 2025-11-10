"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const API_URL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=demo&symbol=";

export default function Home() {
  const [watchlist, setWatchlist] = useState(["AAPL", "TSLA", "NVDA"]);
  const [data, setData] = useState({});
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(false);

  const fetchStock = async (symbol) => {
    try {
      const res = await fetch(API_URL + symbol);
      const json = await res.json();
      const q = json["Global Quote"];
      if (!q) return null;
      return {
        price: parseFloat(q["05. price"]),
        change: parseFloat(q["09. change"]),
        changePct: parseFloat(q["10. change percent"]),
        history: Array.from({ length: 20 }, (_, i) => ({
          time: i,
          price: parseFloat(q["05. price"]) * (1 + (Math.random() - 0.5) * 0.03)
        }))
      };
    } catch { return null; }
  };

  useEffect(() => {
    const load = async () => {
      const results = {};
      for (const s of watchlist) {
        results[s] = await fetchStock(s);
      }
      setData(results);
    };
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, [watchlist]);

  const add = () => {
    const s = input.trim().toUpperCase();
    if (s && !watchlist.includes(s)) {
      setWatchlist([...watchlist, s]);
      setInput("");
    }
  };

  return (
    <main className={`min-h-screen p-6 ${dark ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-950 to-black text-white"}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold">MicroTrade 5.0</h1>
        <button onClick={() => setDark(!dark)} className="p-3 rounded-full bg-gray-800">
          {dark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="flex gap-2 mb-8 max-w-md">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add symbol..."
          className="flex-1 p-3 bg-gray-800 rounded-lg text-white"
        />
        <button onClick={add} className="p-3 bg-green-600 rounded-lg">
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {watchlist.map(sym => {
          const s = data[sym];
          const up = s?.changePct > 0;
          return (
            <div key={sym} className={`p-6 rounded-xl border-2 ${up ? "bg-green-900/30 border-green-500" : "bg-red-900/30 border-red-500"}`}>
              <div className="flex justify-between mb-2">
                <h2 className="text-2xl font-bold">{sym}</h2>
                <button onClick={() => setWatchlist(watchlist.filter(x => x !== sym))}>
                  <Trash2 size={18} className="text-red-400" />
                </button>
              </div>
              {!s ? <p>Loading...</p> : (
                <>
                  <p className="text-3xl font-mono">${s.price.toFixed(2)}</p>
                  <p className={up ? "text-green-400" : "text-red-400"}>
                    {up ? "+" : ""}{s.change.toFixed(2)} ({up ? "+" : ""}{s.changePct.toFixed(2)}%)
                  </p>
                  <div className="h-16 mt-3">
                    <ResponsiveContainer>
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

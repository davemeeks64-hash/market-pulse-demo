"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent: number;
}

const watchlist = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "TSLA", name: "Tesla Motors" },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "AMZN", name: "Amazon.com" },
  { symbol: "META", name: "Meta Platforms" },
];

export default function ResearchPage() {
  const [data, setData] = useState<MarketAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const apiKey = process.env.d418rp1r01qo6qdfg6hgd418rp1r01qo6qdfg6i0;

  async function fetchQuotes() {
    try {
      const responses = await Promise.all(
        watchlist.map((asset) =>
          fetch(
            `https://finnhub.io/api/v1/quote?symbol=${asset.symbol}&token=${apiKey}`
          ).then((r) => r.json())
        )
      );

     const merged = watchlist.map((asset, i) => ({
  ...asset,
  price: responses[i]?.c ?? 0,
  change: responses[i]?.d ?? 0,
  percent: responses[i]?.dp ?? 0,
}));


      setData(merged);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching live data:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 15000); // refresh every 15 s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-white"
      >
        Market Pulse (Live)
      </motion.h1>

      <p className="text-white/70">
        Live data updates every 15 seconds from Finnhub API.
      </p>
{/* Search input */}
<div className="mt-4">
  <input
    type="text"
    placeholder="Search symbol (e.g. AAPL)"
    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/40 outline-none"
    onChange={(e) => {
      const query = e.target.value.toUpperCase();
      if (query === "") {
        setData((prev) => [...prev]);
      } else {
        setData((prev) =>
          prev.filter((asset) =>
            asset.symbol.toUpperCase().includes(query)
          )
        );
      }
    }}
  />
</div>

      {loading ? (
        <p className="text-white/60">Loading live quotes ...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {data.map((asset, index) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-white">
                  {asset.symbol}
                </h2>
                <span
                  className={`text-sm ${
                    asset.change > 0
                      ? "text-emerald-400"
                      : asset.change < 0
                      ? "text-rose-400"
                      : "text-white/60"
                  }`}
                >
                  {asset.change > 0 ? "+" : ""}
                  {asset.percent.toFixed(2)}%
                </span>
              </div>
              <p className="text-white/60 text-sm mb-2">{asset.name}</p>
              <p className="text-white font-semibold text-lg">
                ${asset.price.toFixed(2)}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

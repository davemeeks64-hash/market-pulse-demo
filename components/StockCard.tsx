"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Stock {
  symbol: string;
  name?: string;
  price: number;
  changePct: number;
  sentiment: "hot" | "watch" | "steady";
  sparkline: number[];
}

export default function StockCard({ stock }: { stock: Stock }) {
  const data = stock.sparkline.map((value, index) => ({ index, value }));

  // Auto color sparkline based on price trend
  const isUp = stock.changePct >= 0;
  const lineColor = isUp ? "#4ade80" : "#f87171";

  // Sentiment badge styling
  const sentimentMap = {
    hot: "bg-red-500/20 text-red-300 border-red-500/30",
    watch: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    steady: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };

  return (
    <div
      className="
        p-4
        rounded-2xl
        bg-white/5
        border border-white/10
        hover:bg-white/10
        transition
        shadow-[0_0_10px_rgba(0,0,0,0.3)]
        backdrop-blur-md
        min-w-0
      "
    >
      {/* Header — symbol, name, sentiment */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="text-base font-semibold">{stock.symbol}</div>
          {stock.name && (
            <div className="text-xs text-gray-400">{stock.name}</div>
          )}
        </div>

        {/* Sentiment Tag */}
        <span
          className={`
            text-xs px-2 py-1
            border rounded-full
            ${sentimentMap[stock.sentiment]}
          `}
        >
          {stock.sentiment.toUpperCase()}
        </span>
      </div>

      {/* Price + Change */}
      <div className="flex items-end justify-between mb-3">
        <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>

        <div
          className={`
            text-sm font-semibold
            ${isUp ? "text-green-400" : "text-red-400"}
          `}
        >
          {isUp ? "+" : ""}
          {stock.changePct}%
        </div>
      </div>

      {/* Sparkline */}
      <div className="w-full h-[55px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

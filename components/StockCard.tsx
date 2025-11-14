"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Stock {
  symbol: string;
  price: number;
  changePct: number;
  sparkline: number[];
}

export default function StockCard({ stock }: { stock: Stock }) {
  // Convert numeric sparkline array → recharts data objects
  const data = stock.sparkline.map((value, index) => ({
    index,
    value,
  }));

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold">{stock.symbol}</div>

        <div
          className={`text-sm font-medium ${
            stock.changePct >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {stock.changePct >= 0 ? "+" : ""}
          {stock.changePct}%
        </div>
      </div>

      {/* Price */}
      <div className="text-xl font-bold mb-3">
        ${stock.price.toFixed(2)}
      </div>

      {/* Sparkline Chart */}
      <div className="w-full h-[50px] min-h-[50px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00c2ff"
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

"use client";
import { motion } from "framer-motion";

type Stock = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  sentiment: "hot" | "watch" | "steady";
};

const sentimentColors: Record<Stock["sentiment"], string> = {
  hot: "from-emerald-400/30 to-emerald-600/10",
  watch: "from-amber-400/30 to-amber-600/10",
  steady: "from-slate-400/30 to-slate-600/10",
};

export default function StockCard({ stock }: { stock: Stock }) {
  const isUp = stock.changePct >= 0;
  const gradient = sentimentColors[stock.sentiment];

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 30px rgba(0, 255, 180, 0.15)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`relative rounded-xl bg-gradient-to-br ${gradient} border border-white/10 p-4 flex flex-col gap-3 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-white/40">{stock.name}</p>
          <p className="text-lg font-semibold">{stock.symbol}</p>
        </div>
        <span
          className={`text-[0.6rem] px-2 py-1 rounded-full bg-white/10 text-white/70`}
        >
          {stock.sentiment === "hot"
            ? "🔥 Hot"
            : stock.sentiment === "watch"
            ? "👀 Watch"
            : "💤 Steady"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold">${stock.price.toFixed(2)}</p>
        <p
          className={`text-sm ${
            isUp ? "text-emerald-400" : "text-red-400"
          } font-medium`}
        >
          {isUp ? "+" : ""}
          {stock.changePct}%
        </p>
      </div>

      <p className="text-[0.65rem] text-white/30">
        Demo data • live feed coming soon
      </p>
    </motion.div>
  );
}

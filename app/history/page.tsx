"use client";

import { useTrades } from "@/context/TradeContext";

export default function HistoryPage() {
  const { trades, clearTrades } = useTrades();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Trade History</h1>

      {trades.length === 0 ? (
        <p className="text-white/60">No trades recorded yet.</p>
      ) : (
        <>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-white/70 border-b border-white/10">
                <th className="py-2">Symbol</th>
                <th className="py-2">Type</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Price</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id} className="border-b border-white/5 text-white/80">
                  <td className="py-2">{t.symbol}</td>
                  <td className={`py-2 ${t.type === "buy" ? "text-emerald-400" : "text-rose-400"}`}>
                    {t.type.toUpperCase()}
                  </td>
                  <td className="py-2">{t.quantity}</td>
                  <td className="py-2">${t.price.toFixed(2)}</td>
                  <td className="py-2 text-white/50">{t.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={clearTrades}
            className="mt-6 text-sm text-white/50 hover:text-rose-400 transition"
          >
            Clear History
          </button>
        </>
      )}
    </div>
  );
}

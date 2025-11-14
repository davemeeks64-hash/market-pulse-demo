"use client";

import MarketPulse from "@/components/MarketPulse";

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-black to-black text-white p-6">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-3">Market Research</h1>
        <p className="text-gray-400 mb-8 leading-relaxed max-w-3xl">
          Dive into AI-powered analysis and emerging trends.  
          Each signal is derived from technical, sentiment, and news-driven data —  
          guiding you toward hot, watch, or steady positions across multiple assets.
        </p>

        {/* --- AI / Data Visualization Placeholder --- */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          <div className="p-6 rounded-2xl bg-blue-900/20 border border-blue-500/20 hover:bg-blue-900/30 transition-all">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">AI Signal Summary</h3>
            <p className="text-sm text-gray-300">
              Adaptive algorithms analyze daily movements and rank assets by volatility,
              strength, and pattern stability.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-blue-900/20 border border-blue-500/20 hover:bg-blue-900/30 transition-all">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Sentiment Heat</h3>
            <p className="text-sm text-gray-300">
              Tracks crowd sentiment, correlating volume surges with trending tickers.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-blue-900/20 border border-blue-500/20 hover:bg-blue-900/30 transition-all">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Top Watchlist</h3>
            <p className="text-sm text-gray-300">
              Updated daily: tickers most frequently flagged as “on watch” by Noctive AI.
            </p>
          </div>
        </div>

        {/* --- Shared Market Pulse section --- */}
        <MarketPulse />
      </section>
    </main>
  );
}

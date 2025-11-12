"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const marketData = [
  { symbol: "AAPL", name: "Apple Inc.", trend: "up", change: 1.4, sentiment: "Bullish" },
  { symbol: "TSLA", name: "Tesla Motors", trend: "down", change: -2.1, sentiment: "Bearish" },
  { symbol: "NVDA", name: "NVIDIA Corp.", trend: "up", change: 3.2, sentiment: "Strong Buy" },
  { symbol: "AMZN", name: "Amazon.com", trend: "neutral", change: 0.2, sentiment: "Neutral" },
  { symbol: "META", name: "Meta Platforms", trend: "up", change: 1.1, sentiment: "Bullish" },
];

interface ChatMessage {
  role: "user" | "coach";
  content: string;
}

export default function Coach() {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Load memory
  useEffect(() => {
    const saved = localStorage.getItem("coachChat");
    if (saved) setChat(JSON.parse(saved));
  }, []);

  // Save memory
  useEffect(() => {
    localStorage.setItem("coachChat", JSON.stringify(chat.slice(-5)));
  }, [chat]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const query = input.toUpperCase().trim();
    setChat((prev) => [...prev, { role: "user", content: input }]);
    setIsThinking(true);
    setInput("");

    setTimeout(() => {
      let reply = "";

      // Try to match ticker
      const asset = marketData.find(
        (a) => a.symbol === query || query.includes(a.name.toUpperCase().split(" ")[0])
      );

      if (asset) {
        const emoji =
          asset.trend === "up" ? "📈" : asset.trend === "down" ? "📉" : "⚖️";
        reply = `${emoji} ${asset.name} (${asset.symbol}) is currently showing a ${asset.sentiment.toLowerCase()} sentiment with a ${asset.change > 0 ? "+" : ""}${asset.change}% change.`;
      } else if (query.includes("WHAT") || query.includes("MOVING")) {
        const movers = marketData
          .filter((a) => Math.abs(a.change) > 1)
          .map((a) => `${a.symbol} (${a.change > 0 ? "+" : ""}${a.change}%)`)
          .join(", ");
        reply = `Today's notable movers: ${movers}.`;
      } else {
        const genericReplies = [
          `That’s a good observation about "${input}". I’ll track sentiment for you.`,
          `Try asking “What’s moving today?” or mention a ticker like “NVDA.”`,
          `Markets are dynamic — let’s explore the pulse of the moment.`,
        ];
        reply =
          genericReplies[Math.floor(Math.random() * genericReplies.length)];
      }

      setChat((prev) => [...prev, { role: "coach", content: reply }]);
      setIsThinking(false);
    }, 1200);
  }

  function handleReset() {
    localStorage.removeItem("coachChat");
    setChat([]);
    setInput("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
    >
      {/* Avatar */}
      <motion.div
        className="relative w-14 h-14"
        animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/coach-avatar.png"
          alt="AI Coach"
          className="w-14 h-14 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,255,200,0.25)]"
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/25 to-cyan-500/10 blur-lg"
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: [1, 1.05, 1] }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl max-w-sm border border-white/10 shadow-[0_0_25px_rgba(0,255,200,0.12)]"
      >
        <div className="max-h-48 overflow-y-auto space-y-2 text-white/90 text-sm">
          {chat.length === 0 && (
            <p className="text-white/70">
              Welcome back, trader. Ask about a ticker — for example, “AAPL” or “What’s moving today?”
            </p>
          )}
          {chat.map((m, i) => (
            <p
              key={i}
              className={`${
                m.role === "user"
                  ? "text-cyan-300 text-right"
                  : "text-white/90 text-left"
              }`}
            >
              {m.content}
            </p>
          ))}
          {isThinking && (
            <p className="italic text-white/50 text-sm">Thinking...</p>
          )}
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="text-[11px] text-white/40 hover:text-cyan-300 mt-2 transition"
        >
          🗑 Reset Chat
        </button>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-3">
          <input
            type="text"
            placeholder="Ask about NVDA or say 'What’s moving?'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-transparent border-t border-white/10 mt-2 pt-2 text-sm text-white/80 placeholder-white/40 outline-none"
          />
        </form>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CoachState {
  message: string;
  mood: "neutral" | "encourage" | "praise" | "alert";
}

export default function Coach() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [coach, setCoach] = useState<CoachState>({
    message: "Hey trader 👋 — ready to learn or make a move?",
    mood: "neutral",
  });

  const [trades, setTrades] = useState<number>(0);
  const [lessons, setLessons] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);

  // 🧩 Load stored stats
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tradeData = JSON.parse(localStorage.getItem("tradeHistory") || "[]");
    const lessonData = JSON.parse(localStorage.getItem("lessons") || "[]");

    setTrades(tradeData.length);
    setLessons(lessonData.length);
    setCompleted(lessonData.filter((l: any) => l.completed).length);
  }, []);

  // 🌐 React to route changes and stats
  useEffect(() => {
    if (!pathname) return;

    let msg = "Welcome back, trader 👋";
    let mood: CoachState["mood"] = "neutral";

    switch (pathname) {
      case "/dashboard":
        msg =
          trades > 0
            ? `You're in control ⚡ ${trades} trades logged. Keep the flow steady.`
            : "Welcome to your Dashboard — ready to make your first move?";
        mood = "encourage";
        break;

      case "/trade":
        msg =
          trades > 10
            ? "Aggressive energy today 🔥 — balance your positions wisely."
            : "Set your trade up, analyze your move, and execute with clarity.";
        mood = trades > 10 ? "alert" : "neutral";
        break;

      case "/learn":
        msg =
          completed >= lessons * 0.8 && lessons > 0
            ? "Knowledge sharp — you’re nearly a pro 📘"
            : "Let’s absorb some new insight. Smart traders never stop learning.";
        mood = completed >= lessons * 0.8 ? "praise" : "encourage";
        break;

      case "/history":
        msg =
          trades > 0
            ? "Reflecting on your past trades builds mastery 📊"
            : "No trades yet? Start building your story on the Dashboard.";
        mood = "neutral";
        break;

      case "/research":
        msg = "Scanning the market trends... stay ahead of the noise 📡";
        mood = "encourage";
        break;

      default:
        msg = "Every good trader stays adaptable 🧭";
        mood = "neutral";
    }

    setCoach({ message: msg, mood });
  }, [pathname, trades, lessons, completed]);

  // ✨ Glow color based on mood
  const moodColor =
    coach.mood === "praise"
      ? "from-emerald-400/30"
      : coach.mood === "encourage"
      ? "from-cyan-400/30"
      : coach.mood === "alert"
      ? "from-red-400/30"
      : "from-white/10";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 right-6 z-50 w-72 rounded-2xl bg-white/5 border border-white/10 p-4 text-white backdrop-blur-md shadow-[0_0_25px_rgba(0,255,180,0.15)] overflow-hidden"
        >
          <motion.div
            className={`absolute inset-0 bg-gradient-to-tr ${moodColor} to-transparent`}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="text-emerald-300 w-4 h-4" />
              <h2 className="text-sm font-semibold text-white/90">Coach</h2>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="text-white/40 hover:text-white/80 text-xs"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-white/80 mt-3 relative z-10 leading-relaxed">
            {coach.message}
          </p>

          <div className="mt-3 text-xs text-white/50 relative z-10">
            <p>📈 Trades: {trades}</p>
            <p>🎓 Lessons: {completed}/{lessons}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

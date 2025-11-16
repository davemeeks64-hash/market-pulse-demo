"use client";

import { motion } from "framer-motion";
import { Badge } from "@/hooks/useAchievements";

export default function BadgePopup({
  badge,
  onClose,
}: {
  badge: Badge | null;
  onClose: () => void;
}) {
  if (!badge) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-5 rounded-3xl text-center shadow-2xl"
      >
        <div className="text-5xl mb-2">{badge.icon}</div>
        <h2 className="text-xl font-bold text-white">{badge.title}</h2>
        <p className="text-sm text-gray-300 mt-1">{badge.description}</p>

        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}

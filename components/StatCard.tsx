"use client";
import { motion } from "framer-motion";

type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  tone?: "up" | "down" | "neutral";
};

const toneColors = {
  up: "text-emerald-400",
  down: "text-red-400",
  neutral: "text-white/60",
};

export default function StatCard({
  title,
  value,
  change,
  tone = "neutral",
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        backgroundColor: "rgba(255,255,255,0.05)",
      }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-white/10 p-4 flex flex-col gap-2 backdrop-blur-sm bg-white/5"
    >
      <p className="text-xs uppercase tracking-wide text-white/40">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {change && <p className={`text-xs ${toneColors[tone]}`}>{change}</p>}
    </motion.div>
  );
}

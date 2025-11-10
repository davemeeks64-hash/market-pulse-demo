"use client";
import { motion } from "framer-motion";

export default function HoloBackground() {
  return (
    <motion.div
      initial={{ opacity: 0.2 }}
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none"
    >
      {/* Vertical light streaks */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_120%,rgba(0,255,200,0.2),transparent_70%)] blur-2xl" />
      <motion.div
        initial={{ backgroundPositionY: "100%" }}
        animate={{ backgroundPositionY: "0%" }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,180,0.05)_0px,transparent_2px,transparent_4px)]"
      />
    </motion.div>
  );
}

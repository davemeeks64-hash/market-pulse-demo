"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Lesson {
  id: number;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: "Understanding MicroTrading",
    level: "Beginner",
    description: "Learn the basics of micro trading, position sizing, and market rhythm.",
  },
  {
    id: 2,
    title: "Chart Reading Fundamentals",
    level: "Beginner",
    description: "Discover how to interpret candles, trends, and price action with confidence.",
  },
  {
    id: 3,
    title: "Advanced Trade Psychology",
    level: "Intermediate",
    description: "Explore trader mindset, risk management, and emotional balance.",
  },
  {
    id: 4,
    title: "Algorithmic MicroStrategies",
    level: "Advanced",
    description: "Dive into AI-driven signals, auto-execution, and pattern learning.",
  },
];

export default function LearnPage() {
  const [completed, setCompleted] = useState<number[]>([]);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("learnProgress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("learnProgress", JSON.stringify(completed));
  }, [completed]);

  const toggleComplete = (id: number) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Learn with MicroTrade Coach
      </h1>
      <p className="text-white/70 mb-8">
        These short modules will sharpen your trading mindset and strategy.  
        Track your progress as you level up.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-5 rounded-2xl border ${
              completed.includes(lesson.id)
                ? "border-emerald-400 bg-emerald-500/10"
                : "border-white/10 bg-white/5"
            } shadow-lg backdrop-blur-md`}
          >
            <h2 className="text-lg font-semibold text-white mb-1">
              {lesson.title}
            </h2>
            <p className="text-sm text-white/60 mb-3">{lesson.description}</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs ${
                lesson.level === "Beginner"
                  ? "bg-cyan-500/20 text-cyan-300"
                  : lesson.level === "Intermediate"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-purple-500/20 text-purple-300"
              }`}
            >
              {lesson.level}
            </span>

            <button
              onClick={() => toggleComplete(lesson.id)}
              className={`absolute bottom-4 right-4 px-3 py-1 text-sm rounded-md font-semibold ${
                completed.includes(lesson.id)
                  ? "bg-emerald-500 text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {completed.includes(lesson.id) ? "Completed" : "Mark Done"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

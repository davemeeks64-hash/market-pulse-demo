"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Lesson {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  description: string;
}

export default function LearnPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filter, setFilter] = useState<string>("all");

  // Load lessons from localStorage or set defaults
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("lessons");
    if (stored) {
      setLessons(JSON.parse(stored));
    } else {
      const defaultLessons: Lesson[] = [
        {
          id: 1,
          title: "Understanding Market Orders",
          category: "Basics",
          completed: false,
          description:
            "Learn how market orders execute instantly and what that means for liquidity.",
        },
        {
          id: 2,
          title: "Risk Management 101",
          category: "Risk",
          completed: false,
          description:
            "Explore position sizing, stop losses, and managing exposure.",
        },
        {
          id: 3,
          title: "Technical Patterns",
          category: "Technical",
          completed: false,
          description:
            "Recognize common price patterns and trend confirmations in charts.",
        },
        {
          id: 4,
          title: "Trader Psychology",
          category: "Psychology",
          completed: false,
          description:
            "Control emotions, avoid FOMO, and develop a consistent trading mindset.",
        },
      ];
      setLessons(defaultLessons);
      localStorage.setItem("lessons", JSON.stringify(defaultLessons));
    }
  }, []);

  // Save progress whenever updated
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("lessons", JSON.stringify(lessons));
  }, [lessons]);

  const toggleLesson = (id: number) => {
    const updated = lessons.map((lesson) =>
      lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson
    );
    setLessons(updated);
  };

  const filteredLessons =
    filter === "all"
      ? lessons
      : lessons.filter((lesson) => lesson.category === filter);

  return (
    <div className="p-6 flex flex-col gap-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Learn Center</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white/10 border border-white/10 text-sm rounded-lg p-2 focus:outline-none"
        >
          <option value="all">All Lessons</option>
          <option value="Basics">Basics</option>
          <option value="Risk">Risk</option>
          <option value="Technical">Technical</option>
          <option value="Psychology">Psychology</option>
        </select>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,180,0.1)]"
      >
        <p className="text-sm text-white/60">
          Progress:{" "}
          <span className="text-emerald-300 font-semibold">
            {
              lessons.filter((l) => l.completed).length
            }/{lessons.length}
          </span>{" "}
          lessons completed
        </p>
        <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${
                (lessons.filter((l) => l.completed).length / lessons.length) * 100
              }%`,
            }}
            transition={{ duration: 0.6 }}
            className="h-full bg-emerald-400 rounded-full"
          />
        </div>
      </motion.div>

      {/* Lesson Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredLessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`relative overflow-hidden rounded-2xl p-4 border ${
                lesson.completed
                  ? "border-emerald-400/40 bg-emerald-400/10"
                  : "border-white/10 bg-white/5"
              } backdrop-blur-md shadow-[0_0_15px_rgba(0,255,180,0.1)]`}
            >
              <h2 className="text-lg font-semibold mb-2">{lesson.title}</h2>
              <p className="text-sm text-white/60 mb-4">
                {lesson.description}
              </p>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleLesson(lesson.id)}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  lesson.completed
                    ? "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300"
                    : "bg-white/10 border border-white/10 text-white/70 hover:bg-white/15"
                }`}
              >
                {lesson.completed ? "Completed ✅" : "Mark Complete"}
              </motion.button>

              {/* Glow effect when completed */}
              {lesson.completed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

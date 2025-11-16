"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CoachModal from "@/components/CoachModal";
import { useAchievements } from "@/hooks/useAchievements";
import BadgePopup from "@/components/BadgePopup";

// --------------------------
// Lesson Definitions
// --------------------------

type Lesson = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate";
  summary: string;
  bullets: string[];
};

const lessons: Lesson[] = [
  {
    id: "what-is-stock",
    title: "What is a Stock?",
    level: "Beginner",
    summary:
      "Learn what a stock is, why companies issue them, and what it means to own a share.",
    bullets: [
      "Stocks represent partial ownership in a company.",
      "Companies sell stock to raise money for growth.",
      "Shareholders can benefit from price moves and dividends.",
    ],
  },
  {
    id: "what-is-microtrading",
    title: "What is Micro-Trading?",
    level: "Beginner",
    summary:
      "Micro-trading focuses on smaller trade sizes and controlled risk instead of going all-in.",
    bullets: [
      "Use small trade sizes to stay in the game longer.",
      "Micro trades help you practice with less risk.",
      "Multiple small trades often beat one giant bet.",
    ],
  },
  {
    id: "order-types",
    title: "Order Types 101",
    level: "Beginner",
    summary:
      "Understand market, limit, stop, and take-profit orders — the same types you see in the trade ticket.",
    bullets: [
      "Market orders fill at the best available price now.",
      "Limit orders set the max you’ll pay or min you’ll accept.",
      "Stop orders trigger when the price hits a chosen level.",
      "Take-profit orders lock in gains automatically.",
    ],
  },
  {
    id: "risk-management",
    title: "Risk Management Basics",
    level: "Intermediate",
    summary:
      "How to avoid blowing up your account – position sizing, stops, and planned exits.",
    bullets: [
      "Never risk your account on one trade.",
      "Use stop losses to limit downside.",
      "Micro trades + planned exits = more control.",
    ],
  },
];

// --------------------------
// Progress Tracking
// --------------------------

type LearnProgress = {
  completed: string[];
  lastLessonId: string | null;
};

const defaultProgress: LearnProgress = {
  completed: [],
  lastLessonId: lessons[0].id,
};

const STORAGE_KEY = "learnProgress";

// --------------------------
// Learn Page Component
// --------------------------

export default function LearnPage() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    lessons[0]
  );
  const [progress, setProgress] =
    useState<LearnProgress>(defaultProgress);
  const [showCoach, setShowCoach] = useState(false);

  // Achievements hook
  const {
    badges,
    unlock,
    getUnlocked,
    getLocked,
    showPopup,
    setShowPopup,
  } = useAchievements();

  // Load saved progress safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        const safe: LearnProgress = {
          completed: Array.isArray(parsed.completed)
            ? parsed.completed
            : [],
          lastLessonId: parsed.lastLessonId || lessons[0].id,
        };

        setProgress(safe);

        const last = lessons.find(
          (l) => l.id === safe.lastLessonId
        );
        if (last) setSelectedLesson(last);

        return;
      }

      // if nothing stored
      setProgress(defaultProgress);
      setSelectedLesson(lessons[0]);
    } catch (err) {
      console.error("Failed to load learn progress:", err);
      setProgress(defaultProgress);
      setSelectedLesson(lessons[0]);
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // --------------------------
  // Helpers
  // --------------------------

  const completedCount = progress.completed.length;
  const totalLessons = lessons.length;
  const percent =
    totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

  const isLessonCompleted = (id: string) =>
    progress.completed.includes(id);

  const isLessonLocked = (lesson: Lesson) => {
    const index = lessons.findIndex((l) => l.id === lesson.id);
    if (index === 0) return false; // first always unlocked

    const prev = lessons[index - 1];
    return !progress.completed.includes(prev.id);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    if (isLessonLocked(lesson)) return;
    setSelectedLesson(lesson);

    setProgress((prev) => ({
      ...prev,
      lastLessonId: lesson.id,
    }));
  };

  const handleResume = () => {
    const lesson = lessons.find(
      (l) => l.id === progress.lastLessonId
    );
    if (lesson) setSelectedLesson(lesson);
  };

  // --------------------------
  // Mark Complete + Achievements
  // --------------------------

  const handleMarkComplete = () => {
    if (!selectedLesson) return;

    // already completed
    if (isLessonCompleted(selectedLesson.id)) return;

    const updatedCompleted = [
      ...progress.completed,
      selectedLesson.id,
    ];

    setProgress((prev) => ({
      ...prev,
      completed: updatedCompleted,
      lastLessonId: selectedLesson.id,
    }));

    // 🔥 Unlock First Lesson Badge
    if (progress.completed.length === 0) {
      unlock("first-lesson");
    }

    // 🔥 Unlock Beginner Badge
    const beginnerIds = lessons
      .filter((l) => l.level === "Beginner")
      .map((l) => l.id);

    const allBeginnerDone = beginnerIds.every((id) =>
      updatedCompleted.includes(id)
    );

    if (allBeginnerDone) {
      unlock("all-beginner");
    }

    // 🔥 Unlock Course Complete Badge
    const allDone = lessons.every((l) =>
      updatedCompleted.includes(l.id)
    );

    if (allDone) {
      unlock("course-complete");
    }
  };

  // --------------------------
  // UI Render
  // --------------------------

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#050814] to-blue-600 text-white p-4">
      <section className="max-w-5xl mx-auto space-y-5">
        
        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Learn</h1>
            <p className="text-sm text-gray-400">
              Micro-trading lessons, progress tracking, and built-in coaching.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Image
              src="/assets/coach-avatar.png"
              alt="Coach"
              width={56}
              height={56}
              className="hidden sm:block rounded-full border border-white/20"
            />
            <button
              onClick={() => setShowCoach(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm"
            >
              Ask Coach
            </button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Course Progress</span>
            <span>
              {completedCount}/{totalLessons} • {percent}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          {progress.lastLessonId && (
            <button
              onClick={handleResume}
              className="mt-1 text-xs text-blue-300 hover:text-blue-200 underline"
            >
              Resume last lesson
            </button>
          )}
        </div>

        {/* ACHIEVEMENTS */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase">
            Achievements
          </h2>

          <div className="flex flex-wrap gap-3 mt-2">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`flex flex-col items-center p-2 rounded-xl w-20 text-center border ${
                  b.unlockedAt
                    ? "border-green-400/30"
                    : "border-white/10 opacity-40"
                }`}
              >
                <div className="text-3xl">{b.icon}</div>
                <span className="text-[11px] text-gray-200 mt-1">
                  {b.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid gap-4 md:grid-cols-[2fr,3fr]">
          
          {/* LESSON LIST */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-300 uppercase">
              Lessons
            </h2>

            {lessons.map((lesson) => {
              const locked = isLessonLocked(lesson);
              const completed = isLessonCompleted(lesson.id);
              const active = selectedLesson?.id === lesson.id;

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  disabled={locked}
                  className={`
                    w-full text-left p-3 rounded-xl border text-sm transition
                    ${
                      locked
                        ? "bg-black/30 border-white/5 text-gray-500 cursor-not-allowed"
                        : active
                        ? "bg-blue-600/40 border-blue-400 text-white"
                        : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                    }
                  `}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold flex items-center gap-2">
                      {lesson.title}

                      {completed && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">
                          Done
                        </span>
                      )}

                      {locked && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-200 border border-yellow-500/40">
                          Locked
                        </span>
                      )}
                    </span>

                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-gray-300">
                      {lesson.level}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-2">
                    {lesson.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* LESSON CONTENT */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            {selectedLesson ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedLesson.title}
                    </h2>
                    <p className="text-xs text-gray-400">
                      Level: {selectedLesson.level}
                    </p>
                  </div>

                  {isLessonCompleted(selectedLesson.id) && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">
                      Completed
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-300">
                  {selectedLesson.summary}
                </p>

                <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
                  {selectedLesson.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                  <div className="space-y-1 max-w-xs">
                    <p className="text-xs text-gray-400">
                      Need help? Ask the MicroTrade Coach to explain this in simple terms.
                    </p>
                    <button
                      onClick={() => setShowCoach(true)}
                      className="text-xs text-blue-300 hover:text-blue-200 underline"
                    >
                      Ask Coach about this lesson
                    </button>
                  </div>

                  <button
                    onClick={handleMarkComplete}
                    disabled={isLessonCompleted(selectedLesson.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                      isLessonCompleted(selectedLesson.id)
                        ? "bg-white/10 text-gray-400"
                        : "bg-green-600 hover:bg-green-500 text-white"
                    }`}
                  >
                    {isLessonCompleted(selectedLesson.id)
                      ? "Marked as complete"
                      : "Mark as complete"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-300">
                Select a lesson from the left to get started.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Coach Modal */}
      <CoachModal show={showCoach} onClose={() => setShowCoach(false)} />

      {/* Badge Popup */}
      <BadgePopup badge={showPopup} onClose={() => setShowPopup(null)} />
    </main>
  );
}

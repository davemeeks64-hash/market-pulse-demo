"use client";

import { useEffect, useState } from "react";

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji for now
  unlockedAt: string | null;
};

const defaultBadges: Badge[] = [
  {
    id: "first-lesson",
    title: "First Step",
    description: "You completed your first lesson.",
    icon: "🌟",
    unlockedAt: null,
  },
  {
    id: "all-beginner",
    title: "Beginner Trader",
    description: "Completed all beginner lessons.",
    icon: "📘",
    unlockedAt: null,
  },
  {
    id: "course-complete",
    title: "MicroTrade Scholar",
    description: "Completed all lessons.",
    icon: "🎓",
    unlockedAt: null,
  },
  {
    id: "coach-ask",
    title: "Coach Talker",
    description: "You asked the AI Coach a question.",
    icon: "🤖",
    unlockedAt: null,
  },
  {
    id: "secret",
    title: "Secret Badge",
    description: "You found something special.",
    icon: "🌀",
    unlockedAt: null,
  },
];

const STORAGE_KEY = "achievements";

export function useAchievements() {
  const [badges, setBadges] = useState<Badge[]>(defaultBadges);
  const [showPopup, setShowPopup] = useState<Badge | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setBadges(parsed);
      }
    } catch {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
  }, [badges]);

  const unlock = (id: string) => {
    setBadges((prev) => {
      const updated = prev.map((badge) =>
        badge.id === id && !badge.unlockedAt
          ? { ...badge, unlockedAt: new Date().toISOString() }
          : badge
      );

      const unlocked = updated.find((b) => b.id === id);
      if (unlocked && !unlocked.unlockedAt) {
        setShowPopup(unlocked);
      }

      return updated;
    });
  };

  const getUnlocked = () => badges.filter((b) => b.unlockedAt);
  const getLocked = () => badges.filter((b) => !b.unlockedAt);

  return {
    badges,
    unlock,
    getUnlocked,
    getLocked,
    showPopup,
    setShowPopup,
  };
}

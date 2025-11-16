"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CoachId = "semi" | "hoodie" | "buddy" | "hologram";

interface CoachProfile {
  id: CoachId;
  label: string;
  subtitle: string;
  vibe: string;
  tone: "calm" | "hype" | "friendly" | "futuristic";
  badge: string; // short label
}

interface CoachContextType {
  activeCoach: CoachProfile;
  setCoachById: (id: CoachId) => void;
  allCoaches: CoachProfile[];
}

const COACH_STORAGE_KEY = "microtrade_active_coach_v1";

const COACHES: CoachProfile[] = [
  {
    id: "semi",
    label: "Semi",
    subtitle: "Calm microtrade analyst",
    vibe: "Keeps you grounded, explains risk and position sizing without hype.",
    tone: "calm",
    badge: "Risk & Sizing",
  },
  {
    id: "hoodie",
    label: "Hoodie",
    subtitle: "Street-smart momentum scout",
    vibe: "Speaks like a hustler, but reminds you to keep position sizes micro.",
    tone: "hype",
    badge: "Momentum Vibes",
  },
  {
    id: "buddy",
    label: "Buddy",
    subtitle: "Beginner-friendly navigator",
    vibe: "Explains terms in plain language and slows everything down.",
    tone: "friendly",
    badge: "Beginner Mode",
  },
  {
    id: "hologram",
    label: "Hologram",
    subtitle: "Noctive oracle mode",
    vibe: "Futuristic, pattern-focused, talks in probabilities and scenarios.",
    tone: "futuristic",
    badge: "Pattern Vision",
  },
];

const CoachContext = createContext<CoachContextType | undefined>(undefined);

export const CoachProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeCoachId, setActiveCoachId] = useState<CoachId>("semi");

  // load preferred coach
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(COACH_STORAGE_KEY);
    if (!saved) return;
    if (saved === "semi" || saved === "hoodie" || saved === "buddy" || saved === "hologram") {
      setActiveCoachId(saved);
    }
  }, []);

  // save when changed
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(COACH_STORAGE_KEY, activeCoachId);
  }, [activeCoachId]);

  const setCoachById = (id: CoachId) => setActiveCoachId(id);

  const activeCoach =
    COACHES.find((c) => c.id === activeCoachId) ?? COACHES[0];

  return (
    <CoachContext.Provider
      value={{ activeCoach, setCoachById, allCoaches: COACHES }}
    >
      {children}
    </CoachContext.Provider>
  );
};

export const useCoach = () => {
  const ctx = useContext(CoachContext);
  if (!ctx) {
    throw new Error("useCoach must be used within a CoachProvider");
  }
  return ctx;
};

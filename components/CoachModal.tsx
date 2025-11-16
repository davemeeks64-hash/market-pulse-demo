"use client";

import { useCoach } from "@/context/CoachContext";

interface CoachModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CoachModal({ open, onClose }: CoachModalProps) {
  const { activeCoach, allCoaches, setCoachById } = useCoach();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70">
      <div
        className="bg-[#050814] border border-white/20 rounded-2xl p-4 sm:p-5 w-full max-w-lg mx-3 mb-6 sm:mb-0 shadow-[0_0_35px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-[11px] text-gray-400">Noctive Coach</p>
            <h2 className="text-lg sm:text-xl font-bold">
              {activeCoach.label}{" "}
              <span className="text-xs text-gray-300">
                • {activeCoach.subtitle}
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20"
          >
            Close
          </button>
        </div>

        {/* Personality row */}
        <div className="flex flex-wrap gap-2 mb-3">
          {allCoaches.map((coach) => {
            const isActive = coach.id === activeCoach.id;
            return (
              <button
                key={coach.id}
                onClick={() => setCoachById(coach.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] border transition ${
                  isActive
                    ? "bg-blue-600 border-blue-400 text-white"
                    : "bg-white/5 border-white/15 text-gray-200 hover:bg-white/10"
                }`}
              >
                {coach.label}
              </button>
            );
          })}
        </div>

        {/* Vibe description */}
        <div className="mb-3 rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-gray-200">
          <p className="font-semibold mb-1">How {activeCoach.label} thinks</p>
          <p>{activeCoach.vibe}</p>
        </div>

        {/* Suggested actions (static for now, but feels “AI”) */}
        <div className="space-y-2 text-xs">
          <p className="text-gray-300 font-semibold">
            Quick prompts for this screen:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-200">
            <li>“Explain the risk on this trade size.”</li>
            <li>“Walk me through what could go wrong.”</li>
            <li>“Show me how to micro-size this idea.”</li>
          </ul>
          <p className="text-[11px] text-gray-500 mt-2">
            In a future version, this panel can connect to a live AI backend. For now,
            it sets the tone and presets for how MicroTrade’s coach talks to the user.
          </p>
        </div>
      </div>
    </div>
  );
}

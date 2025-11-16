"use client";

import { useCoach } from "@/context/CoachContext";

interface CoachButtonProps {
  onOpen: () => void;
}

export default function CoachButton({ onOpen }: CoachButtonProps) {
  const { activeCoach } = useCoach();

  return (
    <button
      onClick={onOpen}
      className="
        fixed bottom-4 right-4 z-40
        flex items-center gap-2
        rounded-full
        bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
        px-3 py-2
        shadow-[0_0_20px_rgba(37,99,235,0.7)]
        border border-white/30
        text-xs sm:text-sm font-semibold
        hover:scale-[1.02]
        transition
      "
    >
      <div className="w-7 h-7 rounded-full bg-black/40 border border-white/40 flex items-center justify-center text-[10px] uppercase tracking-wide">
        {activeCoach.label}
      </div>
      <div className="flex flex-col text-left">
        <span>AI Coach</span>
        <span className="text-[10px] text-blue-100">
          {activeCoach.badge}
        </span>
      </div>
    </button>
  );
}

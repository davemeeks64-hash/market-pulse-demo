"use client";

import Image from "next/image";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import CoachButton from "@/components/CoachButton";
import CoachModal from "@/components/CoachModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showCoach, setShowCoach] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Holographic Header */}
      <header
        className="
          sticky top-0 z-40
          border-b border-white/10
          bg-black/50 backdrop-blur-xl
          relative
          before:absolute before:inset-0 
          before:bg-gradient-to-r before:from-blue-600/20 before:via-purple-600/10 before:to-blue-600/20
          before:blur-xl before:opacity-40
        "
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 relative z-10">

          <div className="flex items-center gap-3">
            <Image
  src="/assets/logo.png"
  alt="MicroTrade — Noctive Edition"
  width={34}
  height={34}
  priority
  className="rounded-lg shadow-md"
/>


            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-wide">
                MicroTrade 5.0
              </span>
              <span className="text-[11px] text-gray-400">Noctive Edition</span>
            </div>
          </div>

          <span className="text-[11px] text-gray-300">
            Micro-sized moves. Big-picture clarity.
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24">{children}</main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Floating Coach Button */}
      <div className="fixed bottom-24 right-5 z-50">
        <CoachButton onOpen={() => setShowCoach(true)} />
      </div>

      {/* AI Coach Modal */}
      <CoachModal open={showCoach} onClose={() => setShowCoach(false)} />
    </div>
  );
}

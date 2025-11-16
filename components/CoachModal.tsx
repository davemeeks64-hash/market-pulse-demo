"use client";

import { useState } from "react";
import { useCoach } from "@/context/CoachContext";

interface CoachModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CoachModal({ open, onClose }: CoachModalProps) {
  const { activeCoach, allCoaches, setCoachById } = useCoach();

  // New tab state
  const [tab, setTab] = useState<"overview" | "ask">("overview");

  // Ask Coach states
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  // Simulated answer (no API)
  const handleAsk = () => {
    if (!question.trim()) return;

    const reply = `
Here’s how ${activeCoach.label} breaks it down:

• **${question}**
• Think small, micro-size, and stay flexible.
• Focus on learning, process, and repetition.
• You’ll find the full breakdown in the Learn tab.

_Not financial advice — educational only._
    `.trim();

    setResponse(reply);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70">
      <div
        className="bg-[#050814] border border-white/20 rounded-2xl p-4 sm:p-5 w-full max-w-lg mx-3 mb-6 sm:mb-0 shadow-[0_0_35px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-[11px] text-gray-400">Noctive Coach</p>
            <h2 className="text-lg sm:text-xl font-bold">
              {activeCoach.label}{" "}
              <span className="text-xs text-gray-300">• {activeCoach.subtitle}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20"
          >
            Close
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("overview")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              tab === "overview"
                ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setTab("ask")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              tab === "ask"
                ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
            }`}
          >
            Ask Coach
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="space-y-4">

            {/* Personality buttons */}
            <div className="flex flex-wrap gap-2">
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
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-gray-200">
              <p className="font-semibold mb-1">How {activeCoach.label} thinks</p>
              <p>{activeCoach.vibe}</p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-2 text-xs">
              <p className="text-gray-300 font-semibold">Quick prompts for this screen:</p>
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
        )}

        {/* ASK COACH TAB */}
        {tab === "ask" && (
          <div className="space-y-3">

            <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-gray-200">
              <p className="font-semibold mb-1">Ask {activeCoach.label} anything</p>
              <p className="text-gray-400">
                Learning-focused, simplified answers. Tied into the Learn tab philosophy.
              </p>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a trading question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 bg-white/10 text-white rounded-xl p-2 border border-white/20 text-sm"
              />
              <button
                onClick={handleAsk}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold"
              >
                Ask
              </button>
            </div>

            {/* Response */}
            {response && (
              <div className="rounded-xl bg-white/10 border border-white/20 p-3 text-xs whitespace-pre-line text-gray-200">
                {response}
              </div>
            )}

            <p className="text-[11px] text-gray-500 border-t border-white/10 pt-2">
              Responses are simulated for now. In MicroTrade 6.0, this can connect to a
              real AI backend using user context + Learn modules.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

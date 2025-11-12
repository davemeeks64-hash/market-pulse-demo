"use client";

import { redirect } from "next/navigation";
import MarketPulse from "@/components/MarketPulse";

export default function HomePage() {
  // If you plan to redirect to a dashboard later, uncomment below:
  // redirect("/dashboard");

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">MicroTrade Market Pulse</h1>

        {/* Main MarketPulse component */}
        <MarketPulse />

        <footer className="text-center text-gray-500 mt-10 text-sm">
          Data shown for demo purposes — powered by MicroTrade 5.0 (Noctive Edition)
        </footer>
      </section>
    </main>
  );
}

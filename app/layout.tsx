import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { TradeProvider } from "@/context/TradeContext";

export const metadata: Metadata = {
  title: "MicroTrade 5.0 — Noctive Edition",
  description: "A modern micro-trading experience powered by AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className="
          min-h-screen
          bg-gradient-to-b
          from-black
          via-black
          to-[#001b3d]
          text-white
          antialiased
        "
      >
        <TradeProvider>
          <main className="min-h-screen pb-24">
            {children}
          </main>

          <BottomNav />
        </TradeProvider>
      </body>
    </html>
  );
}

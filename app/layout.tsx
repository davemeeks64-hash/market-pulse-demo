import type { Metadata } from "next";
import "./globals.css";
import { TradeProvider } from "@/context/TradeContext";
import { CoachProvider } from "@/context/CoachContext";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "MicroTrade 5.0 — Noctive Edition",
  description: "Micro-sized trading for the modern retail investor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <TradeProvider>
          <CoachProvider>
            <ClientLayout>{children}</ClientLayout>
          </CoachProvider>
        </TradeProvider>
      </body>
    </html>
  );
}

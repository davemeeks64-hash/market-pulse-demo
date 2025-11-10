import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import Coach from "@/components/Coach";

export const metadata = {
  title: "MicroTrade 5.0 — Noctive Edition",
  description: "AI-powered trading and learning platform by Noctive",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
        {/* Sidebar */}
        <aside className="w-56 flex flex-col justify-between border-r border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="p-4">
            <h1 className="text-xl font-bold mb-6">MicroTrade 5.0</h1>
            <nav className="space-y-3">
              <Link href="/dashboard" className="block hover:text-cyan-300">
                Dashboard
              </Link>
              <Link href="/trade" className="block hover:text-cyan-300">
                Trade
              </Link>
              <Link href="/history" className="block hover:text-cyan-300">
                History
              </Link>
              <Link href="/learn" className="block hover:text-cyan-300">
                Learn
              </Link>
              <Link href="/research" className="block hover:text-cyan-300">
                Research
              </Link>
            </nav>
          </div>
          <p className="text-xs text-center opacity-60 pb-4">Noctive Edition</p>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-10 overflow-y-auto">{children}</main>

        {/* Floating AI Coach */}
        <Coach />
      </body>
    </html>
  );
}

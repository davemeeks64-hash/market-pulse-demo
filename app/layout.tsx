import "./globals.css";
import Link from "next/link";
import { TradeProvider } from "@/context/TradeContext";
import Coach from "@/components/Coach";

export const metadata = {
  title: "MicroTrade 5.0 — Noctive Edition",
  description: "AI-powered trading dashboard with live data and coach integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
        <TradeProvider>
          {/* Sidebar */}
          <aside className="w-56 flex flex-col justify-between border-r border-white/10 bg-white/5 backdrop-blur-md">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-6">
  <img
    src="/logo.png"
    alt="MicroTrade 5.0"
    className="w-10 h-10 rounded-lg shadow-lg"
  />
  <span className="text-lg font-semibold tracking-wide">MicroTrade 5.0</span>
</div>

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

          {/* Main content area */}
          <main className="flex-1 p-10 overflow-y-auto relative">
            {children}
            <div className="absolute bottom-6 right-6 z-50">
              <Coach />
            </div>
          </main>
        </TradeProvider>
      </body>
    </html>
  );
}

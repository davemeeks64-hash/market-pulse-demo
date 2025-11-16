"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Trade", href: "/trade" },
  { name: "Research", href: "/research" },
  { name: "History", href: "/history" },
  { name: "Learn", href: "/learn" },

  // ⭐ NEW TAB: Crypto Corner
  { name: "Crypto", href: "/crypto-corner" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black/40 backdrop-blur-md border-t border-white/10 py-3 flex justify-around text-sm z-50">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-3 py-1 rounded-lg transition-all ${
              active ? "text-blue-400 font-semibold" : "text-white/60"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}


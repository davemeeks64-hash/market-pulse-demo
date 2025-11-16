"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type TradeType = "buy" | "sell";

export interface Trade {
  id: string;
  symbol: string;
  quantity: number;   // shares or coins
  dollars: number;    // notional
  price: number;
  fee: number;
  orderType: string;
  type: TradeType;
  timestamp: string;
  status: string;
}

interface TradeContextType {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, "id">) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

const STORAGE_KEY = "microtrade_trades_v1";

export const TradeProvider = ({ children }: { children: React.ReactNode }) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  // Load trades on startup
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null;
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setTrades(parsed);
      }
    } catch {
      // ignore corrupted localStorage
    }
  }, []);

  // Save trades whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  }, [trades]);

  const addTrade = (trade: Omit<Trade, "id">) => {
    setTrades((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...trade,
      },
    ]);
  };

  return (
    <TradeContext.Provider value={{ trades, addTrade }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => {
  const ctx = useContext(TradeContext);
  if (!ctx) {
    throw new Error("useTrades must be used within a TradeProvider");
  }
  return ctx;
};

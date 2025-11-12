"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface Trade {
  id: number;
  symbol: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  timestamp: string;
}

interface TradeContextProps {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, "id" | "timestamp">) => void;
  clearTrades: () => void;
}

const TradeContext = createContext<TradeContextProps | undefined>(undefined);

export const TradeProvider = ({ children }: { children: React.ReactNode }) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("trades");
    if (stored) setTrades(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  const addTrade = (trade: Omit<Trade, "id" | "timestamp">) => {
    const newTrade = {
      ...trade,
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
    };
    setTrades((prev) => [...prev, newTrade]);
  };

  const clearTrades = () => setTrades([]);

  return (
    <TradeContext.Provider value={{ trades, addTrade, clearTrades }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => {
  const ctx = useContext(TradeContext);
  if (!ctx)
    throw new Error("useTrades must be used within a TradeProvider");
  return ctx;
};

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Trade = {
  id: string;
  symbol: string;
  quantity: number;
  dollars: number;
  price: number;
  fee: number;
  orderType: "market" | "limit" | "stop" | "takeprofit";
  type: "buy" | "sell";
  timestamp: string;
  status: string;
};

export type TradeContextType = {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, "id">) => void;
  clearTrades: () => void;   // <-- ✅ FIX: Add this
};

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider = ({ children }: { children: ReactNode }) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  const addTrade = (trade: Omit<Trade, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);

    setTrades((prev) => [
      ...prev,
      {
        ...trade,
        id,
      },
    ]);
  };

  // ✅ FIX: Clear all trades
  const clearTrades = () => {
    setTrades([]);
  };

  return (
    <TradeContext.Provider value={{ trades, addTrade, clearTrades }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error("useTrades must be used within a TradeProvider");
  }
  return context;
};

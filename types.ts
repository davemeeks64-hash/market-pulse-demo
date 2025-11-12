// types.ts
export interface Stock {
  symbol: string;
  name?: string;
  price: number;
  changePct: number;
  sentiment: string; // "hot", "watch", "steady", "buy", "sell", etc.
  sparkline?: number[];
}

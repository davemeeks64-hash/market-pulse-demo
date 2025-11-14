export interface Stock {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  sentiment: "hot" | "watch" | "steady";
  sparkline: number[];
}

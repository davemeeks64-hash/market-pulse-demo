"use client";

import { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Stock {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  sparkline: number[];
}

const initialStocks: Stock[] = [
  { symbol: "AAPL", price: 227.48, change: 2.15, changePct: 0.96, sparkline: [220, 222, 225, 227, 226, 227.48] },
  { symbol: "TSLA", price: 248.91, change: -5.23, changePct: -2.06, sparkline: [250, 252, 249, 248, 248.5, 248.91] },
  { symbol: "NVDA", price: 135.67, change: 4.89, changePct: 3.74, sparkline: [130, 132, 134, 135, 135, 135.67] },
];

export default function Home() {
  const [watchlist, setWatchlist] = useState<Stock[]>(initialStocks);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSwipe = (symbol: string) => (event: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
    } else if (info.offset.x > 100) {
      alert(`Alert set for ${symbol}`);
    }
  };

  return (
    <div className="max-w-md mx-auto">
  <div className="flex flex-col items-center gap-1 mb-6">
    <img 
      src="data:image/png;base64,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"
      alt="MicroTrade"
      className="w-12 h-12"
    />
    <span className="text-3xl font-bold">MicroTrade</span>
    <span className="text-sm font-medium text-green-500">5.0</span>
  </div>

  <div className="space-y-4">
          {watchlist.map((stock) => {
            const isUp = stock.changePct > 0;
              return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col items-center gap-1 mb-6">
          <img 
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAIAAADdvvtQAAAHUklEQVR4nO3ce2yV9R3H8e+59H6htIVKu57WKp2XpKgVLW7DgpKAMBMUt8xp3D/b8JtdSFxSHcO5GLdlJmM3d4vJ/mBKMFuWyTSBUrDbCChIkK2VXrgUWtYLnMOhpddzzv44elLaUg58DlT6vF//ned5zu95zvm98/Q8J6ePKz29woAr5Z7uA8D1jYAgISBICAgSAoKEgCAhIEgICBICgoSAICEgSAgIEgKChIAgISBICAgSAoKEgCAhIEi8030An1531u4Z+/DAT6qm60g+zTgDTW5cPZMugRHQpC7WCg1NREDjTV0JDY1DQBeIpw8aGouAICEgSAgIEgKChIAuEM+3hXyjOJbLaXfnuAbXUI4qjDMQJAQECQFBQkCQEBAkBAQJAUFCQJAQECQEBAkBQUJAkBAQJAQECQFBQkCQEBAkBAQJAUFyXf4megb/b+h193tqzkCQEBAkBAQJAUFCQJAQECQEBAkBQUJAkBAQJAQECQFBQkCQEBAkBAQJAUFCQJAQECQEBAkBQUJAkBAQJAQECQFBQkCQEBAkBAQJAUFCQJAQECQEBAkBQUJAkBAQJAQECQFBQkCQEBAkBAQJAUFCQJAQECQEBAkBQUJAkHin+wCutf/e+7Pp2vXte783Xbu+ehx3BpquWZyR9ZgDA7LpmMuZWo85MyC7tjM6g+sxxwZk12peZ3Y95uSA7OrP7oyvxxwekF3NOXZCPUZAdnVm2iH1GAFFJXa+nVOPEVBMombdUfUYAY2lz73T6jECGkcpwIH1GAFNdGUdOLMeI6BJXW4Njq3HCOhi4m/CyfUYAU0hnjIcXo8R0NSm7oN6jIAu6WKVUE8UAV3axFaoJ4aA4jK2GOoZi4DiFe2GesYhoMtAPRMRECSu9PSK6T4GXMc4A0FCQJAQECQEBAkBQUJAkBAQJAQEiXp/oAXPNgRb/3n0b9+PPiz94ouzPrvk4CuLU/PLMovv6D3w1/iHyimvnnP3l80so3hB/4mDZtbzwZuBj+ov+cSKdXUf/vzBi63NKr3Ht7x2ONhlZn0nD55q+F10uScls2TVBm9azuhA4PjWH4WG+uI/VMSoAUVCzym5JS6XOxIJm7mSZxdFQsNmNth7ZLD3yGUNFWjeFWjeZWYV6+paXn9aPLCYpMy8rr2bJqZ8w31f6ztxoPu9N+be83jBoqc6d/0mUXt0lATcoWyg63D6vNv6O/+TVjB/oLs1Na80ujx6YvCm5RSvqPWmzoqER479/YXR8/6KdXVnm98933U40LTDt3K9OyktPDLQ/o+XRvpPTxw8tvG5Y/t8y2s9qZmnD77V/f4b3oxc34rnPalZw/6T0S09qVnFy571ZuS6PEkd9b88f6oxujwpM3/w9PGJI2ffdF/r5hoz8zdtv/lLGwnoyiTgM1DwyJ6ssiozy76x6tzRPePWFj1QE/iovuX1p/2N2+Z94etm5vIk+xu39+zbUvRAjb9xW8uf1/obtxUtrZl08NjGcyrXdL77avOmtXPv/aqZFS2t8Tdtb9n0zUBLg9ubYmZFS57p2b+ldfMzx9/6oW/Fc7ERvBl5s276XPkTfyhb80pKTtGY5bkj/WfMbKTvtDcjT38fnCkRAR3dm1W60MyySu8+d+z9cWuzShYGDu80szOH3u7c9aqZWSQUPPaemWX6Kv1NdWbmb6rLLKmcfPRPNu7Y+euUvJKCqic9KRlmluW7K/rxKNj6r0g4ZGbZZVWF1d+Z//hvS1a94E5Kc7liLy0y0N3SvOkbZw5t9a14Xn+9GCsBf8JCg0GLhJOzC8wsNNQ/frX744mMRMLRD6qRcMgi4TgHj2184+qXA4d39ux/c85dj5qZy5P08RYut7lcZmZuT9uW74ZHh83lzvzMgsgnu+jZt2Uk2GVmZ5sbipfXxkYe7T+TlJE70teblJk3OtlfT8QjMZfxwSN75i1eO/H0Y2bnOxtz5i82s7wFDxdWf2vsqr72/Tm3LDWznFuW9rXvn3oX6TfcGmja4fYmR9PpP/lhdNic8vvNXNEls8qrzSy7bFHBoqdiTyys/nb2zZ83s/TC2we728zMnZxmZsG23bNvW2Zms29ddrZt95W/eGdLzG1+g23/Lrx/bdNrT0xc1bFjo++h9fmVa0JD/ce3vnjBqvpf+R5an3/H6vDIYPvbL029i94P/lL+5B8HultCQ30uT9LJ+l+UrNyQX/lYf8eh6HVfx46Nxcufy79zdSQcOvHOj2NPPNXw+5KVP5i78Cvh0FD7Oy+bWdkjP23dXPO/3X8qWbUhp3xJ9DI+Ae+CI/GDMkj4JhoSAoKEgCAhIEgICBICgoSAICEgSAgIEgKChIAgISBICAgSAoKEgCAhIEgICBICgoSAICEgSAgIEgKChIAgISBICAgSAoKEgCAhIEgICBICgoSAIPk/ryMJPDblRbMAAAAASUVORK5CYII="
            alt="MicroTrade"
            className="w-12 h-12"
          />
          <span className="text-3xl font-bold">MicroTrade</span>
          <span className="text-sm font-medium text-green-500">5.0</span>
        </div>

        <div className="space-y-4">
          {watchlist.map((stock) => {
            const isUp = stock.changePct > 0;
            return (
              <motion.div
                key={stock.symbol}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleSwipe(stock.symbol)}
                whileDrag={{ scale: 1.02

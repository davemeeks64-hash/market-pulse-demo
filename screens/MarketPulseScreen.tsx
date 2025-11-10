// screens/MarketPulseScreen.tsx
import React from 'react';
import { View, FlatList } from 'react-native';
import StockCard from '../components/StockCard';

const mockStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 227.48,
    change: 2.15,
    changePct: 0.96,
    volume: "45.2M",
    watching: 3200,
    sparkline: [220, 222, 221, 225, 227, 226, 227.48],
  },
  // Add more...
];

export default function MarketPulseScreen() {
  return (
    <FlatList
      data={mockStocks}
      keyExtractor={(item) => item.symbol}
      renderItem={({ item }) => (
        <StockCard
          stock={item}
          onRemove={() => console.log("Remove", item.symbol)}
          onAlert={() => console.log("Alert", item.symbol)}
        />
      )}
    />
  );
}
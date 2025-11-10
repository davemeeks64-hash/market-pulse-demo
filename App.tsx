// App.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MarketPulseScreen from './screens/MarketPulseScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
      <MarketPulseScreen />
    </GestureHandlerRootView>
  );
}
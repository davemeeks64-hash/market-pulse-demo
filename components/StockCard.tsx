// components/StockCard.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanGestureHandler,
} from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: string;
  sparkline: number[];
  watching: number;
}

interface StockCardProps {
  stock: StockData;
  onRemove: () => void;
  onAlert: () => void;
}

const CARD_HEIGHT = 160;
const SWIPE_THRESHOLD = 100;

export default function StockCard({ stock, onRemove, onAlert }: StockCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    outputRange: [0.7, 1, 0.7],
  });

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    const { translationX, state } = event.nativeEvent;

    if (state === 5) {
      const absX = Math.abs(translationX);

      if (absX > SWIPE_THRESHOLD) {
        const direction = translationX > 0 ? 1 : -1;
        const targetX = direction * 300;

        Animated.spring(translateX, {
          toValue: targetX,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            if (direction < 0) onRemove();
            else onAlert();
          }, 200);
        });
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const isUp = stock.changePct > 0;
  const bgColor = isUp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
  const borderColor = isUp ? '#10b981' : '#ef4444';

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <View style={[styles.actionLeft, { backgroundColor: '#ef4444' }]}>
          <Text style={styles.actionText}>Remove</Text>
        </View>
        <View style={[styles.actionRight, { backgroundColor: '#10b981' }]}>
          <Text style={styles.actionText}>Alert</Text>
        </View>
      </View>

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX }],
              opacity,
              backgroundColor: bgColor,
              borderColor,
            },
          ]}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.ticker}>{stock.symbol}</Text>
              <Text style={styles.name}>{stock.name}</Text>
            </View>
            <Text style={styles.watching}>3.2k</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
            <Text style={[styles.change, { color: isUp ? '#10b981' : '#ef4444' }]}>
              {isUp ? '+' : ''}{stock.change.toFixed(2)} ({isUp ? '+' : ''}{stock.changePct.toFixed(2)}%)
            </Text>
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              style={{ height: 40 }}
              data={stock.sparkline}
              svg={{ stroke: isUp ? '#10b981' : '#ef4444', strokeWidth: 2 }}
              contentInset={{ top: 10, bottom: 10 }}
              curve={shape.curveMonotoneX}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.volume}>Vol: {stock.volume}</Text>
            <Text style={styles.trend}>{isUp ? 'Trending' : 'Quiet'}</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: CARD_HEIGHT, marginVertical: 8, marginHorizontal: 16 },
  actionContainer: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', justifyContent: 'space-between' },
  actionLeft: { flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 150 },
  actionRight: { flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 150 },
  actionText: { color: 'white', fontWeight: '600', fontSize: 16 },
  card: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  ticker: { fontSize: 14, fontWeight: '600', color: '#e0e0e0' },
  name: { fontSize: 12, color: '#888', marginTop: 2 },
  watching: { fontSize: 12, color: '#fb923c' },
  priceRow: { marginTop: 8 },
  price: { fontSize: 28, fontWeight: 'bold', color: '#fff', fontVariant: ['tabular-nums'] },
  change: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  chartContainer: { flex: 1, marginVertical: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  volume: { fontSize: 11, color: '#888' },
  trend: { fontSize: 11, color: '#e0e0e0' },
});
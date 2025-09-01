import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  isLive?: boolean;
}

const LiveCandlestickChart = () => {
  const [historicalCandles, setHistoricalCandles] = useState<CandleData[]>([]);
  const [liveCandle, setLiveCandle] = useState<CandleData | null>(null);
  const [currentPrice, setCurrentPrice] = useState(100);
  const intervalRef = useRef<number | null>(null);
  const priceUpdateRef = useRef<number | null>(null);
  
  const CANDLE_INTERVAL = 5000; // 5 seconds for demo
  const PRICE_UPDATE_INTERVAL = 200; // 200ms price updates
  
  // Chart dimensions
  const chartWidth = screenWidth - 80;
  const chartHeight = 300;
  const candleWidth = 8;
  const candleSpacing = 2;
  const totalCandleWidth = candleWidth + candleSpacing;
  
  // Generate initial historical data
  useEffect(() => {
    const generateInitialData = () => {
      const data = [];
      let price = 100;
      const now = Date.now();
      
      for (let i = 20; i >= 1; i--) {
        const open = price;
        const change = (Math.random() - 0.5) * 5;
        const close = Math.max(50, open + change);
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        
        data.push({
          timestamp: now - (i * CANDLE_INTERVAL),
          open,
          high,
          low,
          close,
        });
        
        price = close;
      }
      
      setHistoricalCandles(data);
      setCurrentPrice(price);
    };
    
    generateInitialData();
  }, []);
  
  // Start live candle and price updates
  useEffect(() => {
    if (historicalCandles.length === 0) return;
    
    const startLiveCandle = () => {
      const lastCandle = historicalCandles[historicalCandles.length - 1];
      const open = lastCandle ? lastCandle.close : currentPrice;
      
      const newLiveCandle: CandleData = {
        timestamp: Date.now(),
        open,
        high: open,
        low: open,
        close: open,
        isLive: true,
      };
      
      setLiveCandle(newLiveCandle);
      setCurrentPrice(open);
    };
    
    const updatePrice = () => {
      setCurrentPrice(prevPrice => {
        const change = (Math.random() - 0.5) * 2; // Random price movement
        const newPrice = Math.max(50, Math.min(150, prevPrice + change));
        
        // Update live candle
        setLiveCandle(prevCandle => {
          if (!prevCandle) return prevCandle;
          
          return {
            ...prevCandle,
            close: newPrice,
            high: Math.max(prevCandle.high, newPrice),
            low: Math.min(prevCandle.low, newPrice),
          };
        });
        
        return newPrice;
      });
    };
    
    const finalizeLiveCandle = () => {
      setLiveCandle(prevCandle => {
        if (!prevCandle) return null;
        
        // Add completed candle to historical data
        const completedCandle = { ...prevCandle, isLive: false };
        setHistoricalCandles(prev => [...prev, completedCandle]);
        
        // Start new live candle
        setTimeout(startLiveCandle, 100);
        
        return null;
      });
    };
    
    // Start the first live candle
    startLiveCandle();
    
    // Set up price updates
    priceUpdateRef.current = setInterval(updatePrice, PRICE_UPDATE_INTERVAL);
    
    // Set up candle completion
    intervalRef.current = setInterval(finalizeLiveCandle, CANDLE_INTERVAL);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (priceUpdateRef.current) clearInterval(priceUpdateRef.current);
    };
  }, [historicalCandles.length]);
  
  // Calculate price range for scaling
  const calculatePriceRange = () => {
    const allCandles = [...historicalCandles];
    if (liveCandle) allCandles.push(liveCandle);
    
    if (allCandles.length === 0) return { min: 90, max: 110 };
    
    const highs = allCandles.map(c => c.high);
    const lows = allCandles.map(c => c.low);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const padding = (max - min) * 0.1;
    
    return { min: min - padding, max: max + padding };
  };
  
  const priceRange = calculatePriceRange();
  
  // Convert price to Y coordinate
  const priceToY = (price: number) => {
    return chartHeight - ((price - priceRange.min) / (priceRange.max - priceRange.min)) * chartHeight;
  };
  
  // Render a single candle
  const renderCandle = (candle: CandleData, index: number) => {
    const x = index * totalCandleWidth;
    const centerX = x + candleWidth / 2;
    
    const openY = priceToY(candle.open);
    const highY = priceToY(candle.high);
    const lowY = priceToY(candle.low);
    const closeY = priceToY(candle.close);
    
    const isGreen = candle.close >= candle.open;
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(2, Math.abs(closeY - openY));
    
    const bodyColor = isGreen ? '#10B981' : '#EF4444';
    const wickColor = isGreen ? '#059669' : '#DC2626';
    const opacity = candle.isLive ? 0.7 : 1;
    
    return (
      <View key={`${candle.timestamp}-${index}`} style={{ position: 'absolute' }}>
        {/* Wick */}
        <View
          style={{
            position: 'absolute',
            left: centerX - 0.5,
            top: highY,
            width: 1,
            height: lowY - highY,
            backgroundColor: wickColor,
            opacity,
          }}
        />
        {/* Body */}
        <View
          style={{
            position: 'absolute',
            left: x,
            top: bodyTop,
            width: candleWidth,
            height: bodyHeight,
            backgroundColor: bodyColor,
            opacity,
            borderWidth: candle.isLive ? 1 : 0,
            borderColor: candle.isLive ? '#FFF' : 'transparent',
          }}
        />
      </View>
    );
  };
  
  // Calculate visible candles (last 15 candles + live candle)
  const visibleCandles = [...historicalCandles.slice(-15)];
  if (liveCandle) visibleCandles.push(liveCandle);
  
  return (
    <View style={{ flex: 1, backgroundColor: '#000', padding: 20 }}>
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: '#FFF', fontSize: 24, fontWeight: 'bold' }}>
          SOLUSDT Live Chart
        </Text>
        <Text style={{ color: '#10B981', fontSize: 18, marginTop: 5 }}>
          ${currentPrice.toFixed(2)}
        </Text>
        <Text style={{ color: '#666', fontSize: 14 }}>
          {liveCandle ? 'Live Candle Active' : 'Starting...'}
        </Text>
      </View>
      
      {/* Price Scale */}
      <View style={{ position: 'absolute', right: 20, top: 80 }}>
        {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
          const price = priceRange.min + (priceRange.max - priceRange.min) * (1 - ratio);
          return (
            <Text
              key={ratio}
              style={{
                color: '#666',
                fontSize: 12,
                position: 'absolute',
                top: ratio * chartHeight - 8,
              }}
            >
              ${price.toFixed(1)}
            </Text>
          );
        })}
      </View>
      
      {/* Chart Area */}
      <View
        style={{
          width: chartWidth,
          height: chartHeight,
          backgroundColor: '#111',
          position: 'relative',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* Grid Lines */}
        {[0.25, 0.5, 0.75].map(ratio => (
          <View
            key={ratio}
            style={{
              position: 'absolute',
              top: ratio * chartHeight,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: '#333',
              opacity: 0.3,
            }}
          />
        ))}
        
        {/* Candles */}
        {visibleCandles.map((candle, index) => renderCandle(candle, index))}
      </View>
      
      {/* Info Panel */}
      <View style={{ marginTop: 20, backgroundColor: '#111', padding: 15, borderRadius: 8 }}>
        <Text style={{ color: '#FFF', fontSize: 16, marginBottom: 10 }}>
          Current Candle Info:
        </Text>
        {liveCandle && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: '#666', fontSize: 12 }}>Open</Text>
              <Text style={{ color: '#FFF', fontSize: 14 }}>${liveCandle.open.toFixed(2)}</Text>
            </View>
            <View>
              <Text style={{ color: '#666', fontSize: 12 }}>High</Text>
              <Text style={{ color: '#10B981', fontSize: 14 }}>${liveCandle.high.toFixed(2)}</Text>
            </View>
            <View>
              <Text style={{ color: '#666', fontSize: 12 }}>Low</Text>
              <Text style={{ color: '#EF4444', fontSize: 14 }}>${liveCandle.low.toFixed(2)}</Text>
            </View>
            <View>
              <Text style={{ color: '#666', fontSize: 12 }}>Close</Text>
              <Text style={{ color: liveCandle.close >= liveCandle.open ? '#10B981' : '#EF4444', fontSize: 14 }}>
                ${liveCandle.close.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </View>
      
      {/* Status */}
      <View style={{ marginTop: 10, alignItems: 'center' }}>
        <Text style={{ color: '#666', fontSize: 12 }}>
          New candle every 5 seconds • Price updates every 200ms
        </Text>
      </View>
    </View>
  );
};

export default LiveCandlestickChart;
import { Canvas, Line, Rect } from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { fetchCandleData, generateCandleData } from '../services/api';
import { CandleData, CandlestickChartProps } from '../types/candlestick';
import { calculatePriceRange, priceToY } from '../utils/chartUtils';
import { ChartGrid } from './ChartGrid';
import { ChartHeader } from './ChartHeader';
import { ErrorState } from './ErrorState';
import { LoadingSpinner } from './LoadingSpinner';
import { PriceLabels } from './PriceLabels';

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  symbol = 'SOLUSDT',
  interval = '1m',
  width = Dimensions.get('window').width,
  height = 400,
}) => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const translateX = useSharedValue(0);
  
  // Chart dimensions
  const chartWidth = width - 60;
  const chartHeight = height - 80;
  const chartLeft = 10;
  const chartTop = 30;
  
  // Candle sizing
  const candleWidth = 8;
  const rightPadding = 60;
  const candleSpacing = 2;
  const totalCandleWidth = candleWidth + candleSpacing;
  
  // Calculate price range
  const priceRange = useMemo(() => {
    if (data.length === 0) return { min: 0, max: 100 };
    return calculatePriceRange(data);
  }, [data]);
  
  // Calculate initial position to show the end of the chart
  const calculateInitialPosition = (dataLength: number) => {
    const totalWidth = dataLength * totalCandleWidth + rightPadding;
  
    // Case 1: chart is wider than screen → scrollable
    if (totalWidth > chartWidth) {
      return chartWidth - totalWidth; // align to the right end (latest candles)
    }
  
    // Case 2: chart fits in screen → stick candles to the right
    return chartWidth - (totalWidth);
  };
  

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      const apiData = await fetchCandleData(symbol, interval);
      if (apiData.length > 0) {
        setData(apiData);
        // Set initial position to show the end of the chart
        const initialPosition = calculateInitialPosition(apiData.length);
        translateX.value = initialPosition;
      } else {
        setError('Failed to fetch data from API');
      }
      setLoading(false);
    };
    
    loadData();
  }, [symbol, interval]);
  
  // Refresh data function
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    const apiData = await fetchCandleData(symbol, interval);
    if (apiData.length > 0) {
      setData(apiData);
      // Maintain position at the end after refresh
      const initialPosition = calculateInitialPosition(apiData.length);
      translateX.value = initialPosition;
    } else {
      setError('Failed to fetch data from API');
      const demoData = generateCandleData(50);
      setData(demoData);
      const initialPosition = calculateInitialPosition(demoData.length);
      translateX.value = initialPosition;
    }
    setLoading(false);
  };
  
  // Pan gesture for scrolling
  const panGesture = Gesture.Pan()
  .onStart(() => {
    // do nothing if chart is smaller than screen
    const totalWidth = data.length * totalCandleWidth + rightPadding;
    if (totalWidth <= chartWidth) return;
  })
  .onUpdate((event) => {
    const totalWidth = data.length * totalCandleWidth + rightPadding;

    if (totalWidth <= chartWidth) {
      // lock candles to right side
      translateX.value = chartWidth - totalWidth;
      return;
    }

    const maxTranslate = Math.min(0, chartWidth - totalWidth);
    const sensitivity = 0.5;
    const newTranslateX = translateX.value + (event.translationX * sensitivity);

    translateX.value = Math.max(maxTranslate, Math.min(0, newTranslateX));
  })
  .onEnd((event) => {
    const totalWidth = data.length * totalCandleWidth + rightPadding;

    if (totalWidth <= chartWidth) {
      // lock candles to right side
      translateX.value = chartWidth - totalWidth;
      return;
    }

    const maxTranslate = Math.min(0, chartWidth - totalWidth);
    const momentum = event.velocityX * 0.005;
    let targetX = translateX.value + momentum;

    targetX = Math.max(maxTranslate, Math.min(0, targetX));

    translateX.value = withSpring(targetX, {
      damping: 20,
      stiffness: 200,
      velocity: event.velocityX * 0.005,
    });
  });

  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }), []);
  
  // Render candlesticks
  const renderCandles = () => {
    return data.map((candle, index) => {
      const x = index * totalCandleWidth;
      const centerX = x + candleWidth / 2;
      
      const openY = priceToY(candle.open, priceRange, chartHeight);
      const highY = priceToY(candle.high, priceRange, chartHeight);
      const lowY = priceToY(candle.low, priceRange, chartHeight);
      const closeY = priceToY(candle.close, priceRange, chartHeight);
      
      const isGreen = candle.close > candle.open;
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(2, Math.abs(closeY - openY));
      
      const color = isGreen ? '#10B981' : '#EF4444';
      const wickColor = isGreen ? '#059669' : '#DC2626';
      
      return (
        <React.Fragment key={index}>
          <Line
            p1={{ x: centerX, y: highY }}
            p2={{ x: centerX, y: lowY }}
            color={wickColor}
            strokeWidth={1}
          />
          <Rect
            x={x}
            y={bodyTop}
            width={candleWidth}
            height={bodyHeight}
            color={color}
          />
        </React.Fragment>
      );
    });
  };
  
  // Show loading state
  if (loading) {
    return <LoadingSpinner message="Loading chart data..." />;
  }

  // Show error state if no data
  if (data.length === 0) {
    return (
      <ErrorState 
        message="No data available" 
        onRetry={refreshData}
        retryText="Retry"
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ }}>
      <View style={{ 
        width, 
        height, 
        backgroundColor: '#111',
        position: 'relative',
      }}>
        <ChartHeader
          symbol={symbol}
          currentPrice={data[data.length - 1]?.close || 0}
          error={error}
          loading={loading}
          onRefresh={refreshData}
        />
        
        <PriceLabels
          priceRange={priceRange}
          chartTop={chartTop}
          chartHeight={chartHeight}
        />
        
        {/* Chart Area */}
        <View style={{
          position: 'absolute',
          left: chartLeft,
          top: chartTop,
          width: chartWidth,
          height: chartHeight,
          overflow: 'hidden',
        }}>
          <ChartGrid
            chartWidth={chartWidth}
            chartHeight={chartHeight}
          />
          
          {/* Scrollable Candles */}
          <GestureDetector gesture={panGesture}>
            <Animated.View 
              style={[
                {
                  width: data.length * totalCandleWidth,  
                  height: chartHeight,
                },
                animatedStyle
              ]}
            >
              <Canvas 
                style={{ 
                  width: data.length * totalCandleWidth,
                  height: chartHeight 
                }}
              >
                {renderCandles()}
              </Canvas>
            </Animated.View>
          </GestureDetector>
        </View>
        
        {/* <InfoPanel data={data} /> */}
      </View>
    </GestureHandlerRootView>
  );
}; 

export default CandlestickChart;
import { CandleData } from '../types/candlestick';

export const formatPrice = (price: number): string => {
  // Handle large numbers like 12345678 -> 1234.5678
  if (price >= 10000) {
    return (price / 10000).toFixed(4);
  }
  // Handle smaller numbers with 4 decimal places
  return price.toFixed(4);
};

export const calculatePriceRange = (data: CandleData[]) => {
  const allPrices = data.flatMap(d => [d.open, d.high, d.low, d.close]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const padding = (maxPrice - minPrice) * 0.05;
  
  return {
    min: minPrice - padding,
    max: maxPrice + padding,
  };
};

export const priceToY = (price: number, priceRange: { min: number; max: number }, chartHeight: number): number => {
  const ratio = (price - priceRange.min) / (priceRange.max - priceRange.min);
  return chartHeight - (ratio * chartHeight);
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}; 
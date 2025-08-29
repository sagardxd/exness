import { CandleData } from '../types/candlestick';

export const formatPrice = (price: number): string => price.toFixed(2);

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
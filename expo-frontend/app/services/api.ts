import { CandleData } from '../types/candlestick';

// API call to fetch candlestick data
export const fetchCandleData = async (
  symbol: string = 'ETH', 
  interval: string = '1m'
): Promise<CandleData[]> => {
  try {
    // Use your computer's IP address instead of localhost for mobile testing
    const response = await fetch(`http://192.168.1.158:8003/candles/${symbol}?interval=${interval}`);
    const result = await response.json();
    
    if (result.success && result.data.success) {
      return result.data.data.map((candle: any) => ({
        timestamp: candle.time,
        open: parseFloat(candle.open),
        high: parseFloat(candle.high),
        low: parseFloat(candle.low),
        close: parseFloat(candle.close),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching candle data:', error);
    return [];
  }
};

// Fallback demo data generator
export const generateCandleData = (count: number): CandleData[] => {
  const data: CandleData[] = [];
  let basePrice = 1000;
  
  for (let i = 0; i < count; i++) {
    const open = basePrice + (Math.random() - 0.5) * 2;
    const high = open + Math.random() * 3;
    const low = open - Math.random() * 3;
    const close = low + Math.random() * (high - low);
    
    data.push({
      timestamp: Date.now() + i * 60000,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });
    
    basePrice = close;
  }
  
  return data;
}; 
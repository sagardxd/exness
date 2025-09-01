import { CandleData } from '@/src/types/candlestick';
import apiCaller from './api.service';

interface CandleResponse {
    success: boolean;
    data: Array<{
      time: string;
      open: string;
      high: string;
      low: string;
      close: string;
    }>;
}

// API call to fetch candlestick data
export const fetchCandleData = async (
  symbol: string = 'BTC', 
  interval: string = '1m'
): Promise<CandleData[]> => {
  try {
    const result = await apiCaller.get<CandleResponse>(`/candles/${symbol}?interval=${interval}`);
    
    if (result.success) {
      return result.data.map((candle) => ({
        timestamp: parseInt(candle.time),
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

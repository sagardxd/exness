export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickChartProps {
  symbol?: string;
  interval?: string;
  width?: number;
  height?: number;
} 
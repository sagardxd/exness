export interface Candle {
    token: string;
    candle_start: Date;
    candle_end: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
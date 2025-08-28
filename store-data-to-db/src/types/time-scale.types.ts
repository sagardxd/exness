export interface TradeData {
    s: string; // symbol like "BTCUSDT"
    p: string; // price as string
    T: string; // timestamp in ms
    m: boolean; // true == sell, false == buy
    q: string // quantity
}

export interface Trade {
    token: string;
    price: number;
    timestamp: Date;
    volume: number;
}
export interface Candle {
    token: string;
    candle_start: Date;
    candle_end: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    sell: number;
}
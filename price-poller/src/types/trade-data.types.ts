export interface TradeData {
    s: string; // symbol
    p: string; // price 
    T: string; // timestamp 
    m: boolean // true == sell, false == buy
    q: string // quantity
}
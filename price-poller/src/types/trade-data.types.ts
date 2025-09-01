export interface TradeData {
    s: string; // symbol
    p: number; // price 
    T: string; // timestamp 
    m: boolean // true == sell, false == buy
    q: string // quantity
    decimals: number // decimal places for the price
}

export interface WSTradeData {
    symbol: Symbol
    buyPrice: number
    sellPrice: number
    decimals: number
}

export enum Symbol {
    BTC = "BTC",
    ETH = "ETH",
    SOL = "SOL"
}

export interface WSResponse {
    price_updates: WSTradeData | null
}
export interface TradeData {
    s: string; // symbol
    p: string; // price 
    T: string; // timestamp 
    m: boolean // true == sell, false == buy
    q: string // quantity
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
export interface WSResponse {
    price_updates: WSTradeData[] | null
}

export enum Symbol {
    BTCUSDT = "BTC",
    ETHUSDT = "ETH",
    SOLUSDT = "SOL"
}

export interface WSTradeData {
    symbol: Symbol
    buyPrice: number
    sellPrice: number
    decimals: number
}

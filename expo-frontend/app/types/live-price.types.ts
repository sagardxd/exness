export interface WSResponse {
    price_updates: WSTradeData[] | []
}

export enum Symbol {
    BTCUSDT = "BTCUSDT",
    ETHUSDT = "ETHUSDT",
    SOLUSDT = "SOLUSDT"
}

export interface WSTradeData {
    symbol: Symbol
    buyPrice: number
    sellPrice: number
    decimals: number
}

export interface IncomingPriceUpdate {
    price_updates: WSTradeData;
}

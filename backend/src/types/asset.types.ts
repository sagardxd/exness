import { Asset } from "./store.types.js"

export interface WSTradeData {
    symbol: Asset
    buyPrice: number
    sellPrice: number
    decimals: number
}

export interface WSResponse {
    price_updates: WSTradeData
}
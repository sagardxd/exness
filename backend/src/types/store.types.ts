export type Id = string

export enum Asset {
    BTC = "BTC",
    ETH = "ETH",
    SOL = "SOL"
}

export enum OrderType {
    BUY = "BUY",
    SELL = "SELL"
}

export interface User {
    id: Id
    email: string
    password: string;
    created_at: Date
}

export interface UserBalance {
    usd_balance: number // "usd_balance": 500000 | Decimals is 2
}

export interface OpenOrders {
    order_id: Id
    user_id: Id
    type: OrderType
    asset: Asset
    margin: number
    leverage: number
    quantity: number
    open_price: number
    liquation_price: number
    stop_loss?: number
    take_profit?: number
    created_at: Date
}

export interface ClosedOrders {
    order_id: Id
    user_id: Id
    type: OrderType
    asset: Asset
    quantity: number
    open_price: number
    close_price: number
    pnl: number
    opened_at: Date
    closed_at: Date
}

export interface PriceUpdate {
    symbol: string;
    buyPrice: number;
    sellPrice: number;
    decimals: number;
}

export interface PriceUpdateMessage {
    price_updates: PriceUpdate;
}

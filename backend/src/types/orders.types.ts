import { Asset, OrderType } from "./store.types.js";

export interface OrderRequest {
    asset: Asset
    type: OrderType
    margin: number
    leverage: number
    stop_loss?: number;
    take_profit?: number;
}

import { Asset, ClosedOrders, Id, OpenOrders, User, UserBalance } from "../types/store.types.js";
import { WSTradeData } from "../types/asset.types.js";

export const users = new Map<Id, User>();
export const balances = new Map<Id, UserBalance>();
export const openOrders = new Map<Id, OpenOrders[]>();
export const closedOrders = new Map<Id, ClosedOrders[]>();
export const latestAssetPrices = new Map<Asset, WSTradeData>();
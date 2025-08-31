import { ClosedOrders, Id, OpenOrders, User, UserBalance } from "../types/store.types.js";

export const users = new Map<Id, User>();
export const balances = new Map<Id, UserBalance>();
export const openOrders = new Map<Id, OpenOrders[]>();
export const closedOrders = new Map<Id, ClosedOrders[]>();
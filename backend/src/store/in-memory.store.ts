import { ClosedOrders, Id, OpenOrders, User } from "../types/store.types.js";

export const users = new Map<Id, User>();
export const openOrders = new Map<Id, OpenOrders[]>();
export const closedOrders = new Map<Id, ClosedOrders[]>();
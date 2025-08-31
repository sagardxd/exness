import { subscribeToAsset } from "../redis/redis-client.js";
import { balances, openOrders, closedOrders } from "../store/in-memory.store.js";
import { WSTradeData } from "../types/asset.types.js";
import { OpenOrder, CloseOrder, OrderRequest } from "../types/orders.types.js"
import { OpenOrders, ClosedOrders, OrderType } from "../types/store.types.js";
import { CustomError } from "../utils/error.js";
import { generateId } from "../utils/uuid.js";
import { createOrderSchema } from "../zod/order.schema.js"

export const createTrade = async (input: OrderRequest, userId: string) => {
    try {
        createOrderSchema.parse(input);

        // checking if the user has enough balance
        const userBalance = balances.get(userId)?.usd_balance || 0

        if ((userBalance - input.margin) < 0) throw new CustomError(400, "Insufficient balance")


        const startTime = Date.now();
        const currentAssetData = await new Promise<WSTradeData>((resolve) => {
            subscribeToAsset(input.asset, (data) => {
                resolve(data);
            });
        });
        const endTime = Date.now();
        const resolveTime = endTime - startTime;

        console.log(`Asset data resolution time for ${input.asset}: ${resolveTime}ms`);

        const orderId = generateId();
        let order: OpenOrders = {
            order_id: orderId,
            user_id: userId,
            asset: input.asset,
            type: input.type,
            margin: input.margin,
            leverage: input.leverage,
            open_price: input.type == OrderType.BUY ? currentAssetData.buyPrice : currentAssetData.sellPrice,
            liquation_price: input.type === OrderType.BUY ? ((currentAssetData.buyPrice) * (1 - 1 / input.leverage)) : ((currentAssetData.sellPrice) * (1 + 1 / input.leverage)),
            quantity: input.type === OrderType.BUY ? ((input.margin * input.leverage) / currentAssetData.buyPrice) : ((input.margin * input.leverage) / currentAssetData.sellPrice),
            created_at: new Date(),
            ...(input.stop_loss !== undefined && { stop_loss: input.stop_loss }),
            ...(input.take_profit !== undefined && { take_profit: input.take_profit })
        }
        const userOpenOrders = openOrders.get(userId) || [];
        userOpenOrders.push(order);
        openOrders.set(userId, userOpenOrders);

        console.log("userOpenOrders", openOrders);

        return {
            orderId: orderId
        }

    } catch (error: any) {
        if (error instanceof CustomError) throw Error

        if (error.name === "ZodError") {
            throw new CustomError(400, "Invalid input data");
        }

        throw new CustomError(500, "Internal Server Error")
    }
}

export const getOpenTrade = async (userId: string) => {
    try {
        if (!userId) {
            throw new CustomError(400, "User ID is required");
        }

        const userOpenOrders = openOrders.get(userId) || [];
        let cleanedData: OpenOrder[] = [];

        if (userOpenOrders.length > 0) {
            cleanedData = userOpenOrders.map((order: OpenOrders) => ({
                orderId: order.order_id,
                type: order.type,
                asset: order.asset,
                margin: order.margin,
                leverage: order.leverage,
                quantity: order.quantity,
                openPrice: order.open_price,
                openTime: order.created_at
            }))
        }

        return {
            trades: cleanedData,
        }
    } catch (error: any) {
        if (error instanceof CustomError) throw error;
        throw new CustomError(500, "Failed to fetch open trades");
    }
}

export const getCloseTrade = async (userId: string) => {
    try {
        if (!userId) {
            throw new CustomError(400, "User ID is required");
        }

        const userClosedOrders = closedOrders.get(userId) || [];
        let cleanedData: CloseOrder[] = [];

        if (userClosedOrders.length > 0) {
            cleanedData = userClosedOrders.map((order: ClosedOrders) => ({
                orderId: order.order_id,
                type: order.type,
                asset: order.asset,
                quantity: order.quantity,
                openPrice: order.open_price,
                closePrice: order.close_price,
                pnl: order.pnl,
                openTime: order.opened_at,
                closeTime: order.closed_at,
            }))
        }

        return {
            trades: cleanedData,
        }
    } catch (error: any) {
        if (error instanceof CustomError) throw error;
        throw new CustomError(500, "Failed to fetch closed trades");
    }
}
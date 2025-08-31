import { subscribeToAsset } from "../redis/redis-client.js";
import { openOrders } from "../store/in-memory.store.js";
import { WSTradeData } from "../types/asset.types.js";
import { OrderRequest } from "../types/orders.types.js"
import { OpenOrders, OrderType } from "../types/store.types.js";
import { CustomError } from "../utils/error.js";
import { generateId } from "../utils/uuid.js";
import { createOrderSchema } from "../zod/order.schema.js"

export const createTrade = async (input: OrderRequest, userId: string) => {
    try {
        createOrderSchema.parse(input);

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
            orderId : orderId
        }

    } catch (error: any) {
        if (error instanceof CustomError) throw Error

        if (error.name === "ZodError") {
            throw new CustomError(400, "Invalid input data");
        }

        throw new CustomError(500, "Internal Server Error")
    }
}

export const getOpenTrade = async () => {

}

export const getCloseTrade = async () => {

}
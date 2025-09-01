import { getLatestAssetPrice } from "../redis/redis-client.js";
import { balances, openOrders, closedOrders } from "../store/in-memory.store.js";
import { WSTradeData } from "../types/asset.types.js";
import { OpenOrder, CloseOrder, OrderRequest } from "../types/orders.types.js"
import { OpenOrders, ClosedOrders, OrderType } from "../types/store.types.js";
import { CustomError } from "../utils/error.js";
import { generateId } from "../utils/uuid.js";
import { createOrderSchema } from "../zod/order.schema.js"

export const createTrade = async (input: OrderRequest, userId: string) => {
    console.log('here')
    try {
        createOrderSchema.parse(input);

        // checking if the user has enough balance
        const userBalance = balances.get(userId)?.usd_balance || 0

        if ((userBalance - input.margin) < 0) throw new CustomError(400, "Insufficient balance")


        // Get latest asset data from memory
        const currentAssetData = getLatestAssetPrice(input.asset);
        if (!currentAssetData) {
            throw new CustomError(400, "Asset price data not available");
        }

        console.log(`Using latest ${input.asset} price data from memory`);

        const orderId = generateId();
        
        // Normalize asset prices to actual dollar values
        const normalizedBuyPrice = currentAssetData.buyPrice / Math.pow(10, currentAssetData.decimals);
        const normalizedSellPrice = currentAssetData.sellPrice / Math.pow(10, currentAssetData.decimals);
        
        // Convert margin from cents to dollars for calculation
        const marginInDollars = input.margin / 100;
        
        console.log(`Asset: ${input.asset}, Raw buy price: ${currentAssetData.buyPrice}, Raw sell price: ${currentAssetData.sellPrice}, Decimals: ${currentAssetData.decimals}`);
        console.log(`Normalized buy price: $${normalizedBuyPrice}, Normalized sell price: $${normalizedSellPrice}`);
        console.log(`Margin in cents: ${input.margin}, Margin in dollars: $${marginInDollars}`);
        
        let order: OpenOrders = {
            order_id: orderId,
            user_id: userId,
            asset: input.asset,
            type: input.type,
            margin: input.margin,
            leverage: input.leverage,
            open_price: input.type == OrderType.BUY ? currentAssetData.buyPrice : currentAssetData.sellPrice,
            liquation_price: input.type === OrderType.BUY ? ((currentAssetData.buyPrice) * (1 - 1 / input.leverage)) : ((currentAssetData.sellPrice) * (1 + 1 / input.leverage)),
            quantity: input.type === OrderType.BUY ? ((marginInDollars * input.leverage) / normalizedBuyPrice) : ((marginInDollars * input.leverage) / normalizedSellPrice),
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
        if (error instanceof CustomError) throw error

        if (error.name === "ZodError") {
            throw new CustomError(400, "Invalid input data");
        }
        throw new CustomError(500, error.message || "Internal server error")
    }
}

export const closeTrade = async (orderId: string, userId: string) => {
    try {
        if (!userId || !orderId) {
            throw new CustomError(400, "User ID and Order ID are required");
        }

        const userOpenOrders = openOrders.get(userId) || [];
        const orderIndex = userOpenOrders.findIndex(order => order.order_id === orderId);
        
        if (orderIndex === -1) {
            throw new CustomError(404, "Order not found");
        }

        const order = userOpenOrders[orderIndex]!;
        
        // Get current asset price for closing from memory
        const currentAssetData = getLatestAssetPrice(order.asset);
        if (!currentAssetData) {
            throw new CustomError(400, "Asset price data not available");
        }

        const closePrice = order.type === OrderType.BUY ? currentAssetData.sellPrice : currentAssetData.buyPrice;
        
        // Normalize prices to the same scale (divide by 10^decimals to get actual dollar value)
        const normalizedOpenPrice = order.open_price / Math.pow(10, currentAssetData.decimals);
        const normalizedClosePrice = closePrice / Math.pow(10, currentAssetData.decimals);
        
        console.log(`Closing trade - Raw open price: ${order.open_price}, Raw close price: ${closePrice}, Decimals: ${currentAssetData.decimals}`);
        console.log(`Normalized open price: $${normalizedOpenPrice}, Normalized close price: $${normalizedClosePrice}`);
        console.log(`Quantity: ${order.quantity}, Order type: ${order.type}`);
        
        // Calculate PnL using normalized prices
        const pnl = order.type === OrderType.BUY 
            ? (normalizedClosePrice - normalizedOpenPrice) * order.quantity
            : (normalizedOpenPrice - normalizedClosePrice) * order.quantity;
            
        console.log(`Calculated PnL: $${pnl}`);

        // Create closed order
        const closedOrder: ClosedOrders = {
            order_id: order.order_id,
            user_id: order.user_id,
            type: order.type,
            asset: order.asset,
            quantity: order.quantity,
            open_price: order.open_price,
            close_price: closePrice,
            pnl: pnl,
            opened_at: order.created_at,
            closed_at: new Date()
        };

        console.log('closed order', closedOrder)

        // Remove from open orders
        userOpenOrders.splice(orderIndex, 1);
        openOrders.set(userId, userOpenOrders);

        // Add to closed orders
        const userClosedOrders = closedOrders.get(userId) || [];
        userClosedOrders.push(closedOrder);
        closedOrders.set(userId, userClosedOrders);

        return {
            orderId: order.order_id,
        };

    } catch (error: any) {
        if (error instanceof CustomError) throw error
        throw new CustomError(500, error.message || "Internal server error")
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
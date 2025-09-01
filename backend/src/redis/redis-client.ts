import { createClient } from "redis";
import { WSResponse, WSTradeData } from "../types/asset.types.js";
import { Asset, OrderType, ClosedOrders } from "../types/store.types.js";
import { openOrders, closedOrders, latestAssetPrices } from "../store/in-memory.store.js";

const redisURL = process.env.REDIS_URL || '';
export const subscriber = createClient({url: redisURL});

subscriber.on("error", (err) => console.log("Redis Client Error", err));

// Simple liquidation check
function checkLiquidations(assetData: WSTradeData) {
    const { symbol, buyPrice, sellPrice, decimals } = assetData;
    
    // Check all open orders
    for (const [userId, orders] of openOrders.entries()) {
        if (!orders || orders.length === 0) continue;
        
        // Check each order for this asset
        for (let i = orders.length - 1; i >= 0; i--) {
            const order = orders[i];
            if (!order || order.asset !== symbol) continue;
            
            const currentPrice = order.type === OrderType.BUY ? sellPrice : buyPrice;
            const shouldLiquidate = order.type === OrderType.BUY 
                ? currentPrice <= order.liquation_price 
                : currentPrice >= order.liquation_price;
            
            if (shouldLiquidate) {
                console.log(`LIQUIDATED: ${order.order_id} on ${symbol}`);
                
                // Calculate PnL
                const openPrice = order.open_price / Math.pow(10, decimals);
                const closePrice = currentPrice / Math.pow(10, decimals);
                const pnl = order.type === OrderType.BUY 
                    ? (closePrice - openPrice) * order.quantity
                    : (openPrice - closePrice) * order.quantity;
                
                // Move to closed orders
                const closedOrder: ClosedOrders = {
                    order_id: order.order_id,
                    user_id: order.user_id,
                    type: order.type,
                    asset: order.asset,
                    quantity: order.quantity,
                    open_price: order.open_price,
                    close_price: currentPrice,
                    pnl: pnl,
                    opened_at: order.created_at,
                    closed_at: new Date()
                };
                
                // Remove from open, add to closed
                orders.splice(i, 1);
                const userClosed = closedOrders.get(userId) || [];
                userClosed.push(closedOrder);
                closedOrders.set(userId, userClosed);
                
                console.log(`PnL: $${pnl.toFixed(2)}`);
            }
        }
    }
}

// Function to get latest asset price from memory
export function getLatestAssetPrice(asset: Asset): WSTradeData | null {
    return latestAssetPrices.get(asset) || null;
}

// Function to get all current asset prices (for debugging)
export function getAllAssetPrices(): Map<string, WSTradeData> {
    return latestAssetPrices;
}

// Start streaming prices
export async function startAssetStreaming() {
    await subscriber.connect();
    
    await subscriber.subscribe("ASSETS", (message: string) => {
        const data: WSResponse = JSON.parse(message);
        const assetData = data.price_updates;
        
        // Store price & check liquidations
        latestAssetPrices.set(assetData.symbol, assetData);
        checkLiquidations(assetData);
    });
    
    console.log("🚀 Streaming started");
}
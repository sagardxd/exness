import { createClient } from "redis";
import { WSResponse, WSTradeData } from "../types/asset.types.js";
import { Asset } from "../types/store.types.js";

const redisURL = process.env.REDIS_URL || '';

export const subscriber = createClient({ url: redisURL });
let isConnected = false;

export async function subscribeToAsset(asset: Asset, callback: (data: WSTradeData) => void) {
    if (!isConnected) {
        await subscriber.connect();
        isConnected = true;
    }

    await subscriber.subscribe("ASSETS", async (message: string) => {
        const data: WSResponse = JSON.parse(message);
        if (data.price_updates.symbol === asset) {
            callback(data.price_updates);
        }
    });

    subscriber.on("error", (err) => console.log("Redis Error", err));
}
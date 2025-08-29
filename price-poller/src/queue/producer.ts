import type { TradeData } from "../types/trade-data.types.js";
import { logger } from "../utils/logger.js";

export const produceQueue = async (data: TradeData,  redisClient:any) => {
    try {
        await redisClient.rPush("queue", JSON.stringify(data))
        console.log("Produced to queue:", JSON.stringify(data));
    } catch (error) {
        logger("produceQueue", "Error in making connection to the redis queue client", error)
    }
}
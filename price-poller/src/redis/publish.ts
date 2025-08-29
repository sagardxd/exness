import type { TradeData, WSResponse } from "../types/trade-data.types.js";
import { logger } from "../utils/logger.js";


export const publishDataToRedis = async (data: WSResponse, redisClient: any) => {
    try {
        await redisClient.publish("ASSETS", JSON.stringify(data));
    } catch (error) {
        logger("publishDataToRedis", "Error publishing data to redis", error)
    }

}
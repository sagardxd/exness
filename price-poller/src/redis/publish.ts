import { createClient } from "redis";
import type { TradeData } from "../types/trade-data.types.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv"
dotenv.config()

const redisURL = process.env.REDIS_URL || ""

export const publishDataToRedis = async (data: TradeData, redisClient: any) => {
    try {
        await redisClient.publish("BTC", JSON.stringify(data));
    } catch (error) {
        logger("publishDataToRedis", "Error publishing data to redis", error)
    }

}
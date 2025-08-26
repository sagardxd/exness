import { createClient } from "redis";
import type { TradeData } from "../types/trade-data.types.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv"
import { queueClient } from "./queue-client.js";
dotenv.config()

const redisURL = process.env.REDIS_URL || ""

export const produceQueue = async (data: TradeData,  redisClient:any) => {
    try {
        await redisClient.rPush("queue", JSON.stringify(data))
        console.log('queue')
    } catch (error) {
        logger("produceQueue", "Error in making connection to the redis queue client", error)
    }
}
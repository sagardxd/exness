import WebSocket from "ws";
import { publishDataToRedis } from "./redis/publish.js";
import { produceQueue } from "./queue/producer.js";
import dotenv from "dotenv"
import type { TradeData } from "./types/trade-data.types.js";
import { logger } from "./utils/logger.js";
import { createClient } from "redis";
dotenv.config()

const binanceWSURL = process.env.BINANCE_WS_URL || "";
const redisURL = process.env.REDIS_URL || "";

const redisClient = createClient({ url: redisURL });

redisClient.on("error", (err) => console.error("Redis Client Error", err));

await redisClient.connect();
console.log("✅ Redis client connected");

async function main() {
    const binanceWS = new WebSocket(binanceWSURL);
    let counter = 0;

    binanceWS.on("message", async (msg) => {
        console.log(counter)
        try {
            const parsed = JSON.parse(msg.toString());
            const final_data: TradeData = {
                s: parsed.s,
                p: parsed.p,
                T: parsed.T,
                m: parsed.m
            };
            await publishDataToRedis(final_data, redisClient)
            await produceQueue(final_data, redisClient)
            counter++;
            if (counter === 30) {
                console.log('one batch should be polled from the trade backend')
                counter = 0;
            }
        } catch (error) {
            logger("main", "error processing messsage from binance ws", error)
        }
    });

}

main().catch(console.error);

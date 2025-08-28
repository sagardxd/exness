import type TradesDB from "../db/time-scale-db.js";
import type { TradeData } from "../types/time-scale.types.ts";
import { redisClient } from "./redis-client.js";

export const getDataFromQueue = async (db: TradesDB) => {
    redisClient.connect();

    console.log("Listening to Redis queue...");
    let count = 0;
    const CHUNK_SIZE = 100;
    let chunk: TradeData[] = []

    while (true) {
        try {
            const rawData = await redisClient.lPop("queue");


            if (rawData) {
                console.log('count: ', count)
                count++;
                const data: TradeData = JSON.parse(rawData)
                chunk.push({ p: data.p, s: data.s, T: data.T, m: data.m, q: data.q })

                if (count === CHUNK_SIZE) {
                    console.log(chunk[0])
                    await db.insert(chunk)
                    count = 0;
                    chunk = []
                }

            } else {
                // Queue is empty → wait a bit before checking again
                await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms
            }
        } catch (err) {
            console.error("Redis error:", err);
            // Optional: reconnect logic
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
};

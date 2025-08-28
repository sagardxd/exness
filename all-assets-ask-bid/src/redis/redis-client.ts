import { createClient } from "redis";

const redisURL = process.env.REDIS_URL || '';
export const subscriber = createClient({url: redisURL});

subscriber.on("error", (err) => console.log("Redis Client Error", err));
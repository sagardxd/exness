import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisURL = process.env.REDIS_URL || "";
export const queueClient = createClient({ url: redisURL });

queueClient.on("error", (err) => console.error("Redis Client Error", err));

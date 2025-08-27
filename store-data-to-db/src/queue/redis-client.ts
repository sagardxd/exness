import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisURL = process.env.REDIS_URL || "";
export const redisClient = createClient({ url: redisURL });

redisClient.on("error", (err) => console.error("Redis Client Error", err));

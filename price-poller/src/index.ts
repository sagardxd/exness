import WebSocket from "ws";
import { createClient } from "redis";
import dotenv from "dotenv";
import { publishDataToRedis } from "./redis/publish.js";
import { produceQueue } from "./queue/producer.js";
import { logger } from "./utils/logger.js";
import type { TradeData, WSResponse, WSTradeData } from "./types/trade-data.types.js";

dotenv.config();

// Constants
const DECIMAL_PLACES = 4;
const DECIMAL_FACTOR = 10000;

// Environment variables
const binanceWSURL = process.env.BINANCE_WS_URL || "";
const redisURL = process.env.REDIS_URL || "";

// Global state
const redisClient = createClient({ url: redisURL });
const wsCache: Record<string, WSTradeData> = {};

// Setup Redis connection
redisClient.on("error", (err) => console.error("Redis Client Error", err));
await redisClient.connect();

function parseWebSocketData(rawData: any): WSTradeData {
    return {
        symbol: rawData.s.replace("USDT", ""),
        buyPrice: rawData.m ? 0 : Math.floor(parseFloat(rawData.p) * DECIMAL_FACTOR),
        sellPrice: rawData.m ? Math.floor(parseFloat(rawData.p) * DECIMAL_FACTOR) : 0,
        decimals: DECIMAL_PLACES
    };
}

function updatePriceCache(newData: WSTradeData): boolean {
    const { symbol } = newData;
    const existing = wsCache[symbol];

    if (!existing) {
        wsCache[symbol] = { ...newData };
        return true;
    }

    let hasChanged = false;

    // Update buy price if it changed
    if (newData.buyPrice > 0 && existing.buyPrice !== newData.buyPrice) {
        existing.buyPrice = newData.buyPrice;
        hasChanged = true;
    }

    // Update sell price if it changed
    if (newData.sellPrice > 0 && existing.sellPrice !== newData.sellPrice) {
        existing.sellPrice = newData.sellPrice;
        hasChanged = true;
    }

    return hasChanged;
}

function shouldPublishUpdate(symbol: string): boolean {
    const cached = wsCache[symbol];
    if (cached && cached.buyPrice > 0 && cached.sellPrice > 0) {
        return true;
    }
    return false;
}

async function publishPriceUpdate(symbol: string) {
    const cached = wsCache[symbol];

    if (!cached) {
        logger("publishPriceUpdate", `No cached data found for symbol: ${symbol}`);
        return;
    }

    console.log("Publishing price update:", cached);

    const priceUpdate: WSResponse = {
        price_updates: cached
    };

    await publishDataToRedis(priceUpdate, redisClient);

    // Reset cache for next update cycle
    wsCache[symbol] = {
        symbol: cached.symbol,
        buyPrice: 0,
        sellPrice: 0,
        decimals: DECIMAL_PLACES
    }
}

function createTradeData(rawData: any): TradeData {
    return {
        s: rawData.s.replace("USDT", ""),
        p: Math.floor(parseFloat(rawData.p) * DECIMAL_FACTOR),
        T: rawData.T,
        m: rawData.m,
        q: rawData.q,
        decimals: DECIMAL_PLACES
    };
}

async function handleWebSocketMessage(message: WebSocket.Data) {
    try {
        const parsed = JSON.parse(message.toString());

        // Parse and update price cache
        const wsData = parseWebSocketData(parsed);
        const priceChanged = updatePriceCache(wsData);

        // Only publish if price changed and we have both buy & sell prices
        if (priceChanged && shouldPublishUpdate(wsData.symbol)) {
            await publishPriceUpdate(wsData.symbol);
        }

        // Create trade data for queue
        const tradeData = createTradeData(parsed);
        // await produceQueue(tradeData, redisClient);
    } catch (error) {
        logger("handleWebSocketMessage", "Error processing message from Binance WS", error);
    }
}

async function main() {
    try {
        const binanceWS = new WebSocket(binanceWSURL);

        binanceWS.on("message", handleWebSocketMessage);

        binanceWS.on("error", (error) => {
            logger("main", "WebSocket error", error);
        });

        binanceWS.on("close", () => {
            console.log("WebSocket connection closed");
        });

        console.log("Binance WebSocket handler started successfully");

    } catch (error) {
        logger("main", "Failed to start WebSocket handler", error);
        throw error;
    }
}

main().catch(console.error);
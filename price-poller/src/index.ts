import WebSocket from "ws";
import { createClient } from "redis";
import type { Trade, TradeData } from "../../trade-db/src/utils/time-scale-db.js";
import TradesDB from "../../trade-db/src/utils/time-scale-db.js";
import { isJSDocCallbackTag } from "typescript";

// Redis clients
const publisher = createClient({ url: "redis://localhost:6379" });
const subscriber = createClient({ url: "redis://localhost:6379" });
const queue = createClient({ url: "redis://localhost:6379" })
const db = new TradesDB("postgresql://sagardxd:sagardxd@localhost:5432/exness");

async function main() {
    const CHUNK_SIZE = 20;
    let count = 0;
    const chunk: TradeData[] = []

    await publisher.connect();
    await subscriber.connect();
    await queue.connect()

    await subscriber.subscribe("BTC", (msg) => {
        // console.log("📩 Data from sub:", msg);
    });

    // 3. Connect to Binance WebSocket
    const binanceWS = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");


    binanceWS.on("message", async (msg) => {
        const data: TradeData = JSON.parse(msg.toString());
        const final_data = JSON.stringify(data)
        // await publisher.publish("BTC",  final_data);
        await queue.rPush("queue", final_data)
        console.log('data:', data)

        count++;
        chunk.push({
            s: data.s,
            p: data.p,
            T: data.T
        })

        console.log(count)

        if (count === CHUNK_SIZE) {
            // await db.insert(chunk); 
            count = 0;
            console.log('chunk added')
            // await db.refresh();
            // const candles = await db.getCandles('BTCUSDT', '1m', 50);
            // console.log('candles', candles)
        }
    });

}

main().catch(console.error);

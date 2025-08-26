import WebSocket from "ws";
import { createClient } from "redis";
import { isJSDocCallbackTag } from "typescript";

// Redis clients
const publisher = createClient({ url: "redis://localhost:6379" });
const subscriber = createClient({ url: "redis://localhost:6379" });
const queue = createClient({ url: "redis://localhost:6379" })

async function main() {
    const CHUNK_SIZE = 20;
    let count = 0;

    await publisher.connect();
    await subscriber.connect();
    await queue.connect()

    await subscriber.subscribe("BTC", (msg) => {
        // console.log("📩 Data from sub:", msg);
    });

    // 3. Connect to Binance WebSocket
    const binanceWS = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");


    binanceWS.on("message", async (msg) => {
        const data = JSON.parse(msg.toString());
        const final_data = JSON.stringify(data)
        // await publisher.publish("BTC",  final_data);
        await queue.rPush("queue", final_data)
        console.log('data:', data)

        count++;

        console.log(count)

        if (count === CHUNK_SIZE) {
            count = 0;
            console.log('chunk added')
            // const candles = await db.getCandles('BTCUSDT', '1m', 50);
            // console.log('candles', candles)
        }
    });

}

main().catch(console.error);

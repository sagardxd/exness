import WebSocket from "ws";
import { createClient } from "redis";

// Redis clients
const publisher = createClient({url: "redis://localhost:6379"});
const subscriber = createClient({url: "redis://localhost:6379"});
const queue = createClient({url: "redis://localhost:6379"})

async function main() {
    await publisher.connect();
    await subscriber.connect();

    await subscriber.subscribe("BTC", (msg) => {
        console.log("📩 Data from sub:", msg);
    });

    // 3. Connect to Binance WebSocket
    const binanceWS = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    binanceWS.on("message", async (msg) => {
        const data = JSON.parse(msg.toString());

        // publish as string
        await publisher.publish("BTC", data);
        await queue.rPush("QUEUE", data)
    });
}

main().catch(console.error);

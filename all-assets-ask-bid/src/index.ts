import { WebSocketServer } from "ws";
import { createClient } from "redis";
import { subscriber } from "./redis/redis-client.js";

const wss = new WebSocketServer({ port: 8080 });

await subscriber.connect();
console.log("Connected to Redis, waiting for messages...");

await subscriber.subscribe("ASSETS", (message) => {
    console.log('assets message received',  JSON.parse(message));

    // // forward to all WS clients
    // wss.clients.forEach((client) => {
    //     if (client.readyState === 1) {
    //         client.send(message);
    //     }
    // });
});

wss.on("connection", (ws) => {
    console.log("Frontend connected");
    ws.send(JSON.stringify({ msg: "Welcome from server" }));
});

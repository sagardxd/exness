import express from 'express';
import cors from 'cors'
import TradesDB from './db/time-scale-db.js';
import candleRouter from './routes/candle.route.js'
import userRouter from './routes/user.route.js'  
import tradesRouter from './routes/trades.route.js'
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.middleware.js';
import { startAssetStreaming } from './redis/redis-client.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());

const timescaleDbURL = process.env.TIMESCALE_DB_URL || ""
export const db = new TradesDB(timescaleDbURL);

// Start asset streaming
await startAssetStreaming();
app.use("/api/v1/user", userRouter)
app.use("/api/v1/candles", candleRouter)
app.use("/api/v1/trade", authMiddleware, tradesRouter)


app.listen(PORT, () => {
    console.log(`Main Backend is running on http://localhost:${PORT}`);
})
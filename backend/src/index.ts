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

const timescaleDbURL = process.env.TIMESCALE_DB_URL || ""
export const db = new TradesDB(timescaleDbURL);

// Start asset streaming
await startAssetStreaming();

app.use(express.json());
app.use("/user", userRouter)
app.use("/candles", candleRouter)
app.use("/trade", authMiddleware, tradesRouter)


app.listen(PORT, () => {
    console.log(`Main Backend is running on http://localhost:${PORT}`);
})
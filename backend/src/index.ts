import express from 'express';
import candleRouter from './routes/candle.router.js'
import TradesDB from './db/time-scale-db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// getting data from the queue and inserting in timescale DB
const timescaleDbURL = process.env.TIMESCALE_DB_URL || ""
export const db = new TradesDB(timescaleDbURL);

app.use(express.json());
app.use("/candles", candleRouter)


app.listen(PORT, () => {
    console.log(`Main Backend is running on http://localhost:${PORT}`);
})
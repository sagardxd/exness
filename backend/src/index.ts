import express from 'express';
import cors from 'cors'
import candleRouter from './routes/candle.route.js'
import userRouter from './routes/user.route.js'    
import TradesDB from './db/time-scale-db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())

const timescaleDbURL = process.env.TIMESCALE_DB_URL || ""
export const db = new TradesDB(timescaleDbURL);

app.use(express.json());
app.use("/user", userRouter)
app.use("/candles", candleRouter)


app.listen(PORT, () => {
    console.log(`Main Backend is running on http://localhost:${PORT}`);
})
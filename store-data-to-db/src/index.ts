import dotenv from 'dotenv';
import express from 'express'
import TradesDB from './db/time-scale-db.js';
import { getDataFromQueue } from './queue/consumer.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001

app.use(express.json());

// getting data from the queue and inserting in timescale DB
const timescaleDbURL = process.env.TIMESCALE_DB_URL || ""
export const db = new TradesDB(timescaleDbURL);
getDataFromQueue(db)

app.get("/", (req, res) => {
    return res.json({ data: "Hello World!" });
});

app.listen(PORT, () => {
    console.log('Server started at ', PORT)
})


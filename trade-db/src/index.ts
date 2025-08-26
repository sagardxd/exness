import dotenv from 'dotenv';
import TradesDB from './db/time-scale-db.js';
import { getDataFromQueue } from './queue/consumer.js';
dotenv.config();

const timescaleDbURL = process.env.TIMESCALE_DB_URL || ""
const db = new TradesDB(timescaleDbURL);

getDataFromQueue(db)


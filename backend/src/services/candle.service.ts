import { error } from "console";
import { db } from "../index.js";


export const getCandleService = async (token: string, interval: string) => {
    try {
        const data = await db.getCandles(token, interval);

        const finalData = data.map((candle) => ({
            time: Number(candle.candle_start),
            open: Number(candle.open),
            high: Number(candle.high),
            low: Number(candle.low),
            close: Number(candle.close),
        }))
            .sort((a, b) => {
                const aTime = a.time ?? '';
                const bTime = b.time ?? '';
                return new Date(aTime).getTime() - new Date(bTime).getTime();
            }); // Sort by date

        if (!data) throw error;
        return {
            success: true,
            data: finalData
        }
    } catch (error) {
        return {
            success: false,
            data: null
        }
    }

}
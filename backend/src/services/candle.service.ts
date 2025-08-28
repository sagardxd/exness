import { error } from "console";
import { db } from "../index.js";


export const getCandleService = async (token: string, interval: string) => {
    try {
        const data = await db.getCandles(token, interval);

        if (!data) throw error;
        return {
            success: true,
            data: data
        }
    } catch (error) {
        return {
            success: false,
            data: null
        }
    }

}
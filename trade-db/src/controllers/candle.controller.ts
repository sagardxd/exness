import type { Request, Response } from "express";
import { getCandleService } from "../services/candle.service.js";

export const getCandleController = async (req: Request, res: Response) => {
    try {
            const { token, interval } = req.params;

            console.log('hey')
    
            if (typeof token !== "string" || typeof interval !== "string") {
                res.json({ success: false, message: "Inputs are wrong" });
                return;
            }
    
            const data = await getCandleService(token, interval);
    
            res.json({ success: true, data: data });
        } catch (err) {
            console.error("Error fetching candles:", err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
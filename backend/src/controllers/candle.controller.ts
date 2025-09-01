import type { Request, Response } from "express";
import { getCandleService } from "../services/candle.service.js";

export const getCandleController = async (req: Request, res: Response) => {
    try {
            const { token } = req.params;
            const { interval } = req.query;
            if (typeof token !== "string" || typeof interval !== "string") {
                res.json({ success: false, message: "Inputs are wrong" });
                return;
            }
    
            const data = await getCandleService(token, interval);
    
            return res.json(data);
        } catch (err) {
            console.error("Error fetching candles:", err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
import { Request, Response } from 'express';
import * as TradeService from '../services/trades.service.js'

export const createTrade = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json("Unautorized")

        const response = await TradeService.createTrade(req.body, userId);
        return res.status(201).json(response)
    } catch (error:any) {
        console.log(error)
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        return res.status(status).json({message: message})
    }

}

export const getOpenTrades = async (req: Request, res: Response) => {

}

export const getCloseTrade = async (req: Request, res: Response) => {

}

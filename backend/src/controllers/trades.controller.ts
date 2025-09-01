import { Request, Response } from 'express';
import * as TradeService from '../services/trades.service.js'

export const createTrade = async (req: Request, res: Response) => {
    console.log('came here')
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json("Unautorized")

        const response = await TradeService.createTrade(req.body, userId);
        return res.status(201).json(response)
    } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        return res.status(status).json({ message: message })
    }
}

export const closeTrade = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const {orderId} = req.params;
        if (!userId) return res.status(401).json("Unautorized")
        if (!orderId) return res.status(400).json({message: "Order ID is required"})

        const response = await TradeService.closeTrade(orderId, userId);
        return res.status(200).json(response)
    } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        return res.status(status).json({ message: message })
    }
}


export const getOpenTrades = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json("Unautorized")

            console.log('came here')

        const response = await TradeService.getOpenTrade(userId);
        return res.status(201).json(response)
    } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        return res.status(status).json({ message: message })
    }
}

export const getCloseTrades = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json("Unautorized")

        const response = await TradeService.getCloseTrade(userId);
        return res.status(201).json(response)
    } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        return res.status(status).json({ message: message })
    }
}

import { Router } from "express";
import * as TradeController from '../controllers/trades.controller.js'

const router = Router();

router.post("/", TradeController.createTrade)
router.post("/close/:orderId", TradeController.closeTrade)
router.get("/open", TradeController.getOpenTrades)
router.get("/close", TradeController.getCloseTrades)

export default router;
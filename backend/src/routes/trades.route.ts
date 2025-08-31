import { Router } from "express";
import * as TradeController from '../controllers/trades.controller.js'

const router = Router();

router.post("/", TradeController.createTrade)
router.post("/open", TradeController.getOpenTrades)
router.post("/close", TradeController.getCloseTrade)

export default router;
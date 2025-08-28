import { Router } from "express";
import * as CandleController from "../controllers/candle.controller.js"

const router = Router();

router.get("/:token", (req, res, next) => {
    console.log("HIT /candles/:token", req.params, req.query);
    next();
}, CandleController.getCandleController);

export default router
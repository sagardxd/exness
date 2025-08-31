import { Router } from "express";
import * as CandleController from "../controllers/candle.controller.js"

const router = Router();

router.get("/:token", CandleController.getCandleController )

export default router
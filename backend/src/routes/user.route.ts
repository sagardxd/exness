import { Router } from "express";
import * as UserController from "../controllers/user.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", UserController.userSignupController);
router.post("/signin",UserController.userSigninController);
router.get("/balance",UserController.userBalanceController);
router.get("/me", authMiddleware , UserController.userMeController);

export default router;
import { Router } from "express";
import * as UserController from "../controllers/user.controller.js"

const router = Router();

router.post("/signup", UserController.userSignupController);
router.post("/signin",UserController.userSigninController);

export default router;
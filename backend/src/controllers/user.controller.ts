import { Request, Response } from "express";
import * as UserService from "../services/user.service.js";

export const userSignupController = async (req: Request, res: Response) => {
  try {
    const response = await UserService.userSignUpService(req.body);
    return res.status(201).json(response);
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    return res.status(status).json({ message });
  }
};

export const userSigninController = async (req: Request, res: Response) => {
  try {
    const response = await UserService.userSignInService(req.body);
    return res.status(200).json(response);
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    return res.status(status).json({ message });
  }
};

export const userBalanceController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json("Unauthorized");
    const response = await UserService.userBalanceService(userId);
    return res.status(200).json(response);
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    return res.status(status).json({ message });
  }
}
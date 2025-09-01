import {Request, Response, NextFunction} from 'express'
import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("authMiddleware")
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message: "No token provided"})
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: "Invalid token format"});
        }
        const decodedUser = verifyToken(token);

        console.log(decodedUser)
        req.user = {
            id: decodedUser.id,
            email: decodedUser.email
        }
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid or expired token"})        
    }
}
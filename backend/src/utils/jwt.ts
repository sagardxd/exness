import jwt from "jsonwebtoken";
import { UserJwtPayload, UserSignupInput } from "../types/user.types.js";

const SECRET = "sagardxd"; 

export const generateToken = (payload: UserJwtPayload) => {
    return jwt.sign(payload, SECRET, { expiresIn: "24h" });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET);
};

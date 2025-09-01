import { balances, closedOrders, openOrders, users } from "../store/in-memory.store.js";
import { UserSignupInput, UserSigninInput } from "../types/user.types.js";
import { CustomError } from "../utils/error.js";
import { generateToken } from "../utils/jwt.js";
import { generateId } from "../utils/uuid.js";
import { UserSignupSchema, UserSigninSchema } from "../zod/user.schema.js";

export const userSignUpService = async (input: UserSignupInput) => {
  try {
    // Validate input with Zod
    UserSignupSchema.parse(input);

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(
      user => user.email === input.email
    );

    if (existingUser) {
      throw new CustomError(409, "User already exists");
    }

    const userId = generateId();
    console.log('userId', userId)
    const newUser = {
      id: userId,
      email: input.email,
      password: input.password,
      created_at: new Date()
    };

    // Store user in memory
    users.set(userId, newUser);

    // set user balance to 5000 with 2 decimal 500000'
    balances.set(userId, {usd_balance: 500000})

    // empty orders 
    openOrders.set(userId, []);
    closedOrders.set(userId, []);

    // Generate JWT token
    const token = generateToken({ id: userId, email: input.email });

    return { token };
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw error;
    }
    
    if (error.name === "ZodError") {
      throw new CustomError(400, "Invalid input data");
    }
    
    throw new CustomError(500, "Internal server error");
  }
};

export const userSignInService = async (credentials: UserSigninInput) => {
  try {
    // Validate input with Zod
    UserSigninSchema.parse(credentials);

    // Find user by email
    const user = Array.from(users.values()).find(
      user => user.email === credentials.email
    );

    if (!user) {
      throw new CustomError(401, "Invalid credentials");
    }

    if (user.password !== credentials.password) {
      throw new CustomError(401, "Invalid credentials");
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email });

    return { token };
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw error;
    }
    
    if (error.name === "ZodError") {
      throw new CustomError(400, "Invalid input data");
    }
    
    throw new CustomError(500, "Internal server error");
  }
};   

export const userBalanceService = async (userId: string) => {
  try {
    const balance = balances.get(userId);
    if (!balance) {
      throw new CustomError(404, "User balance not found");
    }
    return { usd_balance: balance.usd_balance };
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, "Internal server error");
  }
}
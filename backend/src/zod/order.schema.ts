import {z} from 'zod';
import { Asset, OrderType } from '../types/store.types.js';

export const createOrderSchema = z.object({
    asset: z.enum(Asset),
    type: z.enum(OrderType),
    margin: z.number().positive('Margin must be positive'),
    leverage: z.number().min(1, 'Leverage must be at least 1').max(100, 'Leverage cannot exceed 100'),
    stop_loss: z.number().optional(),
    take_profit: z.number().optional()
})
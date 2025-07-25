import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserCredentials, ProductInput } from '../types';

export const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  image_url: z.string().url().optional(),
  description: z.string().optional(),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  price: z.number().positive('Price must be positive'),
});

export const quantitySchema = z.object({
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
});

export const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      res.status(400).json({ error: 'Validation error' });
    }
  }
};
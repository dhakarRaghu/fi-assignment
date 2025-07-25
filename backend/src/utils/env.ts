import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('8080').transform((val) => parseInt(val)),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
});

export const env = envSchema.parse({
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
});
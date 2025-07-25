import { Router } from 'express';
import { login, register } from '../controllers/auth';
import { validate, userSchema } from '../middleware/validate';

export const authRoutes = Router();

authRoutes.post('/register', validate(userSchema), register);
authRoutes.post('/login', validate(userSchema), login);
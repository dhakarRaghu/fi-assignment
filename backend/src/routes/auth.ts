import { Router } from 'express';
import { login, register } from '../controllers/auth';

export const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
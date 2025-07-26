import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { UserCredentials } from '../types';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password }: UserCredentials = req.body;
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      logger.warn(`Registration attempt for existing user: ${username}`);
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });
    logger.info(`User registered: ${username}`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Registration error: ${errorMessage}`);
    throw error;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password }: UserCredentials = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn(`Failed login attempt for user: ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });
    logger.info(`User logged in: ${username}`);
    res.status(200).json({ access_token: token });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Login error: ${errorMessage}`);
    throw error;
  }
};
import { Request, Response } from 'express';
import { register, login } from '../controllers/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';

jest.mock('@prisma/client');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const prisma = new PrismaClient();
const mockPrisma = prisma as jest.Mocked<PrismaClient>;

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    req = { body: {} };
    res = { status, json };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      req.body = { username: 'test', password: 'password' };
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ id: 1, username: 'test', password: 'hashed' });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      await register(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    it('should return 409 if user exists', async () => {
      req.body = { username: 'test', password: 'password' };
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1, username: 'test', password: 'hashed' });

      await register(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(409);
      expect(json).toHaveBeenCalledWith({ error: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      req.body = { username: 'test', password: 'password' };
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1, username: 'test', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      await login(req as Request, res as Response);

      expect(json).toHaveBeenCalledWith({ access_token: 'token' });
    });

    it('should return 401 for invalid credentials', async () => {
      req.body = { username: 'test', password: 'wrong' };
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1, username: 'test', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(401);
      expect(json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });
});
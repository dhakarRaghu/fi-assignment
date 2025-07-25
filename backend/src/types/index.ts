import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  userId: number;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface ProductInput {
  name: string;
  type?: string;
  sku: string;
  image_url?: string;
  description?: string;
  quantity: number;
  price: number;
}

export interface AuthRequest extends Request {
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}
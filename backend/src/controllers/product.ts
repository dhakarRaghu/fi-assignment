import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductInput } from '../types';

const prisma = new PrismaClient();

export const addProduct = async (req: Request, res: Response) => {
  try {
    const productData: ProductInput = req.body;
    
    if (!productData.name || !productData.sku || !productData.quantity || !productData.price) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const product = await prisma.product.create({
      data: productData,
    });

    res.status(201).json({ product_id: product.id, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProductQuantity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { quantity },
    });

    res.json({ message: 'Quantity updated', quantity: product.quantity });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const products = await prisma.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
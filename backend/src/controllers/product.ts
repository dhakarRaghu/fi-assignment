import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductInput } from '../types';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const addProduct = async (req: Request, res: Response) => {
  try {
    const productData: ProductInput = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { sku: productData.sku } });
    if (existingProduct) {
      logger.warn(`Product creation failed: SKU ${productData.sku} already exists`);
      return res.status(409).json({ error: 'Product SKU already exists' });
    }

    const product = await prisma.product.create({
      data: productData,
    });

    logger.info(`Product created: ${product.name} (ID: ${product.id})`);
    res.status(201).json({ product_id: product.id, message: 'Product created successfully' });
  } catch (error) {
    logger.error(`Product creation error: ${error.message}`);
    throw error;
  }
};

export const updateProductQuantity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!product) {
      logger.warn(`Quantity update failed: Product ID ${id} not found`);
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { quantity },
    });

    logger.info(`Quantity updated for product ID ${id}: ${quantity}`);
    res.json({ message: 'Quantity updated', quantity: updatedProduct.quantity });
  } catch (error) {
    logger.error(`Quantity update error: ${error.message}`);
    throw error;
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

    const total = await prisma.product.count();
    logger.info(`Fetched ${products.length} products (page ${page}, size ${pageSize})`);
    res.json({ data: products, total, page, pageSize });
  } catch (error) {
    logger.error(`Get products error: ${error.message}`);
    throw error;
  }
};
import { Request, Response } from 'express';
import { addProduct, updateQuantity, getProducts } from '../controllers/product';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');

const prisma = new PrismaClient();
const mockPrisma = prisma as jest.Mocked<PrismaClient>;

describe('Product Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    req = { body: {}, params: {}, query: {} };
    res = { status, json };
    jest.clearAllMocks();
  });

  describe('addProduct', () => {
    it('should create a new product', async () => {
      req.body = { name: 'Phone', sku: 'PHN-001', quantity: 5, price: 999.99 };
      mockPrisma.product.findUnique.mockResolvedValue(null);
      mockPrisma.product.create.mockResolvedValue({ id: 1, ...req.body });

      await addProduct(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith({ product_id: 1, message: 'Product created successfully' });
    });

    it('should return 409 if SKU exists', async () => {
      req.body = { name: 'Phone', sku: 'PHN-001', quantity: 5, price: 999.99 };
      mockPrisma.product.findUnique.mockResolvedValue({ id: 1, name: 'Phone', sku: 'PHN-001' });

      await addProduct(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(409);
      expect(json).toHaveBeenCalledWith({ error: 'Product SKU already exists' });
    });
  });

  describe('updateProductQuantity', () => {
    it('should update product quantity', async () => {
      req.params = { id: '1' };
      req.body = { quantity: 15 };
      mockPrisma.product.findUnique.mockResolvedValue({ id: 1, name: 'Phone' });
      mockPrisma.product.update.mockResolvedValue({ id: 1, quantity: 15 });

      await updateQuantity(req as Request, res as Response);

      expect(json).toHaveBeenCalledWith({ message: 'Quantity updated', quantity: 15 });
    });

    it('should return 404 if product not found', async () => {
      req.params = { id: '1' };
      req.body = { quantity: 15 };
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await updateQuantity(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });

  describe('getProducts', () => {
    it('should fetch products with pagination', async () => {
      req.query = { page: '1', pageSize: '10' };
      mockPrisma.product.findMany.mockResolvedValue([{ id: 1, name: 'Phone' }]);
      mockPrisma.product.count.mockResolvedValue(1);

      await getProducts(req as Request, res as Response);

      expect(json).toHaveBeenCalledWith({ data: [{ id: 1, name: 'Phone' }], total: 1, page: 1, pageSize: 10 });
    });
  });
});
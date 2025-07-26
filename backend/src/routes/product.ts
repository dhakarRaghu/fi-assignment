import { Router } from 'express';
import { addProduct, updateQuantity, getProducts } from '../controllers/product';
import { authenticate } from '../middleware/auth';
import { validate, productSchema, quantitySchema } from '../middleware/validate';

export const productRoutes = Router();

productRoutes.post('/products', authenticate, validate(productSchema), addProduct);
productRoutes.put('/products/:id/quantity', authenticate, validate(quantitySchema), updateQuantity);
productRoutes.get('/products', authenticate, getProducts);
import { Router } from 'express';
import { addProduct, updateProductQuantity, getProducts } from '../controllers/product';
import { authenticate } from '../middleware/auth';
import { validate, productSchema, quantitySchema } from '../middleware/validate';

export const productRoutes = Router();

productRoutes.post('/products', authenticate, validate(productSchema), addProduct);
productRoutes.put('/products/:id/quantity', authenticate, validate(quantitySchema), updateProductQuantity);
productRoutes.get('/products', authenticate, getProducts);
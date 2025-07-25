import { Router } from 'express';
import { addProduct, updateProductQuantity, getProducts } from '../controllers/product';
import { authenticate } from '../middlewares/auth';

export const productRoutes = Router();

productRoutes.post('/products', authenticate, addProduct);
productRoutes.put('/products/:id/quantity', authenticate, updateProductQuantity);
productRoutes.get('/products', authenticate, getProducts);
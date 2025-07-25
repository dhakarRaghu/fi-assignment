import express from 'express';
import { authRoutes } from './routes/authRoutes';
import { productRoutes } from './routes/productRoutes';
import { config } from './config';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
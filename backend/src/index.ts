import express from 'express';
import { authRoutes } from './routes/auth';
import { productRoutes } from './routes/product';
import { config } from './config';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middleware/error';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use('/api', authRoutes);
app.use('/api', productRoutes);

app.use(errorMiddleware);

app.all('*name', (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.listen(config.port, (error) => {
  if (error) {
    logger.error(`Server error: ${error.message}`);
    throw error;
  }
  logger.info(`Server running on port ${config.port}`);
});
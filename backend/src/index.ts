import express from 'express';
import { authRoutes } from './routes/authRoutes';
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

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
  }),
);

// Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);

// Error handling
app.use(errorMiddleware);

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});
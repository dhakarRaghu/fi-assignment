import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${error.message}, Path: ${req.path}`);
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
  });
};
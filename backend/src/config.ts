import { env } from './utils/env';

export const config = {
  port: env.PORT,
  jwtSecret: env.JWT_SECRET,
  databaseUrl: env.DATABASE_URL,
};
import { env } from './utils/env';

export const config = {
  port: env.PORT,
  jwtSecret: env.JWT_SECRET,
  database: {
    url: env.DATABASE_URL,
  },
  bcrypt: {
    rounds: env.BCRYPT_ROUNDS,
  },
  env: env.NODE_ENV,
} as const;
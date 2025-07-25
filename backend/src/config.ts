export const config = { 
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  databaseUrl: process.env.DATABASE_URL ,
};
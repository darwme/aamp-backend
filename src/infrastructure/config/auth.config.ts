import { config } from 'dotenv';

// Load environment variables
config();

// JWT configuration
export const jwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'access_secret_key',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m', // 15 minutes
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d', // 7 days
};

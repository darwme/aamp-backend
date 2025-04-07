import { config } from 'dotenv';
import { config as mssqlConfig } from 'mssql';

// Load environment variables
config();

// Database configuration
export const dbConfig: mssqlConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrongPassword123!',
  server: process.env.DB_SERVER?.split(',')[0] || 'localhost',
  port: parseInt(process.env.DB_SERVER?.split(',')[1] || '1433'),
  database: process.env.DB_NAME || 'aamp_auth',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true',
    enableArithAbort: true,
    connectTimeout: 30000 // 30 seconds
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

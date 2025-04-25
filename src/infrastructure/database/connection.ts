import sql from 'mssql';
import { dbConfig } from '../config/database.config';

class DatabaseConnection {
  private pool: sql.ConnectionPool | null = null;

  async connect(): Promise<void> {
    try {
      console.log('Attempting to connect to SQL Server...');
      this.pool = await new sql.ConnectionPool(dbConfig).connect();
      console.log('Successfully connected to SQL Server');
    } catch (error: any) {
      console.error('Database connection error:', error.message);
      console.error(`Error code: ${error.code}`);
      
      if (error.code === 'ELOGIN') {
        console.error('Authentication failed. Please check your credentials in .env file.');
      } else if (error.code === 'ESOCKET') {
        console.error('Could not connect to the server. Please check server address and port.');
      }
      
      throw error;
    }
  }

  getPool(): sql.ConnectionPool {
    if (!this.pool) {
      throw new Error('Database connection not established. Please call connect() first.');
    }
    return this.pool;
  }
}

export const dbConnection = new DatabaseConnection();

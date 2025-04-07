import sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';
import { dbConnection } from '../database/connection';
import { AuthUser } from '../../domain/entities/auth-user.entity';
import { Token } from '../../domain/entities/token.entity';
import { IAuthRepository } from '../../application/interfaces/repositories/auth-repository.interface';
import { RegisterUserDTO } from '../../application/dto/auth.dto';

export class AuthRepository implements IAuthRepository {
  async findUserById(id: string): Promise<AuthUser | null> {
    try {
      const pool = dbConnection.getPool();
      const result = await pool
        .request()
        .input('id', sql.VarChar, id)
        .query('SELECT * FROM Users WHERE id = @id');

      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<AuthUser | null> {
    try {
      const pool = dbConnection.getPool();
      const result = await pool
        .request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');

      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findUserByUsername(username: string): Promise<AuthUser | null> {
    try {
      const pool = dbConnection.getPool();
      const result = await pool
        .request()
        .input('username', sql.VarChar, username)
        .query('SELECT * FROM Users WHERE username = @username');

      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  async createUser(user: RegisterUserDTO): Promise<AuthUser> {
    try {
      const pool = dbConnection.getPool();
      const id = uuidv4();
      const now = new Date();
      
      const result = await pool
        .request()
        .input('id', sql.VarChar, id)
        .input('username', sql.VarChar, user.username)
        .input('email', sql.VarChar, user.email)
        .input('password', sql.VarChar, user.password)
        .input('isActive', sql.Bit, 1)
        .input('createdAt', sql.DateTime, now)
        .input('updatedAt', sql.DateTime, now)
        .query(`
          INSERT INTO Users (id, username, email, password, isActive, createdAt, updatedAt)
          VALUES (@id, @username, @email, @password, @isActive, @createdAt, @updatedAt);
          SELECT * FROM Users WHERE id = @id;
        `);

      return result.recordset[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      const pool = dbConnection.getPool();
      const now = new Date();
      
      await pool
        .request()
        .input('userId', sql.VarChar, userId)
        .input('lastLogin', sql.DateTime, now)
        .query('UPDATE Users SET lastLogin = @lastLogin WHERE id = @userId');
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  async saveToken(token: Omit<Token, 'id'>): Promise<Token> {
    try {
      const pool = dbConnection.getPool();
      const id = uuidv4();
      
      // First delete any existing tokens for this user
      await this.deleteTokensByUserId(token.user_id);
      
      const result = await pool
        .request()
        .input('id', sql.VarChar, id)
        .input('userId', sql.VarChar, token.user_id)
        .input('accessToken', sql.VarChar, token.accessToken)
        .input('refreshToken', sql.VarChar, token.refreshToken)
        .input('expiresAt', sql.DateTime, token.expiresAt)
        .input('createdAt', sql.DateTime, token.createdAt)
        .query(`
          INSERT INTO Tokens (id, user_id, accessToken, refreshToken, expiresAt, createdAt)
          VALUES (@id, @userId, @accessToken, @refreshToken, @expiresAt, @createdAt);
          SELECT * FROM Tokens WHERE id = @id;
        `);

      return result.recordset[0];
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }

  private async deleteTokensByUserId(userId: string): Promise<void> {
    try {
      const pool = dbConnection.getPool();
      await pool
        .request()
        .input('userId', sql.VarChar, userId)
        .query('DELETE FROM Tokens WHERE user_id = @userId');
    } catch (error) {
      console.error('Error deleting tokens by user ID:', error);
      throw error;
    }
  }

  async findTokenByUserId(userId: string): Promise<Token | null> {
    try {
      const pool = dbConnection.getPool();
      const result = await pool
        .request()
        .input('userId', sql.VarChar, userId)
        .query('SELECT * FROM Tokens WHERE user_id = @userId');

      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error finding token by user ID:', error);
      throw error;
    }
  }

  async deleteToken(tokenId: string): Promise<boolean> {
    try {
      const pool = dbConnection.getPool();
      const result = await pool
        .request()
        .input('id', sql.VarChar, tokenId)
        .query('DELETE FROM Tokens WHERE id = @id');

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting token:', error);
      throw error;
    }
  }

  async getUserRoles(userId: string): Promise<string[]> {
    try {
      const pool = dbConnection.getPool();
      const result = await pool.request()
        .input('user_id', sql.VarChar, userId)
        .execute('GetUserRoles');
      // Devuelve un arreglo con el nombre de cada rol
      return result.recordset.map((row: any) => row.role_name);
    } catch (error) {
      console.error('Error obtaining user roles:', error);
      throw error;
    }
  }
}

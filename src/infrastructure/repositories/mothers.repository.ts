import sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';
import { dbConnection } from '../database/connection';
import { Mother } from '../../domain/entities/mother.entity';
import { CreateMotherDTO, UpdateMotherDTO } from '../../application/dto/mother.dto';
import { IMothersRepository } from '../../application/interfaces/repositories/mothers-repository.interface';

export class MothersRepository implements IMothersRepository {
  async createMother(data: CreateMotherDTO): Promise<Mother> {
    try {
      const pool = dbConnection.getPool();
      const request = pool.request()
        .input('username', sql.VarChar, data.username)
        .input('password', sql.VarChar, data.password)
        .input('email', sql.VarChar, data.email)
        .input('due_date', sql.Date, data.due_date ? new Date(data.due_date) : null)
        .input('baby_birth_date', sql.Date, data.baby_birth_date ? new Date(data.baby_birth_date) : null)
        .input('notes', sql.Text, data.notes || null)
        .output('user_id', sql.VarChar);
      const result = await request.execute('CreateMother');
      console.log('CreateMother result:', result);
      if (result?.recordset && result.recordset.length > 0) {
        return result.recordset[0];
      } else if (result.output && result.output.user_id) {
        const mother = await this.getMotherById(result.output.user_id);
        if (mother) return mother;
      }
      throw new Error("CreateMother stored procedure did not return any record nor output user_id");
    } catch (error) {
      console.error('Error creating mother:', error);
      throw error;
    }
  }

  async getAllMothers(): Promise<Mother[]> {
    try {
      const pool = dbConnection.getPool();
      const result = await pool.request().execute('GetAllMothers');
      return result.recordset;
    } catch (error) {
      console.error('Error retrieving mothers:', error);
      throw error;
    }
  }

  async getMotherById(id: string): Promise<Mother | null> {
    try {
      const pool = dbConnection.getPool();
      const result = await pool.request()
        .input('user_id', sql.VarChar, id)
        .execute('GetMotherById');
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error retrieving mother by id:', error);
      throw error;
    }
  }

  async updateMother(id: string, data: UpdateMotherDTO): Promise<Mother> {
    try {
      const pool = dbConnection.getPool();
      const result = await pool.request()
        .input('user_id', sql.VarChar, id)
        .input('username', sql.VarChar, data.username || null)
        .input('email', sql.VarChar, data.email || null)
        .input('due_date', sql.Date, data.due_date ? new Date(data.due_date) : null)
        .input('baby_birth_date', sql.Date, data.baby_birth_date ? new Date(data.baby_birth_date) : null)
        .input('notes', sql.Text, data.notes || null)
        .input('isActive', sql.Bit, data.isActive !== undefined ? data.isActive : null)
        .execute('UpdateMother');

      if (result?.recordset && result.recordset.length > 0) {
        return result.recordset[0];
      } else {
        // Intentar recuperar el registro actualizado directamente
        const updatedMother = await this.getMotherById(id);
        console.log('Updated mother:', updatedMother);
        if (updatedMother) {
          return updatedMother;
        }
        throw new Error("UpdateMother stored procedure did not return any record");
      }
    } catch (error) {
      console.error('Error updating mother:', error);
      throw error;
    }
  }

  async deleteMother(id: string): Promise<boolean> {
    try {
      const pool = dbConnection.getPool();
      await pool.request()
        .input('user_id', sql.VarChar, id)
        .execute('DeleteMother');
      return true;
    } catch (error) {
      console.error('Error deleting mother:', error);
      throw error;
    }
  }
}

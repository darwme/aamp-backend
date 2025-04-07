import bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../application/interfaces/services/password-hasher.interface';

export class PasswordHasherService implements IPasswordHasher {
  private readonly saltRounds = 10;
  
  async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new Error('Failed to compare passwords');
    }
  }
}

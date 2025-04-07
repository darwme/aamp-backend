import { AuthUser } from '../../../domain/entities/auth-user.entity';
import { Token } from '../../../domain/entities/token.entity';
import { RegisterUserDTO } from '../../dto/auth.dto';

export interface IAuthRepository {
  findUserById(id: string): Promise<AuthUser | null>;
  findUserByEmail(email: string): Promise<AuthUser | null>;
  findUserByUsername(username: string): Promise<AuthUser | null>;
  createUser(user: RegisterUserDTO): Promise<AuthUser>;
  updateLastLogin(userId: string): Promise<void>;
  saveToken(token: Omit<Token, 'id'>): Promise<Token>;
  findTokenByUserId(userId: string): Promise<Token | null>;
  deleteToken(tokenId: string): Promise<boolean>;
  getUserRoles(userId: string): Promise<string[]>;
}

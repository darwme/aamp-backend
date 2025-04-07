import { IAuthRepository } from '../../interfaces/repositories/auth-repository.interface';
import { IPasswordHasher } from '../../interfaces/services/password-hasher.interface';
import { RegisterUserDTO } from '../../dto/auth.dto';
import { AuthUser } from '../../../domain/entities/auth-user.entity';

export class RegisterUserUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(userData: RegisterUserDTO): Promise<AuthUser> {
    // Check if user already exists with email or username
    const existingUserByEmail = await this.authRepository.findUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw new Error('User with this email already exists');
    }

    const existingUserByUsername = await this.authRepository.findUserByUsername(userData.username);
    if (existingUserByUsername) {
      throw new Error('Username is already taken');
    }

    // Hash password
    const hashedPassword = await this.passwordHasher.hash(userData.password);

    // Create user
    const user = await this.authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }
}

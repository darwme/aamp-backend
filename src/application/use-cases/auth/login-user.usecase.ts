import { IAuthRepository } from '../../interfaces/repositories/auth-repository.interface';
import { IPasswordHasher } from '../../interfaces/services/password-hasher.interface';
import { IJwtService } from '../../interfaces/services/jwt-service.interface';
import { LoginUserDTO, AuthResponseDTO } from '../../dto/auth.dto';

export class LoginUserUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private passwordHasher: IPasswordHasher,
    private jwtService: IJwtService
  ) {}

  async execute(credentials: LoginUserDTO): Promise<AuthResponseDTO> {

    const user = await this.authRepository.findUserByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    console.log('User found:', user);


    const isPasswordValid = await this.passwordHasher.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }


    await this.authRepository.updateLastLogin(user.id);

    const tokens = this.jwtService.generateTokens({
      userId: user.id,
      username: user.username,
      email: user.email
    });

    await this.authRepository.saveToken({
      user_id: user.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
      createdAt: new Date()
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      userId: user.id,
      username: user.username
    };
  }
}

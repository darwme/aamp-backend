import { IAuthRepository } from '../../interfaces/repositories/auth-repository.interface';
import { IJwtService } from '../../interfaces/services/jwt-service.interface';
import { AuthResponseDTO } from '../../dto/auth.dto';

export class RefreshTokenUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private jwtService: IJwtService
  ) {}

  async execute(refreshToken: string): Promise<AuthResponseDTO> {
    const decodedToken = this.jwtService.decodeToken(refreshToken);
    if (!decodedToken || !decodedToken.userId) {
      throw new Error('Invalid refresh token');
    }
    
    const savedToken = await this.authRepository.findTokenByUserId(decodedToken.userId);
    if (!savedToken || savedToken.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }
    
    // Check if token is expired
    if (new Date() > new Date(savedToken.expiresAt)) {
      await this.authRepository.deleteToken(savedToken.id);
      throw new Error('Refresh token expired');
    }
    
    // Get user details
    const user = await this.authRepository.findUserById(decodedToken.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Generate new tokens
    const tokens = this.jwtService.generateTokens({
      userId: user.id,
      username: user.username,
      email: user.email
    });
    
    // Update token in database
    await this.authRepository.saveToken({
      user_id: user.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
      createdAt: new Date()
    });
    
    // Return new tokens
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      userId: user.id,
      username: user.username
    };
  }
}

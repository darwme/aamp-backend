import jwt, { Secret } from 'jsonwebtoken';
import { IJwtService, TokenPayload, JWTResponse } from '../../application/interfaces/services/jwt-service.interface';
import { jwtConfig } from '../config/auth.config';

export class JwtService implements IJwtService {
  generateTokens(payload: TokenPayload): JWTResponse {
    // Access token - short lived
    const signOptions: any = {
        expiresIn: 900, //15 minutes
      };

      const signOptionsRefresh: any = {
        expiresIn: 2700, //45 minutes
      };
    
    const accessToken = jwt.sign(
        payload, 
        jwtConfig.accessTokenSecret as Secret, 
        signOptions
    ) as string;

    // Refresh token - longer lived
    const refreshToken = jwt.sign(
      payload, 
      jwtConfig.refreshTokenSecret as Secret, 
      signOptionsRefresh
    );

    // Convert duration string like "15m" to seconds
    const expiresInSeconds = this.getExpiryInSeconds(jwtConfig.accessTokenExpiry);

    return {
      accessToken,
      refreshToken,
      expiresIn: expiresInSeconds
    };
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, jwtConfig.accessTokenSecret as Secret) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Helper method to convert JWT time strings to seconds
  private getExpiryInSeconds(expiry: string): number {
    const unit = expiry.charAt(expiry.length - 1);
    const value = parseInt(expiry.substring(0, expiry.length - 1));

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: return 900; // Default to 15 minutes in seconds
    }
  }
}

export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
}

export interface JWTResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IJwtService {
  generateTokens(payload: TokenPayload): JWTResponse;
  verifyToken(token: string): TokenPayload | null;
  decodeToken(token: string): TokenPayload | null;
}

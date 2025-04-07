export interface Token {
  id: string;
  user_id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
}

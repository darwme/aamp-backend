export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  email: string;
}

export interface ChangePasswordDTO {
  token: string;
  newPassword: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userId: string;
  username: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  password: string; // Hashed password
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

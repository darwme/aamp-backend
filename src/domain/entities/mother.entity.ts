export interface Mother {
  id: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  lastLogin?: Date;
  due_date?: Date;
  baby_birth_date?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

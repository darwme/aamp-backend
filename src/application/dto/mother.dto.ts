export interface CreateMotherDTO {
  username: string;
  email: string;
  password: string;
  due_date?: string; // ISO date
  baby_birth_date?: string; // ISO date
  notes?: string;
}

export interface UpdateMotherDTO {
  username?: string;
  email?: string;
  due_date?: string;
  baby_birth_date?: string;
  notes?: string;
  isActive?: boolean;
}

export interface MotherResponseDTO {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  lastLogin?: string;
  due_date?: string;
  baby_birth_date?: string;
  notes?: string;
}

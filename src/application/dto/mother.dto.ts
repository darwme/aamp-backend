export interface CreateMotherDTO {
  username: string;
  email: string;
  password: string;
  due_date?: string; // ISO date
  baby_birth_date?: string; // ISO date
  notes?: string;
  // Nuevos campos
  weight?: number;
  height?: number;
  blood_type?: string;
  allergies?: string;
  medical_history?: string;
  fecha_nacimiento?: string; // ISO date
  semanas_gestacion?: number;
  numero_de_hijos?: number;
  tipo_embarazo?: string;
  plan_parto?: string;
  fecha_ultimo_control?: string; // ISO date
  mother_concept?: string;
}

export interface UpdateMotherDTO {
  username?: string;
  email?: string;
  due_date?: string;
  baby_birth_date?: string;
  notes?: string;
  isActive?: boolean;
  // Nuevos campos
  weight?: number;
  height?: number;
  blood_type?: string;
  allergies?: string;
  medical_history?: string;
  fecha_nacimiento?: string;
  semanas_gestacion?: number;
  numero_de_hijos?: number;
  tipo_embarazo?: string;
  plan_parto?: string;
  fecha_ultimo_control?: string;
  mother_concept?: string;
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
  // Nuevos campos
  weight?: number;
  height?: number;
  blood_type?: string;
  allergies?: string;
  medical_history?: string;
  fecha_nacimiento?: string;
  semanas_gestacion?: number;
  numero_de_hijos?: number;
  tipo_embarazo?: string;
  plan_parto?: string;
  fecha_ultimo_control?: string;
  mother_concept?: string;
}

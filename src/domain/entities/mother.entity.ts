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
  // Nuevos campos provenientes de mothers_profiles
  weight?: number;
  height?: number;
  blood_type?: string;
  allergies?: string;
  medical_history?: string;
  fecha_nacimiento?: Date;
  semanas_gestacion?: number;
  numero_de_hijos?: number;
  tipo_embarazo?: string;
  plan_parto?: string;
  fecha_ultimo_control?: Date;
  mother_concept?: string;
}

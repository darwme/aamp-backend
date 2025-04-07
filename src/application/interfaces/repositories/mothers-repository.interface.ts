import { Mother } from '../../../domain/entities/mother.entity';
import { CreateMotherDTO, UpdateMotherDTO } from '../../dto/mother.dto';

export interface IMothersRepository {
  createMother(data: CreateMotherDTO): Promise<Mother>;
  getAllMothers(): Promise<Mother[]>;
  getMotherById(id: string): Promise<Mother | null>;
  updateMother(id: string, data: UpdateMotherDTO): Promise<Mother>;
  deleteMother(id: string): Promise<boolean>;
}

import { IMothersRepository } from '../../interfaces/repositories/mothers-repository.interface';
import { IPasswordHasher } from '../../interfaces/services/password-hasher.interface';
import { CreateMotherDTO, UpdateMotherDTO } from '../../dto/mother.dto';
import { Mother } from '../../../domain/entities/mother.entity';
import { PasswordHasherService } from '../../../infrastructure/services/password-hasher.service';

export class MothersCrudUseCase {
  constructor(
    private mothersRepository: IMothersRepository,
    private passwordHasherService: IPasswordHasher = new PasswordHasherService()
  ) {}

  async createMother(data: CreateMotherDTO): Promise<Mother> {
    const hashedPassword = await this.passwordHasherService.hash(data.password);
    data.password = hashedPassword;
    return this.mothersRepository.createMother(data);
  }

  async getAllMothers(): Promise<Mother[]> {
    return this.mothersRepository.getAllMothers();
  }

  async getMotherById(id: string): Promise<Mother | null> {
    return this.mothersRepository.getMotherById(id);
  }

  async updateMother(id: string, data: UpdateMotherDTO): Promise<Mother> {
    return this.mothersRepository.updateMother(id, data);
  }

  async deleteMother(id: string): Promise<boolean> {
    return this.mothersRepository.deleteMother(id);
  }
}

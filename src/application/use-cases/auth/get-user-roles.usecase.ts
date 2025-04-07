import { IAuthRepository } from '../../interfaces/repositories/auth-repository.interface';

export class GetUserRolesUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userId: string): Promise<string[]> {
    return this.authRepository.getUserRoles(userId);
  }
}

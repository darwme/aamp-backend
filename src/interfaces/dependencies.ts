import { AuthController } from './controllers/auth.controller';
import { RegisterUserUseCase } from '../application/use-cases/auth/register-user.usecase';
import { LoginUserUseCase } from '../application/use-cases/auth/login-user.usecase';
import { GetUserRolesUseCase } from '../application/use-cases/auth/get-user-roles.usecase';
import { AuthRepository } from '../infrastructure/repositories/auth.repository';
import { PasswordHasherService } from '../infrastructure/services/password-hasher.service';
import { JwtService } from '../infrastructure/services/jwt.service';
import { MothersController } from './controllers/mothers.controller';
import { MothersRepository } from '../infrastructure/repositories/mothers.repository';
import { MothersCrudUseCase } from '../application/use-cases/mothers/mothers-crud.usecase';
import { RoleController } from './controllers/role.controller';

// Create instances of services
const authRepository = new AuthRepository();
const passwordHasher = new PasswordHasherService();
const jwtService = new JwtService();

// Create instances of use cases
const registerUserUseCase = new RegisterUserUseCase(authRepository, passwordHasher);
const loginUserUseCase = new LoginUserUseCase(authRepository, passwordHasher, jwtService);
const getUserRolesUseCase = new GetUserRolesUseCase(authRepository);

// Create controller instance with jwtService
export const authController = new AuthController(
  registerUserUseCase, 
  loginUserUseCase,
  jwtService
);

// Create instances of mothers dependencies
const mothersRepository = new MothersRepository();
const mothersUseCase = new MothersCrudUseCase(mothersRepository);
export const mothersController = new MothersController(mothersUseCase);

// Create instance of role controller
export const roleController = new RoleController(getUserRolesUseCase);

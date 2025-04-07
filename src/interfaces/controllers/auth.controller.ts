import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user.usecase';
import { LoginUserUseCase } from '../../application/use-cases/auth/login-user.usecase';
import { IJwtService } from '../../application/interfaces/services/jwt-service.interface';

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private jwtService: IJwtService
  ) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password } = req.body;
      
      const user = await this.registerUserUseCase.execute({
        username,
        email,
        password
      });

      // Return user info without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({
        message: 'User registered successfully',
        status: 'success',
        data: userWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      
      const authResult = await this.loginUserUseCase.execute({
        email,
        password
      });

      res.json({
        message: 'User logged in successfully',
        status: 'success',
        data: authResult
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      
      if (!token) {
        res.status(400).json({
          message: 'Token is required',
          status: 'error',
          data: null
        });
        return;
      }

      const payload = this.jwtService.verifyToken(token);
      
      if (!payload) {
        res.status(401).json({
          message: 'Invalid token',
          status: 'error',
          data: null
        });
        return;
      }

      // Return user info from token
      res.json({
        message: 'Token verified successfully',
        status: 'success',
        data: {
          userId: payload.userId,
          username: payload.username,
          email: payload.email
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

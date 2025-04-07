import { Request, Response, NextFunction } from 'express';
import { GetUserRolesUseCase } from '../../application/use-cases/auth/get-user-roles.usecase';

export class RoleController {
  constructor(private getUserRolesUseCase: GetUserRolesUseCase) {}

  async getUserRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      const roles = await this.getUserRolesUseCase.execute(userId);
      res.status(200).json({
        message: 'Roles retrieved successfully',
        status: 'success',
        data: roles
      });
    } catch (error) {
      next(error);
    }
  }
}

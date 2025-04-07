import { Request, Response, NextFunction } from 'express';
import { MothersCrudUseCase } from '../../application/use-cases/mothers/mothers-crud.usecase';

export class MothersController {
  constructor(private mothersUseCase: MothersCrudUseCase) {}

  async createMother(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mother = await this.mothersUseCase.createMother(req.body);
      res.status(201).json({
        message: 'Mother created successfully',
        status: 'success',
        data: mother
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllMothers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mothers = await this.mothersUseCase.getAllMothers();
      res.json({
        message: 'Mothers retrieved successfully',
        status: 'success',
        data: mothers
      });
    } catch (error) {
      next(error);
    }
  }

  async getMotherById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mother = await this.mothersUseCase.getMotherById(req.params.id);
      if (!mother) {
        res.status(404).json({ message: 'Mother not found', status: 'error', data: null });
        return;
      }
      res.json({
        message: 'Mother retrieved successfully',
        status: 'success',
        data: mother
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMother(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mother = await this.mothersUseCase.updateMother(req.params.id, req.body);
      res.json({
        message: 'Mother updated successfully',
        status: 'success',
        data: mother
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMother(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.mothersUseCase.deleteMother(req.params.id);
      res.json({
        message: 'Mother deleted successfully',
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response } from 'express';
import { IDniService } from '../../application/interfaces/services/dni_service.interface';

export class DniController {
  private readonly dniService: IDniService;

  constructor(dniService: IDniService) {
    this.dniService = dniService;
  }

  async getDni(req: Request, res: Response): Promise<void> {
    const { numeroDocumento } = req.params;

    try {
      const dniData = await this.dniService.getDniData(numeroDocumento);
      res.status(200).json(dniData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'error';
      res.status(500).json({ message: errorMessage });
    }
  }
}
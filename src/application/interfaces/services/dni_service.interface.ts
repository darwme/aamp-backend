import { dni } from '../../../domain/entities/dni.entity';

export interface IDniService {
  getDniData(numeroDocumento: string): Promise<dni>;
}
import { IDniService } from '../../application/interfaces/services/dni_service.interface';
import { dni } from '../../domain/entities/dni.entity';
import { ApiNetService } from '../helper/ApiNet.service'; 

export class DniService implements IDniService {
  private readonly apiNetService = new ApiNetService(); 

  async getDniData(numeroDocumento: string): Promise<dni> {
    try {
      const apiData = await this.apiNetService.getApiNetData(numeroDocumento); 
      return {
        nombres: apiData.nombres,
        apellidoPaterno: apiData.apellidoPaterno,
        apellidoMaterno: apiData.apellidoMaterno,
        nombreCompleto: `${apiData.nombres} ${apiData.apellidoPaterno} ${apiData.apellidoMaterno}`,
        tipoDocumento: 'DNI',
        numeroDocumento: apiData.numeroDocumento,
        digitoVerificador: apiData.digitoVerificador || '',
      };
    } catch (error) {
      console.error('Error in DniService:', error);
      throw new Error('Failed to fetch DNI data');
    }
  }
}
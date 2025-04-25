import { IApiNetService } from "./IApiNet.service";

export class ApiNetService implements IApiNetService {
  async getApiNetData(dni: any): Promise<any> {
    try {
        const response = await fetch(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
            headers: {
              Authorization: 'Bearer apis-token-14565.uvkuoSPZqCsL0hEdlRePvR0JcZFv4PvS'
            }
          });
          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
          }
          
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in ApiNetService:', error);
      throw error;
    }
  }
}
export interface IApiNetService {
  getApiNetData: (dni:any) => Promise<any>;
}
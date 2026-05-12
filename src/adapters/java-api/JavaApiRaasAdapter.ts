import axios from 'axios';

export interface RaasArquivo {
  id: number;
  mes: number;
  ano: number;
  data_geracao: string;
  codigo_empresa: string | null;
  nome_empresa: string | null;
  path: string;
  status: string;
  total_folha: number;
}

export class JavaApiRaasAdapter {
  static async listarArquivosRaas(params?: Record<string, string>): Promise<RaasArquivo[]> {
    const response = await axios.get<RaasArquivo[]>('http://localhost:8081/api/v1/raas', { params });
    return response.data;
  }
}

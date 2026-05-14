import { ArquivoRaas } from "./ArquivoRaas";

export interface ListarArquivosRaasResponse {
  arquivos: ArquivoRaas[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

import type { ArquivoRaas } from "./schemas";
import type { ListarArquivosRaasRequest } from "../types/ListarArquivosRaasRequest";

export interface ListarArquivosRaasResult {
  arquivos: ArquivoRaas[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface RaasPort {
  listarArquivos(
    request: ListarArquivosRaasRequest,
  ): Promise<ListarArquivosRaasResult>;
}

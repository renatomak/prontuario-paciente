import type { ArquivoRaas } from "./schemas";
import type { ListarArquivosRaasRequest } from "../types/ListarArquivosRaasRequest";

export interface ListarArquivosRaasResult {
  arquivos: ArquivoRaas[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

/**
 * Porta (Port) do domínio RAAS.
 * Os hooks (Application/Use Cases) dependem somente desta interface.
 */
export interface RaasRepository {
  listarArquivos(
    request: ListarArquivosRaasRequest,
  ): Promise<ListarArquivosRaasResult>;
}

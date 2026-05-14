import type { ListarArquivosRaasRequest, ListarArquivosRaasResponse } from "../types/RaasTypes";

export interface ListarArquivoRaasPort {
  listarArquivos(request: ListarArquivosRaasRequest): Promise<ListarArquivosRaasResponse>;
}

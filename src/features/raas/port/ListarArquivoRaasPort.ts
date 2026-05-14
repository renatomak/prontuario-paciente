import type { ListarArquivosRaasRequest, ListarArquivosRaasResponse } from "../types/raas";

export interface ListarArquivoRaasPort {
  listarArquivos(request: ListarArquivosRaasRequest): Promise<ListarArquivosRaasResponse>;
}

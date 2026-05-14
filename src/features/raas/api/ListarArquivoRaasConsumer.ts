import { JavaApiClient } from "@/shared/http/JavaApiClient";
import { getRaasApiBaseUrl } from "@/shared/env";
import type { ListarArquivoRaasPort } from "../port/ListarArquivoRaasPort";
import type {
  ListarArquivosRaasRequest,
  ListarArquivosRaasResponse
} from "../types/raas";

export class ListarArquivoRaasConsumer implements ListarArquivoRaasPort {
  private client = new JavaApiClient(getRaasApiBaseUrl());

  async listarArquivos(
    request: ListarArquivosRaasRequest,
  ): Promise<ListarArquivosRaasResponse> {
    const params: Record<string, string> = {};

    if (request.competencia && request.competencia.match(/^\d{2}\/\d{4}$/)) {
      const [mes, ano] = request.competencia.split("/");
      params.mes = mes;
      params.ano = ano;
    }
    if (request.codigoEmpresa) params.codigoEmpresa = request.codigoEmpresa;
    if (request.situacao) params.situacao = request.situacao;
    if (request.page != null) params.page = String(request.page);
    if (request.size != null) params.size = String(request.size);

    return this.client.get<ListarArquivosRaasResponse>(
      "/api/v1/raas",
      params,
    );
  }
}

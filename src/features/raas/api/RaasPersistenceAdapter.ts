import { JavaApiClient } from "@/shared/http/JavaApiClient";
import { getRaasApiBaseUrl } from "@/shared/env";
import type { RaasPort, ListarArquivosRaasResult } from "../domain/RaasPort";
import type { ListarArquivosRaasRequest } from "../types/ListarArquivosRaasRequest";
import type { ListarArquivosRaasResponse } from "../types/ListarArquivosRaasResponse";
import { RaasMapper } from "./RaasMapper";

export class RaasPersistenceAdapter implements RaasPort {
  private client = new JavaApiClient(getRaasApiBaseUrl());

  async listarArquivos(
    request: ListarArquivosRaasRequest,
  ): Promise<ListarArquivosRaasResult> {
    const params: Record<string, string> = {};

    let mes = request.mes;
    let ano = request.ano;
    if (!mes && !ano && request.competencia?.match(/^\d{2}\/\d{4}$/)) {
      [mes, ano] = request.competencia.split("/");
    }
    if (mes) params.mes = mes;
    if (ano) params.ano = ano;
    if (request.codigoEmpresa) params.codigoEmpresa = request.codigoEmpresa;
    if (request.situacao) params.situacao = request.situacao;
    if (request.page != null) params.page = String(request.page);
    if (request.size != null) params.size = String(request.size);

    const data = await this.client.get<ListarArquivosRaasResponse>(
      "/api/v1/raas",
      params,
    );
    return RaasMapper.toListResult(data, request.size ?? 1000);
  }
}

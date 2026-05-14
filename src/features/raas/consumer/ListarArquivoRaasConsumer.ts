import { JavaApiClient } from "@/shared/http/JavaApiClient";
import { getRaasApiBaseUrl } from "@/shared/env";
import type { ListarArquivoRaasPort } from "../port";
import type {
  ListarArquivosRaasRequest,
  ListarArquivosRaasResponse,
} from "../types/RaasTypes";
import { RaasMapper } from "./RaasMapper";

const COMPETENCIA_REGEX = /^(\d{2})\/(\d{4})$/;

export class ListarArquivoRaasConsumer implements ListarArquivoRaasPort {
  private client = new JavaApiClient(getRaasApiBaseUrl());

  async listarArquivos(
    request: ListarArquivosRaasRequest,
  ): Promise<ListarArquivosRaasResponse> {
    const params = this.buildParams(request);
    const raw = await this.client.get<unknown>("/api/v1/raas", params);
    return RaasMapper.toListResult(raw, request.size ?? 10);
  }

  private buildParams(request: ListarArquivosRaasRequest): Record<string, string> {
    const params: Record<string, string> = {};

    const match = request.competencia?.match(COMPETENCIA_REGEX);
    if (match) {
      params.mes = match[1];
      params.ano = match[2];
    }
    if (request.codigoEmpresa) params.codigoEmpresa = request.codigoEmpresa;
    if (request.situacao) params.situacao = request.situacao;
    // page/size: omitidos quando null/undefined — o backend aplica defaults (page=0, size=10).
    if (request.page != null) params.page = String(request.page);
    if (request.size != null) params.size = String(request.size);

    return params;
  }
}

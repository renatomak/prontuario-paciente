import axios from "axios";
import type { RaasRepository, ListarArquivosRaasResult } from "../domain/RaasRepository";
import type { ListarArquivosRaasRequest } from "../types/ListarArquivosRaasRequest";
import type { ListarArquivosRaasResponse } from "../types/ListarArquivosRaasResponse";
import { RaasMapper } from "./RaasMapper";

const DEFAULT_BASE_URL = "http://localhost:8081/api/v1/raas";

export class RaasPersistenceAdapter implements RaasRepository {
  constructor(private readonly baseUrl: string = DEFAULT_BASE_URL) {}

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

    const { data } = await axios.get<ListarArquivosRaasResponse>(this.baseUrl, {
      params,
    });
    return RaasMapper.toListResult(data, request.size ?? 1000);
  }
}

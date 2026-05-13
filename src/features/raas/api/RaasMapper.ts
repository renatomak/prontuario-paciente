import {
  ArquivoRaasProjectionSchema,
  type ArquivoRaasResponse,
} from "../port/schemas";
import type { ArquivoRaasProjection } from "../types/ArquivoRaasProjection";
import type { ListarArquivosRaasResponse } from "../types/ListarArquivosRaasResponse";
import type { ListarArquivosRaasResult } from "../port/RaasPort";

export class RaasMapper {
  static toDomain(raw: ArquivoRaasProjection): ArquivoRaasResponse {
    const dto = ArquivoRaasProjectionSchema.parse(raw);
    return {
      id: dto.id,
      mes: dto.mes,
      ano: dto.ano,
      dataGeracao: dto.dataGeracao ?? "",
      codigoEmpresa: dto.codigoEmpresa,
      nomeEmpresa: dto.nomeEmpresa,
      path: dto.path ?? "",
      status: dto.status ?? "",
      totalFolha: dto.totalFolha ?? 0,
    };
  }

  static toListResult(
    response: ListarArquivosRaasResponse,
    requestedSize: number,
  ): ListarArquivosRaasResult {
    if (Array.isArray(response)) {
      const arquivos = response.map(RaasMapper.toDomain);
      return {
        arquivos,
        totalElements: arquivos.length,
        totalPages: Math.max(1, Math.ceil(arquivos.length / requestedSize)),
        page: 0,
        size: requestedSize,
      };
    }
    const arquivos = (response.content ?? []).map(RaasMapper.toDomain);
    return {
      arquivos,
      totalElements: response.totalElements ?? arquivos.length,
      totalPages: response.totalPages ?? 1,
      page: response.number ?? 0,
      size: response.size ?? requestedSize,
    };
  }
}

import {
  ArquivoRaasProjectionSchema,
  type ArquivoRaas,
} from "../domain/schemas";
import type { ArquivoRaasProjection } from "../types/ArquivoRaasProjection";
import type { ListarArquivosRaasResponse } from "../types/ListarArquivosRaasResponse";
import type { ListarArquivosRaasResult } from "../domain/RaasRepository";

export class RaasMapper {
  static toDomain(raw: ArquivoRaasProjection): ArquivoRaas {
    return ArquivoRaasProjectionSchema.parse(raw);
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

import { ArquivoRaasSchema, type ArquivoRaas } from "../types/ArquivoRaas";
import type {
  ArquivoRaasProjection,
  SpringPageProjection,
} from "../types/ArquivoRaasProjection";
import type { ListarArquivosRaasResponse } from "../types/ListarArquivosRaasResponse";

/**
 * Converte DTOs (Projection) recebidos do backend para o modelo de domínio
 * usado pela UI. Centraliza a normalização — adapters e componentes não
 * devem inspecionar a forma da resposta do backend.
 */
export class RaasMapper {
  static toDomain(dto: ArquivoRaasProjection): ArquivoRaas {
    // Schema valida tipos básicos; campos que não casarem lançam ZodError.
    return ArquivoRaasSchema.parse({
      id: dto.id,
      mes: dto.mes,
      ano: dto.ano,
      dataGeracao: dto.dataGeracao,
      codigoEmpresa: dto.codigoEmpresa,
      nomeEmpresa: dto.nomeEmpresa,
      path: dto.path,
      status: dto.status,
      totalFolha: dto.totalFolha,
    });
  }

  /**
   * Normaliza tanto resposta `Page<T>` do Spring quanto `T[]` cru
   * num formato unificado para a UI.
   */
  static toListResult(
    raw: SpringPageProjection<ArquivoRaasProjection> | ArquivoRaasProjection[] | unknown,
    fallbackSize: number,
  ): ListarArquivosRaasResponse {
    if (Array.isArray(raw)) {
      const arquivos = raw.map((d) => RaasMapper.toDomain(d));
      return {
        arquivos,
        totalElements: arquivos.length,
        totalPages: 1,
        page: 0,
        size: fallbackSize,
      };
    }

    if (raw && typeof raw === "object" && "content" in raw) {
      const page = raw as SpringPageProjection<ArquivoRaasProjection>;
      return {
        arquivos: (page.content ?? []).map((d) => RaasMapper.toDomain(d)),
        totalElements: page.totalElements ?? 0,
        totalPages: page.totalPages ?? 1,
        page: page.number ?? 0,
        size: page.size ?? fallbackSize,
      };
    }

    return {
      arquivos: [],
      totalElements: 0,
      totalPages: 1,
      page: 0,
      size: fallbackSize,
    };
  }
}

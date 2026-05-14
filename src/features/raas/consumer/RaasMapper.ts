import { ArquivoRaasSchema, type ArquivoRaas } from "../types/ArquivoRaas";
import type {
  ArquivoRaasProjection,
  SpringPageProjection,
} from "../types/ArquivoRaasProjection";
import type { ListarArquivosRaasResponse } from "../types/ListarArquivosRaasResponse";

export class RaasMapper {
  static toDomain(dto: ArquivoRaasProjection): ArquivoRaas {
    const parsed = ArquivoRaasSchema.safeParse({
      id: dto.id,
      mes: dto.mes,
      ano: dto.ano,
      dataGeracao: dto.dataGeracao,
      codigoEmpresa: dto.codigoEmpresa ?? null,
      nomeEmpresa: dto.nomeEmpresa ?? null,
      path: dto.path,
      status: dto.status != null ? String(dto.status) : "",
      totalFolha: dto.totalFolha ?? 0,
    });
    if (parsed.success) return parsed.data;
    console.warn("[RaasMapper] item inválido ignorado pela validação:", parsed.error.issues, dto);
    return {
      id: Number(dto.id),
      mes: Number(dto.mes),
      ano: Number(dto.ano),
      dataGeracao: String(dto.dataGeracao ?? ""),
      codigoEmpresa: dto.codigoEmpresa ?? null,
      nomeEmpresa: dto.nomeEmpresa ?? null,
      path: String(dto.path ?? ""),
      status: String(dto.status ?? ""),
      totalFolha: Number(dto.totalFolha ?? 0),
    };
  }

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

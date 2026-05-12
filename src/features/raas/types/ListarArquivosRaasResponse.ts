import type { ArquivoRaasProjection } from "./ArquivoRaasProjection";

/**
 * Pode vir como array simples ou como Spring Page.
 * O Mapper normaliza ambos para o domínio.
 */
export type ListarArquivosRaasResponse =
  | ArquivoRaasProjection[]
  | {
      content: ArquivoRaasProjection[];
      totalElements?: number;
      totalPages?: number;
      number?: number;
      size?: number;
    };

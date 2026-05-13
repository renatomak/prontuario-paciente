import type { ArquivoRaasProjection } from "./ArquivoRaasProjection";

export type ListarArquivosRaasResponse =
  | ArquivoRaasProjection[]
  | {
      content: ArquivoRaasProjection[];
      totalElements?: number;
      totalPages?: number;
      number?: number;
      size?: number;
    };

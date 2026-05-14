import { ArquivoRaas } from "./ArquivoRaas";

export interface ListarArquivosRaasResponse {
  content: ArquivoRaas[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
  pageable?: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };

  arquivos?: ArquivoRaas[];
  page?: number;
}

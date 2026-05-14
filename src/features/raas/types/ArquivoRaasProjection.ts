/**
 * DTO bruto recebido do backend Java (espelha snake/camel do JSON).
 * Não usar diretamente na UI — converter via RaasMapper.toDomain.
 */
export interface ArquivoRaasProjection {
  id: number;
  mes: number;
  ano: number;
  dataGeracao: string;
  codigoEmpresa: string | null;
  nomeEmpresa: string | null;
  path: string;
  status: string;
  totalFolha: number;
}

/** Página padrão Spring (Pageable). */
export interface SpringPageProjection<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

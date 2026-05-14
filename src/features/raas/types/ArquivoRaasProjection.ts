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

export interface SpringPageProjection<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

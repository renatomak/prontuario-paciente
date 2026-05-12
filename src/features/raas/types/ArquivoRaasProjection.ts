export interface ArquivoRaasProjection {
  id: number;
  mes: number;
  ano: number;
  dataGeracao: string | null;
  codigoEmpresa: string | null;
  nomeEmpresa: string | null;
  path: string | null;
  status: string | null;
  totalFolha: number | null;
}

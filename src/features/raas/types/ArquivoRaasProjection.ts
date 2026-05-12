/**
 * DTO espelhando o payload retornado pelo backend Java
 * para a listagem de arquivos do RAAS-PSI.
 *
 * Mantemos o snake_case para refletir EXATAMENTE o JSON
 * recebido — a conversão para camelCase ocorre no Mapper.
 */
export interface ArquivoRaasProjection {
  id: number;
  mes: number;
  ano: number;
  data_geracao: string;
  codigo_empresa: string | null;
  nome_empresa: string | null;
  path: string;
  status: string;
  total_folha: number;
}

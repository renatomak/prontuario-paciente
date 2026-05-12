/**
 * Parâmetros aceitos pelo endpoint
 *   GET /api/raas-psi/arquivos
 *
 * Todos opcionais — quando ausentes, lista todos.
 */
export interface ListarArquivosRaasRequest {
  competencia?: string; // formato MM/AAAA
  mes?: string;
  ano?: string;
  codigoEmpresa?: string;
  situacao?: string;
  page?: number;
  size?: number;
}

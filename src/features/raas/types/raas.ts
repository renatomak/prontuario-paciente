import { z } from "zod";

export const ArquivoRaasSchema = z.object({
  id: z.number(),
  mes: z.number().int().min(1).max(12),
  ano: z.number().int(),
  dataGeracao: z.string(),
  codigoEmpresa: z.string().nullable(),
  nomeEmpresa: z.string().nullable(),
  path: z.string(),
  status: z.string(),
  totalFolha: z.number(),
});
export type ArquivoRaas = z.infer<typeof ArquivoRaasSchema>;

export interface ListarArquivosRaasRequest {
  competencia?: string;
  codigoEmpresa?: string;
  situacao?: string;
  page?: number;
  size?: number;
}

export interface ListarArquivosRaasResponse {
  arquivos: ArquivoRaas[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface DownloadArquivoRaasResponse {
  id: number;
  nome: string | null;
  arquivo: string | null;
}

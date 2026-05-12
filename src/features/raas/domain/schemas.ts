import { z } from "zod";

/**
 * Schema Zod usado pelo Mapper para validar o payload
 * recebido da infraestrutura antes de chegar ao domínio.
 */
export const ArquivoRaasProjectionSchema = z.object({
  id: z.number(),
  mes: z.number(),
  ano: z.number(),
  data_geracao: z.string(),
  codigo_empresa: z.string().nullable(),
  nome_empresa: z.string().nullable(),
  path: z.string(),
  status: z.string(),
  total_folha: z.number(),
});

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

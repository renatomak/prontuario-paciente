import { z } from "zod";

export const ArquivoRaasProjectionSchema = z.object({
  id: z.number(),
  mes: z.number(),
  ano: z.number(),
  dataGeracao: z.string(),
  codigoEmpresa: z.string().nullable(),
  nomeEmpresa: z.string().nullable(),
  path: z.string(),
  status: z.string(),
  totalFolha: z.number(),
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

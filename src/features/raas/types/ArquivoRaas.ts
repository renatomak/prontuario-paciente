import { z as dataValidator } from "zod";

export const ArquivoRaasSchema = dataValidator.object({
  id: dataValidator.number(),
  mes: dataValidator.number().int().min(1).max(12),
  ano: dataValidator.number().int(),
  dataGeracao: dataValidator.string(),
  codigoEmpresa: dataValidator.string().nullable(),
  nomeEmpresa: dataValidator.string().nullable(),
  path: dataValidator.string(),
  status: dataValidator.string(),
  totalFolha: dataValidator.number(),
});
export type ArquivoRaas = dataValidator.infer<typeof ArquivoRaasSchema>;

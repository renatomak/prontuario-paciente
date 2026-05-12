import { z as validarTipo } from "zod";

export const ArquivoRaasProjectionSchema = validarTipo.object({
  id: validarTipo.number(),
  mes: validarTipo.number(),
  ano: validarTipo.number(),
  dataGeracao: validarTipo.string().nullable().default(""),
  codigoEmpresa: validarTipo.string().nullable().default(null),
  nomeEmpresa: validarTipo.string().nullable().default(null),
  path: validarTipo.string().nullable().default(""),
  status: validarTipo.string().nullable().default(""),
  totalFolha: validarTipo.number().nullable().default(0),
}).passthrough();

export const ArquivoRaasSchema = validarTipo.object({
  id: validarTipo.number(),
  mes: validarTipo.number().int().min(1).max(12),
  ano: validarTipo.number().int(),
  dataGeracao: validarTipo.string(),
  codigoEmpresa: validarTipo.string().nullable(),
  nomeEmpresa: validarTipo.string().nullable(),
  path: validarTipo.string(),
  status: validarTipo.string(),
  totalFolha: validarTipo.number(),
});

export type ArquivoRaasResponse = validarTipo.infer<typeof ArquivoRaasSchema>;

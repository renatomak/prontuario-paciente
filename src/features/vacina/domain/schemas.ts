import { z } from "zod";

export const VacinaResumoSchema = z.object({
  idAplicacao: z.number(),
  dataAplicacao: z.string(),
  nomeVacina: z.string(),
  dose: z.string(),
  estrategia: z.string().nullable(),
  status: z.string(),
  laboratorio: z.string().nullable().optional(),
  estabelecimento: z.string().nullable().optional(),
  profissional: z.string().nullable().optional(),
  lote: z.string().nullable().optional(),
});

export const VacinaDetalheSchema = z.object({
  idAplicacao: z.number(),
  nrAtendimento: z.string().nullable(),
  doseCodigo: z.number().nullable(),
  dose: z.string(),
  estrategia: z.string().nullable(),
  nomeVacina: z.string(),
  descricaoVacina: z.string().nullable(),
  lote: z.string().nullable(),
  validadeLote: z.string().nullable(),
  fabricanteNome: z.string().nullable(),
  fabricanteCnpj: z.string().nullable(),
  dataAplicacao: z.string(),
  localAtendimento: z.string().nullable(),
  turno: z.string().nullable(),
  grupoAtendimento: z.string().nullable(),
  gestante: z.boolean(),
  puerpera: z.boolean(),
  historico: z.boolean(),
  foraEsquema: z.boolean(),
  viajante: z.boolean(),
  novoFrasco: z.boolean(),
  viaAdministracao: z.string().nullable(),
  localAplicacao: z.string().nullable(),
  observacao: z.string().nullable(),
  status: z.string(),
  profissionalNome: z.string().nullable(),
  profissionalConselho: z.string().nullable(),
  profissionalRegistro: z.string().nullable(),
  profissionalCns: z.string().nullable(),
  unidadeNome: z.string().nullable(),
  unidadeCnes: z.string().nullable(),
  rndsSituacao: z.string().nullable(),
  rndsUuid: z.string().nullable(),
});

export type VacinaResumo = z.infer<typeof VacinaResumoSchema>;
export type VacinaDetalhe = z.infer<typeof VacinaDetalheSchema>;

import { z as validarTipos } from "zod";

export const VacinaResumoSchema = validarTipos.object({
  idAplicacao: validarTipos.number(),
  dataAplicacao: validarTipos.string(),
  nomeVacina: validarTipos.string(),
  dose: validarTipos.string(),
  estrategia: validarTipos.string().nullable(),
  status: validarTipos.string(),
  laboratorio: validarTipos.string().nullable().optional(),
  estabelecimento: validarTipos.string().nullable().optional(),
  profissional: validarTipos.string().nullable().optional(),
  lote: validarTipos.string().nullable().optional(),
});

export const VacinaDetalheSchema = validarTipos.object({
  idAplicacao: validarTipos.number(),
  nrAtendimento: validarTipos.string().nullable(),
  doseCodigo: validarTipos.number().nullable(),
  dose: validarTipos.string(),
  estrategia: validarTipos.string().nullable(),
  nomeVacina: validarTipos.string(),
  descricaoVacina: validarTipos.string().nullable(),
  lote: validarTipos.string().nullable(),
  validadeLote: validarTipos.string().nullable(),
  fabricanteNome: validarTipos.string().nullable(),
  fabricanteCnpj: validarTipos.string().nullable(),
  dataAplicacao: validarTipos.string(),
  localAtendimento: validarTipos.string().nullable(),
  turno: validarTipos.string().nullable(),
  grupoAtendimento: validarTipos.string().nullable(),
  gestante: validarTipos.boolean(),
  puerpera: validarTipos.boolean(),
  historico: validarTipos.boolean(),
  foraEsquema: validarTipos.boolean(),
  viajante: validarTipos.boolean(),
  novoFrasco: validarTipos.boolean(),
  viaAdministracao: validarTipos.string().nullable(),
  localAplicacao: validarTipos.string().nullable(),
  observacao: validarTipos.string().nullable(),
  status: validarTipos.string(),
  profissionalNome: validarTipos.string().nullable(),
  profissionalConselho: validarTipos.string().nullable(),
  profissionalRegistro: validarTipos.string().nullable(),
  profissionalCns: validarTipos.string().nullable(),
  unidadeNome: validarTipos.string().nullable(),
  unidadeCnes: validarTipos.string().nullable(),
  rndsSituacao: validarTipos.string().nullable(),
  rndsUuid: validarTipos.string().nullable(),
});

export type VacinaResumoResponse = validarTipos.infer<typeof VacinaResumoSchema>;
export type VacinaDetalheResponse = validarTipos.infer<typeof VacinaDetalheSchema>;

/**
 * DTOs brutos retornados pelo backend Java para vacinas.
 * Aceitam variações snake_case e camelCase.
 */
export interface VacinaResumoProjection {
  id_aplicacao?: number;
  idAplicacao?: number;
  data_aplicacao?: string | null;
  dataAplicacao?: string | null;
  vacina?: string | null;
  nome_vacina?: string | null;
  nomeVacina?: string | null;
  dose?: string | null;
  estrategia?: string | null;
  status?: string | number | null;
  laboratorio?: string | null;
  estabelecimento?: string | null;
  profissional?: string | null;
  lote?: string | null;
}

export interface VacinaDetalheProjection {
  id_aplicacao?: number;
  idAplicacao?: number;
  nr_atendimento?: string | null;
  nrAtendimento?: string | null;
  dose_codigo?: number | null;
  doseCodigo?: number | null;
  dose?: string | null;
  estrategia?: string | null;
  nome_vacina?: string | null;
  nomeVacina?: string | null;
  descricao_vacina?: string | null;
  descricaoVacina?: string | null;
  lote?: string | null;
  validade_lote?: string | null;
  validadeLote?: string | null;
  fabricante_nome?: string | null;
  fabricanteNome?: string | null;
  fabricante_cnpj?: string | null;
  fabricanteCnpj?: string | null;
  data_aplicacao?: string | null;
  dataAplicacao?: string | null;
  local_atendimento?: string | null;
  localAtendimento?: string | null;
  turno?: string | null;
  grupo_atendimento?: string | null;
  grupoAtendimento?: string | null;
  gestante?: boolean | null;
  puerpera?: boolean | null;
  historico?: boolean | null;
  fora_esquema?: boolean | null;
  foraEsquema?: boolean | null;
  viajante?: boolean | null;
  novo_frasco?: boolean | null;
  novoFrasco?: boolean | null;
  via_administracao?: string | null;
  viaAdministracao?: string | null;
  local_aplicacao?: string | null;
  localAplicacao?: string | null;
  observacao?: string | null;
  status?: string | null;
  profissional_nome?: string | null;
  profissionalNome?: string | null;
  profissional_conselho?: string | null;
  profissionalConselho?: string | null;
  profissional_registro?: string | null;
  profissionalRegistro?: string | null;
  profissional_cns?: string | null;
  profissionalCns?: string | null;
  unidade_nome?: string | null;
  unidadeNome?: string | null;
  unidade_cnes?: string | null;
  unidadeCnes?: string | null;
  rnds_situacao?: string | null;
  rndsSituacao?: string | null;
  rnds_uuid?: string | null;
  rndsUuid?: string | null;
  profissional?: { nome?: string | null; conselho?: string | null; registro?: string | null; cns?: string | null } | null;
  unidade?: { nome?: string | null; cnes?: string | null } | null;
  fabricante?: { nome?: string | null; cnpj?: string | null } | null;
  rnds?: { situacao?: string | null; uuid?: string | null } | null;
}

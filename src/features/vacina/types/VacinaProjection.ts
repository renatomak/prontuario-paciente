export interface VacinaResumoProjection {
  idAplicacao?: number;
  dataAplicacao?: string | null;
  vacina?: string | null;
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
  idAplicacao?: number;
  nrAtendimento?: string | null;
  doseCodigo?: number | null;
  dose?: string | null;
  estrategia?: string | null;
  nomeVacina?: string | null;
  descricaoVacina?: string | null;
  lote?: string | null;
  validadeLote?: string | null;
  fabricanteNome?: string | null;
  fabricanteCnpj?: string | null;
  dataAplicacao?: string | null;
  localAtendimento?: string | null;
  turno?: string | null;
  grupoAtendimento?: string | null;
  gestante?: boolean | null;
  puerpera?: boolean | null;
  historico?: boolean | null;
  foraEsquema?: boolean | null;
  viajante?: boolean | null;
  novoFrasco?: boolean | null;
  viaAdministracao?: string | null;
  localAplicacao?: string | null;
  observacao?: string | null;
  status?: string | null;
  profissionalNome?: string | null;
  profissionalConselho?: string | null;
  profissionalRegistro?: string | null;
  profissionalCns?: string | null;
  unidadeNome?: string | null;
  unidadeCnes?: string | null;
  rndsSituacao?: string | null;
  rndsUuid?: string | null;
  profissionalObj?: { nome?: string | null; conselho?: string | null; registro?: string | null; cns?: string | null } | null;
  unidade?: { nome?: string | null; cnes?: string | null } | null;
  fabricante?: { nome?: string | null; cnpj?: string | null } | null;
  rnds?: { situacao?: string | null; uuid?: string | null } | null;
}

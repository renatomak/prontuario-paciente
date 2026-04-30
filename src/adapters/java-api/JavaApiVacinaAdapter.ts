// src/adapters/java-api/JavaApiVacinaAdapter.ts
import type { VacinaPort } from "../../ports";
import type { VacinaResumo, VacinaDetalhe } from "../../domain/models";
import { JavaApiClient } from "./JavaApiClient";

interface RawVacinaResumo {
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

interface RawVacinaDetalhe {
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
  // Estruturas aninhadas opcionais (caso backend retorne assim)
  profissional?: { nome?: string | null; conselho?: string | null; registro?: string | null; cns?: string | null } | null;
  unidade?: { nome?: string | null; cnes?: string | null } | null;
  fabricante?: { nome?: string | null; cnpj?: string | null } | null;
  rnds?: { situacao?: string | null; uuid?: string | null } | null;
}

function pick<T>(...vals: (T | null | undefined)[]): T | null {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== "") return v as T;
  }
  return null;
}

function asBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true" || v === "1" || v.toLowerCase() === "sim";
  if (typeof v === "number") return v === 1;
  return false;
}

function mapStatusVacina(s: unknown): string {
  if (s === null || s === undefined || s === "") return "Aplicada";
  if (typeof s === "number") return s === 1 ? "Aprazada" : "Aplicada";
  if (typeof s === "string") {
    const t = s.trim();
    if (t === "0") return "Aplicada";
    if (t === "1") return "Aprazada";
    return t;
  }
  return String(s);
}

function mapResumo(r: RawVacinaResumo): VacinaResumo {
  return {
    idAplicacao: (r.id_aplicacao ?? r.idAplicacao ?? 0) as number,
    dataAplicacao: (pick(r.data_aplicacao, r.dataAplicacao) ?? "") as string,
    nomeVacina: (pick(r.vacina, r.nome_vacina, r.nomeVacina) ?? "") as string,
    dose: (r.dose ?? "") as string,
    estrategia: (r.estrategia ?? null) as string | null,
    status: mapStatusVacina(r.status),
    laboratorio: r.laboratorio ?? null,
    estabelecimento: r.estabelecimento ?? null,
    profissional: r.profissional ?? null,
  };
}

function mapDetalhe(r: RawVacinaDetalhe): VacinaDetalhe {
  return {
    idAplicacao: (r.id_aplicacao ?? r.idAplicacao ?? 0) as number,
    nrAtendimento: pick(r.nr_atendimento, r.nrAtendimento),
    doseCodigo: (r.dose_codigo ?? r.doseCodigo ?? null) as number | null,
    dose: (r.dose ?? "") as string,
    estrategia: r.estrategia ?? null,
    nomeVacina: (pick(r.nome_vacina, r.nomeVacina) ?? "") as string,
    descricaoVacina: pick(r.descricao_vacina, r.descricaoVacina),
    lote: r.lote ?? null,
    validadeLote: pick(r.validade_lote, r.validadeLote),
    fabricanteNome: pick(r.fabricante_nome, r.fabricanteNome, r.fabricante?.nome),
    fabricanteCnpj: pick(r.fabricante_cnpj, r.fabricanteCnpj, r.fabricante?.cnpj),
    dataAplicacao: (pick(r.data_aplicacao, r.dataAplicacao) ?? "") as string,
    localAtendimento: pick(r.local_atendimento, r.localAtendimento),
    turno: r.turno ?? null,
    grupoAtendimento: pick(r.grupo_atendimento, r.grupoAtendimento),
    gestante: asBool(r.gestante),
    puerpera: asBool(r.puerpera),
    historico: asBool(r.historico),
    foraEsquema: asBool(r.fora_esquema ?? r.foraEsquema),
    viajante: asBool(r.viajante),
    novoFrasco: asBool(r.novo_frasco ?? r.novoFrasco),
    viaAdministracao: pick(r.via_administracao, r.viaAdministracao),
    localAplicacao: pick(r.local_aplicacao, r.localAplicacao),
    observacao: r.observacao ?? null,
    status: (r.status ?? "") as string,
    profissionalNome: pick(r.profissional_nome, r.profissionalNome, r.profissional?.nome),
    profissionalConselho: pick(r.profissional_conselho, r.profissionalConselho, r.profissional?.conselho),
    profissionalRegistro: pick(r.profissional_registro, r.profissionalRegistro, r.profissional?.registro),
    profissionalCns: pick(r.profissional_cns, r.profissionalCns, r.profissional?.cns),
    unidadeNome: pick(r.unidade_nome, r.unidadeNome, r.unidade?.nome),
    unidadeCnes: pick(r.unidade_cnes, r.unidadeCnes, r.unidade?.cnes),
    rndsSituacao: pick(r.rnds_situacao, r.rndsSituacao, r.rnds?.situacao),
    rndsUuid: pick(r.rnds_uuid, r.rndsUuid, r.rnds?.uuid),
  };
}

export class JavaApiVacinaAdapter implements VacinaPort {
  private client = new JavaApiClient();

  async listByPaciente(id: number): Promise<VacinaResumo[]> {
    const raw = await this.client.get<RawVacinaResumo[]>(`/api/pacientes/${id}/vacinas`);
    return (raw || []).map(mapResumo);
  }

  async getDetalhe(idAplicacao: number): Promise<VacinaDetalhe> {
    const raw = await this.client.get<RawVacinaDetalhe>(`/api/vacinas/aplicacoes/${idAplicacao}`);
    return mapDetalhe(raw);
  }
}

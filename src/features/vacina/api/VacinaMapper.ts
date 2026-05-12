import type { VacinaResumo, VacinaDetalhe } from "../domain/schemas";
import type {
  VacinaResumoProjection,
  VacinaDetalheProjection,
} from "../types/VacinaProjection";

function pick<T>(...vals: (T | null | undefined)[]): T | null {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== "") return v as T;
  }
  return null;
}

function asBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string")
    return v.toLowerCase() === "true" || v === "1" || v.toLowerCase() === "sim";
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

export class VacinaMapper {
  static resumoToDomain(r: VacinaResumoProjection): VacinaResumo {
    return {
      idAplicacao: (r.id_aplicacao ?? r.idAplicacao ?? 0) as number,
      dataAplicacao: (pick(r.data_aplicacao, r.dataAplicacao) ?? "") as string,
      nomeVacina: (pick(r.vacina, r.nome_vacina, r.nomeVacina) ?? "") as string,
      dose: (r.dose ?? "") as string,
      estrategia: r.estrategia ?? null,
      status: mapStatusVacina(r.status),
      laboratorio: r.laboratorio ?? null,
      estabelecimento: r.estabelecimento ?? null,
      profissional: r.profissional ?? null,
      lote: r.lote ?? null,
    };
  }

  static detalheToDomain(r: VacinaDetalheProjection): VacinaDetalhe {
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
}

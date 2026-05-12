import type { VacinaResumoResponse, VacinaDetalheResponse } from "../domain/schemas";
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
  static resumoToDomain(r: VacinaResumoProjection): VacinaResumoResponse {
    return {
      idAplicacao: (r.idAplicacao ?? 0) as number,
      dataAplicacao: (pick(r.dataAplicacao) ?? "") as string,
      nomeVacina: (pick(r.vacina, r.nomeVacina) ?? "") as string,
      dose: (r.dose ?? "") as string,
      estrategia: r.estrategia ?? null,
      status: mapStatusVacina(r.status),
      laboratorio: r.laboratorio ?? null,
      estabelecimento: r.estabelecimento ?? null,
      profissional: r.profissional ?? null,
      lote: r.lote ?? null,
    };
  }

  static detalheToDomain(r: VacinaDetalheProjection): VacinaDetalheResponse {
    return {
      idAplicacao: (r.idAplicacao ?? 0) as number,
      nrAtendimento: r.nrAtendimento ?? null,
      doseCodigo: r.doseCodigo ?? null,
      dose: (r.dose ?? "") as string,
      estrategia: r.estrategia ?? null,
      nomeVacina: (r.nomeVacina ?? "") as string,
      descricaoVacina: r.descricaoVacina ?? null,
      lote: r.lote ?? null,
      validadeLote: r.validadeLote ?? null,
      fabricanteNome: pick(r.fabricanteNome, r.fabricante?.nome),
      fabricanteCnpj: pick(r.fabricanteCnpj, r.fabricante?.cnpj),
      dataAplicacao: (r.dataAplicacao ?? "") as string,
      localAtendimento: r.localAtendimento ?? null,
      turno: r.turno ?? null,
      grupoAtendimento: r.grupoAtendimento ?? null,
      gestante: asBool(r.gestante),
      puerpera: asBool(r.puerpera),
      historico: asBool(r.historico),
      foraEsquema: asBool(r.foraEsquema),
      viajante: asBool(r.viajante),
      novoFrasco: asBool(r.novoFrasco),
      viaAdministracao: r.viaAdministracao ?? null,
      localAplicacao: r.localAplicacao ?? null,
      observacao: r.observacao ?? null,
      status: (r.status ?? "") as string,
      profissionalNome: pick(r.profissionalNome, r.profissionalObj?.nome),
      profissionalConselho: pick(r.profissionalConselho, r.profissionalObj?.conselho),
      profissionalRegistro: pick(r.profissionalRegistro, r.profissionalObj?.registro),
      profissionalCns: pick(r.profissionalCns, r.profissionalObj?.cns),
      unidadeNome: pick(r.unidadeNome, r.unidade?.nome),
      unidadeCnes: pick(r.unidadeCnes, r.unidade?.cnes),
      rndsSituacao: pick(r.rndsSituacao, r.rnds?.situacao),
      rndsUuid: pick(r.rndsUuid, r.rnds?.uuid),
    };
  }
}

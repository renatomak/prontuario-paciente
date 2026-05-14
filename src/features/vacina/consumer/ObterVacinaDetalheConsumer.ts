import { JavaApiClient } from "@/shared/http/JavaApiClient";
import type { ObterVacinaDetalhePort } from "../port/ObterVacinaDetalhePort";
import type { VacinaDetalheResponse } from "../types/ObterVacinaDetalheResponse";
import type { VacinaDetalheProjection } from "../types/VacinaProjection";
import { pick, asBool } from "./vacinaMapperUtils";

function detalheToDomain(r: VacinaDetalheProjection): VacinaDetalheResponse {
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

export class ObterVacinaDetalheConsumer implements ObterVacinaDetalhePort {
  constructor(private client: JavaApiClient = new JavaApiClient()) {}

  async obterDetalhe(idAplicacao: number): Promise<VacinaDetalheResponse> {
    const raw = await this.client.get<VacinaDetalheProjection>(
      `/api/vacinas/aplicacoes/${idAplicacao}`,
    );
    return detalheToDomain(raw);
  }
}

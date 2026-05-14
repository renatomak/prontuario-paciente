import { JavaApiClient } from "@/shared/http/JavaApiClient";
import type { ListarVacinasPort } from "../port/ListarVacinasPort";
import type { VacinaResumoResponse } from "../types/ListarVacinasResponse";
import type { VacinaResumoProjection } from "../types/VacinaProjection";
import { pick, mapStatusVacina } from "./vacinaMapperUtils";

function resumoToDomain(r: VacinaResumoProjection): VacinaResumoResponse {
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

export class ListarVacinasConsumer implements ListarVacinasPort {
  constructor(private client: JavaApiClient = new JavaApiClient()) {}

  async listarPorPaciente(pacienteId: number): Promise<VacinaResumoResponse[]> {
    const raw = await this.client.get<VacinaResumoProjection[]>(
      `/api/pacientes/${pacienteId}/vacinas`,
    );
    return (raw || []).map(resumoToDomain);
  }
}

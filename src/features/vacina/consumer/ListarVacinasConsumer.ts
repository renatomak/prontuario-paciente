import { JavaApiClient } from "@/shared/http/JavaApiClient";
import type { ListarVacinasPort } from "../port/ListarVacinasPort";
import type { VacinaResumoResponse } from "../types/ListarVacinasResponse";
import type { VacinaResumoProjection } from "../types/VacinaProjection";

function pick<T>(...vals: (T | null | undefined)[]): T | null {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== "") return v as T;
  }
  return null;
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
  private client = new JavaApiClient();

  async listarPorPaciente(pacienteId: number): Promise<VacinaResumoResponse[]> {
    const raw = await this.client.get<VacinaResumoProjection[]>(
      `/api/pacientes/${pacienteId}/vacinas`,
    );
    return (raw || []).map(resumoToDomain);
  }
}

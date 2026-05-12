import { JavaApiClient } from "@/shared/http/JavaApiClient";
import type { VacinaPort } from "../domain/VacinaPort";
import type { VacinaResumoResponse, VacinaDetalheResponse } from "../domain/schemas";
import type {
  VacinaResumoProjection,
  VacinaDetalheProjection,
} from "../types/VacinaProjection";
import { VacinaMapper } from "./VacinaMapper";

export class VacinaPersistenceAdapter implements VacinaPort {
  private client = new JavaApiClient();

  async listarPorPaciente(pacienteId: number): Promise<VacinaResumoResponse[]> {
    const raw = await this.client.get<VacinaResumoProjection[]>(
      `/api/pacientes/${pacienteId}/vacinas`,
    );
    return (raw || []).map(VacinaMapper.resumoToDomain);
  }

  async obterDetalhe(idAplicacao: number): Promise<VacinaDetalheResponse> {
    const raw = await this.client.get<VacinaDetalheProjection>(
      `/api/vacinas/aplicacoes/${idAplicacao}`,
    );
    return VacinaMapper.detalheToDomain(raw);
  }
}

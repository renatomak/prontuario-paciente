import { JavaApiClient } from "@/shared/http/JavaApiClient";
import type { VacinaRepository } from "../domain/VacinaRepository";
import type { VacinaResumo, VacinaDetalhe } from "../domain/schemas";
import type {
  VacinaResumoProjection,
  VacinaDetalheProjection,
} from "../types/VacinaProjection";
import { VacinaMapper } from "./VacinaMapper";

export class VacinaPersistenceAdapter implements VacinaRepository {
  private client = new JavaApiClient();

  async listarPorPaciente(pacienteId: number): Promise<VacinaResumo[]> {
    const raw = await this.client.get<VacinaResumoProjection[]>(
      `/api/pacientes/${pacienteId}/vacinas`,
    );
    return (raw || []).map(VacinaMapper.resumoToDomain);
  }

  async obterDetalhe(idAplicacao: number): Promise<VacinaDetalhe> {
    const raw = await this.client.get<VacinaDetalheProjection>(
      `/api/vacinas/aplicacoes/${idAplicacao}`,
    );
    return VacinaMapper.detalheToDomain(raw);
  }
}

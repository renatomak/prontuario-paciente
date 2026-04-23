// src/adapters/java-api/JavaApiVacinaAdapter.ts
import type { VacinaPort } from "../../ports";
import type { VacinaResumo, VacinaDetalhe } from "../../domain/models";
import { JavaApiClient } from "./JavaApiClient";

export class JavaApiVacinaAdapter implements VacinaPort {
  private client = new JavaApiClient();

  async listByPaciente(id: number): Promise<VacinaResumo[]> {
    return this.client.get<VacinaResumo[]>(`/api/pacientes/${id}/vacinas`);
  }

  async getDetalhe(idAplicacao: number): Promise<VacinaDetalhe> {
    return this.client.get<VacinaDetalhe>(`/api/vacinas/aplicacoes/${idAplicacao}`);
  }
}

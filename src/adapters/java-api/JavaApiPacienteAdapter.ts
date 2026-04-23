// src/adapters/java-api/JavaApiPacienteAdapter.ts
import type { PacientePort } from "../../ports";
import type { Paciente, SearchResult } from "../../domain/models";
import { JavaApiClient } from "./JavaApiClient";

export class JavaApiPacienteAdapter implements PacientePort {
  private client = new JavaApiClient();

  async search(query: string): Promise<SearchResult> {
    return this.client.get<SearchResult>("/api/pacientes/search", { query });
  }

  async getById(id: number): Promise<Paciente> {
    return this.client.get<Paciente>(`/api/pacientes/${id}`);
  }
}

import type { PacientePort } from "../../ports";
import type { Paciente, SearchResult } from "../../domain/models";
import { JavaApiClient } from "./JavaApiClient";

export class JavaApiPacienteAdapter implements PacientePort {
  private client = new JavaApiClient();

  async search(query: string): Promise<SearchResult> {
    const cpfRegex = /^\d{11}$/;
    
    if (cpfRegex.test(query)) {
      return this.client.get<SearchResult>("/api/pacientes/search/cpf", { cpf: query });
    }

    return this.client.get<SearchResult>("/api/pacientes/search/nome", { nome: query });
  }

  async getById(id: number): Promise<Paciente> {
    return this.client.get<Paciente>(`/api/pacientes/${id}`);
  }
}

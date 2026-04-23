import type { PacientePort } from "../../ports";
import type { Paciente, PacienteResumo, SearchResult } from "../../domain/models";
import { JavaApiClient } from "./JavaApiClient";
import { ApiErrorImpl } from "../../shared/http";

function calcIdade(dataNascimento: string | null): string {
  if (!dataNascimento) return "";
  const nasc = new Date(dataNascimento);
  if (isNaN(nasc.getTime())) return "";
  const hoje = new Date();
  let anos = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--;
  return `${anos} anos`;
}

function withIdade(p: Omit<Paciente, "idade"> & { idade?: string }): Paciente {
  return { ...p, idade: p.idade ?? calcIdade(p.dataNascimento) };
}

export class JavaApiPacienteAdapter implements PacientePort {
  private client = new JavaApiClient();

  async search(query: string): Promise<SearchResult> {
    const cpfRegex = /^\d{11}$/;

    if (cpfRegex.test(query)) {
      try {
        const paciente = await this.client.get<Omit<Paciente, "idade"> & { idade?: string }>(
          "/api/pacientes/search/cpf",
          { cpf: query }
        );
        return { tipo: "paciente", paciente: withIdade(paciente) };
      } catch (e) {
        if (e instanceof ApiErrorImpl && e.status === 404) {
          return { tipo: "lista", pacientes: [] };
        }
        throw e;
      }
    }

    const lista = await this.client.get<PacienteResumo[]>("/api/pacientes/search/nome", {
      nome: query,
    });
    return { tipo: "lista", pacientes: lista };
  }

  async getById(id: number): Promise<Paciente> {
    const paciente = await this.client.get<Omit<Paciente, "idade"> & { idade?: string }>(
      `/api/pacientes/${id}`
    );
    return withIdade(paciente);
  }
}

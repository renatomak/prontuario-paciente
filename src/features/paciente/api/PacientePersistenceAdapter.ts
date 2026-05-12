import { JavaApiClient } from "@/shared/http/JavaApiClient";
import { ApiErrorImpl } from "@/shared/http";
import type { PacienteRepository } from "../domain/PacienteRepository";
import type { Paciente } from "../domain/schemas";
import type { BuscarPacienteRequest } from "../types/BuscarPacienteRequest";
import type { BuscarPacienteResponse } from "../types/BuscarPacienteResponse";
import type {
  PacienteProjection,
  PacienteResumoProjection,
} from "../types/PacienteProjection";
import { PacienteMapper } from "./PacienteMapper";

export class PacientePersistenceAdapter implements PacienteRepository {
  private client = new JavaApiClient();

  async buscar({ query }: BuscarPacienteRequest): Promise<BuscarPacienteResponse> {
    const cpfRegex = /^\d{11}$/;

    if (cpfRegex.test(query)) {
      try {
        const dto = await this.client.get<PacienteProjection>(
          "/api/pacientes/search/cpf",
          { cpf: query },
        );
        return { tipo: "paciente", paciente: PacienteMapper.toDomain(dto) };
      } catch (e) {
        if (e instanceof ApiErrorImpl && e.status === 404) {
          return { tipo: "lista", pacientes: [] };
        }
        throw e;
      }
    }

    const lista = await this.client.get<PacienteResumoProjection[]>(
      "/api/pacientes/search/nome",
      { nome: query },
    );
    return {
      tipo: "lista",
      pacientes: lista.map(PacienteMapper.resumoToDomain),
    };
  }

  async carregarPorId(id: number): Promise<Paciente> {
    const dto = await this.client.get<PacienteProjection>(`/api/pacientes/${id}`);
    return PacienteMapper.toDomain(dto);
  }
}

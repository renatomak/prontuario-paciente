import { JavaApiClient } from "@/shared/http/JavaApiClient";
import { ApiErrorImpl } from "@/shared/http";
import type { PacientePort } from "../port/PacientePort";
import type { PacienteResponse } from "../port/schemas";
import type { BuscarPacienteRequest } from "../types/BuscarPacienteRequest";
import type { BuscarPacienteResponse } from "../types/BuscarPacienteResponse";
import type {
  PacienteProjection,
  PacienteResumoProjection,
} from "../types/PacienteProjection";
import { PacienteMapper } from "./PacienteMapper";

export class PacientePersistenceAdapter implements PacientePort {
  private client = new JavaApiClient();

  async buscar({ query }: BuscarPacienteRequest): Promise<BuscarPacienteResponse> {
    const cpfFormatado = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(query);
    const cpfSomenteDigitos = /^\d{11}$/.test(query);

    if (cpfFormatado || cpfSomenteDigitos) {
      let cpf = query;
      if (cpfSomenteDigitos) {
        cpf = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
      }
      try {
        const dto = await this.client.get<PacienteProjection>(
          `/api/pacientes/cpf/${cpf}`
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

  async carregarPorId(id: number): Promise<PacienteResponse> {
    const dto = await this.client.get<PacienteProjection>(`/api/pacientes/${id}`);
    return PacienteMapper.toDomain(dto);
  }
}

import { JavaApiClient } from "@/shared/http/JavaApiClient";
import type { CarregarPacientePort } from "../port/CarregarPacientePort";
import type { PacienteResponse } from "../types/CarregarPacienteResponse";
import type { PacienteProjection } from "../types/PacienteProjection";
import { pacienteToDomain } from "./pacienteMapperUtils";

export class CarregarPacienteConsumer implements CarregarPacientePort {
  constructor(private client: JavaApiClient = new JavaApiClient()) {}

  async carregarPorId(id: number): Promise<PacienteResponse> {
    const dto = await this.client.get<PacienteProjection>(`/api/pacientes/${id}`);
    return pacienteToDomain(dto);
  }
}

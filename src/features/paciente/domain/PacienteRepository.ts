import type { Paciente } from "./schemas";
import type { BuscarPacienteRequest } from "../types/BuscarPacienteRequest";
import type { BuscarPacienteResponse } from "../types/BuscarPacienteResponse";

export interface PacienteRepository {
  buscar(request: BuscarPacienteRequest): Promise<BuscarPacienteResponse>;
  carregarPorId(id: number): Promise<Paciente>;
}

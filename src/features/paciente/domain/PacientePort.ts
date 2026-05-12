import type { PacienteResponse } from "./schemas";
import type { BuscarPacienteRequest } from "../types/BuscarPacienteRequest";
import type { BuscarPacienteResponse } from "../types/BuscarPacienteResponse";

export interface PacientePort {
  buscar(request: BuscarPacienteRequest): Promise<BuscarPacienteResponse>;
  carregarPorId(id: number): Promise<PacienteResponse>;
}

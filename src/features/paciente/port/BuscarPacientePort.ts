import type { BuscarPacienteRequest } from "../types/BuscarPacienteRequest";
import type { BuscarPacienteResponse } from "../types/BuscarPacienteResponse";

export interface BuscarPacientePort {
  buscar(request: BuscarPacienteRequest): Promise<BuscarPacienteResponse>;
}

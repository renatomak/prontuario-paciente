import type { PacienteResponse } from "../types/CarregarPacienteResponse";

export interface CarregarPacientePort {
  carregarPorId(id: number): Promise<PacienteResponse>;
}

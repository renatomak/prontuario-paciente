import type { VacinaResumoResponse } from "../types/ListarVacinasResponse";

export interface ListarVacinasPort {
  listarPorPaciente(pacienteId: number): Promise<VacinaResumoResponse[]>;
}

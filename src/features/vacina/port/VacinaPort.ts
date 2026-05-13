import type { VacinaResumoResponse, VacinaDetalheResponse } from "./schemas";

export interface VacinaPort {
  listarPorPaciente(pacienteId: number): Promise<VacinaResumoResponse[]>;
  obterDetalhe(idAplicacao: number): Promise<VacinaDetalheResponse>;
}

import type { VacinaResumo, VacinaDetalhe } from "./schemas";

export interface VacinaPort {
  listarPorPaciente(pacienteId: number): Promise<VacinaResumo[]>;
  obterDetalhe(idAplicacao: number): Promise<VacinaDetalhe>;
}

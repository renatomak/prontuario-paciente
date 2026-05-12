import type { VacinaResumo, VacinaDetalhe } from "./schemas";

export interface VacinaRepository {
  listarPorPaciente(pacienteId: number): Promise<VacinaResumo[]>;
  obterDetalhe(idAplicacao: number): Promise<VacinaDetalhe>;
}

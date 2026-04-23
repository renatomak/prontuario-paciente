// Contratos (ports) para acesso a pacientes e vacinas
import type { Paciente, PacienteResumo, SearchResult, VacinaResumo, VacinaDetalhe } from "../domain/models";

export interface PacientePort {
  search(query: string): Promise<SearchResult>;
  getById(id: number): Promise<Paciente>;
}

export interface VacinaPort {
  listByPaciente(id: number): Promise<VacinaResumo[]>;
  getDetalhe(idAplicacao: number): Promise<VacinaDetalhe>;
}

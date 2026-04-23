import type { PacientePort } from "../ports";
import type { SearchResult, Paciente } from "../domain/models";

export function searchPaciente(query: string, pacientePort: PacientePort): Promise<SearchResult> {
  return pacientePort.search(query);
}

export function loadPaciente(id: number, pacientePort: PacientePort): Promise<Paciente> {
  return pacientePort.getById(id);
}

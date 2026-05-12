import type { Paciente, PacienteResumo } from "../domain/schemas";

export type BuscarPacienteResponse =
  | { tipo: "paciente"; paciente: Paciente }
  | { tipo: "lista"; pacientes: PacienteResumo[] };

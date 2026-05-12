import type { PacienteResponse, PacienteResumoResponse } from "../domain/schemas";

export type BuscarPacienteResponse =
  | { tipo: "paciente"; paciente: PacienteResponse }
  | { tipo: "lista"; pacientes: PacienteResumoResponse[] };

import type { PacienteResponse, PacienteResumoResponse } from "../port/schemas";

export type BuscarPacienteResponse =
  | { tipo: "paciente"; paciente: PacienteResponse }
  | { tipo: "lista"; pacientes: PacienteResumoResponse[] };

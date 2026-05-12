// Shim — re-exporta tipos das novas features.
// Mantido temporariamente para componentes que ainda importam daqui.
export type {
  Paciente,
  PacienteResumo,
  Endereco,
} from "@/features/paciente/domain/schemas";
export type {
  VacinaResumo,
  VacinaDetalhe,
} from "@/features/vacina/domain/schemas";

import type { Paciente, PacienteResumo } from "@/features/paciente/domain/schemas";

export type SearchResult =
  | { tipo: "paciente"; paciente: Paciente }
  | { tipo: "lista"; pacientes: PacienteResumo[] };

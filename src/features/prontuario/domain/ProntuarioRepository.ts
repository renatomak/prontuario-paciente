import type { ProntuarioResponse } from "./schemas";

export interface ProntuarioRepository {
  obterPorPacienteId(pacienteId: number): Promise<ProntuarioResponse>;
}

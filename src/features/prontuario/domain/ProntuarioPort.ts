import type { ProntuarioResponse } from "./schemas";

export interface ProntuarioPort {
  obterPorPacienteId(pacienteId: number): Promise<ProntuarioResponse>;
}

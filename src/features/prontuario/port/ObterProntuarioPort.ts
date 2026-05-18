import type { ProntuarioResponse } from "../types/ObterProntuarioResponse";

export interface ObterProntuarioPort {
  obterPorPacienteId(pacienteId: number): Promise<ProntuarioResponse>;
}

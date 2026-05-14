import type { VacinaDetalheResponse } from "../types/ObterVacinaDetalheResponse";

export interface ObterVacinaDetalhePort {
  obterDetalhe(idAplicacao: number): Promise<VacinaDetalheResponse>;
}
